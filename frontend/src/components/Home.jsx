import { useState, useEffect } from "react";
import useCountUp from "./useCountUp";
import api from "../services/api";
import Navbar from "./Navbar";

function AnimatedStat({ target, label, delay }) {
  const count = useCountUp(target, 2200, delay);
  const formatted = count.toLocaleString("fr-FR").replace(/\u202f/g, "\u00a0");

  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="font-black tabular-nums bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent"
        style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(1.25rem, 5vw, 2rem)" }}
      >
        {formatted}
      </span>
      <span className="text-xs text-gray-400 tracking-widest uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>
        {label}
      </span>
    </div>
  );
}

export default function Home({ onGoToLogin, onGoToRegister, onLogout, user, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState({ totalJeux: 0, totalAvis: 0, totalUsers: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/stats");
        setStats({
          totalJeux: res.data.totalJeux ?? 0,
          totalAvis: res.data.totalAvis ?? 0,
          totalUsers: res.data.totalUsers ?? 0,
        });
      } catch (err) {
        console.error("Erreur stats home", err);
      }
    };
    fetchStats();
  }, []);

  const STATS = [
    { target: stats.totalJeux, label: "Jeux" },
    { target: stats.totalAvis, label: "Avis" },
    { target: stats.totalUsers, label: "Joueurs" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d1a]">

      {/* Fond radial */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,rgba(139,92,246,0.18)_0%,rgba(236,72,153,0.10)_40%,transparent_70%)]" />

      {/* ── NAVBAR ── */}


      <div className="min-h-screen flex flex-col bg-[#0d0d1a]">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,rgba(139,92,246,0.18)_0%,rgba(236,72,153,0.10)_40%,transparent_70%)]" />

        <Navbar
          user={user}
          onGoToLogin={onGoToLogin}
          onGoToRegister={onGoToRegister}
          onLogout={onLogout}
          onNavigate={onNavigate}
          activePage="home"
        />

        {/* ── HERO ── */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-5 md:px-6 gap-6 md:gap-8 py-12 md:py-0">
          {user && (
            <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500/20 to-pink-500/20 border border-violet-500/30">
              <span className="text-sm sm:text-base font-semibold text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                Bienvenue {user.nom} !
              </span>
            </div>
          )}

          <div
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest text-gray-300 uppercase border border-white/15 bg-white/5"
            style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.12em" }}
          >
            <span>🎮</span>
            <span>Plateforme de notation</span>
          </div>

          <h1
            className="font-black leading-tight"
            style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(2rem, 7vw, 4rem)" }}
          >
            <span className="text-white">Découvrez les jeux</span>
            <br />
            <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
              appréciés par la communauté
            </span>
          </h1>

          <p className="text-gray-400 text-sm md:text-base max-w-md">
            Notez, commentez et explorez les meilleurs jeux vidéo selon les avis de vrais joueurs.
          </p>

          <div className="flex flex-row items-center justify-center gap-3 w-full max-w-md">
            <button
              onClick={() => onNavigate("catalogue")}
              className="flex-1 md:flex-none md:w-auto md:min-w-[220px] md:max-w-[360px] py-3 md:px-6 md:py-4 rounded-xl text-xs md:text-sm font-bold tracking-widest text-white uppercase bg-gradient-to-r from-violet-600 to-pink-500 cursor-pointer hover:opacity-90 hover:shadow-lg hover:shadow-violet-500/50 active:scale-95 transition-all md:whitespace-nowrap"
              style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.08em" }}
            >
              Explorer le catalogue
            </button>
            {!user && (
              <button
                onClick={onGoToRegister}
                className="flex-1 md:flex-none md:w-auto md:min-w-[220px] md:max-w-[360px] py-3 md:px-6 md:py-4 rounded-xl text-xs md:text-sm font-bold tracking-widest text-white uppercase border border-white/20 bg-white/5 cursor-pointer hover:bg-white/20 hover:border-white/40 active:scale-95 transition-all md:whitespace-nowrap"
                style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.08em" }}
              >
                Rejoindre la communauté
              </button>
            )}
          </div>

          <div className="flex flex-row items-center justify-center gap-8 md:gap-16 mt-2">
            {STATS.map(({ target, label }, i) => (
              <AnimatedStat key={label} target={target} label={label} delay={i * 200} />
            ))}
          </div>
        </main>
      </div>
      ;


      {/* Menu burger mobile */}
      {menuOpen && (
        <div className="relative z-10 flex flex-col items-center gap-4 py-4 md:hidden bg-[#0d0d1a]/95 border-b border-white/10">
          {["Catalogue", "Plateformes", "Catégories"].map((item) => (

            <a key={item}
              href="#"
              className="text-sm font-medium text-gray-300 cursor-pointer hover:text-white transition-colors"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}