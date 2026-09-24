"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import {
  ShoppingCart,
  Check,
  ShieldCheck,
  Zap,
  Star,
  CreditCard,
  Sparkles,
  Layers,
} from "lucide-react";

// Hədiyyə Kartları Məlumatı
const CARDS_DATA = [
  {
    id: 301,
    title: "Steam 10 USD",
    platform: "Steam",
    price: 18.0,
    value: "10$",
    color: "from-slate-800 via-slate-900 to-black",
    accent: "text-blue-400",
    image: "/Steam.webp",
  },
  {
    id: 302,
    title: "Steam 20 USD",
    platform: "Steam",
    price: 35.5,
    value: "20$",
    color: "from-blue-900 via-indigo-950 to-slate-950",
    accent: "text-blue-300",
    image: "/Steam.webp",
  },
  {
    id: 303,
    title: "Steam 50 USD",
    platform: "Steam",
    price: 88.0,
    value: "50$",
    color: "from-red-950 via-slate-900 to-black",
    accent: "text-red-400",
    image: "/Steam.webp",
  },
  {
    id: 304,
    title: "Steam 100 USD",
    platform: "Steam",
    price: 175.0,
    value: "100$",
    color: "from-purple-950 via-slate-900 to-black",
    accent: "text-purple-400",
    image: "/Steam.webp",
  },
];

const PLATFORMS = ["Hamısı", "Steam", "PlayStation", "Xbox", "Razer Gold"];

const formatPrice = (val) => `${Number(val).toFixed(2)} AZN`;

export default function GameCardsPage() {
  const { addToCart, cartItems = [] } = useCart();
  const [selectedPlatform, setSelectedPlatform] = useState("Hamısı");
  const [justAddedId, setJustAddedId] = useState(null);

  const isInCart = (id) => cartItems.some((item) => item.id === id);

  const handleAddToCart = (card) => {
    addToCart({
      id: card.id,
      title: card.title,
      category: "Oyun Kartı",
      price: card.price,
      image: card.image,
    });

    setJustAddedId(card.id);
    setTimeout(() => setJustAddedId(null), 1500);
  };

  const filteredCards = CARDS_DATA.filter((card) =>
    selectedPlatform === "Hamısı" ? true : card.platform === selectedPlatform,
  );

  return (
    <main className="bg-[#090d16] min-h-screen text-slate-100 pb-24 selection:bg-red-500 selection:text-white">
      {/* 1. Üst Başlıq (Hero Banner) */}
      <section className="relative py-20 md:py-28 bg-slate-900/40 border-b border-slate-800/80 overflow-hidden text-center">
        {/* Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 text-xs font-bold tracking-wider text-red-400 uppercase bg-red-950/40 border border-red-800/40 rounded-full">
            <CreditCard size={14} className="text-red-500" />
            <span>RƏSMİ RƏQƏMSAL HƏDİYYƏ KARTLARI</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tight leading-none">
            RƏQƏMSAL{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500">
              KARTLAR
            </span>
          </h1>

          <p className="text-slate-400 mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Steam, PlayStation, Xbox və digər qlobal platformalarda hesabınızı
            anında artırmaq üçün rəsmi rəqəmsal kodlar.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-800 shadow-sm">
              <Zap size={14} className="text-amber-400" />
              <span>Anında Çatdırılma</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-800 shadow-sm">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>100% Rəsmi Zəmanət</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Platforma Filtrləri */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 justify-start sm:justify-center">
          {PLATFORMS.map((plat) => (
            <button
              key={plat}
              type="button"
              onClick={() => setSelectedPlatform(plat)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedPlatform === plat
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
            >
              {plat}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Kartlar Grid-i */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {filteredCards.map((card) => {
            const inCart = isInCart(card.id) || justAddedId === card.id;

            return (
              <article
                key={card.id}
                className="group bg-slate-900/80 border border-slate-800/90 rounded-3xl p-5 hover:border-red-500/40 transition-all duration-300 flex flex-col h-full shadow-xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                {/* Holoqrafik Kart Dizaynı */}
                <div
                  className={`h-48 rounded-2xl bg-gradient-to-br ${card.color} relative overflow-hidden p-5 flex flex-col justify-between border border-white/10 shadow-lg group-hover:scale-[1.02] transition-transform duration-300`}
                >
                  {/* Kartın Yuxarı Hissəsi */}
                  <div className="flex justify-between items-center z-10">
                    <span className="text-xs font-black tracking-widest text-white/50 uppercase">
                      {card.platform}
                    </span>
                    <Star className="text-amber-400/40 fill-amber-400/30 w-4 h-4" />
                  </div>

                  {/* Nominal Dəyəri */}
                  <div className="relative z-10">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-white/50">
                      Balans Kartı
                    </p>
                    <h3 className="text-4xl font-black italic text-white drop-shadow-md">
                      {card.value}
                    </h3>
                  </div>

                  {/* Parıltı və Çip effekti */}
                  <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
                  <div className="absolute top-1/2 -right-4 w-20 h-20 bg-red-500/10 rounded-full blur-lg pointer-events-none" />
                </div>

                {/* Məlumat və Qiymət */}
                <div className="pt-5 flex flex-col flex-1 justify-between gap-5">
                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-red-400 transition-colors truncate">
                      {card.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Avtomatik rəqəmsal aktivasiya
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-black block">
                        Qiymət
                      </span>
                      <span className="text-xl font-black text-white">
                        {formatPrice(card.price)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(card)}
                      className={`px-4 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm ${
                        inCart
                          ? "bg-emerald-600 text-white"
                          : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-600/25"
                      }`}
                    >
                      {inCart ? (
                        <>
                          <Check size={14} strokeWidth={2.5} />
                          <span>Səbətdədir</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={14} />
                          <span>Sifariş Et</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. Təlimat Bölməsi */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl shadow-xl">
          <h3 className="text-xl font-black uppercase italic mb-8 text-center text-white">
            Necə <span className="text-red-500">Aktiv Edilir?</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/60">
              <div className="text-red-500 font-black text-2xl mb-1.5">01</div>
              <h4 className="text-sm font-bold text-white mb-1">Kartı Seçin</h4>
              <p className="text-xs text-slate-400">
                Lazımi məbləği səbətə atıb ödənişi təsdiqləyin.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/60">
              <div className="text-red-500 font-black text-2xl mb-1.5">02</div>
              <h4 className="text-sm font-bold text-white mb-1">
                Kodu Əldə Edin
              </h4>
              <p className="text-xs text-slate-400">
                16 rəqəmli rəqəmsal kod dərhal kabinetinizə göndəriləcək.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/60">
              <div className="text-red-500 font-black text-2xl mb-1.5">03</div>
              <h4 className="text-sm font-bold text-white mb-1">
                Hesabı Doldurun
              </h4>
              <p className="text-xs text-slate-400">
                Platforma tətbiqində &quot;Kodu Aktiv Et&quot; bölməsinə daxil edin.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
