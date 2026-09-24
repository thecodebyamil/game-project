"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  CreditCard,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  ShoppingBag,
  Wallet,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function CheckoutPage() {
  const { cartItems = [], totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState("card"); // 'card' | 'm10' | 'balance'
  const [formData, setFormData] = useState({
    name: user?.name || user?.fullName || "",
    email: user?.email || "",
    phone: "",
    notes: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completedOrder, setCompletedOrder] = useState(null);
  const [copiedKeyIndex, setCopiedKeyIndex] = useState(null);

  const handleCopyKey = (keyText, index) => {
    navigator.clipboard.writeText(keyText);
    setCopiedKeyIndex(index);
    setTimeout(() => setCopiedKeyIndex(null), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMsg("Zəhmət olmasa ad və e-poçt ünvanınızı qeyd edin.");
      return;
    }

    if (paymentMethod === "balance") {
      if (!user) {
        setErrorMsg("Balans ilə ödəniş üçün əvvəlcə hesabınıza daxil olmalısınız.");
        return;
      }
      if (Number(user.balance || 0) < totalPrice) {
        setErrorMsg(`Balansınızda kifayət qədər vəsait yoxdur. Cari balans: ${(Number(user.balance) || 0).toFixed(2)} AZN`);
        return;
      }
    }

    setIsLoading(true);

    try {
      const orderPayload = {
        userId: user?.id || null,
        userName: formData.name.trim(),
        userEmail: formData.email.trim().toLowerCase(),
        contact: formData.phone.trim(),
        items: cartItems.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity || 1,
          type: item.type || "Oyun / Kod",
        })),
        paymentMethod:
          paymentMethod === "card"
            ? "Bank Kartı (Visa/MC)"
            : paymentMethod === "m10"
              ? "M10 / MilliÖn"
              : "Daxili Balans",
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Sifariş icra olunarkən xəta baş verdi.");
      }

      setCompletedOrder(data.order);
      clearCart();
    } catch (err) {
      setErrorMsg(err.message || "Ödəniş zamanı xəta baş verdi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Sifariş Tamamlandı Ekranı
  if (completedOrder) {
    return (
      <main className="bg-[#090d16] min-h-[85vh] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 size={36} />
          </div>

          <div>
            <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
              Ödəniş Uğurla Tamamlandı!
            </span>
            <h1 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight text-white mt-1">
              Sifariş #{completedOrder.id}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Təşəkkür edirik! Rəqəmsal açar və lisenziya kodlarınız anında çatdırıldı.
            </p>
          </div>

          {/* Çatdırılan Kodlar Bölməsi */}
          <div className="space-y-3 text-left">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Aktivasiya Kodlarınız:
            </h3>
            {(completedOrder.items || []).map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-bold text-sm text-white">{item.title}</h4>
                  <p className="font-mono text-sm text-red-400 font-bold mt-1 tracking-wider select-all">
                    {item.licenseKey || "GAME-AUTO-ACTIVE-KEY"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopyKey(item.licenseKey || "GAME-AUTO-ACTIVE-KEY", idx)
                  }
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  {copiedKeyIndex === idx ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      <span className="text-emerald-400">Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Kopyala</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2.5 text-left">
            <Zap size={16} className="text-yellow-400 shrink-0 mt-0.5" />
            <span>
              Kodları müvafiq platforma tətbiqində (Steam, Riot Games, Epic Games və s.)
              aktivləşdirə bilərsiniz. Çatdırılma detalları e-poçt ünvanınıza da göndərildi.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/market"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-600/30"
            >
              Mağazaya Qayıt
            </Link>
            <Link
              href="/profile"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-all border border-slate-700"
            >
              Sifarişlərimə Bax
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Səbət Boşdursa
  if (!cartItems || cartItems.length === 0) {
    return (
      <main className="bg-[#090d16] min-h-[75vh] flex flex-col items-center justify-center text-white px-4">
        <div className="p-6 rounded-full bg-slate-900 border border-slate-800 mb-6 shadow-inner">
          <ShoppingBag size={48} className="text-slate-600" />
        </div>
        <h2 className="text-2xl font-black italic tracking-tight uppercase mb-2">
          Səbətinizdə Məhsul Yoxdur
        </h2>
        <p className="text-slate-400 text-sm max-w-sm text-center mb-8">
          Ödəniş etmək üçün əvvəlcə səbətə oyun və ya rəqəmsal kod əlavə edin.
        </p>
        <Link
          href="/market"
          className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-8 py-3.5 font-bold rounded-xl transition-all uppercase tracking-wider text-xs shadow-lg shadow-red-600/30"
        >
          Mağazaya Keçid Et
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-[#090d16] min-h-screen text-slate-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-red-500 selection:text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-10 pb-4 border-b border-slate-800">
          <div className="w-1.5 h-8 bg-red-600 rounded-full" />
          <h1 className="text-3xl sm:text-4xl font-black italic tracking-tight uppercase">
            Sifarişin <span className="text-red-500">Rəsmiləşdirilməsi</span>
          </h1>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sol Tərəf: Müştəri və Ödəniş Formu */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Əlaqə Məlumatları */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <h2 className="text-sm font-black tracking-wider uppercase text-slate-300 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-600/20 text-red-500 text-xs flex items-center justify-center font-bold">
                  1
                </span>
                Çatdırılma və Əlaqə Məlumatları
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Ad və Soyad *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Məs: Əli Əliyev"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    E-poçt Ünvanı (Kod buraya göndəriləcək) *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="example@mail.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Əlaqə nömrəsi / WhatsApp (İstəyə bağlı)
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+994 50 123 45 67"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* 2. Ödəniş Üsulu */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <h2 className="text-sm font-black tracking-wider uppercase text-slate-300 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-600/20 text-red-500 text-xs flex items-center justify-center font-bold">
                  2
                </span>
                Ödəniş Üsulunu Seçin
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {/* Bank Kartı */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${
                    paymentMethod === "card"
                      ? "bg-red-500/10 border-red-500 text-white shadow-lg shadow-red-500/10"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <CreditCard className={paymentMethod === "card" ? "text-red-500" : "text-slate-500"} size={22} />
                  <div>
                    <h3 className="font-bold text-xs text-white">Bank Kartı</h3>
                    <p className="text-[11px] text-slate-500">Visa / Mastercard</p>
                  </div>
                </button>

                {/* M10 / MilliÖn */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("m10")}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${
                    paymentMethod === "m10"
                      ? "bg-red-500/10 border-red-500 text-white shadow-lg shadow-red-500/10"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <Zap className={paymentMethod === "m10" ? "text-yellow-400" : "text-slate-500"} size={22} />
                  <div>
                    <h3 className="font-bold text-xs text-white">M10 / MilliÖn</h3>
                    <p className="text-[11px] text-slate-500">Terminal / QR</p>
                  </div>
                </button>

                {/* Daxili Balans */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("balance")}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${
                    paymentMethod === "balance"
                      ? "bg-red-500/10 border-red-500 text-white shadow-lg shadow-red-500/10"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <Wallet className={paymentMethod === "balance" ? "text-emerald-400" : "text-slate-500"} size={22} />
                  <div>
                    <h3 className="font-bold text-xs text-white">Daxili Balans</h3>
                    <p className="text-[11px] text-slate-500">
                      {user ? `${(Number(user.balance) || 0).toFixed(2)} AZN` : "Giriş tələb olunur"}
                    </p>
                  </div>
                </button>
              </div>

              {paymentMethod === "balance" && !user && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs">
                  Balans ilə ödəniş etmək üçün əvvəlcə{" "}
                  <Link href="/login?redirect=/checkout" className="underline font-bold">
                    hesabınıza daxil olun
                  </Link>
                  .
                </div>
              )}
            </div>
          </div>

          {/* Sağ Tərəf: Sifariş İcmalı */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 sticky top-28 shadow-2xl">
              <h2 className="text-xs font-black tracking-widest text-slate-400 uppercase pb-3 border-b border-slate-800">
                Sifarişin Məzmunu ({cartItems.length} məhsul)
              </h2>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 text-xs py-2 border-b border-slate-800/60"
                  >
                    <div className="overflow-hidden">
                      <p className="font-bold text-white truncate">{item.title}</p>
                      <p className="text-slate-500 text-[11px]">
                        {item.quantity || 1} ədəd × {Number(item.price).toFixed(2)} AZN
                      </p>
                    </div>
                    <span className="font-bold text-white shrink-0">
                      {(Number(item.price) * (item.quantity || 1)).toFixed(2)} AZN
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2 text-sm">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-400">Ara cəm:</span>
                  <span className="text-white font-bold">{totalPrice.toFixed(2)} AZN</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-400">Çatdırılma:</span>
                  <span className="text-emerald-400 font-bold text-xs uppercase">Anında / Pulsuz</span>
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white py-4 font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-600/30 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Ödəniş İcra Olunur...</span>
                  </>
                ) : (
                  <>
                    <span>Sifarişi Təsdiqlə və Ödə</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-slate-800 text-center flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>256-bit SSL ilə Təhlükəsiz Ödəniş</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
