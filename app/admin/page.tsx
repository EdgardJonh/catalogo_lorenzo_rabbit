"use client";
import { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import {
  Conejo, Cruza, Gestacion, Parto,
  mapConejoDBToConejo, mapCruzaDBToCruza,
  mapGestacionDBToGestacion, mapPartoDBToParto,
} from "../../lib/supabase";
import { createSupabaseBrowserClient } from "../../lib/supabaseBrowser";
import AdminConejoForm from "./components/AdminConejoForm";
import AdminConejoList from "./components/AdminConejoList";
import AdminCruzaForm from "./components/AdminCruzaForm";
import AdminCruzaList from "./components/AdminCruzaList";
import AdminGestacionForm from "./components/AdminGestacionForm";
import AdminGestacionList from "./components/AdminGestacionList";
import AdminPartoForm from "./components/AdminPartoForm";
import AdminPartoList from "./components/AdminPartoList";
import AdminAuth from "./components/AdminAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Rabbit, LogOut, Plus, Moon, Sun, Loader2, AlertTriangle,
  Search, GitBranch, Baby, HeartPulse, CheckCircle2, ArrowUpRight,
  LayoutDashboard, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

export const dynamic = "force-dynamic";

type TabId = "dashboard" | "conejos" | "cruzas" | "gestaciones" | "partos";

const NAV: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard",    label: "Dashboard",   icon: <LayoutDashboard className="h-5 w-5" /> },
  { id: "conejos",      label: "Conejos",      icon: <Rabbit          className="h-5 w-5" /> },
  { id: "cruzas",       label: "Cruzas",       icon: <GitBranch       className="h-5 w-5" /> },
  { id: "gestaciones",  label: "Gestaciones",  icon: <Baby            className="h-5 w-5" /> },
  { id: "partos",       label: "Partos",       icon: <HeartPulse      className="h-5 w-5" /> },
];

export default function AdminPage() {
  const { theme, setTheme } = useTheme();
  const [supabase, setSupabase] = useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [conejos,      setConejos]      = useState<Conejo[]>([]);
  const [cruzas,       setCruzas]       = useState<Cruza[]>([]);
  const [gestaciones,  setGestaciones]  = useState<Gestacion[]>([]);
  const [partos,       setPartos]       = useState<Parto[]>([]);
  const [loading,            setLoading]            = useState(true);
  const [loadingCruzas,      setLoadingCruzas]      = useState(true);
  const [loadingGestaciones, setLoadingGestaciones] = useState(true);
  const [loadingPartos,      setLoadingPartos]      = useState(true);
  const [showForm,           setShowForm]           = useState(false);
  const [showCruzaForm,      setShowCruzaForm]      = useState(false);
  const [showGestacionForm,  setShowGestacionForm]  = useState(false);
  const [showPartoForm,      setShowPartoForm]      = useState(false);
  const [editingConejo,      setEditingConejo]      = useState<Conejo | null>(null);
  const [editingCruza,       setEditingCruza]       = useState<Cruza | null>(null);
  const [editingGestacion,   setEditingGestacion]   = useState<Gestacion | null>(null);
  const [editingParto,       setEditingParto]       = useState<Parto | null>(null);
  const [activeTab,          setActiveTab]          = useState<TabId>("dashboard");
  const [initializing,       setInitializing]       = useState(true);
  const [sidebarOpen,        setSidebarOpen]        = useState(false);

  useEffect(() => {
    try { setSupabase(createSupabaseBrowserClient()); }
    catch { setInitializing(false); }
  }, []);

  const loadConejos = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data } = await supabase.from("conejos").select("*").order("created_at", { ascending: false });
      setConejos((data || []).map(mapConejoDBToConejo));
    } finally { setLoading(false); }
  };
  const loadCruzas = async () => {
    if (!supabase) return;
    setLoadingCruzas(true);
    try {
      const { data } = await supabase.from("cruzas").select("*").order("fecha_cruza", { ascending: false });
      setCruzas((data || []).map(mapCruzaDBToCruza));
    } finally { setLoadingCruzas(false); }
  };
  const loadGestaciones = async () => {
    if (!supabase) return;
    setLoadingGestaciones(true);
    try {
      const { data } = await supabase.from("gestaciones").select("*").order("created_at", { ascending: false });
      setGestaciones((data || []).map(mapGestacionDBToGestacion));
    } finally { setLoadingGestaciones(false); }
  };
  const loadPartos = async () => {
    if (!supabase) return;
    setLoadingPartos(true);
    try {
      const { data } = await supabase.from("partos").select("*").order("created_at", { ascending: false });
      setPartos((data || []).map(mapPartoDBToParto));
    } finally { setLoadingPartos(false); }
  };

  useEffect(() => {
    if (!supabase) return;
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
        await Promise.all([loadConejos(), loadCruzas(), loadGestaciones(), loadPartos()]);
      }
      setInitializing(false);
    };
    init();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      const ok = !!session;
      setIsAuthenticated(ok);
      if (ok) Promise.all([loadConejos(), loadCruzas(), loadGestaciones(), loadPartos()]);
      else { setConejos([]); setCruzas([]); setGestaciones([]); setPartos([]); }
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleAuth = async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabase no inicializado");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    setIsAuthenticated(true);
    await loadConejos();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setConejos([]);
    supabase?.auth.signOut();
  };

  const handleToggleVisible = async (id: string, visible: boolean) => {
    try {
      const res = await fetch("/api/conejos", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, visible }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error);
      await loadConejos();
      toast.success(visible ? `${id} visible` : `${id} oculto`);
    } catch (e: any) { toast.error("Error: " + e.message); }
  };

  const handleToggleDisponibilidad = async (id: string, disponibilidad: string) => {
    try {
      const res = await fetch("/api/conejos", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, disponibilidad }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error);
      await loadConejos();
      toast.success(`${id}: "${disponibilidad}"`);
    } catch (e: any) { toast.error("Error: " + e.message); }
  };

  const makeDeleteHandler = (url: (id: string) => string, reload: () => Promise<void>, label: string) =>
    (id: string) => toast(`¿Eliminar ${label} ${id}?`, {
      action: { label: "Eliminar", onClick: async () => {
        const tid = toast.loading(`Eliminando ${id}...`);
        try {
          const res = await fetch(url(id), { method: "DELETE" });
          const json = await res.json();
          if (!res.ok) throw new Error(json?.error);
          await reload();
          toast.success(`${label} ${id} eliminado`, { id: tid });
        } catch (e: any) { toast.error("Error: " + e.message, { id: tid }); }
      }},
      cancel: { label: "Cancelar", onClick: () => {} },
      duration: 8000,
    });

  const handleDelete          = makeDeleteHandler(id => `/api/conejos?id=${encodeURIComponent(id)}`,     loadConejos,     "conejito");
  const handleDeleteCruza     = makeDeleteHandler(id => `/api/cruzas?id=${encodeURIComponent(id)}`,      loadCruzas,      "cruza");
  const handleDeleteGestacion = makeDeleteHandler(id => `/api/gestaciones?id=${encodeURIComponent(id)}`, loadGestaciones, "gestación");
  const handleDeleteParto     = makeDeleteHandler(id => `/api/partos?id=${encodeURIComponent(id)}`,      loadPartos,      "parto");

  const stats = useMemo(() => {
    const disponibles   = conejos.filter(c => c.disponibilidad === "Disponible").length;
    const reproductores = conejos.filter(c => c.reproductor).length;
    const cruzasActivas = cruzas.filter(c => c.estado === "programada" || c.estado === "en_proceso").length;
    return [
      { label: "Total Conejos",    value: conejos.length,  sub: `${disponibles} disponibles`,       pct: conejos.length > 0 ? Math.round(disponibles / conejos.length * 100) : 0,         icon: <Rabbit      className="h-5 w-5" />, tab: "conejos"  as TabId },
      { label: "Disponibles",      value: disponibles,     sub: `${conejos.length > 0 ? Math.round(disponibles / conejos.length * 100) : 0}% del total`, pct: conejos.length > 0 ? Math.round(disponibles / conejos.length * 100) : 0,         icon: <CheckCircle2 className="h-5 w-5" />, tab: "conejos"  as TabId },
      { label: "Reproductores",    value: reproductores,   sub: `${conejos.length > 0 ? Math.round(reproductores / conejos.length * 100) : 0}% del total`, pct: conejos.length > 0 ? Math.round(reproductores / conejos.length * 100) : 0,    icon: <GitBranch    className="h-5 w-5" />, tab: "cruzas"   as TabId },
      { label: "Cruzas Activas",   value: cruzasActivas,   sub: `${cruzas.length} totales`,          pct: cruzas.length > 0 ? Math.round(cruzasActivas / cruzas.length * 100) : 0,         icon: <HeartPulse   className="h-5 w-5" />, tab: "cruzas"   as TabId },
    ];
  }, [conejos, cruzas]);

  const showingForm = showForm || showCruzaForm || showGestacionForm || showPartoForm;

  const closeAllForms = () => {
    setShowForm(false); setShowCruzaForm(false);
    setShowGestacionForm(false); setShowPartoForm(false);
  };

  const handleNavClick = (id: TabId) => {
    setActiveTab(id);
    closeAllForms();
  };

  const handleNewItem = () => {
    if (activeTab === "conejos")     { setEditingConejo(null);    setShowForm(true); }
    if (activeTab === "cruzas")      { setEditingCruza(null);     setShowCruzaForm(true); }
    if (activeTab === "gestaciones") { setEditingGestacion(null); setShowGestacionForm(true); }
    if (activeTab === "partos")      { setEditingParto(null);     setShowPartoForm(true); }
  };

  const pantallaInicializando = (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Inicializando...</p>
      </div>
    </div>
  );

  if (!supabase && initializing) return pantallaInicializando;
  if (!supabase) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-xl border border-destructive/40 bg-destructive/10 p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h1 className="text-xl font-bold mb-2">Error de Configuración</h1>
        <p className="text-muted-foreground text-sm">Verifica las variables de entorno de Supabase.</p>
      </div>
    </div>
  );
  if (initializing) return pantallaInicializando;
  if (!isAuthenticated) return <AdminAuth onLogin={handleAuth} />;

  const activeNav = NAV.find(n => n.id === activeTab);

  return (
    <div className="flex h-screen overflow-hidden bg-muted/40 relative">

      {/* ── Botón contraer/expandir — flota sobre el borde del sidebar ── */}
      <button
        onClick={() => setSidebarOpen(o => !o)}
        title={sidebarOpen ? "Contraer menú" : "Expandir menú"}
        style={{ left: sidebarOpen ? "192px" : "48px" }}
        className="absolute top-12 z-50 w-8 h-8 rounded-full bg-primary border-[3px] border-sidebar flex items-center justify-center transition-[left] duration-300 ease-in-out"
      >
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 text-primary-foreground transition-transform duration-300",
            sidebarOpen && "rotate-180"
          )}
        />
      </button>

      {/* ══════════════════════════════
          SIDEBAR
      ══════════════════════════════ */}
      <aside
        className={cn(
          "shrink-0 flex flex-col py-4 bg-sidebar border-r border-sidebar-border",
          "transition-[width] duration-300 ease-in-out overflow-hidden",
          sidebarOpen ? "w-52" : "w-16"
        )}
      >

        {/* Logo */}
        <div className={cn(
          "flex items-center gap-3 mb-6 px-3",
          sidebarOpen ? "justify-start" : "justify-center"
        )}>
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-md shadow-primary/30">
            <Rabbit className="w-5 h-5 text-primary-foreground" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-sidebar-foreground font-bold text-sm leading-tight whitespace-nowrap">LorenZo</p>
              <p className="text-sidebar-foreground/50 text-xs whitespace-nowrap">Rabbit Admin</p>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 flex-1 px-2">
          {NAV.map(item => {
            const isActive = activeTab === item.id && !showingForm;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={!sidebarOpen ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl h-10 px-2.5 w-full transition-all duration-150",
                  sidebarOpen ? "justify-start" : "justify-center",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                    : "text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <span className="shrink-0">{item.icon}</span>
                {sidebarOpen && (
                  <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="flex flex-col gap-1 px-2 mt-2">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
            className={cn(
              "flex items-center gap-3 rounded-xl h-10 px-2.5 w-full transition-all duration-150",
              sidebarOpen ? "justify-start" : "justify-center",
              "text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            {theme === "dark"
              ? <Sun  className="h-5 w-5 shrink-0" />
              : <Moon className="h-5 w-5 shrink-0" />
            }
            {sidebarOpen && (
              <span className="text-sm font-medium whitespace-nowrap">
                {theme === "dark" ? "Modo claro" : "Modo oscuro"}
              </span>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className={cn(
              "flex items-center gap-3 rounded-xl h-10 px-2.5 w-full transition-all duration-150",
              sidebarOpen ? "justify-start" : "justify-center",
              "text-red-400/70 hover:bg-red-500/20 hover:text-red-400"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium whitespace-nowrap">Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════
          MAIN
      ══════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="h-14 shrink-0 flex items-center gap-4 px-6 bg-card border-b border-border shadow-sm">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar (Ctrl+K)..."
              className="pl-9 h-8 bg-muted/60 border-0 focus-visible:ring-1"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Título de sección activa */}
            {activeNav && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-muted-foreground/60">{activeNav.icon}</span>
                <span className="font-semibold text-foreground">{activeNav.label}</span>
              </div>
            )}

            {/* Botón nuevo (solo en secciones, no en dashboard, no en formularios) */}
            {!showingForm && activeTab !== "dashboard" && (
              <>
                <div className="h-4 w-px bg-border hidden sm:block" />
                <Button size="sm" onClick={handleNewItem} className="shadow-sm">
                  <Plus className="h-4 w-4 mr-1.5" />
                  {activeTab === "conejos"     && "Nuevo Conejito"}
                  {activeTab === "cruzas"      && "Nueva Cruza"}
                  {activeTab === "gestaciones" && "Nueva Gestación"}
                  {activeTab === "partos"      && "Nuevo Parto"}
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">

          {/* ── Formularios ── */}
          {showingForm && (
            <>
              {showForm && (
                <AdminConejoForm
                  conejo={editingConejo}
                  onSave={async () => { await loadConejos(); setShowForm(false); setEditingConejo(null); }}
                  onCancel={() => { setShowForm(false); setEditingConejo(null); }}
                />
              )}
              {showCruzaForm && (
                <AdminCruzaForm
                  cruza={editingCruza} conejos={conejos}
                  onSave={async () => { await loadCruzas(); setShowCruzaForm(false); setEditingCruza(null); }}
                  onCancel={() => { setShowCruzaForm(false); setEditingCruza(null); }}
                />
              )}
              {showGestacionForm && (
                <AdminGestacionForm
                  gestacion={editingGestacion} cruzas={cruzas}
                  onSave={async () => { await loadGestaciones(); setShowGestacionForm(false); setEditingGestacion(null); }}
                  onCancel={() => { setShowGestacionForm(false); setEditingGestacion(null); }}
                />
              )}
              {showPartoForm && (
                <AdminPartoForm
                  parto={editingParto} cruzas={cruzas}
                  onSave={async () => { await loadPartos(); setShowPartoForm(false); setEditingParto(null); }}
                  onCancel={() => { setShowPartoForm(false); setEditingParto(null); }}
                />
              )}
            </>
          )}

          {/* ── Dashboard (overview con stats) ── */}
          {!showingForm && activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Fila 1: banner + 2 cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <Card className="sm:col-span-2 xl:col-span-2 bg-gradient-to-br from-primary via-primary/85 to-emerald-600 border-0 text-primary-foreground overflow-hidden relative shadow-lg shadow-primary/20">
                  <CardContent className="p-6 relative z-10">
                    <p className="text-primary-foreground/70 text-xs font-medium uppercase tracking-widest mb-1">Panel de administración</p>
                    <h2 className="text-2xl font-bold leading-tight">Criadero LorenZo Rabbit</h2>
                    <p className="text-primary-foreground/80 text-sm mt-2">
                      {conejos.length} conejos · {cruzas.length} cruzas · {gestaciones.length} gestaciones · {partos.length} partos
                    </p>
                  </CardContent>
                  <Rabbit className="absolute -right-4 -bottom-4 h-32 w-32 text-white/10" />
                </Card>

                {stats.slice(0, 2).map(stat => (
                  <StatCard key={stat.label} stat={stat} onClick={() => handleNavClick(stat.tab)} />
                ))}
              </div>

              {/* Fila 2: 2 cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stats.slice(2).map(stat => (
                  <StatCard key={stat.label} stat={stat} onClick={() => handleNavClick(stat.tab)} />
                ))}
              </div>
            </div>
          )}

          {/* ── Sección: Conejos ── */}
          {!showingForm && activeTab === "conejos" && (
            <AdminConejoList
              conejos={conejos} loading={loading}
              onEdit={(c) => { setEditingConejo(c); setShowForm(true); }}
              onDelete={handleDelete} onRefresh={loadConejos}
              onToggleVisible={handleToggleVisible}
              onToggleDisponibilidad={handleToggleDisponibilidad}
            />
          )}

          {/* ── Sección: Cruzas ── */}
          {!showingForm && activeTab === "cruzas" && (
            <AdminCruzaList
              cruzas={cruzas} conejos={conejos} loading={loadingCruzas}
              onEdit={(c) => { setEditingCruza(c); setShowCruzaForm(true); }}
              onDelete={handleDeleteCruza} onRefresh={loadCruzas}
            />
          )}

          {/* ── Sección: Gestaciones ── */}
          {!showingForm && activeTab === "gestaciones" && (
            <AdminGestacionList
              gestaciones={gestaciones} cruzas={cruzas} loading={loadingGestaciones}
              onEdit={(g) => { setEditingGestacion(g); setShowGestacionForm(true); }}
              onDelete={handleDeleteGestacion} onRefresh={loadGestaciones}
            />
          )}

          {/* ── Sección: Partos ── */}
          {!showingForm && activeTab === "partos" && (
            <AdminPartoList
              partos={partos} cruzas={cruzas} loading={loadingPartos}
              onEdit={(p) => { setEditingParto(p); setShowPartoForm(true); }}
              onDelete={handleDeleteParto} onRefresh={loadPartos}
            />
          )}
        </main>
      </div>
    </div>
  );
}

/* ── Componente de tarjeta de métrica ── */
function StatCard({
  stat,
  onClick,
}: {
  stat: { label: string; value: number; sub: string; pct: number; icon: React.ReactNode };
  onClick: () => void;
}) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</p>
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {stat.icon}
          </div>
        </div>
        <p className="text-3xl font-bold text-foreground">{stat.value}</p>
        <div className="flex items-center justify-between mt-1 mb-2">
          <p className="text-xs text-muted-foreground">{stat.sub}</p>
          <div className="flex items-center gap-0.5 text-xs text-primary font-semibold">
            <ArrowUpRight className="h-3 w-3" />
            {stat.pct}%
          </div>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${stat.pct}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground/60 mt-1.5">Target</p>
      </CardContent>
    </Card>
  );
}
