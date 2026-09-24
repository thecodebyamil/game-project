"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  Gamepad2,
  ShoppingCart,
  Check,
  Sparkles,
} from "lucide-react";

// Oyunlar və Paketlər
const TOPUP_OPTIONS = [
  {
    id: 1,
    game: "PUBG Mobile",
    currencyName: "UC",
    img: "/Pubg.webp",
    inputPlaceholder: "Oyunçu ID daxil edin (Məs: 5123456789)",
    amounts: [
      { id: "p1", uc: "60 UC", price: 1.8 },
      { id: "p2", uc: "325 UC", price: 8.5 },
      { id: "p3", uc: "660 UC", price: 16.5, popular: true },
      { id: "p4", uc: "1800 UC", price: 42.0 },
      { id: "p5", uc: "3850 UC", price: 85.0 },
    ],
  },
  {
    id: 2,
    game: "Free Fire",
    currencyName: "Diamonds",
    img: "/Fire.webp",
    inputPlaceholder: "Player ID daxil edin (Məs: 84920194)",
    amounts: [
      { id: "f1", uc: "100 Diamonds", price: 2.1 },
      { id: "f2", uc: "310 Diamonds", price: 6.2 },
      { id: "f3", uc: "520 Diamonds", price: 10.4, popular: true },
      { id: "f4", uc: "1060 Diamonds", price: 20.5 },
    ],
  },
  {
    id: 3,
    game: "Mobile Legends",
    currencyName: "Diamonds",
    img: "/Valorant.webp",
    inputPlaceholder: "User ID və Server ID (Məs: 123456 (2001))",
    amounts: [
      { id: "m1", uc: "86 Diamonds", price: 2.9 },
      { id: "m2", uc: "257 Diamonds", price: 8.2, popular: true },
      { id: "m3", uc: "706 Diamonds", price: 22.0 },
    ],
  },
  {
    id: 4,
    game: "Brawl Stars",
    currencyName: "Gems",
    img: "/BrawlStars.webp",
    inputPlaceholder: "Supercell ID və ya Tag (# ilə)",
    amounts: [
      { id: "b1", uc: "30 Gems", price: 3.5 },
      { id: "b2", uc: "80 Gems", price: 8.9, popular: true },
      { id: "b3", uc: "170 Gems", price: 17.5 },
    ],
  },
];

const formatPrice = (val) => `${Number(val).toFixed(2)} AZN`;

export default function TopUpPage() {
  const { addToCart } = useCart();
  const [selectedGame, setSelectedGame] = useState(TOPUP_OPTIONS[0]);
  const [selectedAmount, setSelectedAmount] = useState(
    TOPUP_OPTIONS[0].amounts || TOPUP_OPTIONS[0].amounts[0],
  );
  const [playerId, setPlayerId] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    setSelectedAmount(game.amounts[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAmount || !playerId.trim()) return;

    // Səbətə atmaq
    addToCart({
      id: `${selectedGame.id}-${selectedAmount.id}-${Date.now()}`,
      title: `${selectedGame.game} - ${selectedAmount.uc} (ID: ${playerId})`,
      category: "Balans Yükləmə",
      price: selectedAmount.price,
      image: selectedGame.img,
    });

    setSuccessMsg(
      `${selectedGame.game} üçün ${selectedAmount.uc} sifarişiniz səbətə əlavə edildi!`,
    );
    setIsSuccess(true);
    setPlayerId("");

    setTimeout(() => setIsSuccess(false), 4000);
  };

  return (
    <main className="bg-[#090d16] min-h-screen text-slate-100 pb-24 selection:bg-red-500 selection:text-white">
      {/* 1. Üst Banner */}
      <section className="relative py-20 md:py-28 bg-slate-900/40 border-b border-slate-800/80 text-center overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 text-xs font-bold tracking-wider text-red-400 uppercase bg-red-950/40 border border-red-800/40 rounded-full">
            <Zap size={14} className="text-amber-400" />
            <span>ANINDA AVTOMATİK YÜKLƏMƏ</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tight leading-none">
            SÜRƏTLİ{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500">
              BALANS
            </span>
          </h1>

          <p className="text-slate-400 mt-4 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Oyunu və paketi seçin, oyunçu ID-nizi daxil edin və saniyələr içində
            hesabınızı artırın.
          </p>
        </div>
      </section>

      {/* 2. Əsas 3 Mərhələli Bölmə */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 1. Addım: Oyun Seçimi (4 sütun) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-black flex items-center justify-center">
              1
            </span>
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-white">
              Oyunu Seçin
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {TOPUP_OPTIONS.map((game) => {
              const isSelected = selectedGame.id === game.id;
              return (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => handleGameSelect(game)}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center text-center gap-3 cursor-pointer group shadow-sm ${
                    isSelected
                      ? "border-red-500 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                      : "border-slate-800 bg-slate-900/80 hover:border-slate-700"
                  }`}
                >
                  <div className="relative w-14 h-14 bg-slate-950 rounded-2xl overflow-hidden shrink-0 border border-slate-800">
                    <Image
                      src={game.img}
                      alt={game.game}
                      fill
                      sizes="56px"
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span
                    className={`text-xs font-bold leading-tight ${isSelected ? "text-red-400" : "text-slate-300"}`}
                  >
                    {game.game}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Addım: Paket Seçimi (4 sütun) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-black flex items-center justify-center">
              2
            </span>
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-white">
              Paketi Seçin
            </h2>
          </div>

          <div className="space-y-2.5">
            {selectedGame.amounts.map((item) => {
              const isSelected = selectedAmount?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedAmount(item)}
                  className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? "border-red-500 bg-red-600/15 shadow-md shadow-red-600/20"
                      : "border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? "border-red-500 bg-red-500" : "border-slate-700"}`}
                    >
                      {isSelected && (
                        <Check
                          size={10}
                          className="text-white"
                          strokeWidth={3}
                        />
                      )}
                    </div>
                    <span className="font-bold text-sm text-white">
                      {item.uc}
                    </span>
                    {item.popular && (
                      <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                        Populyar
                      </span>
                    )}
                  </div>

                  <span className="text-base font-black text-white">
                    {formatPrice(item.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Addım: Məlumat və Sifariş (4 sütun) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-black flex items-center justify-center">
              3
            </span>
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-white">
              Təsdiq və Yükləmə
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-slate-900/90 p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-5 shadow-2xl relative"
          >
            {isSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div>
              <label className="text-[11px] text-slate-400 uppercase font-black tracking-wider mb-2 block">
                Oyunçu ID Nömrəsi:
              </label>
              <input
                type="text"
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                placeholder={selectedGame.inputPlaceholder}
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
              />
              <p className="text-[10px] text-slate-500 mt-1.5">
                * ID profilinizin içindəki unikal rəqəmli koddur.
              </p>
            </div>

            {/* Sifariş İcmalı */}
            <div className="border-t border-slate-800 pt-4 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Seçilən oyun:</span>
                <span className="font-bold text-white">
                  {selectedGame.game}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Yüklənəcək məbləğ:</span>
                <span className="font-bold text-emerald-400">
                  {selectedAmount ? selectedAmount.uc : "---"}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-slate-800/80">
                <span className="text-xs uppercase font-black text-red-400">
                  Yekun Qiymət:
                </span>
                <span className="text-2xl font-black text-white">
                  {selectedAmount
                    ? formatPrice(selectedAmount.price)
                    : "0.00 AZN"}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedAmount || !playerId.trim()}
              className={`w-full py-4 rounded-xl font-black uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 ${
                selectedAmount && playerId.trim()
                  ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-600/30 cursor-pointer active:scale-95"
                  : "bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed"
              }`}
            >
              <ShoppingCart size={16} />
              <span>Səbətə Əlavə Et</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
