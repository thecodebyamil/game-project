"use client";

import React, { useState } from "react";
import {
  Wallet,
  PlusCircle,
  History,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  CreditCard,
  X,
  CheckCircle2,
  Sparkles,
  Filter,
} from "lucide-react";

const INITIAL_TRANSACTIONS = [
  {
    id: 1,
    title: "Valorant Points (Alış)",
    amount: -12.0,
    date: "04.09.2026",
    type: "purchase",
  },
  {
    id: 2,
    title: "Balans Artımı (MilliÖN)",
    amount: 50.0,
    date: "03.09.2026",
    type: "deposit",
  },
  {
    id: 3,
    title: "Steam Gift Card (Alış)",
    amount: -20.0,
    date: "01.09.2026",
    type: "purchase",
  },
  {
    id: 4,
    title: "PUBG Mobile UC (Alış)",
    amount: -5.5,
    date: "28.08.2026",
    type: "purchase",
  },
];

const PRESET_AMOUNTS = [10, 25, 50, 100];

export default function TopupPage() {
  const [balance, setBalance] = useState(150.5);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [filterType, setFilterType] = useState("all"); // 'all', 'deposit', 'purchase'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [successMsg, setSuccessMsg] = useState("");

  // Balans Artırma Əməliyyatı
  const handleDeposit = (e) => {
    e.preventDefault();
    const val = parseFloat(depositAmount);
    if (!val || val <= 0) return;

    const newBalance = balance + val;
    setBalance(newBalance);

    const newTx = {
      id: Date.now(),
      title: `Balans Artımı (${paymentMethod === "card" ? "Bank Kartı" : "Terminal"})`,
      amount: val,
      date: "İndicə",
      type: "deposit",
    };

    setTransactions([newTx, ...transactions]);
    setSuccessMsg(`${val.toFixed(2)} AZN balansınıza uğurla əlavə olundu!`);
    setDepositAmount("");

    setTimeout(() => {
      setSuccessMsg("");
      setIsModalOpen(false);
    }, 1500);
  };

  // Əməliyyatların süzülməsi
  const filteredTx = transactions.filter((tx) => {
    if (filterType === "all") return true;
    return tx.type === filterType;
  });

  return (
    <main className="bg-[#090d16] min-h-screen text-slate-100 pb-24 selection:bg-red-500 selection:text-white">
      {/* 1. Üst Başlıq */}
      <section className="relative py-20 md:py-28 bg-slate-900/40 border-b border-slate-800/80 overflow-hidden text-center">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 text-xs font-bold tracking-wider text-red-400 uppercase bg-red-950/40 border border-red-800/40 rounded-full">
            <Wallet size={14} className="text-red-500" />
            <span>ŞƏXSİ MALİYYƏ VƏ HESABLAŞMA</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tight leading-none">
            MƏNİM{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500">
              CÜZDANIM
            </span>
          </h1>

          <p className="text-slate-400 mt-4 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Balansınızı anında artırın, əməliyyat tarixçənizi izləyin və 1
            kliklə sifarişlərinizi tamamlayın.
          </p>
        </div>
      </section>

      {/* 2. Cüzdan və Əməliyyatlar Bölməsi */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sol: VIP Rəqəmsal Kart və Artır Düyməsi (5 sütun) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Lüks Qeyminq Kartı */}
            <div className="bg-gradient-to-br from-red-900 via-rose-950 to-slate-950 p-7 rounded-3xl border border-red-500/30 shadow-[0_15px_35px_rgba(225,29,72,0.25)] relative overflow-hidden flex flex-col justify-between h-56 group">
              {/* Kart Başlığı */}
              <div className="flex justify-between items-start z-10">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-300">
                    GameX Store Card
                  </span>
                  <p className="text-xs text-white/60 font-mono mt-0.5">
                    VIP CLIENT
                  </p>
                </div>
                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                  <Wallet className="text-white w-5 h-5" />
                </div>
              </div>

              {/* Balans Məlumatı */}
              <div className="relative z-10 my-auto">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-200">
                  Cari Balansınız
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-0.5">
                  {balance.toFixed(2)}{" "}
                  <span className="text-lg font-bold text-red-400">AZN</span>
                </h2>
              </div>

              {/* Kartın Aşağı Hissəsi */}
              <div className="flex justify-between items-end z-10 pt-2 border-t border-white/10">
                <span className="text-xs font-mono text-white/50 tracking-widest">
                  •••• 8829
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <ShieldCheck size={14} /> AKTİV
                </span>
              </div>

              {/* Ambient Glow */}
              <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-red-600/30 rounded-full blur-2xl pointer-events-none" />
            </div>

            {/* Balansı Artır Düyməsi */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black uppercase tracking-wider py-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-red-600/30 active:scale-95 text-xs sm:text-sm cursor-pointer"
            >
              <PlusCircle size={18} />
              <span>Balansı Artır</span>
            </button>
          </div>

          {/* Sağ: Əməliyyat Tarixçəsi (7 sütun) */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/80 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
              {/* Başlıq və Filter Tabları */}
              <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <History className="text-red-500 w-5 h-5" />
                  <h3 className="font-bold text-sm uppercase tracking-wider text-white">
                    Son Əməliyyatlar
                  </h3>
                </div>

                {/* Filtrlər */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setFilterType("all")}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                      filterType === "all"
                        ? "bg-red-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Hamısı
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType("deposit")}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                      filterType === "deposit"
                        ? "bg-emerald-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Mədaxil
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType("purchase")}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                      filterType === "purchase"
                        ? "bg-rose-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Alışlar
                  </button>
                </div>
              </div>

              {/* Əməliyyatlar Siyahısı */}
              <div className="divide-y divide-slate-800/80">
                {filteredTx.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-sm">
                    Heç bir əməliyyat tapılmadı.
                  </div>
                ) : (
                  filteredTx.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-5 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className={`p-3 rounded-xl shrink-0 ${
                            tx.amount > 0
                              ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                              : "bg-red-500/10 text-red-500 ring-1 ring-red-500/20"
                          }`}
                        >
                          {tx.amount > 0 ? (
                            <ArrowDownLeft size={18} />
                          ) : (
                            <ArrowUpRight size={18} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white text-sm truncate">
                            {tx.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {tx.date}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`font-black text-sm sm:text-base tracking-tight shrink-0 ${
                          tx.amount > 0 ? "text-emerald-400" : "text-white"
                        }`}
                      >
                        {tx.amount > 0
                          ? `+${tx.amount.toFixed(2)}`
                          : tx.amount.toFixed(2)}{" "}
                        <span className="text-xs text-slate-400 font-bold">
                          AZN
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Balans Artırma Modalı (Popup) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-slate-900 w-full max-w-md rounded-3xl border border-slate-800 p-6 sm:p-8 relative shadow-2xl">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800/60 p-2 rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            <h2 className="text-2xl font-black italic uppercase mb-1 text-white">
              Balansı <span className="text-red-500">Artır</span>
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Məbləği seçin və ya istədiyiniz miqdarı daxil edin.
            </p>

            {successMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleDeposit} className="space-y-5">
              {/* Hazır Məbləğ Düymələri */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Sürətli Seçim:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt.toString())}
                      className={`py-2.5 rounded-xl text-xs font-black border transition-all ${
                        depositAmount === amt.toString()
                          ? "bg-red-600 border-red-500 text-white shadow-md shadow-red-600/30"
                          : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      +{amt} AZN
                    </button>
                  ))}
                </div>
              </div>

              {/* Əllə Məbləğ Yazmaq */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Daxil Ediləcək Məbləğ (AZN):
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Məs: 20.00"
                  required
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3.5 text-base font-bold text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              {/* Ödəniş Metodu */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Ödəniş Üsulu:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === "card"
                        ? "bg-red-600/10 border-red-500 text-red-400"
                        : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    <CreditCard size={16} />
                    <span>Bank Kartı</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("terminal")}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === "terminal"
                        ? "bg-red-600/10 border-red-500 text-red-400"
                        : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    <Wallet size={16} />
                    <span>MilliÖN / eManat</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black uppercase tracking-wider py-4 rounded-xl transition-all shadow-lg shadow-red-600/30 active:scale-95 text-xs sm:text-sm cursor-pointer"
              >
                Ödənişi Təsdiq Et
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
