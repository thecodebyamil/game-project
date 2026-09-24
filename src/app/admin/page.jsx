"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '../../context/StoreContext';
import {
  GamepadIcon,
  CrownIcon,
  CartIcon,
  UserIcon,
  SettingsIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
  CheckIcon,
  CloseIcon,
  ShieldCheckIcon,
  FlameIcon,
  WalletIcon,
  RefreshIcon
} from '@/Components/Icons';

export default function AdminPage() {
  const {
    user,
    login,
    updateProfile,
    updateUserAsAdmin,
    games,
    accounts,
    refreshGames,
    refreshAccounts,
    deleteAccount,
    showToast
  } = useStore();

  const [stats, setStats] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'games' | 'accounts' | 'orders' | 'users' | 'settings'

  // Admin Self-Profile Form State (Fixes: "admin adın emailin düzəliş edə bilmir")
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isUpdatingAdmin, setIsUpdatingAdmin] = useState(false);

  // User Edit Modal State (Admin editing any user's name, email, role, balance)
  const [editingUser, setEditingUser] = useState(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserRole, setEditUserRole] = useState('user');
  const [editUserBalance, setEditUserBalance] = useState('');
  const [editUserPassword, setEditUserPassword] = useState('');
  const [isSavingUserEdit, setIsSavingUserEdit] = useState(false);

  // Add game form state
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);
  const [gameTitle, setGameTitle] = useState('');
  const [gamePlatform, setGamePlatform] = useState('Steam');
  const [gameGenre, setGameGenre] = useState('Açıq Dünya / Fəaliyyət');
  const [gamePrice, setGamePrice] = useState('');
  const [gameOldPrice, setGameOldPrice] = useState('');
  const [gameImage, setGameImage] = useState('');
  const [gameTag, setGameTag] = useState('Populyar');

  // Add account form state
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [accGame, setAccGame] = useState('Valorant');
  const [accTitle, setAccTitle] = useState('');
  const [accRank, setAccRank] = useState('');
  const [accRegion, setAccRegion] = useState('EU (Türkiyə/Avropa)');
  const [accPrice, setAccPrice] = useState('');
  const [accUsername, setAccUsername] = useState('');
  const [accPassword, setAccPassword] = useState('');

  // Synchronize admin form fields when user loads
  useEffect(() => {
    if (user) {
      const t = setTimeout(() => {
        setAdminName(user.name || user.fullName || '');
        setAdminEmail(user.email || '');
      }, 0);
      return () => clearTimeout(t);
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      const [statsRes, ordersRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/orders'),
        fetch('/api/admin/users')
      ]);

      const statsData = await statsRes.json();
      if (statsData.success) setStats(statsData.stats);

      const ordersData = await ordersRes.json();
      if (ordersData.success) setAllOrders(ordersData.orders);

      const usersData = await usersRes.json();
      if (usersData.success) setAllUsers(usersData.users);
    } catch (err) {
      console.error("Admin data fetch error:", err);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      const t = setTimeout(() => {
        fetchAdminData();
      }, 0);
      return () => clearTimeout(t);
    }
  }, [user]);

  // Admin updating their own profile
  const handleAdminProfileUpdate = async (e) => {
    e.preventDefault();
    if (!adminName.trim() || !adminEmail.trim()) {
      showToast("Ad və e-poçt boş ola bilməz!", "error");
      return;
    }

    setIsUpdatingAdmin(true);
    const res = await updateProfile({
      name: adminName.trim(),
      email: adminEmail.trim(),
      password: adminPassword ? adminPassword.trim() : undefined
    });

    if (res.success) {
      setAdminPassword('');
      fetchAdminData();
    }
    setIsUpdatingAdmin(false);
  };

  // Open User Edit Modal
  const handleOpenUserEdit = (u) => {
    setEditingUser(u);
    setEditUserName(u.name || '');
    setEditUserEmail(u.email || '');
    setEditUserRole(u.role || 'user');
    setEditUserBalance(String(u.balance || 0));
    setEditUserPassword('');
  };

  // Save User Edit
  const handleSaveUserEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!editUserName.trim() || !editUserEmail.trim()) {
      showToast("Ad və e-poçt mütləqdir!", "error");
      return;
    }

    setIsSavingUserEdit(true);
    const payload = {
      name: editUserName.trim(),
      email: editUserEmail.trim(),
      role: editUserRole,
      balance: Number(editUserBalance) || 0
    };
    if (editUserPassword.trim()) {
      payload.password = editUserPassword.trim();
    }

    const res = await updateUserAsAdmin(editingUser.id, payload);
    if (res.success) {
      setEditingUser(null);
      fetchAdminData();
    }
    setIsSavingUserEdit(false);
  };

  // Delete user
  const handleDeleteUser = async (id, role) => {
    if (role === 'admin') {
      const adminCount = allUsers.filter(u => u.role === 'admin').length;
      if (adminCount <= 1) {
        showToast("Sonuncu admin hesabı silinə bilməz!", "error");
        return;
      }
    }

    if (!confirm("Bu istifadəçini silmək istədiyinizdən əminsiniz?")) return;

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast("İstifadəçi silindi", "info");
        fetchAdminData();
      } else {
        showToast(data.error || "Xəta baş verdi", "error");
      }
    } catch (e) {
      showToast("Server xətası", "error");
    }
  };

  const handleDeleteGame = async (id) => {
    if (!confirm("Bu oyunu silmək istəyirsiniz?")) return;
    try {
      const res = await fetch(`/api/games?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast("Oyun silindi", "info");
        refreshGames();
        fetchAdminData();
      }
    } catch (e) {
      showToast("Xəta baş verdi", "error");
    }
  };

  const handleCreateGame = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: gameTitle,
          platform: gamePlatform,
          genre: gameGenre,
          price: Number(gamePrice),
          oldPrice: Number(gameOldPrice) || Number(gamePrice) * 1.3,
          image: gameImage || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
          tag: gameTag || "Populyar",
          instantDelivery: true
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast("Oyun uğurla əlavə edildi!", "success");
        setIsAddGameOpen(false);
        setGameTitle('');
        setGamePrice('');
        setGameOldPrice('');
        setGameImage('');
        refreshGames();
        fetchAdminData();
      }
    } catch (e) {
      showToast("Xəta baş verdi", "error");
    }
  };

  const handleDeleteAccountAction = async (id) => {
    if (!confirm("Bu hesabı silmək istəyirsiniz?")) return;
    await deleteAccount(id);
    refreshAccounts();
    fetchAdminData();
  };

  const handleAccountStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch('/api/accounts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Status: \"${newStatus}\" olaraq dəyişdirildi`, "success");
        refreshAccounts();
      }
    } catch (e) {
      showToast("Xəta baş verdi", "error");
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: accGame,
          title: accTitle,
          rank: accRank || "Qeyd olunmayıb",
          region: accRegion,
          price: Number(accPrice),
          createdBy: user?.email || "admin@nexus.az",
          isUserCreated: false,
          credentials: {
            username: accUsername || "nexus_official",
            password: accPassword || "nexus_pass_2026",
            mailAccess: "Rəsmi Nexus zəmanəti"
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast("Hesab uğurla əlavə edildi!", "success");
        setIsAddAccountOpen(false);
        setAccTitle('');
        setAccPrice('');
        setAccRank('');
        refreshAccounts();
        fetchAdminData();
      }
    } catch (e) {
      showToast("Xəta baş verdi", "error");
    }
  };

  // If not admin, show login prompt with 1-click admin login
  if (user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <ShieldCheckIcon className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black text-white">Admin Girişi Tələb Olunur</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Bu bölmə yalnız sistem administratorları üçün nəzərdə tutulub. Zəhmət olmasa admin hesabınızla daxil olun.
        </p>

        <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-3">
          <p className="text-xs text-slate-300 font-semibold">Tez Giriş Üçün:</p>
          <button
            onClick={() => login('admin@nexus.az', 'admin123')}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold text-xs shadow-lg shadow-rose-500/25 transition-all cursor-pointer"
          >
            ⚡ 1-Kliklə Admin Kimi Daxil Ol (admin@nexus.az)
          </button>
        </div>

        <Link href="/" className="text-xs text-slate-500 hover:text-white transition-colors block">
          ← Ana Səhifəyə Qayıt
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'İcmal', icon: <FlameIcon className="w-4 h-4" /> },
    { id: 'games', label: 'Oyunlar', icon: <GamepadIcon className="w-4 h-4" /> },
    { id: 'accounts', label: 'Hesablar', icon: <CrownIcon className="w-4 h-4" /> },
    { id: 'orders', label: 'Sifarişlər', icon: <CartIcon className="w-4 h-4" /> },
    { id: 'users', label: 'İstifadəçilər', icon: <UserIcon className="w-4 h-4" /> },
    { id: 'settings', label: 'Admin Profili', icon: <SettingsIcon className="w-4 h-4" /> }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* HEADER BANNER */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-rose-500/30 bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold">
            <ShieldCheckIcon className="w-3.5 h-3.5" />
            <span>NEXUS GAME İdarəetmə Mərkəzi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Admin İdarəetmə Paneli</h1>
          <p className="text-xs text-slate-400">
            Platforma məhsullarını, istifadəçi hesablarını, sifarişləri və admin profilini buradan idarə edin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshIcon className="w-3.5 h-3.5" />
            <span>Yenilə</span>
          </button>
          <div className="bg-slate-950/80 px-4 py-2 rounded-2xl border border-white/10 text-right">
            <span className="text-[10px] text-slate-400 block font-semibold">Giriş edib:</span>
            <span className="text-xs font-black text-rose-300">{user.name}</span>
            <span className="text-[10px] text-slate-500 block truncate max-w-[150px]">{user.email}</span>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2 bg-gradient-to-br from-slate-900 to-indigo-950/30">
              <span className="text-xs text-slate-400 block font-semibold">Ümumi Gəlir (AZN)</span>
              <h3 className="text-3xl font-black text-emerald-400">
                {stats ? Number(stats.totalRevenue).toFixed(2) : '0.00'} ₼
              </h3>
              <span className="text-[11px] text-slate-500">Tamamlanmış sifarişlərdən</span>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2 bg-gradient-to-br from-slate-900 to-purple-950/30">
              <span className="text-xs text-slate-400 block font-semibold">Cəmi Sifarişlər</span>
              <h3 className="text-3xl font-black text-indigo-300">
                {stats ? stats.totalOrders : allOrders.length}
              </h3>
              <span className="text-[11px] text-slate-500">Rəqəmsal açar və hesablar</span>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2 bg-gradient-to-br from-slate-900 to-amber-950/30">
              <span className="text-xs text-slate-400 block font-semibold">Aktiv Hesab Vitrini</span>
              <h3 className="text-3xl font-black text-amber-400">
                {stats ? stats.totalAccounts : accounts.length}
              </h3>
              <span className="text-[11px] text-slate-500">Satışdakı hesablar</span>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2 bg-gradient-to-br from-slate-900 to-rose-950/30">
              <span className="text-xs text-slate-400 block font-semibold">Qeydiyyatlı İstifadəçilər</span>
              <h3 className="text-3xl font-black text-rose-300">
                {stats ? stats.totalUsers : allUsers.length}
              </h3>
              <span className="text-[11px] text-slate-500">Aktiv müştərilər və adminlər</span>
            </div>
          </div>

          {/* Quick links to edit profile or add games */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel rounded-2xl p-5 border border-rose-500/20 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <SettingsIcon className="w-5 h-5" />
                <h4>Admin Profilini Redaktə Et</h4>
              </div>
              <p className="text-xs text-slate-400">
                Admin adınızı ({user.name}) və rəsmi e-poçtunuzu ({user.email}) birbaşa dəyişdirin.
              </p>
              <button
                onClick={() => setActiveTab('settings')}
                className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold transition-all cursor-pointer"
              >
                Profil Tənzimləmələrinə Get →
              </button>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-indigo-500/20 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <GamepadIcon className="w-5 h-5" />
                <h4>Yeni Oyun Əlavə Et</h4>
              </div>
              <p className="text-xs text-slate-400">
                Mağaza kataloquna yeni Steam, Epic Games və ya konsol oyunu yerləşdirin.
              </p>
              <button
                onClick={() => { setActiveTab('games'); setIsAddGameOpen(true); }}
                className="px-4 py-2 rounded-xl bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-xs font-bold transition-all cursor-pointer"
              >
                + Yeni Oyun Yarat →
              </button>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-amber-500/20 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <CrownIcon className="w-5 h-5" />
                <h4>Hesabları Yoxla & İdarə Et</h4>
              </div>
              <p className="text-xs text-slate-400">
                İstifadəçilərin satışa çıxardığı hesabları təsdiqləyin və ya silin.
              </p>
              <button
                onClick={() => setActiveTab('accounts')}
                className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-all cursor-pointer"
              >
                Hesablar Siyahısına Get →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. GAMES TAB */}
      {activeTab === 'games' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white text-base">Oyunlar Kataloqu ({games.length})</h3>
              <p className="text-xs text-slate-400">Mağazada satışda olan rəqəmsal oyun açarları</p>
            </div>
            <button
              onClick={() => setIsAddGameOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Yeni Oyun Əlavə Et</span>
            </button>
          </div>

          {/* Add Game Modal */}
          {isAddGameOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="max-w-md w-full bg-[#0d121f] border border-indigo-500/40 rounded-3xl p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setIsAddGameOpen(false)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-white"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
                <h4 className="text-xl font-black text-white">Yeni Oyun Əlavə Et</h4>
                <form onSubmit={handleCreateGame} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Oyun Adı</label>
                    <input
                      type="text"
                      required
                      placeholder="Məs: Cyberpunk 2077: Phantom Liberty"
                      value={gameTitle}
                      onChange={(e) => setGameTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-semibold">Platforma</label>
                      <select
                        value={gamePlatform}
                        onChange={(e) => setGamePlatform(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                      >
                        <option value="Steam">Steam</option>
                        <option value="Epic Games">Epic Games</option>
                        <option value="EA Sports">EA Sports</option>
                        <option value="Microsoft">Microsoft</option>
                        <option value="Rockstar">Rockstar</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-semibold">Qiymət (AZN)</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        placeholder="Məs: 29.99"
                        value={gamePrice}
                        onChange={(e) => setGamePrice(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-semibold">Köhnə Qiymət (AZN)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Məs: 49.99"
                        value={gameOldPrice}
                        onChange={(e) => setGameOldPrice(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-semibold">Etiket (Badge)</label>
                      <input
                        type="text"
                        placeholder="Məs: Populyar / Yeni"
                        value={gameTag}
                        onChange={(e) => setGameTag(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Janr</label>
                    <input
                      type="text"
                      placeholder="Məs: Fəaliyyət / RPG"
                      value={gameGenre}
                      onChange={(e) => setGameGenre(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Şəkil URL-i</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={gameImage}
                      onChange={(e) => setGameImage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all cursor-pointer mt-2"
                  >
                    Oyunu Vitrinə Əlavə Et
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="glass-panel rounded-2xl overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-white/10 text-slate-500 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Oyun</th>
                  <th className="py-3 px-4">Platforma</th>
                  <th className="py-3 px-4">Janr</th>
                  <th className="py-3 px-4">Qiymət</th>
                  <th className="py-3 px-4 text-right">Əməliyyat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {games.map((g) => (
                  <tr key={g.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={g.image} alt={g.title} className="w-10 h-8 rounded object-cover" />
                      <span>{g.title}</span>
                    </td>
                    <td className="py-3 px-4">{g.platform}</td>
                    <td className="py-3 px-4 text-slate-400">{g.genre}</td>
                    <td className="py-3 px-4 font-bold text-emerald-400">{g.price} ₼</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteGame(g.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                      >
                        <TrashIcon className="w-3.5 h-3.5 inline mr-1" />
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. ACCOUNTS TAB */}
      {activeTab === 'accounts' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white text-base">Oyun Hesabları ({accounts.length})</h3>
              <p className="text-xs text-slate-400">Satışda olan bütün istifadəçi və rəsmi hesablar</p>
            </div>
            <button
              onClick={() => setIsAddAccountOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Yeni Hesab Əlavə Et</span>
            </button>
          </div>

          {/* Add Account Modal */}
          {isAddAccountOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="max-w-md w-full bg-[#0d121f] border border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setIsAddAccountOpen(false)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-white"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
                <h4 className="text-xl font-black text-white">Rəsmi Hesab Əlavə Et</h4>
                <form onSubmit={handleCreateAccount} className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-semibold">Oyun</label>
                      <select
                        value={accGame}
                        onChange={(e) => setAccGame(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                      >
                        <option value="Valorant">Valorant</option>
                        <option value="Counter-Strike 2">CS2</option>
                        <option value="Steam">Steam</option>
                        <option value="GTA V">GTA V</option>
                        <option value="Brawl Stars">Brawl Stars</option>
                        <option value="PUBG Mobile">PUBG Mobile</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-semibold">Qiymət (AZN)</label>
                      <input
                        type="number"
                        step="0.5"
                        required
                        placeholder="Məs: 75.00"
                        value={accPrice}
                        onChange={(e) => setAccPrice(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Başlıq</label>
                    <input
                      type="text"
                      required
                      placeholder="Məs: CS2 Prime + 1500 Saət + Bıçaq"
                      value={accTitle}
                      onChange={(e) => setAccTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-semibold">Rütbə / Rank</label>
                      <input
                        type="text"
                        placeholder="Məs: Global Elite"
                        value={accRank}
                        onChange={(e) => setAccRank(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-semibold">Region</label>
                      <input
                        type="text"
                        value={accRegion}
                        onChange={(e) => setAccRegion(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                      />
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                    <span className="text-[11px] font-bold text-amber-400 block">Gizli Giriş Məlumatları:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Login / Mail"
                        value={accUsername}
                        onChange={(e) => setAccUsername(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white text-[11px]"
                      />
                      <input
                        type="text"
                        placeholder="Şifrə"
                        value={accPassword}
                        onChange={(e) => setAccPassword(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white text-[11px]"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all cursor-pointer mt-2"
                  >
                    Hesabı Vitrinə Qoy
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="glass-panel rounded-2xl overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-white/10 text-slate-500 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Oyun</th>
                  <th className="py-3 px-4">Başlıq</th>
                  <th className="py-3 px-4">Rütbə</th>
                  <th className="py-3 px-4">Satıcı</th>
                  <th className="py-3 px-4">Qiymət</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Əməliyyat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-bold text-indigo-400">{acc.game}</td>
                    <td className="py-3 px-4 font-bold text-white max-w-[200px] truncate">{acc.title}</td>
                    <td className="py-3 px-4">{acc.rank}</td>
                    <td className="py-3 px-4 text-slate-400 text-[11px] truncate max-w-[120px]">{acc.createdBy}</td>
                    <td className="py-3 px-4 font-bold text-amber-400">{acc.price} ₼</td>
                    <td className="py-3 px-4">
                      <select
                        value={acc.status || "Aktiv"}
                        onChange={(e) => handleAccountStatusChange(acc.id, e.target.value)}
                        className="px-2 py-1 rounded bg-slate-900 border border-white/10 text-xs font-semibold text-emerald-400"
                      >
                        <option value="Aktiv">Aktiv</option>
                        <option value="Yoxlanılır">Yoxlanılır</option>
                        <option value="Satıldı">Satıldı</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteAccountAction(acc.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                        title="Hesabı Sil"
                      >
                        <TrashIcon className="w-3.5 h-3.5 inline mr-1" />
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="font-bold text-white text-base">Bütün Sifarişlər ({allOrders.length})</h3>
          <div className="glass-panel rounded-2xl overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-white/10 text-slate-500 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Sifariş #</th>
                  <th className="py-3 px-4">Tarix</th>
                  <th className="py-3 px-4">Müştəri</th>
                  <th className="py-3 px-4">Məhsullar</th>
                  <th className="py-3 px-4">Məbləğ</th>
                  <th className="py-3 px-4">Ödəniş</th>
                  <th className="py-3 px-4">Təhvil Verilmiş Açar / Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {allOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-400">#{ord.id}</td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('az-AZ') : 'Bu gün'}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      <div>{ord.customer?.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{ord.customer?.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      {ord.items?.map((it, idx) => (
                        <div key={idx} className="truncate max-w-[180px] font-semibold text-slate-200">
                          • {it.title}
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">{Number(ord.totalAmount).toFixed(2)} ₼</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-slate-300">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-indigo-300">
                      {ord.items?.map((it, idx) => (
                        <div key={idx} className="truncate max-w-[220px]">
                          {it.deliveredKey ? (
                            <span className="text-emerald-400">{it.deliveredKey}</span>
                          ) : it.deliveredAccount ? (
                            <span>{it.deliveredAccount.username} : {it.deliveredAccount.password}</span>
                          ) : 'Avtomatik təhvil'}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. USERS TAB & USER EDIT MODAL */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white text-base">Qeydiyyatlı İstifadəçilər ({allUsers.length})</h3>
              <p className="text-xs text-slate-400">İstifadəçilərin adını, e-poçtunu, rolunu və balansını buradan redaktə edin</p>
            </div>
          </div>

          <div className="glass-panel rounded-2xl overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-white/10 text-slate-500 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">İstifadəçi Adı</th>
                  <th className="py-3 px-4">E-poçt Ünvanı</th>
                  <th className="py-3 px-4">Rol</th>
                  <th className="py-3 px-4">Balans</th>
                  <th className="py-3 px-4">Qeydiyyat Tarixi</th>
                  <th className="py-3 px-4 text-right">Əməliyyatlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {allUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-black">
                        {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400 text-sm">{Number(u.balance || 0).toFixed(2)} ₼</td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('az-AZ') : '2026'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenUserEdit(u)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors font-semibold cursor-pointer"
                        title="Ad, E-poçt və Rolu Düzəlt"
                      >
                        <EditIcon className="w-3.5 h-3.5 inline mr-1" />
                        Redaktə Et
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id, u.role)}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                        title="İstifadəçini Sil"
                      >
                        <TrashIcon className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* EDIT USER MODAL */}
          {editingUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="max-w-md w-full bg-[#0d1222] border border-indigo-500/40 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl relative">
                <button
                  onClick={() => setEditingUser(null)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-white"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">İstifadəçi Redaktəsi</span>
                  <h4 className="text-xl font-black text-white">{editingUser.name} məlumatları</h4>
                </div>

                <form onSubmit={handleSaveUserEdit} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">İstifadəçi Adı (Name)</label>
                    <input
                      type="text"
                      required
                      value={editUserName}
                      onChange={(e) => setEditUserName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">E-poçt Ünvanı (Email)</label>
                    <input
                      type="email"
                      required
                      value={editUserEmail}
                      onChange={(e) => setEditUserEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-semibold">Rol</label>
                      <select
                        value={editUserRole}
                        onChange={(e) => setEditUserRole(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                      >
                        <option value="user">İstifadəçi (user)</option>
                        <option value="admin">Administrator (admin)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-semibold">Balans (AZN)</label>
                      <input
                        type="number"
                        step="0.5"
                        required
                        value={editUserBalance}
                        onChange={(e) => setEditUserBalance(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-emerald-400 font-bold text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Yeni Şifrə (Dəyişmək istəmirsinizsə boş buraxın)</label>
                    <input
                      type="password"
                      placeholder="Yeni şifrə..."
                      value={editUserPassword}
                      onChange={(e) => setEditUserPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                    />
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                    >
                      Ləğv Et
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingUserEdit}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 text-white font-bold text-xs cursor-pointer disabled:opacity-50"
                    >
                      {isSavingUserEdit ? "Yadda saxlanılır..." : "Yadda Saxla 💾"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. ADMIN PROFILE & SETTINGS TAB (DIRECT FIX FOR: "admin adın emailin düzəliş edə bilmir") */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-rose-500/30 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white">
                <SettingsIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Admin Profili və Tənzimləmələr</h3>
                <p className="text-xs text-slate-400">
                  Admin adınızı və e-poçt ünvanınızı buradan düzəliş edin və yadda saxlayın.
                </p>
              </div>
            </div>

            <form onSubmit={handleAdminProfileUpdate} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Admin Adı (Display Name)</label>
                <input
                  type="text"
                  required
                  placeholder="Məs: Admin Operator"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm font-semibold focus:outline-none focus:border-rose-500"
                />
                <span className="text-[10px] text-slate-500">Bu ad saytda və idarəetmə panelində görünəcək.</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Admin E-poçtu (Email Address)</label>
                <input
                  type="email"
                  required
                  placeholder="admin@nexus.az"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-rose-500"
                />
                <span className="text-[10px] text-slate-500">Admin panelinə giriş üçün istifadə olunan rəsmi e-poçt.</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Yeni Şifrə (Dəyişmək istəmirsinizsə boş saxlayın)</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Hesab ID:</span>
                  <span className="font-mono text-slate-300">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Səlahiyyət Statusu:</span>
                  <span className="text-rose-400 font-bold uppercase">{user.role}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cari Balans:</span>
                  <span className="text-emerald-400 font-bold">{Number(user.balance || 0).toFixed(2)} ₼</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdatingAdmin}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:opacity-95 text-white font-black text-sm shadow-xl shadow-rose-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isUpdatingAdmin ? "Yenilənir..." : "Admin Məlumatlarını Yadda Saxla ⚡"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
