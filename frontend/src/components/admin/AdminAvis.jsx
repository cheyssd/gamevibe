import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import api from "../../services/api";

export default function AdminAvis() {
  const PAGE_SIZE = 10;

  const [jeux, setJeux] = useState([]);
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [jeuFilter, setJeuFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [avisMeta, setAvisMeta] = useState({ total: 0, current_page: 1, last_page: 1 });

  useEffect(() => { fetchJeux(); }, []);

  useEffect(() => {
    fetchAvis(currentPage, jeuFilter);
  }, [currentPage, jeuFilter]);

  const fetchJeux = async () => {
    try {
      const res = await api.get("/jeux", { params: { all: true } });
      setJeux(res.data.data ?? []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAvis = async (page = 1, jeuId = "") => {
    setLoading(true);
    setError(null);
    try {
      const params = { per_page: PAGE_SIZE, page };
      if (jeuId) params.jeu_id = jeuId;

      const res = await api.get("/avis", { params });
      const meta = res.data.meta ?? {};
      const fallbackTotal = res.data.data?.length ?? 0;

      const normalizedMeta = {
        total:         Number(meta.total ?? fallbackTotal) || fallbackTotal,
        current_page:  Number(meta.page_actuelle ?? meta.current_page ?? page) || page,
        last_page:     Number(meta.derniere_page ?? meta.last_page ?? 1) || 1,
      };

      setAvis(res.data.data ?? []);
      setAvisMeta(normalizedMeta);
      setCurrentPage(normalizedMeta.current_page);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les avis.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jeuId, avisId) => {
    if (!confirm("Supprimer cet avis ?")) return;
    try {
      await api.delete(`/jeux/${jeuId}/avis/${avisId}`);
      // Si c'était le dernier avis de la page, on recule d'une page
      if (avis.length === 1 && currentPage > 1) {
        setCurrentPage((p) => Math.max(p - 1, 1));
      } else {
        fetchAvis(currentPage, jeuFilter);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const lastPage          = Number(avisMeta.last_page) || 1;
  const currentPageNumber = Number(avisMeta.current_page) || currentPage;
  const totalAvisNumber   = Number(avisMeta.total) || 0;
  const displayedStart    = totalAvisNumber > 0 ? Math.min((currentPageNumber - 1) * PAGE_SIZE + 1, totalAvisNumber) : 0;
  const displayedEnd      = totalAvisNumber > 0 ? Math.min(currentPageNumber * PAGE_SIZE, totalAvisNumber) : 0;

  const getPaginationItems = () => {
    const pages = [];
    const siblingCount = 1;
    const totalPageNumbers = siblingCount * 2 + 5;

    if (lastPage <= totalPageNumbers) {
      return Array.from({ length: lastPage }, (_, i) => i + 1);
    }

    const left  = Math.max(currentPageNumber - siblingCount, 2);
    const right = Math.min(currentPageNumber + siblingCount, lastPage - 1);

    pages.push(1);
    if (left > 2) pages.push("left-ellipsis");
    for (let p = left; p <= right; p++) pages.push(p);
    if (right < lastPage - 1) pages.push("right-ellipsis");
    pages.push(lastPage);

    return pages;
  };

  // Ellipse propre sur le commentaire (3 points, pas de coupure brutale au milieu d'un mot si possible)
  const truncate = (text, max = 80) => {
    if (!text) return "";
    if (text.length <= max) return text;
    return text.slice(0, max).trimEnd() + "...";
  };

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-black text-white line-clamp-1" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          Avis
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">Voir et gérer les avis</p>
      </div>

      {/* Filtre par jeu */}
      <div className="mb-4">
        <select
          value={jeuFilter}
          onChange={(e) => { setJeuFilter(e.target.value); setCurrentPage(1); }}
          className="w-full bg-[#1A1A2E] border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white outline-none focus:border-violet-500/50"
        >
          <option value="">Tous les jeux</option>
          {jeux.map((j) => (
            <option key={j.id} value={j.id}>{j.titre}</option>
          ))}
        </select>
      </div>

      {/* Table avis */}
      <div className="bg-[#1A1A2E] rounded-xl border border-white/5 overflow-x-auto">
        {loading ? (
          <div className="p-4 sm:p-6 text-gray-500 text-sm">Chargement...</div>
        ) : error ? (
          <div className="p-4 sm:p-6 text-red-400 text-sm">{error}</div>
        ) : (
          <>
            <table className="w-full min-w-max">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-500 tracking-widest uppercase whitespace-nowrap">UTILISATEUR</th>
                  <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-500 tracking-widest uppercase whitespace-nowrap hidden sm:table-cell">JEU</th>
                  <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-500 tracking-widest uppercase whitespace-nowrap">NOTE</th>
                  <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-500 tracking-widest uppercase hidden md:table-cell whitespace-nowrap">COMMENTAIRE</th>
                  <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-500 tracking-widest uppercase hidden lg:table-cell whitespace-nowrap">DATE</th>
                  <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-500 tracking-widest uppercase whitespace-nowrap">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {avis.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 sm:px-4 py-4 sm:py-6 text-center text-gray-500 text-xs sm:text-sm">
                      Aucun avis trouvé
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
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-300 hidden sm:table-cell whitespace-nowrap max-w-[160px] truncate" title={a.jeu?.titre}>
                        {a.jeu?.titre ?? "—"}
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-yellow-400 text-xs sm:text-sm whitespace-nowrap">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={`bi ${i < a.note ? 'bi-star-fill' : 'bi-star'} text-xs sm:text-sm`}></i>
                          ))}
                          <span className="ml-1 text-xs text-gray-400 hidden sm:inline">({a.note})</span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-400 hidden md:table-cell max-w-xs" title={a.commentaire}>
                        {truncate(a.commentaire, 80)}
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-500 hidden lg:table-cell whitespace-nowrap">
                        {a.cree_le}
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(a.jeu?.id, a.id)}
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

            {/* Pagination */}
            {lastPage > 1 && (
              <div className="px-3 sm:px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-white/5">
                <div className="text-xs text-gray-400">
                  Affichage {displayedStart} - {displayedEnd} sur {totalAvisNumber} avis
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(Math.max(currentPageNumber - 1, 1))}
                    disabled={currentPageNumber === 1}
                    className="px-3 py-2 rounded-lg text-xs font-semibold text-white bg-white/5 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 transition-all"
                  >
                    Précédent
                  </button>
                  {getPaginationItems().map((page) =>
                    typeof page === "string" ? (
                      <span key={page} className="px-3 py-2 rounded-lg text-xs font-semibold text-gray-400 select-none">…</span>
                    ) : (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                          page === currentPageNumber ? "bg-violet-500 text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    type="button"
                    onClick={() => setCurrentPage(Math.min(currentPageNumber + 1, lastPage))}
                    disabled={currentPageNumber === lastPage}
                    className="px-3 py-2 rounded-lg text-xs font-semibold text-white bg-white/5 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 transition-all"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}