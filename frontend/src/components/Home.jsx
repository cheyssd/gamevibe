import { useState } from "react";
import useCountUp from "./useCountUp";

// Données stats — on remplacera par les vraies données API quand elles sont dispo
const STATS = [
  { target: 1240, label: "Jeux" },
  { target: 8500, label: "Avis" },
  { target: 3200, label: "Joueurs" },
];
/* // Plus tard — données de l'API
const STATS = [
  { target: data.totalJeux, label: "Jeux" },
  { target: data.totalAvis, label: "Avis" },
  { target: data.totalJoueurs, label: "Joueurs" },
]; */

function AnimatedStat({ target, label, delay }) {
  const count = useCountUp(target, 2200, delay);

  // Formatage avec espace comme séparateur de milliers : 1240 → "1 240"
  const formatted = count.toLocaleString("fr-FR").replace(/\u202f/g, "\u00a0");

  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="font-black tabular-nums"
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "clamp(1.25rem, 5vw, 2rem)",
          background: "linear-gradient(90deg, #7c3aed, #ec4899)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          minWidth: "4ch",
          display: "inline-block",
          textAlign: "center",
        }}
      >
        {formatted}
      </span>
      <span
        className="text-xs text-gray-400 tracking-widest uppercase"
        style={{ fontFamily: "'Orbitron', sans-serif" }}
      >
        {label}
      </span>
    </div>
  );
}

export default function Home({ onGoToLogin, onGoToRegister }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0d0d1a" }}>

      {/* Fond radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(139,92,246,0.18) 0%, rgba(236,72,153,0.10) 40%, transparent 70%)",
        }}
      />

      {/* ── NAVBAR ── */}
      <nav className="relative z-20 flex items-center justify-between px-5 md:px-10 py-4">
        <span
          className="text-lg md:text-xl font-black tracking-widest shrink-0"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            background: "linear-gradient(90deg, #7c3aed, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          GAMEVIBE
        </span>

        <div className="hidden md:flex items-center gap-8">
          {["Catalogue", "Plateformes", "Catégories"].map((item, i) => (
            <a
              key={item}
              href="#"
              className={`text-sm font-medium transition-colors ${i === 0 ? "text-white border-b border-white pb-0.5" : "text-gray-400 hover:text-white"}`}
              style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.05em" }}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onGoToLogin}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-purple-400 transition-all hover:bg-purple-400/10"
            style={{ border: "1px solid #7c3aed", fontFamily: "'Orbitron', sans-serif" }}
          >
            Connexion
          </button>
          <button
            onClick={onGoToRegister}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(90deg, #7c3aed, #ec4899)", fontFamily: "'Orbitron', sans-serif" }}
          >
            S&apos;inscrire
          </button>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onGoToLogin}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-400"
            style={{ border: "1px solid #7c3aed", fontFamily: "'Orbitron', sans-serif" }}
          >
            Connexion
          </button>
          <button
            onClick={onGoToRegister}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
            style={{ background: "linear-gradient(90deg, #7c3aed, #ec4899)", fontFamily: "'Orbitron', sans-serif" }}
          >
            S&apos;inscrire
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="ml-1 flex flex-col gap-1 p-1">
            <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Menu burger mobile */}
      {menuOpen && (
        <div
          className="relative z-10 flex flex-col items-center gap-4 py-4 md:hidden"
          style={{ background: "rgba(13,13,26,0.95)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          {["Catalogue", "Plateformes", "Catégories"].map((item) => (
            <a key={item} href="#" className="text-sm font-medium text-gray-300 hover:text-white"
              style={{ fontFamily: "'Orbitron', sans-serif" }}>
              {item}
            </a>
          ))}
        </div>
      )}

      {/* ── HERO ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-5 md:px-6 gap-6 md:gap-8 py-12 md:py-0">

        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest text-gray-300 uppercase"
          style={{
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.05)",
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: "0.12em",
          }}
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
          <span
            style={{
              background: "linear-gradient(90deg, #7c3aed, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            appréciés par la communauté
          </span>
        </h1>

        <p className="text-gray-400 text-sm md:text-base max-w-md">
          Notez, commentez et explorez les meilleurs jeux vidéo selon les avis de vrais joueurs.
        </p>

        <div className="flex flex-row items-center gap-3 w-full max-w-md">
          <button
            className="flex-1 py-3 md:py-4 rounded-xl text-xs md:text-sm font-bold tracking-widest text-white uppercase transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "linear-gradient(90deg, #7c3aed, #ec4899)",
              fontFamily: "'Orbitron', sans-serif",
              letterSpacing: "0.08em",
            }}
          >
            Explorer le catalogue
          </button>
          <button
            onClick={onGoToRegister}
            className="flex-1 py-3 md:py-4 rounded-xl text-xs md:text-sm font-bold tracking-widest text-white uppercase transition-all hover:bg-white/10 active:scale-95"
            style={{
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.05)",
              fontFamily: "'Orbitron', sans-serif",
              letterSpacing: "0.08em",
            }}
          >
            Rejoindre
          </button>
        </div>

        {/* ── STATS ANIMÉES ── */}
        <div className="flex flex-row items-center justify-center gap-8 md:gap-16 mt-2">
          {STATS.map(({ target, label }, i) => (
            <AnimatedStat
              key={label}
              target={target}
              label={label}
              delay={i * 200} // chaque stat démarre 200ms après la précédente
            />
          ))}
        </div>
      </main>
    </div>
  );
}