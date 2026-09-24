"use client";

import React from 'react';
import { useStore } from '../context/StoreContext';
import { CloseIcon, CartIcon } from './Icons';

export default function TrailerModal() {
  const {
    isTrailerModalOpen,
    setIsTrailerModalOpen,
    selectedGameForTrailer,
    addToCart,
    openDirectCheckout
  } = useStore();

  if (!isTrailerModalOpen || !selectedGameForTrailer) return null;

  const game = selectedGameForTrailer;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="max-w-2xl w-full bg-[#0d1222] border border-indigo-500/30 rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col justify-between">
        
        <button
          onClick={() => setIsTrailerModalOpen(false)}
          className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md text-white p-2 rounded-full hover:bg-black transition-colors"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        {/* MEDIA BANNER / TRAILER SIMULATION */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-950 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1222] via-[#0d1222]/40 to-transparent"></div>
          
          {/* TRAILER BADGE */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div className="space-y-1">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-indigo-500 text-white shadow-md">
                {game.platform}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">{game.title}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 line-through block">{game.oldPrice} ₼</span>
              <span className="text-2xl font-black text-emerald-400">{game.price} ₼</span>
            </div>
          </div>
        </div>

        {/* DETAILS BODY */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
              Janr: <strong className="text-white">{game.genre}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-amber-300">
              ★ {game.rating} ({game.reviews} rəy)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
              ⚡ Ani Açarlar
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Oyun Haqqında</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {game.description || "Rəsmi lisenziyalı məhsul. Ödəniş tamamlandıqdan sonra aktivasiya açarı dərhal ekranda görünür və e-poçtunuza göndərilir."}
            </p>
          </div>

          {game.specs && (
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase">Sistem Tələbləri</h4>
              <p className="text-xs text-slate-300 font-mono">{game.specs}</p>
            </div>
          )}
        </div>

        {/* ACTIONS FOOTER */}
        <div className="p-6 pt-3 border-t border-white/10 flex items-center justify-between gap-3 bg-slate-950/50">
          <button
            onClick={() => {
              addToCart(game);
              setIsTrailerModalOpen(false);
            }}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <CartIcon className="w-4 h-4" /> Səbətə At
          </button>
          <button
            onClick={() => {
              setIsTrailerModalOpen(false);
              openDirectCheckout(game);
            }}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            Dərhal Almaq ({game.price} ₼) ⚡
          </button>
        </div>

      </div>
    </div>
  );
}
