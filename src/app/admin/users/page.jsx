"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  Search,
  ShieldCheck,
  ShieldOff,
  Ban,
  CheckCircle,
  Trash2,
  Pencil,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [editingBalanceId, setEditingBalanceId] = useState(null);
  const [balanceDraft, setBalanceDraft] = useState("");

  const loadUsers = () => {
    setLoading(true);
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setUsers(data.users);
      })
      .catch(() => setError("İstifadəçilər yüklənə bilmədi."))
      .finally(() => setLoading(false));
  };

  useEffect(loadUsers, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }, [users, search]);

  const patchUser = async (id, updates) => {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Əməliyyat uğursuz oldu.");
      setUsers((prev) => prev.map((u) => (u.id === id ? data.user : u)));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bu istifadəçini silmək istədiyinizə əminsiniz?")) return;
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Silinmə uğursuz oldu.");
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const startEditBalance = (u) => {
    setEditingBalanceId(u.id);
    setBalanceDraft(String(u.balance ?? 0));
  };

  const saveBalance = async (id) => {
    const value = Number(balanceDraft);
    if (Number.isNaN(value) || value < 0) {
      setError("Yanlış balans dəyəri.");
      return;
    }
    await patchUser(id, { balance: value });
    setEditingBalanceId(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-3xl font-black italic uppercase">
          İstifadəçilər
        </h2>
        <div className="relative w-full sm:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={16}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ad və ya e-poçt axtar..."
            className="w-full bg-[#1e293b] border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-red-500 text-white"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-400 rounded-xl px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 className="animate-spin" size={18} /> Yüklənir...
        </div>
      ) : (
        <div className="bg-[#1e293b] border border-gray-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-800">
                <th className="px-5 py-4">Ad</th>
                <th className="px-5 py-4">E-poçt</th>
                <th className="px-5 py-4">Rol</th>
                <th className="px-5 py-4">Balans</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Qeydiyyat</th>
                <th className="px-5 py-4 text-right">Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const isSelf = u.id === currentUser?.id;
                const isBusy = busyId === u.id;
                return (
                  <tr
                    key={u.id}
                    className="border-b border-gray-800/60 last:border-0 hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4 font-medium">
                      {u.fullName}
                      {isSelf && (
                        <span className="ml-2 text-[10px] text-gray-500 uppercase">
                          (siz)
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-400">{u.email}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                          u.role === "admin"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-gray-700/50 text-gray-300"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {editingBalanceId === u.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={balanceDraft}
                            onChange={(e) => setBalanceDraft(e.target.value)}
                            className="w-24 bg-[#0f172a] border border-gray-700 rounded-lg px-2 py-1 text-sm outline-none focus:border-red-500"
                          />
                          <button
                            onClick={() => saveBalance(u.id)}
                            className="text-green-400 text-xs font-bold"
                          >
                            Yadda saxla
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditBalance(u)}
                          className="flex items-center gap-1.5 text-gray-300 hover:text-white"
                        >
                          {(u.balance ?? 0).toFixed(2)} AZN
                          <Pencil size={13} className="text-gray-500" />
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {u.banned ? (
                        <span className="text-red-400 text-xs font-bold uppercase">
                          Bloklanıb
                        </span>
                      ) : (
                        <span className="text-green-400 text-xs font-bold uppercase">
                          Aktiv
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {new Date(u.createdAt).toLocaleDateString("az-AZ")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          disabled={isSelf || isBusy}
                          onClick={() =>
                            patchUser(u.id, {
                              role: u.role === "admin" ? "user" : "admin",
                            })
                          }
                          title={
                            u.role === "admin"
                              ? "Admin roluni çıxar"
                              : "Admin et"
                          }
                          className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          {u.role === "admin" ? (
                            <ShieldOff size={16} />
                          ) : (
                            <ShieldCheck size={16} />
                          )}
                        </button>
                        <button
                          disabled={isSelf || isBusy}
                          onClick={() =>
                            patchUser(u.id, { banned: !u.banned })
                          }
                          title={u.banned ? "Blokdan çıxar" : "Blokla"}
                          className="p-2 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          {u.banned ? (
                            <CheckCircle size={16} />
                          ) : (
                            <Ban size={16} />
                          )}
                        </button>
                        <button
                          disabled={isSelf || isBusy}
                          onClick={() => handleDelete(u.id)}
                          title="Sil"
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    Nəticə tapılmadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
