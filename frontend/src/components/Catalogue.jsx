import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import api from "../services/api";
import Navbar from "./Navbar";

export default function Catalogue({ user, onGoToLogin, onGoToRegister, onLogout, onNavigate, onSelectJeu }) {
  const [jeux, setJeux] = useState([]);
  const [plateformes, setPlateformes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPlateforme, setSelectedPlateforme] = useState(null);
  const [selectedCategorie, setSelectedCategorie] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const PAGE_SIZE = 12;

  useEffect(() => { fetchMeta(); }, []);

  useEffect(() => {
    fetchJeux(currentPage);
  }, [currentPage, search, selectedPlateforme, selectedCategorie]);

  const fetchMeta = async () => {
    try {
      const [platRes, catRes] = await Promise.all([
        api.get("/plateformes"),
        api.get("/categories"),
      ]);
      setPlateformes(platRes.data.data ?? []);
      setCategories(catRes.data.data ?? []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchJeux = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, per_page: PAGE_SIZE };
      if (search) params.search = search;
      if (selectedPlateforme) params.plateforme_id = selectedPlateforme;
      if (selectedCategorie) params.categorie_id = selectedCategorie;

      const res = await api.get("/jeux", { params });
      const meta = res.data.meta ?? {};
      setJeux(res.data.data ?? []);
      setTotal(Number(meta.total ?? res.data.data?.length) || 0);
      setTotalPages(Number(meta.derniere_page ?? meta.last_page ?? 1) || 1);
      setCurrentPage(Number(meta.page_actuelle ?? meta.current_page ?? page) || page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handlePlateforme = (id) => {
    setSelectedPlateforme(selectedPlateforme === id ? null : id);
    setCurrentPage(1);
  };

  const handleCategorie = (id) => {
    setSelectedCategorie(selectedCategorie === id ? null : id);
    setCurrentPage(1);
  };

  const resetFiltres = () => {
    setSearch("");
    setSelectedPlateforme(null);
    setSelectedCategorie(null);
    setCurrentPage(1);
  };

  const getPaginationItems = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    if (currentPage > 3) pages.push("left-ellipsis");
    for (let p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) pages.push(p);
    if (currentPage < totalPages - 2) pages.push("right-ellipsis");
    pages.push(totalPages);
    return pages;
  };

  const renderStars = (note) => {
    const full = Math.round(note);
    return Array.from({ length: 5 }, (_, i) => (
      <i key={i} className={`bi ${i < full ? "bi-star-fill" : "bi-star"} text-yellow-400 text-xs`}></i>
    ));
  };

  return (
    <div className="min-h-screen bg-[#0F0F1A] text-white" style={{ fontFamily: "'Rajdhani', sans-serif" }}>

      {/* ── NAVBAR ── */}
      <Navbar
        user={user}
        onGoToLogin={onGoToLogin}
        onGoToRegister={onGoToRegister}
        onLogout={onLogout}
        onNavigate={onNavigate}
        activePage="catalogue"
      />

      {/* ── HEADER ── */}
      <div className="bg-[#1A1A2E] border-b border-violet-500/10 px-4 md:px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1
              className="text-2xl md:text-3xl font-black text-white mb-1"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Catalogue des jeux
            </h1>
            <p className="text-gray-500 text-sm">{total} jeux disponibles</p>
          </div>
          {(selectedPlateforme || selectedCategorie || search) && (
            <button
              onClick={resetFiltres}
              className="text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all cursor-pointer flex items-center gap-1"
            >
              <i className="bi bi-x-circle"></i> Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">

        {/* ── RECHERCHE + FILTRES ── */}
        <div className="mb-6 flex flex-col gap-4">

          {/* Barre de recherche */}
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un jeu..."
              value={search}
              onChange={handleSearch}
              className="w-full bg-[#1A1A2E] border border-white/10 rounded-xl px-5 py-3 pl-11 text-sm text-white outline-none focus:border-violet-500/50 transition-colors"
            />
            <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
          </div>

          {/* Filtres plateformes */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-500 uppercase tracking-widest self-center mr-1">
              <i className="bi bi-pc-display mr-1"></i>Plateformes :
            </span>
            {/* Bouton Toutes plateformes */}
            <button
              onClick={() => { setSelectedPlateforme(null); setCurrentPage(1); }}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                selectedPlateforme === null
                  ? "bg-violet-500/20 border-violet-500 text-violet-300"
                  : "bg-white/5 border-white/10 text-gray-400 hover:border-violet-500/50 hover:text-white"
              }`}
            >
              <i className="bi bi-grid-fill mr-1"></i>Toutes
            </button>
            {plateformes.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePlateforme(p.id)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  selectedPlateforme === p.id
                    ? "bg-violet-500/20 border-violet-500 text-violet-300"
                    : "bg-white/5 border-white/10 text-gray-400 hover:border-violet-500/50 hover:text-white"
                }`}
              >
                <i className="bi bi-pc-display mr-1"></i>{p.nom}
              </button>
            ))}
          </div>

          {/* Filtres catégories */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-500 uppercase tracking-widest self-center mr-1">
              <i className="bi bi-tag-fill mr-1"></i>Catégories :
            </span>
            {/* Bouton Toutes catégories */}
            <button
              onClick={() => { setSelectedCategorie(null); setCurrentPage(1); }}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                selectedCategorie === null
                  ? "bg-pink-500/20 border-pink-500 text-pink-300"
                  : "bg-white/5 border-white/10 text-gray-400 hover:border-pink-500/50 hover:text-white"
              }`}
            >
              <i className="bi bi-grid-fill mr-1"></i>Toutes
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategorie(c.id)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  selectedCategorie === c.id
                    ? "bg-pink-500/20 border-pink-500 text-pink-300"
                    : "bg-white/5 border-white/10 text-gray-400 hover:border-pink-500/50 hover:text-white"
                }`}
              >
                <i className="bi bi-tag-fill mr-1"></i>{c.nom}
              </button>
            ))}
          </div>
        </div>

        {/* ── GRILLE DE JEUX ── */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-500 text-sm flex items-center gap-2">
              <i className="bi bi-arrow-repeat animate-spin text-violet-500 text-xl"></i>
              Chargement...
            </div>
          </div>
        ) : jeux.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <i className="bi bi-controller text-5xl text-gray-600"></i>
            <p className="text-gray-500 text-sm">Aucun jeu trouvé</p>
            <button
              onClick={resetFiltres}
              className="text-xs text-violet-400 hover:underline cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {jeux.map((jeu) => (
              <div
                key={jeu.id}
                onClick={() => onSelectJeu(jeu.id)}
                className="bg-[#1A1A2E] rounded-xl border border-white/5 overflow-hidden cursor-pointer hover:border-violet-500/40 hover:transform hover:-translate-y-1 transition-all duration-200 group"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={jeu.image || "https://via.placeholder.com/400x250?text=GameVibe"}
                    alt={jeu.titre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E] to-transparent opacity-60" />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                    <i className="bi bi-star-fill text-yellow-400 text-xs"></i>
                    <span className="text-white text-xs font-bold">{Number(jeu.note_moyenne).toFixed(1)}</span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-3">
                  <h3 className="font-bold text-white text-sm mb-2 line-clamp-1">{jeu.titre}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(jeu.note_moyenne)}
                    <span className="text-gray-500 text-xs ml-1">({jeu.avis?.length ?? 0})</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {jeu.plateformes?.slice(0, 3).map((p) => (
                      <span key={p.id} className="text-xs px-2 py-0.5 rounded bg-violet-500/15 text-violet-400">{p.nom}</span>
                    ))}
                    {jeu.plateformes?.length > 3 && (
                      <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-400">+{jeu.plateformes.length - 3}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {jeu.categories?.slice(0, 2).map((c) => (
                      <span key={c.id} className="text-xs px-2 py-0.5 rounded bg-pink-500/15 text-pink-400">{c.nom}</span>
                    ))}
                    {jeu.categories?.length > 2 && (
                      <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-400">+{jeu.categories.length - 2}</span>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-3 py-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    <i className="bi bi-person-fill mr-1"></i>
                    {jeu.developpeur?.nom ?? "Inconnu"}
                  </span>
                  <span className="text-xs text-violet-400 group-hover:text-violet-300 transition-colors">
                    Voir plus <i className="bi bi-arrow-right"></i>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── PAGINATION ── */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-gray-500">
              Affichage {(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, total)} sur {total} jeux
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg text-xs font-semibold text-white bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <i className="bi bi-chevron-left"></i> Précédent
              </button>
              {getPaginationItems().map((page) =>
                typeof page === "string" ? (
                  <span key={page} className="px-3 py-2 text-xs text-gray-400">…</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      page === currentPage
                        ? "bg-violet-500 text-white"
                        : "bg-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg text-xs font-semibold text-white bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Suivant <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}