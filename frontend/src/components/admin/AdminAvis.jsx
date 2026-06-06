import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import api from "../../services/api";

export default function AdminAvis() {
  const [jeux, setJeux] = useState([]);
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJeu, setSelectedJeu] = useState("");

  useEffect(() => { fetchJeux(); }, []);

  useEffect(() => {
    if (selectedJeu) fetchAvis(selectedJeu);
  }, [selectedJeu]);

  const fetchJeux = async () => {
    try {
      // all=true → tous les jeux sans pagination pour remplir le select
      const res = await api.get("/jeux", { params: { all: true } });
      const jeuxData = res.data.data ?? [];
      setJeux(jeuxData);
      if (jeuxData.length > 0) setSelectedJeu(jeuxData[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvis = async (jeuId) => {
    setLoading(true);
    try {
      const res = await api.get(`/jeux/${jeuId}/avis`);
      setAvis(res.data.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jeuId, avisId) => {
    if (!confirm("Supprimer cet avis ?")) return;
    try {
      await api.delete(`/jeux/${jeuId}/avis/${avisId}`);
      fetchAvis(jeuId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-black text-white line-clamp-1" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          Avis
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">Voir et gérer les avis</p>
      </div>

      {/* Sélecteur de jeu */}
      <div className="mb-4">
        <select
          value={selectedJeu}
          onChange={(e) => setSelectedJeu(e.target.value)}
          className="w-full bg-[#1A1A2E] border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white outline-none focus:border-violet-500/50"
        >
          {jeux.map((j) => (
            <option key={j.id} value={j.id}>{j.titre}</option>
          ))}
        </select>
      </div>

      {/* Table avis */}
      <div className="bg-[#1A1A2E] rounded-xl border border-white/5 overflow-x-auto">
        {loading ? (
          <div className="p-4 sm:p-6 text-gray-500 text-sm">Chargement...</div>
        ) : (
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-500 tracking-widest uppercase whitespace-nowrap">UTILISATEUR</th>
                <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-500 tracking-widest uppercase whitespace-nowrap">NOTE</th>
                <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-500 tracking-widest uppercase hidden md:table-cell whitespace-nowrap">COMMENTAIRE</th>
                <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-500 tracking-widest uppercase hidden lg:table-cell whitespace-nowrap">DATE</th>
                <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-500 tracking-widest uppercase whitespace-nowrap">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {avis.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 sm:px-4 py-4 sm:py-6 text-center text-gray-500 text-xs sm:text-sm">
                    Aucun avis pour ce jeu
                  </td>
                </tr>
              ) : (
                avis.map((a) => (
                  <tr key={a.id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                    <td className="px-3 sm:px-4 py-2 sm:py-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                          {a.user?.nom?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-white truncate">{a.user?.nom}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-yellow-400 text-xs sm:text-sm whitespace-nowrap">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`bi ${i < a.note ? 'bi-star-fill' : 'bi-star'} text-xs sm:text-sm`}></i>
                        ))}
                        <span className="ml-1 text-xs text-gray-400 hidden sm:inline">({a.note})</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-400 hidden md:table-cell max-w-xs truncate">
                      {a.commentaire}
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-500 hidden lg:table-cell whitespace-nowrap">
                      {a.cree_le}
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(selectedJeu, a.id)}
                        className="text-xs px-2 sm:px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 cursor-pointer transition-colors min-h-8 flex items-center justify-center gap-1"
                      >
                        <i className="bi bi-trash"></i>
                        <span className="hidden sm:inline">Supprimer</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}