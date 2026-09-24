"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  Zap,
  Plus,
  Minus,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { cartItems = [], removeFromCart, updateQuantity } = useCart();

  // Ümumi qiymətin hesablanması
  const totalPrice = cartItems.reduce((acc, item) => {
    const priceValue =
      typeof item.price === "string"
        ? parseFloat(item.price.replace(/[^\d.-]/g, ""))
        : Number(item.price);
    return acc + (priceValue || 0) * (item.quantity || 1);
  }, 0);

  // Səbət boş olduqda
  if (cartItems.length === 0) {
    return (
      <div className="bg-[#090d16] min-h-[75vh] flex flex-col items-center justify-center text-white px-4">
        <div className="p-6 rounded-full bg-slate-900 border border-slate-800 mb-6 shadow-inner">
          <ShoppingBag size={48} className="text-slate-600" />
        </div>
        <h2 className="text-2xl font-black italic tracking-tight uppercase mb-2">
          Səbətiniz Boşdur
        </h2>
        <p className="text-slate-400 text-sm max-w-sm text-center mb-8">
          Hələ heç bir oyun və ya hesab əlavə etməmisiniz. Mağazaya keçid edərək
          ən son təkliflərə baxa bilərsiniz.
        </p>
        <Link
          href="/market"
          className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-8 py-3.5 font-bold rounded-xl transition-all uppercase tracking-wider text-xs shadow-lg shadow-red-600/30 active:scale-95"
        >
          Mağazaya Keçid Et
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-[#090d16] min-h-screen text-slate-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-red-500 selection:text-white">
      <div className="max-w-6xl mx-auto">
        {/* Başlıq */}
        <div className="flex items-center gap-3 mb-10 pb-4 border-b border-slate-800">
          <div className="w-1.5 h-8 bg-red-600 rounded-full" />
          <h1 className="text-3xl sm:text-4xl font-black italic tracking-tight uppercase">
            Səbətim
          </h1>
          <span className="text-slate-400 font-bold text-sm ml-2">
            ({cartItems.length} məhsul)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 1. Məhsullar Siyahısı */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => {
              const itemImage = item.image || item.img || "/EA.jpg";
              const unitPrice =
                typeof item.price === "string"
                  ? parseFloat(item.price.replace(/[^\d.-]/g, ""))
                  : Number(item.price) || 0;

              return (
                <motion.div
                  layout
                  key={item.id}
                  className="bg-slate-900/80 border border-slate-800/90 hover:border-red-500/30 flex items-center p-3.5 sm:p-5 gap-4 rounded-2xl shadow-md transition-all group"
                >
                  {/* Şəkil */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-slate-950 border border-slate-800 shrink-0 rounded-xl overflow-hidden">
                    <Image
                      src={itemImage}
                      alt={item.title || "Oyun şəkli"}
                      fill
                      sizes="(max-width: 768px) 64px, 80px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Başlıq və Təsvir */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                      {item.category || "Rəqəmsal Məhsul"}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white truncate group-hover:text-red-400 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold mt-1">
                      <Zap
                        size={12}
                        fill="currentColor"
                        className="animate-pulse"
                      />
                      <span>ANINDA ÇATDIRILMA</span>
                    </div>
                  </div>

                  {/* Say və İdarəetmə */}
                  <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                    {/* Say Artırma / Azaltma */}
                    <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden h-9">
                      <button
                        type="button"
                        onClick={() =>
                          item.quantity > 1 && updateQuantity?.(item.id, -1)
                        }
                        disabled={item.quantity <= 1}
                        className={`px-2.5 h-full flex items-center transition-colors ${
                          item.quantity > 1
                            ? "hover:bg-red-600/20 text-slate-300 hover:text-white"
                            : "text-slate-600 cursor-not-allowed"
                        }`}
                        aria-label="Sayı azalt"
                      >
                        <Minus size={13} />
                      </button>

                      <div className="w-8 flex items-center justify-center text-xs font-black text-white border-x border-slate-800">
                        {item.quantity || 1}
                      </div>

                      <button
                        type="button"
                        onClick={() => updateQuantity?.(item.id, 1)}
                        className="px-2.5 h-full hover:bg-red-600/20 text-slate-300 hover:text-white transition-colors flex items-center"
                        aria-label="Sayı artır"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Qiymət */}
                    <div className="text-right min-w-[75px] sm:min-w-[100px]">
                      <p className="text-base sm:text-xl font-black text-white tracking-tight">
                        {(unitPrice * (item.quantity || 1)).toFixed(2)}
                        <span className="text-xs text-red-500 font-bold ml-1">
                          AZN
                        </span>
                      </p>
                    </div>

                    {/* Silmə düyməsi */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-slate-500 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10"
                      aria-label="Məhsulu səbətdən sil"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* 2. Sifariş İcmalı (Sağ Tərəf) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-slate-900/90 border border-slate-800 p-6 sm:p-7 shadow-2xl rounded-3xl">
              <h2 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-6 pb-3 border-b border-slate-800">
                Sifariş İcmalı
              </h2>

              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-400">Ara cəm:</span>
                  <span className="text-white font-bold">
                    {totalPrice.toFixed(2)} AZN
                  </span>
                </div>

                <div className="flex justify-between font-medium">
                  <span className="text-slate-400">Komissiya və xidmət:</span>
                  <span className="text-emerald-400 font-bold uppercase text-xs">
                    PULSUZ
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="text-xs font-black text-red-500 uppercase tracking-wider">
                    YEKUN MƏBLƏĞ:
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {totalPrice.toFixed(2)}{" "}
                    <span className="text-sm font-bold text-red-500">AZN</span>
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white py-4 font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-600/30 text-center"
              >
                <span>Ödənişə Keçid Et</span>
                <ArrowRight size={16} />
              </Link>

              {/* Təhlükəsizlik və Ödəniş Sistemi İkonları */}
              <div className="mt-8 pt-6 border-t border-slate-800 text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>256-bit SSL Təhlükəsiz Ödəniş</span>
                </div>

                {/* Təmiz SVG Loqoları */}
                <div className="flex items-center justify-center gap-4 pt-1 opacity-70">
                  {/* Visa */}
                  <span className="text-xs font-black tracking-widest text-slate-300 border border-slate-700 px-2 py-1 rounded bg-slate-950">
                    VISA
                  </span>
                  {/* Mastercard */}
                  <span className="text-xs font-black tracking-widest text-slate-300 border border-slate-700 px-2 py-1 rounded bg-slate-950">
                    MASTERCARD
                  </span>
                  {/* Apple Pay / MilliÖn */}
                  <span className="text-xs font-black tracking-widest text-slate-300 border border-slate-700 px-2 py-1 rounded bg-slate-950">
                    MİLLİÖN / EMANAT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
