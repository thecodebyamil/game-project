"use client";

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CloseIcon, CheckIcon, CopyIcon, ShieldCheckIcon, WalletIcon } from './Icons';

export default function CheckoutModal() {
  const {
    user,
    cart,
    clearCart,
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    checkoutInitialItem,
    createOrder,
    showToast,
    setIsTopUpModalOpen
  } = useStore();

  const [paymentMethod, setPaymentMethod] = useState('M10');
  const [userName, setUserName] = useState(user?.name || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [contact, setContact] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [copiedKey, setCopiedKey] = useState(false);

  if (!isCheckoutModalOpen) return null;

  const itemsToBuy = checkoutInitialItem ? [checkoutInitialItem] : cart;
  const totalAmount = itemsToBuy.reduce((sum, i) => sum + Number(i.price), 0);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!userEmail) {
      showToast("E-poçt ünvanınızı qeyd edin!", "error");
      return;
    }

    if (paymentMethod === 'Balans' && (!user || Number(user.balance || 0) < totalAmount)) {
      showToast("Balansınızda kifayət qədər vəsait yoxdur!", "error");
      return;
    }

    setIsLoading(true);

    const payload = {
      userId: user?.id || null,
      userName: userName || user?.name || "Müştəri",
      userEmail: userEmail || user?.email || "musteri@nexus.az",
      contact: contact || "",
      items: itemsToBuy,
      paymentMethod
    };

    const res = await createOrder(payload);
    setIsLoading(false);

    if (res.success) {
      setCompletedOrder(res.order);
      if (!checkoutInitialItem) {
        clearCart();
      }
      showToast("Təbriklər! Sifarişiniz tamamlandı.", "success");
    } else {
      showToast(res.error || "Ödəniş xətası baş verdi", "error");
    }
  };

  const handleCopyKey = (keyText) => {
    navigator.clipboard.writeText(keyText);
    setCopiedKey(true);
    showToast("Açar kopyalandı!", "info");
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleClose = () => {
    setIsCheckoutModalOpen(false);
    setCompletedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="max-w-lg w-full bg-[#0d1222] border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        {completedOrder ? (
          <div className="space-y-5 text-center py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckIcon className="w-8 h-8 stroke-[3]" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase text-emerald-400">Sifariş Uğurla Tamamlandı!</span>
              <h3 className="text-xl font-black text-white font-mono">Sifariş #{completedOrder.id}</h3>
              <p className="text-xs text-slate-400">
                Rəqəmsal açarınız hazırdır və profilinizdə saxlanıldı:
              </p>
            </div>

            <div className="space-y-3 text-left">
              {completedOrder.items.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{item.title}</span>
                    <span className="font-bold text-emerald-400">{Number(item.price).toFixed(2)} ₼</span>
                  </div>

                  {item.deliveredKey && (
                    <div className="space-y-1">
                      <span className="text-slate-400 text-[11px]">Lisenziya Açarı:</span>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 font-mono font-bold text-xs select-all">
                          {item.deliveredKey}
                        </code>
                        <button
                          onClick={() => handleCopyKey(item.deliveredKey)}
                          className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1"
                        >
                          <CopyIcon className="w-3.5 h-3.5" />
                          <span>{copiedKey ? "Kopyalandı!" : "Kopyala"}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {item.deliveredAccount && (
                    <div className="space-y-1 text-slate-300 bg-slate-900 p-3 rounded-xl border border-amber-500/20">
                      <span className="text-amber-400 font-bold block text-[11px]">👑 Hesab Giriş Məlumatları:</span>
                      <div className="font-mono text-xs">Login: <strong className="text-white">{item.deliveredAccount.username}</strong></div>
                      <div className="font-mono text-xs">Şifrə: <strong className="text-emerald-400">{item.deliveredAccount.password}</strong></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm cursor-pointer shadow-lg shadow-emerald-500/25"
            >
              Oldu, Alış-verişə Davam Et
            </button>
          </div>
        ) : (
          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-1">
                <ShieldCheckIcon className="w-3.5 h-3.5" />
                <span>Təhlükəsiz Ödəniş</span>
              </div>
              <h3 className="text-xl font-black text-white">Sifarişi Təsdiqlə</h3>
            </div>

            {/* Items summary */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2 text-xs">
              <span className="font-bold text-slate-400 text-[11px] block">Məhsullar ({itemsToBuy.length}):</span>
              {itemsToBuy.map((it, idx) => (
                <div key={idx} className="flex justify-between text-slate-200">
                  <span className="truncate max-w-[280px]">• {it.title}</span>
                  <span className="font-bold text-emerald-400">{Number(it.price).toFixed(2)} ₼</span>
                </div>
              ))}
              <div className="pt-2 border-t border-white/5 flex justify-between font-black text-sm">
                <span className="text-white">Yekun Məbləğ:</span>
                <span className="text-amber-400 text-base">{totalAmount.toFixed(2)} ₼</span>
              </div>
            </div>

            {/* Payment method selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Ödəniş Üsulu</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'M10', name: 'm10', sub: '0% Komissiya' },
                  { id: 'BirBank', name: 'BirBank', sub: 'Kapital Bank' },
                  { id: 'Kart', name: 'Bank Kartı', sub: 'Visa/MC' },
                  { id: 'Balans', name: 'Balans', sub: user ? `${Number(user.balance || 0).toFixed(2)} ₼` : '0 ₼' }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === m.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                        : 'bg-slate-900 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <span className="block font-black text-xs">{m.name}</span>
                    <span className="block text-[9px] opacity-75">{m.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Adınız</label>
                <input
                  type="text"
                  placeholder="Məs: Əli Əliyev"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">E-poçt ünvanınız (Lisenziya açarı göndəriləcək)</label>
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Əlaqə nömrəsi / WhatsApp (İstəyə bağlı)</label>
                <input
                  type="text"
                  placeholder="+994 50 000 00 00"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:opacity-95 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-500/25 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Ödəniş aparılır..." : `Ödənişi Tamamla (${totalAmount.toFixed(2)} ₼) ⚡`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
