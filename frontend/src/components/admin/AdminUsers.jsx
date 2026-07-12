import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import api from "../../services/api";

const PAGE_SIZE = 10;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => { fetchUsers(currentPage); }, [currentPage]);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/users", { params: { page, per_page: PAGE_SIZE } });
      const data = res.data.data ?? [];
      const meta = res.data.meta ?? {};
      setUsers(data);
      setTotal(Number(meta.total ?? data.length) || data.length);
      setTotalPages(Number(meta.derniere_page ?? meta.last_page ?? 1) || 1);
      setCurrentPage(Number(meta.page_actuelle ?? meta.current_page ?? page) || page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDesactiver = async (id) => {
    if (!confirm("Désactiver ce compte ?")) return;
    try {
      await api.delete(`/users/${id}`);
      if (users.length === 1 && currentPage > 1) setCurrentPage((p) => Math.max(p - 1, 1));
      else fetchUsers(currentPage);
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
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-black text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>Gestion des utilisateurs</h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">Voir et gérer les comptes utilisateurs</p>
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
                  <th className="text-left px-4 py-3 text-xs text-gray-500 tracking-widest uppercase hidden md:table-cell">EMAIL</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 tracking-widest uppercase">RÔLE</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 tracking-widest uppercase hidden md:table-cell">INSCRIT LE</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 tracking-widest uppercase">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-500 text-sm">Aucun utilisateur trouvé</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            {u.nom?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-semibold text-white whitespace-nowrap">{u.nom}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400 hidden md:table-cell whitespace-nowrap">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-lg font-semibold whitespace-nowrap ${u.role === "admin" ? "bg-pink-500/15 text-pink-400" : "bg-violet-500/15 text-violet-400"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400 hidden md:table-cell whitespace-nowrap">{u.cree_le}</td>
                      <td className="px-4 py-3">
                        {u.role !== "admin" && (
                          <button onClick={() => handleDesactiver(u.id)} className="text-xs px-2 sm:px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 cursor-pointer transition-colors min-h-8 flex items-center gap-1" aria-label="Désactiver l'utilisateur">
                            <i className="bi bi-person-x" aria-hidden="true"></i><span className="hidden sm:inline">Désactiver</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="mt-4 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-gray-400">Affichage {displayedStart} - {displayedEnd} sur {total} utilisateurs</div>
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
    </div>
  );
}