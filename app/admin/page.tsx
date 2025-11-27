"use client";
import { useState, useEffect } from "react";
import { Conejo, mapConejoDBToConejo } from "../../lib/supabase";
import { createSupabaseBrowserClient } from "../../lib/supabaseBrowser";
import AdminConejoForm from "./components/AdminConejoForm";
import AdminConejoList from "./components/AdminConejoList";
import AdminAuth from "./components/AdminAuth";
import { FaLock, FaUnlock } from "react-icons/fa";

// Forzar renderizado dinámico (no prerenderizar)
export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const [supabase, setSupabase] = useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [conejos, setConejos] = useState<Conejo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingConejo, setEditingConejo] = useState<Conejo | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Crear cliente solo en el cliente (después del mount)
  useEffect(() => {
    try {
      const client = createSupabaseBrowserClient();
      setSupabase(client);
    } catch (error: any) {
      console.error('Error creating Supabase client:', error);
      // No mostrar alert aquí, se mostrará en la UI
      setInitializing(false);
    }
  }, []);

  // Cargar conejos (todos, incluyendo no visibles para admin)
  const loadConejos = async () => {
    if (!supabase) return;
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
    if (!supabase) return;

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
    if (!supabase) {
      throw new Error("Supabase client not initialized");
    }
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
    if (supabase) {
      supabase.auth.signOut();
    }
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

  if (initializing && supabase) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-slate-900 to-slate-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Inicializando...</p>
        </div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-slate-900 to-slate-700 flex items-center justify-center p-4">
        <div className="bg-red-500/20 backdrop-blur-md rounded-xl p-8 border border-red-500/50 max-w-md w-full text-center">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Error de Configuración
          </h1>
          <p className="text-red-200 mb-4">
            No se pudo inicializar el cliente de Supabase.
          </p>
          <div className="bg-black/30 rounded-lg p-4 text-left text-sm text-gray-300">
            <p className="mb-2 font-semibold">Posibles causas:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Las variables de entorno no están configuradas en Vercel</li>
              <li>Las variables tienen nombres incorrectos</li>
              <li>Necesitas redesplegar después de agregar las variables</li>
            </ul>
            <p className="mt-4 font-semibold">Variables requeridas:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><code className="bg-black/50 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code></li>
              <li><code className="bg-black/50 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
            </ul>
          </div>
        </div>
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

