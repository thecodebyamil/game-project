"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import {
  ShoppingCart,
  Check,
  Timer,
  TrendingDown,
  Flame,
  Sparkles,
  Zap,
} from "lucide-react";

// Endirim Məlumatları (Data)
const DEALS_DATA = [
  {
    id: 201,
    title: "Valorant 2850 VP",
    category: "Oyun Valyutası",
    originalPrice: 45.0,
    price: 35.0,
    discount: 22,
    image: "/Valorant.webp",
    timeLeft: "05:42:10",
  },
  {
    id: 202,
    title: "PUBG Mobile 660 UC",
    category: "Oyun Valyutası",
    originalPrice: 18.5,
    price: 14.9,
    discount: 19,
    image: "/Pubg.webp",
    timeLeft: "02:15:00",
  },
  {
    id: 203,
    title: "PlayStation Network 50$",
    category: "Hədiyyə Kartı",
    originalPrice: 95.0,
    price: 82.0,
    discount: 13,
    image: "/PSPlus.webp",
    timeLeft: "12:00:00",
  },
];

const formatPrice = (val) => `${Number(val).toFixed(2)} AZN`;

export default function DiscountsPage() {
  const { addToCart, cartItems = [] } = useCart();
  const [justAddedId, setJustAddedId] = useState(null);

  const isInCart = (id) => cartItems.some((item) => item.id === id);

  const handleAddToCart = (deal) => {
    // Səbətin gözlədiyi formata tam uyğun göndəririk
    addToCart({
      id: deal.id,
      title: deal.title,
      category: deal.category,
      price: deal.price,
      originalPrice: deal.originalPrice,
      image: deal.image,
    });

    setJustAddedId(deal.id);
    setTimeout(() => setJustAddedId(null), 1500);
  };

  return (
    <main className="bg-[#090d16] min-h-screen text-slate-100 pb-24 selection:bg-red-500 selection:text-white">
      {/* 1. Hero Banner */}
      <section className="relative py-20 md:py-28 bg-slate-900/40 border-b border-slate-800/80 overflow-hidden text-center">
        {/* Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/20 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-6 shadow-md shadow-red-600/30 animate-pulse">
            <Timer size={14} />
            <span>MƏHDUD ZAMANLI TƏKLİFLƏR</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tight leading-none">
            GÜNÜN{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500">
              ENDİRİMLƏRİ
            </span>
          </h1>

          <p className="text-slate-400 mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Ən populyar oyun kodları, UC və rəqəmsal hədiyyə kartları üçün
            xüsusi endirimli qiymətlər. Vaxt bitmədən sifariş edin!
          </p>
        </div>
      </section>

      {/* 2. Endirim Kartları Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DEALS_DATA.map((item) => {
            const inCart = isInCart(item.id) || justAddedId === item.id;
            const savings = (item.originalPrice - item.price).toFixed(2);

            return (
              <article
                key={item.id}
                className="bg-slate-900/80 border border-slate-800/80 rounded-3xl overflow-hidden group hover:border-red-500/50 transition-all duration-300 flex flex-col relative shadow-xl hover:shadow-[0_10px_30px_rgba(239,68,68,0.15)]"
              >
                {/* Endirim Faiz Etiketi */}
                <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1">
                  <Flame size={14} />
                  <span>-{item.discount}%</span>
                </div>

                {/* Şəkil və Taymer */}
                <div className="h-64 overflow-hidden relative bg-slate-950">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-108 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />

                  {/* Taymer Bölməsi */}
                  <div className="absolute bottom-3 left-4 right-4 bg-slate-950/80 backdrop-blur-md py-2 px-3.5 rounded-xl border border-white/10 flex items-center justify-between z-20">
                    <span className="text-[11px] font-bold text-red-400 uppercase flex items-center gap-1.5">
                      <Timer size={13} /> Qalan vaxt:
                    </span>
                    <span className="text-xs font-mono font-black text-white tracking-widest bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">
                      {item.timeLeft}
                    </span>
                  </div>
                </div>

                {/* Məhsul Məlumatları */}
                <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between gap-6">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                      {item.title}
                    </h3>

                    {/* Qənaət məlumatı */}
                    <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                      <TrendingDown size={14} />
                      <span>{savings} AZN Qənaət</span>
                    </div>
                  </div>

                  {/* Qiymət və Düymə */}
                  <div className="pt-4 border-t border-slate-800/80">
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        {formatPrice(item.price)}
                      </span>
                      <span className="text-xs text-slate-500 line-through font-bold">
                        {formatPrice(item.originalPrice)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className={`w-full py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md ${
                        inCart
                          ? "bg-emerald-600 text-white"
                          : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-600/30"
                      }`}
                    >
                      {inCart ? (
                        <>
                          <Check size={16} strokeWidth={2.5} />
                          <span>Səbətə Əlavə Edildi</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={16} />
                          <span>Səbətə At</span>
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
    </main>
  );
}
