import { useState } from "react";

function InputField({ label, type = "text", placeholder, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-xs font-semibold tracking-widest text-gray-400 uppercase"
        style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.15em" }}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg px-4 py-3 text-sm text-gray-200 outline-none transition-all duration-200 placeholder-gray-500"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        onFocus={(e) => {
          e.target.style.border = "1px solid rgba(168,85,247,0.5)";
          e.target.style.boxShadow = "0 0 0 2px rgba(168,85,247,0.15)";
        }}
        onBlur={(e) => {
          e.target.style.border = "1px solid rgba(255,255,255,0.08)";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

export default function Login({ onSwitchToRegister, onGoHome }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const handle = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="w-full px-4 flex items-center justify-center min-h-screen" style={{ background: "#0d0d1a" }}>
      <div
        className="w-full max-w-sm rounded-2xl p-6 md:p-8 flex flex-col gap-5"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Logo cliquable */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={onGoHome}
            className="text-3xl md:text-4xl font-black tracking-widest text-center"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              background: "linear-gradient(90deg, #7c3aed, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            GAMEVIBE
          </button>
          <p className="text-sm text-gray-400 mt-1">Connectez-vous à votre compte</p>
        </div>

        <div className="flex flex-col gap-4">
          <InputField label="Email" type="email" placeholder="votre@email.com" value={form.email} onChange={handle("email")} />
          <InputField label="Mot de passe" type="password" placeholder="••••••••" value={form.password} onChange={handle("password")} />
        </div>

        <button
          className="w-full py-3 md:py-4 rounded-xl font-bold tracking-widest text-sm text-white uppercase transition-all hover:opacity-90 active:scale-95"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            background: "linear-gradient(90deg, #7c3aed, #ec4899)",
            letterSpacing: "0.12em",
          }}
        >
          Se connecter
        </button>

        <p className="text-center text-sm text-gray-400">
          Pas encore de compte ?{" "}
          <button onClick={onSwitchToRegister} className="font-semibold hover:underline" style={{ color: "#a78bfa" }}>
            S&apos;inscrire
          </button>
        </p>
      </div>
    </div>
  );
}