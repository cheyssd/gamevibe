import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import api from "../../services/api";

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#1A1A2E] rounded-xl border border-violet-500/20 w-full max-w-md">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5 sticky top-0 bg-[#1A1A2E] z-10">
          <h2 className="font-bold text-white text-sm sm:text-base" style={{ fontFamily: "'Orbitron', sans-serif" }}>{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-lg cursor-pointer min-h-9 min-w-9 flex items-center justify-center" aria-label="Fermer"><i className="bi bi-x-lg" aria-hidden="true"></i></button>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

const PAGE_SIZE = 10;

export default function AdminDeveloppeurs() {
  const [developpeurs, setDeveloppeurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [nom, setNom] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => { fetchDeveloppeurs(currentPage); }, [currentPage]);

  const fetchDeveloppeurs = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/developpeurs", { params: { page, per_page: PAGE_SIZE } });
      const data = res.data.data ?? [];
      const meta = res.data.meta ?? {};
      setDeveloppeurs(data);
      setTotal(Number(meta.total ?? data.length) || data.length);
      setTotalPages(Number(meta.derniere_page ?? meta.last_page ?? 1) || 1);
      setCurrentPage(Number(meta.page_actuelle ?? meta.current_page ?? page) || page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => { setNom(""); setEditId(null); setError(""); setModal("add"); };
  const openEdit = (d) => { setNom(d.nom); setEditId(d.id); setError(""); setModal("edit"); };

  const handleSubmit = async () => {
    if (!nom.trim()) { setError("Le nom est obligatoire."); return; }
    try {
      if (modal === "add") await api.post("/developpeurs", { nom });
      else await api.put(`/developpeurs/${editId}`, { nom });
      setModal(null);
      fetchDeveloppeurs(currentPage);
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce développeur ?")) return;
    try {
      await api.delete(`/developpeurs/${id}`);
      if (developpeurs.length === 1 && currentPage > 1) setCurrentPage((p) => Math.max(p - 1, 1));
      else fetchDeveloppeurs(currentPage);
    } catch (err) { console.error(err); }
  };

  const displayedStart = total > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const displayedEnd = Math.min(currentPage * PAGE_SIZE, total);

  const getPaginationItems = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    if (currentPage > 3) pages.push("left-ellipsis");
    for (let p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) pages.push(p);
    if (currentPage < totalPages - 2) pages.push("right-ellipsis");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>Gestion des développeurs</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Ajouter, modifier ou supprimer des développeurs</p>
        </div>
        <button onClick={openAdd} className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-pink-500 hover:opacity-90 cursor-pointer flex items-center gap-2 min-h-10 whitespace-nowrap" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          <i className="bi bi-plus-lg"></i>
          <span className="hidden sm:inline">Ajouter un développeur</span>
          <span className="sm:hidden">Développeur</span>
        </button>
      </div>

      <div className="bg-[#1A1A2E] rounded-xl border border-white/5 overflow-x-auto">
        {loading ? (
          <div className="p-6 text-gray-500 text-sm">Chargement...</div>
        ) : (
          <>
            <table className="w-full min-w-max">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-4 py-3 text-xs text-gray-500 tracking-widest uppercase">NOM</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 tracking-widest uppercase">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {developpeurs.length === 0 ? (
                  <tr><td colSpan={2} className="px-4 py-6 text-center text-gray-500 text-sm">Aucun développeur trouvé</td></tr>
                ) : (
                  developpeurs.map((d) => (
                    <tr key={d.id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-white">
                        <span className="px-3 py-1 rounded-lg bg-yellow-500/15 text-yellow-400">{d.nom}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(d)} className="text-xs px-2 sm:px-3 py-1.5 rounded-lg bg-violet-500/15 text-violet-400 hover:bg-violet-500/25 cursor-pointer transition-colors min-h-8 flex items-center gap-1" aria-label="Modifier le développeur">
                            <i className="bi bi-pencil" aria-hidden="true"></i><span className="hidden sm:inline">Modifier</span>
                          </button>
                          <button onClick={() => handleDelete(d.id)} className="text-xs px-2 sm:px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 cursor-pointer transition-colors min-h-8 flex items-center gap-1" aria-label="Supprimer le développeur">
                            <i className="bi bi-trash" aria-hidden="true"></i><span className="hidden sm:inline">Supprimer</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="mt-4 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-gray-400">Affichage {displayedStart} - {displayedEnd} sur {total} développeurs</div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <button onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} disabled={currentPage === 1} className="px-3 py-2 rounded-lg text-xs font-semibold text-white bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed">Précédent</button>
                  {getPaginationItems().map((page) => typeof page === "string" ? (
                    <span key={page} className="px-3 py-2 text-xs text-gray-400">…</span>
                  ) : (
                    <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${page === currentPage ? "bg-violet-500 text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"}`}>{page}</button>
                  ))}
                  <button onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-2 rounded-lg text-xs font-semibold text-white bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed">Suivant</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {modal && (
        <Modal title={modal === "add" ? "Ajouter un développeur" : "Modifier le développeur"} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 uppercase tracking-widest">Nom</label>
              <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex: FromSoftware" className="bg-[#0F0F1A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/50" />
            </div>
            <div className="flex gap-3 mt-2">
              <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-pink-500 hover:opacity-90 cursor-pointer" style={{ fontFamily: "'Orbitron', sans-serif" }}>{modal === "add" ? "Ajouter" : "Modifier"}</button>
              <button onClick={() => setModal(null)} className="px-4 py-2.5 rounded-lg text-sm font-bold text-gray-400 border border-white/10 hover:bg-white/5 cursor-pointer">Annuler</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}