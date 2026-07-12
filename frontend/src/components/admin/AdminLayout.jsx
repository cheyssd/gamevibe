import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import AdminDashboard from "./AdminDashboard";
import AdminJeux from "./AdminJeux";
import AdminPlateformes from "./AdminPlateformes";
import AdminCategories from "./AdminCategories";
import AdminDeveloppeurs from "./AdminDeveloppeurs";
import AdminUsers from "./AdminUsers";
import AdminAvis from "./AdminAvis";

const MENU = [
  { key: "dashboard",    label: "Dashboard",      icon: "bi-graph-up" },
  { key: "jeux",         label: "Jeux",           icon: "bi-joystick" },
  { key: "plateformes",  label: "Plateformes",    icon: "bi-pc-display" },
  { key: "categories",   label: "Catégories",     icon: "bi-tag-fill" },
  { key: "developpeurs", label: "Développeurs",   icon: "bi-person-fill" },
  { key: "users",        label: "Utilisateurs",   icon: "bi-people-fill" },
  { key: "avis",         label: "Avis",           icon: "bi-chat-left-fill" },
];

export default function AdminLayout({ user, onLogout, onNavigate }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash.startsWith("admin/")) {
      const page = hash.split("/")[1];
      if (MENU.some((item) => item.key === page)) {
        setActivePage(page);
        return;
      }
    }
    const savedPage = localStorage.getItem("adminActivePage");
    if (savedPage && MENU.some((item) => item.key === savedPage)) {
      setActivePage(savedPage);
    }
  }, []);

  const goTo = (key) => {
    setActivePage(key);
    localStorage.setItem("adminActivePage", key);
    window.history.pushState({ view: "admin" }, "GameVibe", `#admin/${key}`);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-[#0F0F1A]" style={{ fontFamily: "'Rajdhani', sans-serif" }}>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-60 sm:w-48 z-30
        bg-[#1A1A2E] border-r border-violet-500/10
        flex flex-col transition-transform duration-300 overflow-y-auto
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>

        {/* Logo */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-violet-500/10 flex-shrink-0">
          <span
            className="text-sm sm:text-lg font-black tracking-widest bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            GAMEVIBE
          </span>
          <div className="text-xs text-gray-500 mt-1 tracking-widest uppercase">Admin</div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-2 sm:px-3 py-3 sm:py-4 flex flex-col gap-1 overflow-y-auto">
          {MENU.map((item) => (
            <button
              key={item.key}
              onClick={() => goTo(item.key)}
              className={`
                flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium
                transition-all cursor-pointer text-left w-full min-h-[40px]
                ${activePage === item.key
                  ? "bg-violet-500/15 text-white border-l-2 border-violet-500"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <i className={`bi ${item.icon} text-sm sm:text-base flex-shrink-0`}></i>
              <span className="line-clamp-1">{item.label}</span>
            </button>
          ))}

          {/* Séparateur */}
          <div className="border-t border-white/5 my-2" />

          {/* ── VOIR LE SITE ── */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all cursor-pointer text-left w-full min-h-[40px]"
          >
            <i className="bi bi-box-arrow-up-right text-sm sm:text-base flex-shrink-0"></i>
            <span>Voir le site</span>
          </button>
        </nav>

        {/* User + Déconnexion */}
        <div className="px-3 sm:px-4 py-3 sm:py-4 border-t border-violet-500/10 flex-shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {user?.nom?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-semibold text-white truncate">{user?.nom}</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full py-2 rounded-lg text-xs font-semibold text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors cursor-pointer"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            <i className="bi bi-box-arrow-right mr-1"></i>Déconnexion
          </button>
        </div>
      </aside>

      {/* ── CONTENU ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">

        {/* Header mobile */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#1A1A2E] border-b border-violet-500/10 sticky top-0 z-10">
          <span
            className="text-base font-black tracking-widest bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            GAMEVIBE
          </span>
          <div className="flex items-center gap-2">
            {/* Bouton site sur mobile aussi */}
            <button
              onClick={() => onNavigate("home")}
              className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded border border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Voir le site"
            >
              <i className="bi bi-box-arrow-up-right" aria-hidden="true"></i>
            </button>
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex flex-col gap-1 p-1 cursor-pointer"
              aria-label="Ouvrir le menu"
              aria-expanded={sidebarOpen}
            >
              <span className="block w-5 h-0.5 bg-white" />
              <span className="block w-5 h-0.5 bg-white" />
              <span className="block w-5 h-0.5 bg-white" />
            </button>
          </div>
        </header>

        {/* Page active */}
        <main className="flex-1 p-2 sm:p-4 md:p-8 overflow-y-auto">
          {activePage === "dashboard"    && <AdminDashboard onNavigate={setActivePage} />}
          {activePage === "jeux"         && <AdminJeux />}
          {activePage === "plateformes"  && <AdminPlateformes />}
          {activePage === "categories"   && <AdminCategories />}
          {activePage === "developpeurs" && <AdminDeveloppeurs />}
          {activePage === "users"        && <AdminUsers />}
          {activePage === "avis"         && <AdminAvis />}
        </main>
      </div>
    </div>
  );
}