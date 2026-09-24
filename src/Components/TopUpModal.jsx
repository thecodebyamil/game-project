"use client";

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CloseIcon, WalletIcon } from './Icons';

export default function TopUpModal() {
  const {
    user,
    isTopUpModalOpen,
    setIsTopUpModalOpen,
    topUpWallet
  } = useStore();

  const [amount, setAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('M10'); // 'M10' | 'BirBank' | 'Kart'
  const [isLoading, setIsLoading] = useState(false);

  if (!isTopUpModalOpen) return null;

  const currentAmount = customAmount ? Number(customAmount) : amount;

  const handleTopUp = async (e) => {
    e.preventDefault();
    if (!currentAmount || currentAmount <= 0) return;

    setIsLoading(true);
    await topUpWallet(currentAmount, paymentMethod);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="max-w-md w-full bg-[#0d1222] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        
        <button
          onClick={() => setIsTopUpModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-1">
            <WalletIcon className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-black text-white">Balansı Artır</h3>
          <p className="text-xs text-slate-400">
            Cari Balansınız: <strong className="text-emerald-400">{Number(user?.balance || 0).toFixed(2)} ₼</strong>
          </p>
        </div>

        {/* AMOUNT PRESETS */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">Məbləği seçin:</label>
          <div className="grid grid-cols-4 gap-2">
            {[10, 25, 50, 100].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => { setAmount(val); setCustomAmount(''); }}
                className={`py-2.5 rounded-xl border text-center font-black text-sm transition-all cursor-pointer ${
                  amount === val && !customAmount
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/30'
                    : 'bg-slate-900 border-white/10 text-white hover:border-emerald-500/40'
                }`}
              >
                {val} ₼
              </button>
            ))}
          </div>

          <div className="pt-2">
            <input
              type="number"
              placeholder="Və ya başqa məbləğ (₼)..."
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* PAYMENT METHODS */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">Ödəniş üsulu:</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'M10', name: 'm10', sub: 'Komissiyasız' },
              { id: 'BirBank', name: 'BirBank', sub: 'Kapital' },
              { id: 'Kart', name: 'Bank Kartı', sub: 'Visa/MC' }
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPaymentMethod(m.id)}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === m.id
                    ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold'
                    : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <span className="block text-xs font-bold">{m.name}</span>
                <span className="block text-[9px] text-slate-500">{m.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleTopUp}
          disabled={isLoading || currentAmount <= 0}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-black text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
        >
          {isLoading ? "Artırılır..." : `Balansa ${Number(currentAmount).toFixed(2)} ₼ Əlavə Et 💰`}
        </button>

      </div>
    </div>
  );
}
