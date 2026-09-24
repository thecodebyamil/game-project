"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '../../context/StoreContext';
import {
  UserIcon,
  CartIcon,
  CrownIcon,
  WalletIcon,
  EditIcon,
  TrashIcon,
  CopyIcon,
  CheckIcon,
  CloseIcon,
  ShieldCheckIcon,
  SettingsIcon
} from '@/Components/Icons';

export default function ProfilePage() {
  const {
    user,
    orders,
    accounts,
    deleteAccount,
    updateProfile,
    setIsTopUpModalOpen,
    setIsSellModalOpen,
    setIsAuthModalOpen,
    setAuthModalTab,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'accounts' | 'settings'
  const [copiedKey, setCopiedKey] = useState(null);

  // Edit Profile form state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      const t = setTimeout(() => {
        setNameInput(user.name || user.fullName || '');
        setEmailInput(user.email || '');
      }, 0);
      return () => clearTimeout(t);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black text-white">Giriş Tələb Olunur</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Şəxsi kabinetinizə, balansınıza, sifariş açarlarınıza və satışda olan hesablarınıza baxmaq üçün zəhmət olmasa daxil olun.
        </p>
        <button
          onClick={() => {
            setAuthModalTab('login');
            setIsAuthModalOpen(true);
          }}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-xl shadow-indigo-500/25 transition-all cursor-pointer"
        >
          Daxil Ol ⚡
        </button>
      </div>
    );
  }

  // Filter accounts created by the logged in user
  const userAccounts = accounts.filter(acc => {
    return acc.createdBy === user.email || acc.createdBy === user.name || (user.role === 'admin' && acc.isUserCreated);
  });

  const handleCopy = (keyText, id) => {
    navigator.clipboard.writeText(keyText);
    setCopiedKey(id);
    showToast("Açar kopyalandı!", "info");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDeleteUserAccount = async (id, title) => {
    if (!confirm(`"${title}" elanını silmək istədiyinizdən əminsiniz?`)) return;
    await deleteAccount(id);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim()) {
      showToast("Ad və e-poçt mütləqdir!", "error");
      return;
    }

    setIsUpdating(true);
    const res = await updateProfile({
      name: nameInput.trim(),
      email: emailInput.trim(),
      password: passwordInput ? passwordInput.trim() : undefined
    });

    if (res.success) {
      setPasswordInput('');
      setIsEditProfileOpen(false);
    }
    setIsUpdating(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Profile banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-indigo-500/30">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{user.name}</h1>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                user.role === 'admin'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              }`}>
                {user.role === 'admin' ? '🛡️ Administrator' : '🎮 Oyunçu'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">{user.email}</p>

            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold transition-colors cursor-pointer pt-1"
            >
              <EditIcon className="w-3.5 h-3.5" />
              <span>Adı və E-poçtu Düzəlt</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-white/10 flex items-center gap-3">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Cari Balans:</span>
              <span className="text-2xl font-black text-emerald-400">{Number(user.balance || 0).toFixed(2)} ₼</span>
            </div>
            <button
              onClick={() => setIsTopUpModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md shadow-emerald-500/20 transition-colors"
            >
              + Balansı Artır
            </button>
          </div>

          {user.role === 'admin' && (
            <Link
              href="/admin"
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold text-xs shadow-lg shadow-rose-500/25 flex items-center gap-1.5 transition-transform"
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Admin Panel</span>
            </Link>
          )}
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="max-w-md w-full bg-[#0d1222] border border-indigo-500/40 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsEditProfileOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <CloseIcon className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">Profil Tənzimləmələri</span>
              <h3 className="text-xl font-black text-white">Məlumatların Düzəldilməsi</h3>
              <p className="text-xs text-slate-400">
                Adınızı, e-poçtunuzu və şifrənizi buradan yeniləyə bilərsiniz.
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Adınız və Soyadınız</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">E-poçt Ünvanınız</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Yeni Şifrə (Dəyişmək istəmirsinizsə boş buraxın)</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Ləğv Et
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 text-white font-bold text-xs cursor-pointer disabled:opacity-50 shadow-md shadow-indigo-500/25"
                >
                  {isUpdating ? "Yenilənir..." : "Yadda Saxla 💾"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'orders' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <CartIcon className="w-4 h-4" />
          <span>Sifarişlərim ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('accounts')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'accounts' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <CrownIcon className="w-4 h-4" />
          <span>Satışa Qoyduğum Hesablar ({userAccounts.length})</span>
        </button>
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center text-slate-400 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-slate-500">
                <CartIcon className="w-6 h-6" />
              </div>
              <p className="font-bold text-white text-sm">Hələ heç bir sifarişiniz yoxdur</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Kataloqdan oyun və ya hesab alaraq lisenziya açarlarını və giriş məlumatlarını burada dərhal əldə edə bilərsiniz.
              </p>
              <Link
                href="/"
                className="inline-block px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Oyun Kataloquna Get
              </Link>
            </div>
          ) : (
            orders.map(o => (
              <div key={o.id} className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs pb-3 border-b border-white/5 gap-2">
                  <div>
                    <span className="font-bold text-white font-mono">Sifariş #{o.id}</span>
                    <span className="text-slate-500 ml-3">
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString('az-AZ') : 'Bu gün'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">Ödəniş: <strong className="text-white">{o.paymentMethod}</strong></span>
                    <span className="text-emerald-400 font-black text-sm">{Number(o.totalAmount).toFixed(2)} ₼</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {o.items?.map((it, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5 text-xs space-y-2">
                      <div className="flex justify-between items-center font-bold text-white">
                        <span className="text-sm">{it.title}</span>
                        <span className="text-emerald-400 font-black">{Number(it.price).toFixed(2)} ₼</span>
                      </div>

                      {it.deliveredKey && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1">
                          <span className="text-[11px] text-slate-400 font-semibold">Rəqəmsal Açar (CD Key):</span>
                          <code className="flex-1 px-3 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-mono text-xs select-all">
                            {it.deliveredKey}
                          </code>
                          <button
                            onClick={() => handleCopy(it.deliveredKey, `${o.id}-${idx}`)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <CopyIcon className="w-3.5 h-3.5" />
                            <span>{copiedKey === `${o.id}-${idx}` ? "Kopyalandı!" : "Kopyala"}</span>
                          </button>
                        </div>
                      )}

                      {it.deliveredAccount && (
                        <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20 text-slate-200 text-xs space-y-1">
                          <span className="text-amber-400 font-bold block text-[11px]">Hesab Giriş Məlumatları:</span>
                          <div className="flex flex-wrap gap-4 font-mono text-xs">
                            <div>Login: <strong className="text-white">{it.deliveredAccount.username}</strong></div>
                            <div>Şifrə: <strong className="text-emerald-400">{it.deliveredAccount.password}</strong></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* USER LISTED ACCOUNTS TAB (WITH DELETE OPTION) */}
      {activeTab === 'accounts' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-white font-bold text-base">Satışa Qoyduğunuz Hesablar</h3>
              <p className="text-xs text-slate-400">İstədiyiniz vaxt yeni hesab yerləşdirə və ya mövcud elanınızı silə bilərsiniz.</p>
            </div>
            <button
              onClick={() => setIsSellModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-slate-950 font-black text-xs cursor-pointer shadow-lg shadow-amber-500/20 transition-all"
            >
              + Yeni Hesab Sat
            </button>
          </div>

          {userAccounts.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center text-slate-400 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-slate-500">
                <CrownIcon className="w-6 h-6" />
              </div>
              <p className="font-bold text-white text-sm">Satışda aktiv elanınız yoxdur</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Valorant, CS2, GTA V və digər oyun hesablarınızı dərhal platformada satışa qoya bilərsiniz.
              </p>
              <button
                onClick={() => setIsSellModalOpen(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs rounded-xl cursor-pointer mt-2"
              >
                İndi Hesabını Satışa Qoy
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userAccounts.map(acc => (
                <div key={acc.id} className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3 flex flex-col justify-between hover:border-amber-500/30 transition-all">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-indigo-400 uppercase px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30">
                        {acc.game}
                      </span>
                      <span className="text-emerald-400 text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        {acc.status || "Aktiv"}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-sm line-clamp-2">{acc.title}</h4>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Rütbə / Level:</span>
                        <span className="font-semibold text-white">{acc.rank}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Region:</span>
                        <span className="text-slate-200">{acc.region}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-amber-400 font-black text-xl">{acc.price} ₼</span>
                    
                    {/* DELETE BUTTON FOR USER */}
                    <button
                      onClick={() => handleDeleteUserAccount(acc.id, acc.title)}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                      title="Elanı Sil"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                      <span>Elanı Sil</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
