import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import api from "../services/api";
import Navbar from "./Navbar";

// ── Modal réutilisable ───────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1A1A2E] rounded-2xl border border-violet-500/20 w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2
            className="font-bold text-white text-sm"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white cursor-pointer"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function InputField({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-400 uppercase tracking-widest">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-[#0F0F1A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/50 transition-colors"
      />
    </div>
  );
}

// ── Étoiles ──────────────────────────────────────────────────────────────────
function Stars({ note, interactive = false, onRate }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <i
          key={i}
          onClick={() => interactive && onRate(i)}
          className={`bi ${i <= note ? "bi-star-fill text-yellow-400" : "bi-star text-gray-600"} text-sm ${interactive ? "cursor-pointer hover:text-yellow-300" : ""}`}
        />
      ))}
    </div>
  );
}

export default function Profil({
  user,
  onGoToLogin,
  onGoToRegister,
  onLogout,
  onNavigate,
  onUpdateUser,
}) {
  const [stats, setStats] = useState(null);
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [modal, setModal] = useState(null); // "profil" | "password" | "edit-avis"
  const [editingAvis, setEditingAvis] = useState(null);

  // Formulaires
  const [profilForm, setProfilForm] = useState({ nom: user?.nom ?? "" });
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [avisForm, setAvisForm] = useState({ note: 0, commentaire: "" });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, avisRes] = await Promise.all([
        api.get("/mes-stats"),
        api.get("/mes-avis"),
      ]);
      setStats(statsRes.data);
      setAvis(avisRes.data.data ?? avisRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Modifier profil ────────────────────────────────────────────────────────
  const handleUpdateProfil = async () => {
    setFormError("");
    setFormSuccess("");
    try {
      const res = await api.put("/profile", { name: profilForm.nom });
      const updated = { ...user, nom: profilForm.nom };
      localStorage.setItem("user", JSON.stringify(updated));
      onUpdateUser(updated);
      setFormSuccess("Profil mis à jour !");
      setTimeout(() => {
        setModal(null);
        setFormSuccess("");
      }, 1200);
    } catch (err) {
      setFormError(
        err.response?.data?.message ?? "Erreur lors de la mise à jour",
      );
    }
  };

  // ── Modifier mot de passe ──────────────────────────────────────────────────
  const handleUpdatePassword = async () => {
    setFormError("");
    setFormSuccess("");
    if (passwordForm.password !== passwordForm.password_confirmation) {
      setFormError("Les mots de passe ne correspondent pas");
      return;
    }
    try {
      await api.put("/password", passwordForm);
      setFormSuccess("Mot de passe modifié !");
      setTimeout(() => {
        setModal(null);
        setFormSuccess("");
        setPasswordForm({
          current_password: "",
          password: "",
          password_confirmation: "",
        });
      }, 1200);
    } catch (err) {
      setFormError(err.response?.data?.message ?? "Erreur lors du changement");
    }
  };

  // ── Supprimer son compte ──────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Supprimer définitivement votre compte ? Cette action est irréversible.",
      )
    )
      return;
    try {
      await api.delete("/account");
      // Nettoyer et déconnecter
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("currentView");
      onLogout();
    } catch (err) {
      alert(
        err.response?.data?.message ??
          "Erreur lors de la suppression du compte.",
      );
    }
  };

  // ── Modifier avis ──────────────────────────────────────────────────────────
  const openEditAvis = (a) => {
    setEditingAvis(a);
    setAvisForm({ note: a.note, commentaire: a.commentaire });
    setFormError("");
    setModal("edit-avis");
  };

  const handleUpdateAvis = async () => {
    setFormError("");
    try {
      await api.put(
        `/jeux/${editingAvis.jeu.id}/avis/${editingAvis.id}`,
        avisForm,
      );
      setModal(null);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message ?? "Erreur");
    }
  };

  // ── Supprimer avis ─────────────────────────────────────────────────────────
  const handleDeleteAvis = async (a) => {
    if (!confirm("Supprimer cet avis ?")) return;
    try {
      await api.delete(`/jeux/${a.jeu.id}/avis/${a.id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Initiales avatar ───────────────────────────────────────────────────────
  const initiale = user?.nom?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="min-h-screen bg-[#0d0d1a]">
      <Navbar
        user={user}
        onGoToLogin={onGoToLogin}
        onGoToRegister={onGoToRegister}
        onLogout={onLogout}
        onNavigate={onNavigate}
        activePage="profil"
      />

      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
        {/* ── CARTE PROFIL ── */}
        <div className="bg-[#1A1A2E] rounded-2xl border border-white/5 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-2xl font-black text-white flex-shrink-0">
            {initiale}
          </div>

          {/* Infos */}
          <div className="flex-1 min-w-0">
            <h2
              className="text-xl font-black text-white"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              {user?.nom}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">{user?.email}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => {
                  setProfilForm({ nom: user?.nom ?? "" });
                  setFormError("");
                  setModal("profil");
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-violet-400 border border-violet-600 hover:bg-violet-400/10 transition-colors cursor-pointer"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                Modifier le profil
              </button>
              <button
                onClick={() => {
                  setPasswordForm({
                    current_password: "",
                    password: "",
                    password_confirmation: "",
                  });
                  setFormError("");
                  setModal("password");
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-pink-400 border border-pink-600 hover:bg-pink-400/10 transition-colors cursor-pointer"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                Changer mot de passe
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 border border-red-600/50 hover:bg-red-400/10 transition-colors cursor-pointer"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                <i className="bi bi-trash mr-1"></i>Supprimer mon compte
              </button>
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        {loading ? (
          <div className="text-gray-500 text-sm text-center py-4">
            Chargement...
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: stats?.total_avis ?? 0, label: "Jeux notés" },
              {
                value: stats?.note_moyenne ?? "—",
                label: "Note moyenne donnée",
              },
              { value: stats?.genre_prefere ?? "—", label: "Genre préféré" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="bg-[#1A1A2E] rounded-2xl border border-white/5 p-5 flex flex-col items-center justify-center gap-2 text-center"
              >
                <span
                  className="font-black bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                  }}
                >
                  {value}
                </span>
                <span
                  className="text-xs text-gray-500 uppercase tracking-widest"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── MES AVIS ── */}
        <div className="flex flex-col gap-4">
          <h3
            className="text-lg font-black text-white"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Mes avis postés
          </h3>

          {loading ? (
            <div className="text-gray-500 text-sm">Chargement...</div>
          ) : avis.length === 0 ? (
            <div className="bg-[#1A1A2E] rounded-2xl border border-white/5 p-6 text-center text-gray-500 text-sm">
              Vous n&apos;avez pas encore posté d&apos;avis.
            </div>
          ) : (
            avis.map((a) => (
              <div
                key={a.id}
                className="bg-[#1A1A2E] rounded-2xl border border-white/5 p-5 flex flex-col gap-3"
              >
                {/* Header avis */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {initiale}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {a.jeu?.titre ?? "Jeu inconnu"}
                      </p>
                      <Stars note={a.note} />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap shrink-0">
                    {a.cree_le}
                  </span>
                </div>

                {/* Commentaire */}
                <p className="text-sm text-gray-300 leading-relaxed">
                  {a.commentaire}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditAvis(a)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-violet-400 border border-violet-600 hover:bg-violet-400/10 transition-colors cursor-pointer"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteAvis(a)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 border border-red-600 hover:bg-red-400/10 transition-colors cursor-pointer"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── MODAL MODIFIER PROFIL ── */}
      {modal === "profil" && (
        <Modal title="Modifier le profil" onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <InputField
              label="Nom"
              value={profilForm.nom}
              onChange={(e) => setProfilForm({ nom: e.target.value })}
              placeholder="Votre nom"
            />
            {formError && <p className="text-xs text-red-400">{formError}</p>}
            {formSuccess && (
              <p className="text-xs text-green-400">{formSuccess}</p>
            )}
            <div className="flex gap-2 mt-1">
              <button
                onClick={handleUpdateProfil}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-pink-500 hover:opacity-90 cursor-pointer"
              >
                Enregistrer
              </button>
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white bg-white/5 hover:bg-white/10 cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── MODAL CHANGER MOT DE PASSE ── */}
      {modal === "password" && (
        <Modal title="Changer le mot de passe" onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <InputField
              label="Mot de passe actuel"
              type="password"
              value={passwordForm.current_password}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  current_password: e.target.value,
                })
              }
              placeholder="••••••••"
            />
            <InputField
              label="Nouveau mot de passe"
              type="password"
              value={passwordForm.password}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, password: e.target.value })
              }
              placeholder="••••••••"
            />
            <InputField
              label="Confirmer"
              type="password"
              value={passwordForm.password_confirmation}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  password_confirmation: e.target.value,
                })
              }
              placeholder="••••••••"
            />
            {formError && <p className="text-xs text-red-400">{formError}</p>}
            {formSuccess && (
              <p className="text-xs text-green-400">{formSuccess}</p>
            )}
            <div className="flex gap-2 mt-1">
              <button
                onClick={handleUpdatePassword}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-pink-500 hover:opacity-90 cursor-pointer"
              >
                Enregistrer
              </button>
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white bg-white/5 hover:bg-white/10 cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── MODAL MODIFIER AVIS ── */}
      {modal === "edit-avis" && (
        <Modal
          title={`Modifier l'avis — ${editingAvis?.jeu?.titre}`}
          onClose={() => setModal(null)}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 uppercase tracking-widest">
                Note
              </label>
              <Stars
                note={avisForm.note}
                interactive
                onRate={(n) => setAvisForm({ ...avisForm, note: n })}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 uppercase tracking-widest">
                Commentaire
              </label>
              <textarea
                value={avisForm.commentaire}
                onChange={(e) =>
                  setAvisForm({ ...avisForm, commentaire: e.target.value })
                }
                rows={4}
                className="bg-[#0F0F1A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/50 resize-none"
              />
            </div>
            {formError && <p className="text-xs text-red-400">{formError}</p>}
            <div className="flex gap-2 mt-1">
              <button
                onClick={handleUpdateAvis}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-pink-500 hover:opacity-90 cursor-pointer"
              >
                Enregistrer
              </button>
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white bg-white/5 hover:bg-white/10 cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
