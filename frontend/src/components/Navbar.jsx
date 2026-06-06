import { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Navbar({ user, onGoToLogin, onGoToRegister, onLogout, onNavigate, activePage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const NAV_LINKS = [
    { label: "Accueil", page: "home" },
    { label: "Catalogue", page: "catalogue" },
  ];

  return (
    <nav className="relative z-20 flex items-center justify-between px-5 md:px-10 py-4 bg-[#0d0d1a]/95 backdrop-blur-md border-b border-white/5">

      {/* Logo */}
      <span
        onClick={() => onNavigate("home")}
        className="text-lg md:text-xl font-black tracking-widest shrink-0 bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent cursor-pointer"
        style={{ fontFamily: "'Orbitron', sans-serif" }}
      >
        GAMEVIBE
      </span>

      {/* Liens desktop */}
      <div className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`text-sm font-medium cursor-pointer transition-colors ${
              activePage === item.page
                ? "text-white border-b border-white pb-0.5"
                : "text-gray-400 hover:text-white"
            }`}
            style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.05em" }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Boutons desktop */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <>
            <span
              className="text-sm font-semibold text-gray-300"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              <i className="bi bi-person-circle mr-1"></i>{user.nom}
            </span>
            <button
              onClick={onLogout}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-red-400 border border-red-500 cursor-pointer hover:bg-red-400/10 transition-colors"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              <i className="bi bi-box-arrow-right mr-1"></i>Déconnexion
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onGoToLogin}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-violet-400 border border-violet-600 cursor-pointer hover:bg-violet-400/10 hover:border-violet-500 transition-colors"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Connexion
            </button>
            <button
              onClick={onGoToRegister}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-pink-500 cursor-pointer hover:opacity-90 hover:shadow-lg hover:shadow-violet-500/50 transition-opacity"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              S&apos;inscrire
            </button>
          </>
        )}
      </div>

      {/* Burger mobile */}
      <div className="flex md:hidden items-center gap-2">
        {user ? (
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 border border-red-500 cursor-pointer hover:bg-red-400/10 transition-colors"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            <i className="bi bi-box-arrow-right"></i>
          </button>
        ) : (
          <>
            <button
              onClick={onGoToLogin}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-violet-400 border border-violet-600 cursor-pointer hover:bg-violet-400/10 transition-colors"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Connexion
            </button>
            <button
              onClick={onGoToRegister}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-pink-500 cursor-pointer hover:opacity-90 transition-opacity"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              S&apos;inscrire
            </button>
          </>
        )}
        <button onClick={() => setMenuOpen(!menuOpen)} className="ml-1 flex flex-col gap-1 p-1 cursor-pointer">
          <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>
      </div>

      {/* Menu burger mobile */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 flex flex-col items-center gap-4 py-4 md:hidden bg-[#0d0d1a]/95 border-b border-white/10 z-30">
          {NAV_LINKS.map((item) => (
            <button
              key={item.page}
              onClick={() => { onNavigate(item.page); setMenuOpen(false); }}
              className={`text-sm font-medium cursor-pointer transition-colors ${
                activePage === item.page ? "text-white" : "text-gray-300 hover:text-white"
              }`}
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              {item.label}
            </button>
          ))}
          {user && (
            <span className="text-sm text-gray-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              <i className="bi bi-person-circle mr-1"></i>{user.nom}
            </span>
          )}
        </div>
      )}
    </nav>
  );
}