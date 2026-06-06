import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import api from "../../services/api";

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#1A1A2E] rounded-xl border border-violet-500/20 w-full max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5 sticky top-0 bg-[#1A1A2E] z-10">
          <h2
            className="font-bold text-white text-sm sm:text-base line-clamp-1"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg sm:text-xl cursor-pointer shrink-0 ml-2 min-h-9 min-w-9 flex items-center justify-center"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
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
        className="bg-[#0F0F1A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/50 transition-colors w-full"
      />
    </div>
  );
}

const EMPTY_FORM = {
  titre: "",
  description: "",
  image: "",
  date_sortie: "",
  developpeur_id: "",
  plateformes: [],
  categories: [],
};

export default function AdminJeux() {
  const PAGE_SIZE = 10;
  const [jeux, setJeux] = useState([]);
  const [plateformes, setPlateformes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [developpeurs, setDeveloppeurs] = useState([]);
  const [loadingJeux, setLoadingJeux] = useState(true);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJeux, setTotalJeux] = useState(0);
  const [jeuxMeta, setJeuxMeta] = useState({
    total: 0,
    current_page: 1,
    last_page: 1,
  });
  const [error, setError] = useState(null);
  const [platformeFilter, setPlatformeFilter] = useState("");
  const [categorieFilter, setCategorieFilter] = useState("");

  useEffect(() => {
    fetchJeux(currentPage, search, platformeFilter, categorieFilter);
  }, [currentPage, search, platformeFilter, categorieFilter]);

  useEffect(() => {
    const currentPageNum = Number(currentPage) || 1;
    const lastPage = Number(jeuxMeta.last_page) || totalPages;
    if (currentPageNum > lastPage) {
      setCurrentPage(Math.max(lastPage || 1, 1));
    }
  }, [totalPages, jeuxMeta.last_page]);

  useEffect(() => {
    fetchMeta();
  }, []);

  const fetchJeux = async (
    page = 1,
    query = "",
    plateforme = "",
    categorie = "",
  ) => {
    setLoadingJeux(true);
    setError(null);

    try {
      const params = { per_page: PAGE_SIZE, page };
      if (query) params.search = query;
      if (plateforme) params.plateforme_id = plateforme;
      if (categorie) params.categorie_id = categorie;

      const response = await api.get("/jeux", { params });
      const meta = response.data.meta ?? {};
      const fallbackTotal = response.data.data?.length ?? 0;

      // normalize meta (support FR/EN keys and provide fallbacks)
      const normalizedMeta = {
        total: Number(meta.total ?? fallbackTotal) || fallbackTotal,
        current_page:
          Number(meta.page_actuelle ?? meta.current_page ?? page) || page,
        last_page: Number(meta.derniere_page ?? meta.last_page ?? 1) || 1,
      };

      setJeux(response.data.data ?? []);
      setJeuxMeta(normalizedMeta);
      setTotalPages(normalizedMeta.last_page);
      setTotalJeux(normalizedMeta.total);
      setCurrentPage(normalizedMeta.current_page);
    } catch (err) {
      console.error(err);
      setError(
        "Impossible de charger les jeux. Vérifiez la connexion ou l'API.",
      );
    } finally {
      setLoadingJeux(false);
    }
  };

  const fetchMeta = async () => {
    setLoadingMeta(true);
    try {
      const [platRes, catRes, devRes] = await Promise.all([
        api.get("/plateformes", { params: { all: true } }),
        api.get("/categories", { params: { all: true } }),
        api.get("/developpeurs", { params: { all: true } }),
      ]);

      // Gère les deux formats possibles : { data: [...] } ou directement [...]
      const extract = (res) => {
        const raw = res.data;
        if (Array.isArray(raw)) return raw;
        if (Array.isArray(raw.data)) return raw.data;
        return [];
      };

      const devs = extract(devRes);
      // Tri alphabétique pour trouver facilement dans le select
      devs.sort((a, b) => a.nom.localeCompare(b.nom));

      setPlateformes(extract(platRes));
      setCategories(extract(catRes));
      setDeveloppeurs(devs);

      console.log(`✅ ${devs.length} développeurs chargés`); // debug temporaire
    } catch (err) {
      console.error("Erreur fetchMeta :", err);
    } finally {
      setLoadingMeta(false);
    }
  };

  const handle = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const toggleArray = (field, id) => {
    const arr = form[field];
    setForm({
      ...form,
      [field]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id],
    });
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setModal("add");
  };

  const openEdit = (jeu) => {
    setForm({
      titre: jeu.titre,
      description: jeu.description,
      image: jeu.image ?? "",
      date_sortie: jeu.date_sortie,
      developpeur_id: jeu.developpeur?.id ?? "",
      plateformes: jeu.plateformes?.map((p) => p.id) ?? [],
      categories: jeu.categories?.map((c) => c.id) ?? [],
    });
    setEditId(jeu.id);
    setModal("edit");
  };

  const handleSubmit = async () => {
    try {
      if (modal === "add") {
        await api.post("/jeux", form);
      } else {
        await api.put(`/jeux/${editId}`, form);
      }
      setModal(null);
      fetchJeux(currentPage, search, platformeFilter, categorieFilter);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce jeu ?")) return;
    try {
      await api.delete(`/jeux/${id}`);
      if (jeux.length === 1 && currentPage > 1) {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
      } else {
        fetchJeux(currentPage, search, platformeFilter, categorieFilter);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const currentPageNumber =
    Number(currentPage) || Number(jeuxMeta.current_page) || 1;
  const totalJeuxNumber = Number(jeuxMeta.total) || Number(totalJeux) || 0;
  const lastPage = Number(jeuxMeta.last_page) || totalPages;
  const displayedStart =
    totalJeuxNumber > 0
      ? Math.min((currentPageNumber - 1) * PAGE_SIZE + 1, totalJeuxNumber)
      : jeux.length > 0
        ? 1
        : 0;
  const displayedEnd =
    totalJeuxNumber > 0
      ? Math.min(currentPageNumber * PAGE_SIZE, totalJeuxNumber)
      : jeux.length;

  const getPaginationItems = () => {
    const pages = [];
    const siblingCount = 1;
    const totalPagesCount = Number(jeuxMeta.last_page) || totalPages;
    const totalPageNumbers = siblingCount * 2 + 5;

    if (totalPagesCount <= totalPageNumbers) {
      return Array.from({ length: totalPagesCount }, (_, index) => index + 1);
    }

    const leftSiblingIndex = Math.max(currentPageNumber - siblingCount, 2);
    const rightSiblingIndex = Math.min(
      currentPageNumber + siblingCount,
      totalPagesCount - 1,
    );

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPagesCount - 1;

    pages.push(1);

    if (shouldShowLeftDots) {
      pages.push("left-ellipsis");
    }

    for (let page = leftSiblingIndex; page <= rightSiblingIndex; page += 1) {
      pages.push(page);
    }

    if (shouldShowRightDots) {
      pages.push("right-ellipsis");
    }

    pages.push(totalPagesCount);
    return pages;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <div className="min-w-0">
          <h1
            className="text-xl sm:text-2xl font-black text-white line-clamp-1"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Gestion des jeux
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1 line-clamp-1">
            Ajouter, modifier ou supprimer des jeux
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-pink-500 hover:opacity-90 cursor-pointer flex items-center gap-2 min-h-10 whitespace-nowrap"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          <i className="bi bi-plus-lg"></i>
          <span className="hidden sm:inline">Ajouter un jeu</span>
          <span className="sm:hidden">Jeu</span>
        </button>
      </div>

      <div className="flex flex-col gap-3 mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#1A1A2E] border border-white/10 rounded-lg px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white outline-none focus:border-violet-500/50 pr-10"
          />
          <i className="bi bi-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            value={platformeFilter}
            onChange={(e) => {
              setPlatformeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#1A1A2E] border border-white/10 rounded-lg px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white outline-none focus:border-violet-500/50"
          >
            <option value="">Filtrer par plateforme...</option>
            {plateformes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nom}
              </option>
            ))}
          </select>
          <select
            value={categorieFilter}
            onChange={(e) => {
              setCategorieFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#1A1A2E] border border-white/10 rounded-lg px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white outline-none focus:border-violet-500/50"
          >
            <option value="">Filtrer par catégorie...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-[#1A1A2E] rounded-xl border border-white/5 overflow-x-auto">
        {loadingJeux ? (
          <div className="p-4 sm:p-6 text-gray-500 text-sm">
            Chargement des jeux...
          </div>
        ) : error ? (
          <div className="p-4 sm:p-6 text-red-400 text-sm">{error}</div>
        ) : (
          <>
            <table className="w-full min-w-max">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-500 tracking-widest uppercase whitespace-nowrap">
                    IMAGE
                  </th>
                  <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-500 tracking-widest uppercase whitespace-nowrap">
                    TITRE
                  </th>
                  <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-500 tracking-widest uppercase whitespace-nowrap hidden md:table-cell">
                    PLATEFORMES
                  </th>
                  <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-500 tracking-widest uppercase whitespace-nowrap hidden lg:table-cell">
                    CATÉGORIES
                  </th>
                  <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-500 tracking-widest uppercase whitespace-nowrap">
                    NOTE
                  </th>
                  <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-500 tracking-widest uppercase whitespace-nowrap">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {jeux.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 sm:px-4 py-4 sm:py-6 text-center text-gray-500 text-xs sm:text-sm"
                    >
                      Aucun jeu trouvé
                    </td>
                  </tr>
                ) : (
                  jeux.map((jeu) => (
                    <tr
                      key={jeu.id}
                      className="border-b border-white/3 hover:bg-white/2 transition-colors"
                    >
                      <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                        <img
                          src={
                            jeu.image ||
                            "https://via.placeholder.com/120x80?text=No+Image"
                          }
                          alt={jeu.titre}
                          className="h-12 w-20 rounded-lg object-cover"
                        />
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white max-w-[220px] truncate overflow-hidden">
                        {jeu.titre}
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {jeu.plateformes?.map((p) => (
                            <span
                              key={p.id}
                              className="text-xs px-2 py-0.5 rounded bg-violet-500/15 text-violet-400 whitespace-nowrap"
                            >
                              {p.nom}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {jeu.categories?.map((c) => (
                            <span
                              key={c.id}
                              className="text-xs px-2 py-0.5 rounded bg-pink-500/15 text-pink-400 whitespace-nowrap"
                            >
                              {c.nom}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-yellow-400 whitespace-nowrap shrink-0">
                        <i className="bi bi-star-fill"></i> {jeu.note_moyenne}
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                        <div className="flex gap-1 sm:gap-2">
                          <button
                            onClick={() => openEdit(jeu)}
                            className="text-xs px-2 sm:px-3 py-1.5 rounded-lg bg-violet-500/15 text-violet-400 hover:bg-violet-500/25 cursor-pointer transition-colors min-h-8 flex items-center justify-center"
                            title="Modifier"
                          >
                            <i className="bi bi-pencil"></i>
                            <span className="hidden sm:inline ml-1">
                              Modifier
                            </span>
                          </button>
                          <button
                            onClick={() => handleDelete(jeu.id)}
                            className="text-xs px-2 sm:px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 cursor-pointer transition-colors min-h-8 flex items-center justify-center"
                            title="Supprimer"
                          >
                            <i className="bi bi-trash"></i>
                            <span className="hidden sm:inline ml-1">
                              Supprimer
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {lastPage > 1 && (
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-gray-400">
                  Affichage {displayedStart} - {displayedEnd} sur{" "}
                  {totalJeuxNumber} jeux
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage(Math.max(currentPageNumber - 1, 1))
                    }
                    disabled={currentPageNumber === 1}
                    className="px-3 py-2 rounded-lg text-xs font-semibold text-white bg-white/5 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 transition-all"
                  >
                    Précédent
                  </button>
                  {getPaginationItems().map((page) =>
                    typeof page === "string" ? (
                      <span
                        key={page}
                        className="px-3 py-2 rounded-lg text-xs font-semibold text-gray-400 bg-transparent select-none"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                          page === currentPageNumber
                            ? "bg-violet-500 text-white"
                            : "bg-white/5 text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage(Math.min(currentPageNumber + 1, lastPage))
                    }
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

      {modal && (
        <Modal
          title={modal === "add" ? "Ajouter un jeu" : "Modifier le jeu"}
          onClose={() => setModal(null)}
        >
          <div className="flex flex-col gap-4">
            <InputField
              label="Titre"
              value={form.titre}
              onChange={handle("titre")}
              placeholder="Ex: Elden Ring"
            />
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 uppercase tracking-widest">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={handle("description")}
                placeholder="Description du jeu..."
                rows={3}
                className="bg-[#0F0F1A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/50 resize-none"
              />
            </div>
            <InputField
              label="Image (URL)"
              value={form.image}
              onChange={handle("image")}
              placeholder="https://..."
            />
            <InputField
              label="Date de sortie"
              type="date"
              value={form.date_sortie}
              onChange={handle("date_sortie")}
            />

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 uppercase tracking-widest">
                Développeur
              </label>
              <select
                value={form.developpeur_id}
                onChange={handle("developpeur_id")}
                className="bg-[#0F0F1A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/50"
              >
                <option value="">Sélectionner un développeur</option>
                {developpeurs.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400 uppercase tracking-widest">
                Plateformes
              </label>
              <div className="flex flex-wrap gap-2">
                {plateformes.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => toggleArray("plateformes", p.id)}
                    type="button"
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                      form.plateformes.includes(p.id)
                        ? "bg-violet-500/20 border-violet-500 text-violet-300"
                        : "bg-white/5 border-white/10 text-gray-400"
                    }`}
                  >
                    {p.nom}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400 uppercase tracking-widest">
                Catégories
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => toggleArray("categories", c.id)}
                    type="button"
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                      form.categories.includes(c.id)
                        ? "bg-pink-500/20 border-pink-500 text-pink-300"
                        : "bg-white/5 border-white/10 text-gray-400"
                    }`}
                  >
                    {c.nom}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSubmit}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-pink-500 hover:opacity-90"
              >
                Enregistrer
              </button>
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white bg-white/5 hover:bg-white/10"
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
