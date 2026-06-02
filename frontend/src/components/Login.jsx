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
        className="w-full rounded-lg px-4 py-3 text-sm text-gray-200 outline-none transition-all duration-200 placeholder-gray-500 bg-white/5 border border-white/10 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/15"
      />
    </div>
  );
}

export default function Login({ onSwitchToRegister, onGoHome }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const handle = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="w-full px-4 flex items-center justify-center min-h-screen bg-[#0d0d1a]">
      <div className="w-full max-w-sm rounded-2xl p-6 md:p-8 flex flex-col gap-5 bg-white/[0.04] border border-white/[0.07] backdrop-blur-md">

        {/* Logo */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={onGoHome}
            className="text-3xl md:text-4xl font-black tracking-widest text-center bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            GAMEVIBE
          </button>
          <p className="text-sm text-gray-400 mt-1">Connectez-vous à votre compte</p>
        </div>

        {/* Champs */}
        <div className="flex flex-col gap-4">
          <InputField label="Email" type="email" placeholder="votre@email.com" value={form.email} onChange={handle("email")} />
          <InputField label="Mot de passe" type="password" placeholder="••••••••" value={form.password} onChange={handle("password")} />
        </div>

        {/* Bouton */}
        <button
          className="w-full py-3 md:py-4 rounded-xl font-bold tracking-widest text-sm text-white uppercase bg-gradient-to-r from-violet-600 to-pink-500 hover:opacity-90 active:scale-95 transition-all"
          style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.12em" }}
        >
          Se connecter
        </button>

        {/* Lien */}
        <p className="text-center text-sm text-gray-400">
          Pas encore de compte ?{" "}
          <button onClick={onSwitchToRegister} className="font-semibold text-violet-400 hover:underline">
            S&apos;inscrire
          </button>
        </p>
      </div>
    </div>
  );
}