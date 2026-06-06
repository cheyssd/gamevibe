import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import api from "../services/api";
import Navbar from "./Navbar";

export default function FicheJeu({ jeuId, user, onGoToLogin, onGoToRegister, onLogout, onNavigate }) {
  const [jeu, setJeu] = useState(null);
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ note: 0, commentaire: "" });
  const [hoverNote, setHoverNote] = useState(0);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ note: 0, commentaire: "" });
  const [editHover, setEditHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (jeuId) fetchJeu();
  }, [jeuId]);

  const fetchJeu = async () => {
    setLoading(true);
    try {
      const [jeuRes, avisRes] = await Promise.all([
        api.get(`/jeux/${jeuId}`),
        api.get(`/jeux/${jeuId}/avis`),
      ]);
      setJeu(jeuRes.data.data);
      setAvis(avisRes.data.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const monAvis = user ? avis.find((a) => a.user?.id === user.id) : null;

  const handleSubmitAvis = async () => {
    if (form.note === 0) { setError("Veuillez sélectionner une note."); return; }
    if (!form.commentaire.trim()) { setError("Veuillez écrire un commentaire."); return; }
    setError(""); setSubmitting(true);
    try {
      await api.post(`/jeux/${jeuId}/avis`, form);
      setForm({ note: 0, commentaire: "" });
      setSuccess("Avis posté avec succès !");
      fetchJeu();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAvis = async (avisId) => {
    if (!confirm("Supprimer cet avis ?")) return;
    try {
      await api.delete(`/jeux/${jeuId}/avis/${avisId}`);
      fetchJeu();
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (a) => {
    setEditId(a.id);
    setEditForm({ note: a.note, commentaire: a.commentaire });
  };

  const handleEditAvis = async () => {
    if (editForm.note === 0) { setError("Veuillez sélectionner une note."); return; }
    if (!editForm.commentaire.trim()) { setError("Veuillez écrire un commentaire."); return; }
    setError(""); setSubmitting(true);
    try {
      await api.put(`/jeux/${jeuId}/avis/${editId}`, editForm);
      setEditId(null);
      setSuccess("Avis modifié avec succès !");
      fetchJeu();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (note, interactive = false, onSet = null, onHover = null, hovered = 0) => {
    return Array.from({ length: 5 }, (_, i) => {
      const val = i + 1;
      const filled = interactive ? val <= (hovered || note) : val <= note;
      return (
        <i
          key={i}
          className={`bi ${filled ? "bi-star-fill" : "bi-star"} text-yellow-400 ${interactive ? "cursor-pointer text-xl hover:scale-110 transition-transform" : "text-sm"}`}
          onMouseEnter={interactive ? () => onHover(val) : undefined}
          onMouseLeave={interactive ? () => onHover(0) : undefined}
          onClick={interactive ? () => onSet(val) : undefined}
        />
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center">
        <div className="text-gray-500 flex items-center gap-2">
          <i className="bi bi-arrow-repeat animate-spin text-violet-500 text-2xl"></i>
          Chargement...
        </div>
      </div>
    );
  }

  if (!jeu) {
    return (
      <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center">
        <div className="text-gray-500">Jeu introuvable.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F1A] text-white" style={{ fontFamily: "'Rajdhani', sans-serif" }}>

      {/* NAVBAR */}
      <Navbar
        user={user}
        onGoToLogin={onGoToLogin}
        onGoToRegister={onGoToRegister}
        onLogout={onLogout}
        onNavigate={onNavigate}
        activePage="catalogue"
      />

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">

        {/* Retour */}
        <button
          onClick={() => onNavigate("catalogue")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer mb-6 text-sm"
        >
          <i className="bi bi-arrow-left"></i> Retour au catalogue
        </button>

        {/* ── HERO JEU ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Image */}
          <div className="md:col-span-1">
            <div className="rounded-xl overflow-hidden border border-white/10">
              <img
                src={jeu.image || "https://via.placeholder.com/400x500?text=GameVibe"}
                alt={jeu.titre}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>
          </div>

          {/* Infos */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h1
              className="text-2xl md:text-3xl font-black text-white"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              {jeu.titre}
            </h1>

            {/* Note globale */}
            <div className="flex items-center gap-3">
              <span
                className="text-4xl font-black bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {Number(jeu.note_moyenne).toFixed(1)}
              </span>
              <div>
                <div className="flex gap-0.5">
                  {renderStars(Math.round(jeu.note_moyenne))}
                </div>
                <div className="text-gray-500 text-xs mt-0.5">{avis.length} avis</div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed">{jeu.description}</p>

            {/* Détails */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1A1A2E] rounded-lg p-3 border border-white/5">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                  <i className="bi bi-calendar3 mr-1"></i>Date de sortie
                </div>
                <div className="text-sm font-semibold">{jeu.date_sortie}</div>
              </div>
              <div className="bg-[#1A1A2E] rounded-lg p-3 border border-white/5">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                  <i className="bi bi-person-fill mr-1"></i>Développeur
                </div>
                <div className="text-sm font-semibold">{jeu.developpeur?.nom ?? "Inconnu"}</div>
              </div>
            </div>

            {/* Plateformes */}
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                <i className="bi bi-pc-display mr-1"></i>Plateformes
              </div>
              <div className="flex flex-wrap gap-2">
                {jeu.plateformes?.map((p) => (
                  <span key={p.id} className="text-xs px-3 py-1 rounded-lg bg-violet-500/15 text-violet-400 border border-violet-500/20">{p.nom}</span>
                ))}
              </div>
            </div>

            {/* Catégories */}
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                <i className="bi bi-tag-fill mr-1"></i>Catégories
              </div>
              <div className="flex flex-wrap gap-2">
                {jeu.categories?.map((c) => (
                  <span key={c.id} className="text-xs px-3 py-1 rounded-lg bg-pink-500/15 text-pink-400 border border-pink-500/20">{c.nom}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION AVIS ── */}
        <div className="border-t border-white/5 pt-8">
          <h2
            className="text-xl font-black text-white mb-6"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            <i className="bi bi-chat-left-fill mr-2 text-violet-500"></i>
            Avis de la communauté ({avis.length})
          </h2>

          {/* Messages */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
              <i className="bi bi-exclamation-circle mr-2"></i>{error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-lg mb-4">
              <i className="bi bi-check-circle mr-2"></i>{success}
            </div>
          )}

          {/* Formulaire avis — user connecté sans avis existant */}
          {user && !monAvis && (
            <div className="bg-[#1A1A2E] rounded-xl border border-violet-500/20 p-5 mb-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <i className="bi bi-pencil-fill text-violet-500"></i>
                Donner mon avis
              </h3>

              {/* Sélection note */}
              <div className="mb-4">
                <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">Ma note</div>
                <div className="flex items-center gap-1">
                  {renderStars(form.note, true,
                    (val) => setForm({ ...form, note: val }),
                    setHoverNote,
                    hoverNote
                  )}
                  {form.note > 0 && (
                    <span className="text-yellow-400 text-sm ml-2 font-bold">{form.note}/5</span>
                  )}
                </div>
              </div>

              {/* Commentaire */}
              <div className="mb-4">
                <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">Mon commentaire</div>
                <textarea
                  value={form.commentaire}
                  onChange={(e) => setForm({ ...form, commentaire: e.target.value })}
                  placeholder="Partagez votre expérience avec ce jeu..."
                  rows={4}
                  className="w-full bg-[#0F0F1A] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50 resize-none"
                />
              </div>

              <button
                onClick={handleSubmitAvis}
                disabled={submitting}
                className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-pink-500 hover:opacity-90 cursor-pointer disabled:opacity-50 transition-all"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {submitting ? "Publication..." : "Publier mon avis"}
              </button>
            </div>
          )}

          {/* Message si non connecté */}
          {!user && (
            <div className="bg-[#1A1A2E] rounded-xl border border-white/10 p-5 mb-6 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <i className="bi bi-lock-fill text-violet-500 text-xl"></i>
                <span>Connectez-vous pour laisser un avis sur ce jeu</span>
              </div>
              <button
                onClick={onGoToLogin}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-pink-500 hover:opacity-90 cursor-pointer"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                Se connecter
              </button>
            </div>
          )}

          {/* Liste des avis */}
          {avis.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <i className="bi bi-chat-left text-4xl text-gray-600"></i>
              <p className="text-gray-500 text-sm">Aucun avis pour ce jeu. Soyez le premier !</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {avis.map((a) => (
                <div
                  key={a.id}
                  className={`bg-[#1A1A2E] rounded-xl border p-4 ${
                    user && a.user?.id === user.id
                      ? "border-violet-500/30"
                      : "border-white/5"
                  }`}
                >
                  {editId === a.id ? (
                    /* Formulaire modification */
                    <div className="flex flex-col gap-3">
                      <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Modifier ma note</div>
                      <div className="flex items-center gap-1">
                        {renderStars(editForm.note, true,
                          (val) => setEditForm({ ...editForm, note: val }),
                          setEditHover,
                          editHover
                        )}
                        {editForm.note > 0 && (
                          <span className="text-yellow-400 text-sm ml-2 font-bold">{editForm.note}/5</span>
                        )}
                      </div>
                      <textarea
                        value={editForm.commentaire}
                        onChange={(e) => setEditForm({ ...editForm, commentaire: e.target.value })}
                        rows={3}
                        className="w-full bg-[#0F0F1A] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50 resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleEditAvis}
                          disabled={submitting}
                          className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-pink-500 hover:opacity-90 cursor-pointer disabled:opacity-50"
                        >
                          {submitting ? "Modification..." : "Enregistrer"}
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="px-4 py-2 rounded-lg text-sm font-bold text-gray-400 border border-white/10 hover:bg-white/5 cursor-pointer"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Affichage avis */
                    <>
                      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            {a.user?.nom?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white flex items-center gap-2">
                              {a.user?.nom}
                              {user && a.user?.id === user.id && (
                                <span className="text-xs px-2 py-0.5 rounded bg-violet-500/15 text-violet-400">Mon avis</span>
                              )}
                            </div>
                            <div className="flex gap-0.5 mt-0.5">
                              {renderStars(a.note)}
                              <span className="text-yellow-400 text-xs ml-1 font-bold">{a.note}/5</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-xs">{a.cree_le}</span>
                          {user && a.user?.id === user.id && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => openEdit(a)}
                                className="text-xs px-2 py-1 rounded-lg bg-violet-500/15 text-violet-400 hover:bg-violet-500/25 cursor-pointer transition-colors"
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                onClick={() => handleDeleteAvis(a.id)}
                                className="text-xs px-2 py-1 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 cursor-pointer transition-colors"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">{a.commentaire}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}