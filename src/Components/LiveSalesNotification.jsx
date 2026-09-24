"use client";

import React, { useState, useEffect } from 'react';

const RECENT_SALES = [
  { name: "Fərid K.", city: "Bakı", item: "GTA V: Premium Edition", price: "19.99 ₼", time: "2 dəqiqə əvvəl" },
  { name: "Elvin M.", city: "Sumqayıt", item: "Valorant Radiant Hesabı", price: "95.00 ₼", time: "5 dəqiqə əvvəl" },
  { name: "Rəşad S.", city: "Gəncə", item: "CS2 Prime Status + Bıçaq", price: "69.00 ₼", time: "8 dəqiqə əvvəl" },
  { name: "Nurlan T.", city: "Bakı", item: "EA SPORTS FC 25", price: "58.00 ₼", time: "12 dəqiqə əvvəl" },
  { name: "Murad Ə.", city: "Xırdalan", item: "PUBG Mobile Buz Diyarı", price: "139.00 ₼", time: "15 dəqiqə əvvəl" },
];

export default function LiveSalesNotification() {
  const [currentSale, setCurrentSale] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setCurrentSale(RECENT_SALES[index % RECENT_SALES.length]);
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      index++;
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  if (!currentSale || !isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 animate-slide-up transition-all hidden sm:block">
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#0e1424]/95 border border-indigo-500/30 backdrop-blur-xl shadow-2xl text-xs max-w-sm">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-white flex-shrink-0 text-base shadow-md">
          ⚡
        </div>
        <div className="space-y-0.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-white truncate">{currentSale.name} ({currentSale.city})</span>
            <span className="text-[10px] text-slate-500">{currentSale.time}</span>
          </div>
          <p className="text-[11px] text-slate-300 truncate">
            Alış etdi: <strong className="text-indigo-300">{currentSale.item}</strong>
          </p>
          <span className="text-emerald-400 font-extrabold text-[11px]">{currentSale.price}</span>
        </div>
      </div>
    </div>
  );
}
