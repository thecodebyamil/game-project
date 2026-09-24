"use client";

import React, { useState } from "react";
import {
  MessageCircle,
  MessageSquare,
  Send,
  ChevronDown,
  Headphones,
  CheckCircle2,
  HelpCircle,
  Clock,
} from "lucide-react";

const FAQS = [
  {
    id: 1,
    question: "Aldığım oyun kodu nə vaxt çatdırılır?",
    answer:
      "Rəqəmsal lisenziya kodları və balans yükləmələri avtomatlaşdırılmış sistem vasitəsilə adətən 1-5 dəqiqə ərzində şəxsi kabinetinizə və e-poçtunuza çatdırılır.",
  },
  {
    id: 2,
    question: "Ödəniş üsullarınız hansılardır?",
    answer:
      "Bütün yerli bank kartları (Visa, Mastercard, Birbank, LeoBank), həmçinin MilliÖN, eManat və m10 vasitəsilə 0% komissiya ilə ödəniş edə bilərsiniz.",
  },
  {
    id: 3,
    question: "Səhv oyunçu ID daxil etsəm nə olur?",
    answer:
      "Balans yükləmələri sistem tərəfindən avtomatik və saniyələr içində icra edildiyi üçün səhv ID-yə yüklənən məbləğ geri qaytarılmır. Zəhmət olmasa ID nömrənizi təsdiqləmədən öncə dəqiqləşdirin.",
  },
  {
    id: 4,
    question: "Hesab alarkən zəmanət verirsinizmi?",
    answer:
      "Bəli, satdığımız bütün VIP oyun hesabları 100% rəsmi zəmanətlidir. Hesab təhvil verildikdən dərhal sonra bütün təhlükəsizlik məlumatları sizin adınıza keçirilir.",
  },
];

const SUPPORT_CHANNELS = [
  {
    name: "WhatsApp",
    href: "https://wa.me/994551234567",
    icon: MessageCircle,
    color:
      "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white",
    status: "🟢 Onlayn",
  },
  {
    name: "Telegram",
    href: "https://telegram.org",
    icon: Send,
    color: "text-blue-400 bg-blue-500/10 hover:bg-blue-500 hover:text-white",
    status: "⚡ Sürətli cavab",
  },
  {
    name: "Discord",
    href: "https://discord.com",
    icon: MessageSquare,
    color:
      "text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500 hover:text-white",
    status: "🎮 İcma dəstəyi",
  },
];

export default function SupportPage() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Sifariş problemi",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "Sifariş problemi",
        message: "",
      });

      setTimeout(() => setIsSuccess(false), 4000);
    }, 800);
  };

  return (
    <main className="bg-[#090d16] min-h-screen text-slate-100 pb-24 selection:bg-red-500 selection:text-white">
      {/* 1. Üst Header */}
      <section className="relative py-20 md:py-28 bg-slate-900/40 border-b border-slate-800/80 text-center overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 text-xs font-bold tracking-wider text-red-400 uppercase bg-red-950/40 border border-red-800/40 rounded-full">
            <Headphones size={14} className="text-red-500" />
            <span>MÜŞTƏRİ MƏMNUNİYYƏTİ VƏ DƏSTƏK</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase italic tracking-tight leading-none">
            SİZƏ NECƏ{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500">
              KÖMƏK EDƏK?
            </span>
          </h1>

          <p className="text-slate-400 mt-4 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
            Suallarınızın cavabını dərhal tapın və ya birbaşa canlı dəstək
            komandamızla əlaqə saxlayın.
          </p>
        </div>
      </section>

      {/* 2. Əsas Bölmə (FAQ və Əlaqə Formu) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Sol Tərəf: Sual-Cavab və Canlı Kanallar (5 sütun) */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase italic mb-6 text-white flex items-center gap-2">
              <HelpCircle size={22} className="text-red-500" />
              <span>Tez-tez Verilən Suallar</span>
            </h2>

            <div className="space-y-3">
              {FAQS.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div
                    key={faq.id}
                    className={`bg-slate-900/80 border rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer shadow-md ${
                      isOpen
                        ? "border-red-500/50 bg-slate-900"
                        : "border-slate-800 hover:border-slate-700"
                    }`}
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                  >
                    <div className="p-4 sm:p-5 flex justify-between items-center gap-3">
                      <span className="font-bold text-slate-200 text-sm sm:text-base">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`text-red-500 transition-transform duration-300 shrink-0 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        size={18}
                      />
                    </div>
                    {isOpen && (
                      <div className="px-5 pb-5 text-slate-400 text-xs sm:text-sm leading-relaxed border-t border-slate-800/60 pt-3 animate-in fade-in">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Canlı Əlaqə Kanalları */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">
              Canlı Mesencerlərlə Əlaqə:
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {SUPPORT_CHANNELS.map((ch) => {
                const Icon = ch.icon;
                return (
                  <a
                    key={ch.name}
                    href={ch.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex flex-col items-center text-center transition-all group active:scale-95"
                  >
                    <div
                      className={`p-2.5 rounded-xl mb-2 transition-colors ${ch.color}`}
                    >
                      <Icon size={20} />
                    </div>
                    <span className="text-xs font-bold text-white group-hover:text-red-400">
                      {ch.name}
                    </span>
                    <span className="text-[9px] text-slate-500 mt-0.5 font-medium">
                      {ch.status}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sağ Tərəf: Əlaqə Formu (7 sütun) */}
        <div className="lg:col-span-7 bg-slate-900/80 p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl relative">
          <h2 className="text-2xl font-black uppercase italic mb-2 text-white">
            Bizə Mesaj Yaz
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-8">
            Probleminizi ətraflı bildirin, texniki şöbəmiz qısa müddətdə
            araşdırıb cavablasın.
          </p>

          {isSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>
                Mesajınız uğurla göndərildi! Ən qısa zamanda sizinlə əlaqə
                saxlanılacaq.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase text-slate-400 font-bold mb-1.5 block">
                  Adınız
                </label>
                <input
                  type="text"
                  placeholder="Məs: Əli"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3.5 focus:border-red-500 focus:outline-none text-sm text-white placeholder-slate-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs uppercase text-slate-400 font-bold mb-1.5 block">
                  E-poçt
                </label>
                <input
                  type="email"
                  placeholder="nümunə@mail.com"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3.5 focus:border-red-500 focus:outline-none text-sm text-white placeholder-slate-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase text-slate-400 font-bold mb-1.5 block">
                Müraciət Mövzusu
              </label>
              <select
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3.5 focus:border-red-500 focus:outline-none text-sm text-slate-200 transition-colors cursor-pointer"
              >
                <option value="Sifariş problemi">
                  Sifariş və ya Kod problemi
                </option>
                <option value="Ödəniş haqqında">
                  Ödəniş və Balans ləngiməsi
                </option>
                <option value="Hesab şikayəti">VIP Hesab sorğusu</option>
                <option value="Digər">Digər texniki məsələ</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase text-slate-400 font-bold mb-1.5 block">
                Mesajınız
              </label>
              <textarea
                rows={4}
                placeholder="Probleminizi və ya sifariş nömrənizi qeyd edin..."
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3.5 focus:border-red-500 focus:outline-none text-sm resize-none text-white placeholder-slate-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-red-600/30 cursor-pointer active:scale-95 disabled:opacity-60 text-xs sm:text-sm mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={16} />
                  <span>Mesajı Göndər</span>
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
