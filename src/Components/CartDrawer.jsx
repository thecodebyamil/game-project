"use client";

import React from 'react';
import { useStore } from '../context/StoreContext';
import { CloseIcon, TrashIcon, CartIcon } from './Icons';

export default function CartDrawer() {
  const {
    cart,
    removeFromCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutModalOpen,
    setCheckoutInitialItem
  } = useStore();

  if (!isCartOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCheckoutInitialItem(null); // Full cart checkout
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#0d1222] border-l border-white/10 h-full p-6 flex flex-col justify-between shadow-2xl">
        
        {/* HEADER */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛒</span>
              <div>
                <h3 className="font-extrabold text-lg text-white">Səbətiniz</h3>
                <span className="text-xs text-slate-400">{cart.length} məhsul seçilib</span>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* ITEM LIST */}
          <div className="mt-4 space-y-3 overflow-y-auto max-h-[62vh] pr-1">
            {cart.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <div className="text-5xl">🛍️</div>
                <p className="font-bold text-base text-slate-300">Səbətiniz hazırda boşdur</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Oyun və ya hesab kataloqundan bəyəndiyiniz məhsulu səbətə əlavə edin.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 flex items-center justify-between gap-3 group hover:border-indigo-500/40 transition-all"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {item.image && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                      />
                    )}
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {item.type}
                        </span>
                        <span className="text-[10px] text-slate-400">{item.platform}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-black text-emerald-400 text-sm">{Number(item.price).toFixed(2)} ₼</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Sil"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* BOTTOM TOTAL & CHECKOUT */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-sm font-semibold">Cəmi Məbləğ:</span>
              <span className="font-black text-2xl text-emerald-400">{totalAmount.toFixed(2)} ₼</span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:opacity-95 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-500/25 transition-all cursor-pointer active:scale-95"
            >
              Sifarişi Rəsmiləşdir (Ödəniş) ⚡
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span className="flex items-center gap-1">🔒 100% Zəmanətli</span>
              <button
                onClick={clearCart}
                className="text-slate-500 hover:text-rose-400 transition-colors underline cursor-pointer"
              >
                Səbəti təmizlə
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
