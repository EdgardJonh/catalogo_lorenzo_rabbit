"use client";
import { useState, useEffect, useMemo } from "react";
import { Conejo, mapConejoDBToConejo } from "../../lib/supabase";
import { createSupabaseBrowserClient } from "../../lib/supabaseBrowser";
import AdminConejoForm from "./components/AdminConejoForm";
import AdminConejoList from "./components/AdminConejoList";
import AdminAuth from "./components/AdminAuth";
import { FaLock, FaUnlock } from "react-icons/fa";

export default function AdminPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [conejos, setConejos] = useState<Conejo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingConejo, setEditingConejo] = useState<Conejo | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Cargar conejos (todos, incluyendo no visibles para admin)
  const loadConejos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('conejos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching conejos:', error);
        setConejos([]);
        return;
      }

      const mappedConejos = (data || []).map(mapConejoDBToConejo);
      setConejos(mappedConejos);
    } catch (error) {
      console.error("Error loading conejos:", error);
      setConejos([]);
    } finally {
      setLoading(false);
    }
  };

  // Verificar autenticación al cargar
  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
        await loadConejos();
      } else {
        setIsAuthenticated(false);
      }
      setInitializing(false);
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const loggedIn = !!session;
      setIsAuthenticated(loggedIn);
      if (loggedIn) {
        loadConejos();
      } else {
        setConejos([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleAuth = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw new Error(error.message);
    }
    setIsAuthenticated(true);
    await loadConejos();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setConejos([]);
    supabase.auth.signOut();
  };

  // CRUD Operations
  const handleCreate = () => {
    setEditingConejo(null);
    setShowForm(true);
  };

  const handleEdit = (conejo: Conejo) => {
    setEditingConejo(conejo);
    setShowForm(true);
  };

  const handleToggleVisible = async (id: string, visible: boolean) => {
    try {
      const res = await fetch('/api/conejos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, visible }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Error al actualizar visibilidad');
      await loadConejos();
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`¿Estás seguro de eliminar el conejo ${id}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/conejos?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Error al eliminar');
      await loadConejos();
      alert("Conejo eliminado exitosamente");
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  const handleSave = async () => {
    await loadConejos();
    setShowForm(false);
    setEditingConejo(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingConejo(null);
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-slate-900 to-slate-700 flex items-center justify-center">
        <p className="text-white text-lg">Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminAuth onLogin={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 to-slate-700 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                🐰 Panel de Administración
              </h1>
              <p className="text-gray-300">
                Gestiona tu catálogo de conejitos
              </p>
            </div>
            <div className="flex gap-3">
              {!showForm && (
                <button
                  onClick={handleCreate}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                >
                  + Nuevo Conejito
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <FaUnlock /> Salir
              </button>
            </div>
          </div>
        </div>

        {/* Formulario o Lista */}
        {showForm ? (
          <AdminConejoForm
            conejo={editingConejo}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <AdminConejoList
            conejos={conejos}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRefresh={loadConejos}
            onToggleVisible={handleToggleVisible}
          />
        )}
      </div>
    </div>
  );
}

