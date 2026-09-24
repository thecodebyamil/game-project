"use client";

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { UserIcon, CloseIcon, BoltIcon, CrownIcon, ShieldCheckIcon } from './Icons';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    login,
    register
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (authModalTab === 'login') {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMessage(res.error || "Giriş uğursuz oldu");
      }
    } else {
      const res = await register(name, email, password);
      if (!res.success) {
        setErrorMessage(res.error || "Qeydiyyat uğursuz oldu");
      }
    }
    setIsLoading(false);
  };

  const handleQuickDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@nexus.az');
      setPassword('admin123');
      login('admin@nexus.az', 'admin123');
    } else {
      setEmail('user@nexus.az');
      setPassword('user123');
      login('user@nexus.az', 'user123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="max-w-md w-full bg-[#0d1222] border border-indigo-500/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        <div className="space-y-1 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold mx-auto">
            <UserIcon className="w-3.5 h-3.5" />
            <span>NEXUS GAME Şəxsi Kabinet</span>
          </div>
          <h3 className="text-2xl font-black text-white">
            {authModalTab === 'login' ? 'Giriş Et' : 'Hesab Yarat'}
          </h3>
          <p className="text-xs text-slate-400">
            {authModalTab === 'login'
              ? 'Balansınıza, sifariş açarlarınıza və hesablarınıza baxın'
              : 'Qeydiyyatdan keçin və dərhal 50 ₼ bonus balans əldə edin!'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => { setAuthModalTab('login'); setErrorMessage(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              authModalTab === 'login'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Daxil Ol
          </button>
          <button
            type="button"
            onClick={() => { setAuthModalTab('register'); setErrorMessage(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              authModalTab === 'register'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Qeydiyyat (+50 ₼)
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authModalTab === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Ad və Soyad</label>
              <input
                type="text"
                required
                placeholder="Məs: Amil Məmmədli"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">E-poçt ünvanı</label>
            <input
              type="email"
              required
              placeholder="adiniz@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Şifrə</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Gözləyin...' : (authModalTab === 'login' ? 'Daxil Ol ⚡' : 'Qeydiyyatdan Keç (+50 ₼ Bonus)')}
          </button>
        </form>

        {/* Quick 1-click test accounts */}
        <div className="pt-3 border-t border-white/5 space-y-2">
          <p className="text-[11px] text-center text-slate-400 font-semibold">
            Tez Test Girişi (1 Kliklə):
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all text-center cursor-pointer"
            >
              👑 Admin Girişi
              <span className="block text-[9px] text-slate-400 font-normal font-mono">admin@nexus.az</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('user')}
              className="py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all text-center cursor-pointer"
            >
              🎮 İstifadəçi (150 ₼)
              <span className="block text-[9px] text-slate-400 font-normal font-mono">user@nexus.az</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
