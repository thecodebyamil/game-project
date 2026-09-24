"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Instagram,
  Twitter,
  Clock,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Form göndərilməsi simulyasiyası
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setFormData({ name: "", email: "", message: "" });

      setTimeout(() => setIsSuccess(false), 4000);
    }, 800);
  };

  return (
    <main className="bg-[#090d16] min-h-screen text-slate-100 pb-24 selection:bg-red-500 selection:text-white">
      {/* 1. Üst Başlıq (Header) */}
      <section className="relative py-20 md:py-28 bg-slate-900/40 border-b border-slate-800/80 overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 text-xs font-bold tracking-wider text-red-400 uppercase bg-red-950/40 border border-red-800/40 rounded-full">
            <Clock className="w-3.5 h-3.5 text-red-500" />
            <span>24/7 CANLI VƏ TEXNİKİ DƏSTƏK</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase italic tracking-tight leading-none">
            BİZİMLƏ{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">
              ƏLAQƏ
            </span>
          </h1>

          <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Hər hansı sualınız, təklifiniz və ya texniki çətinliyiniz varsa,
            bizə yazın. Operativ komandamız ən qısa zamanda cavablandıracaq.
          </p>
        </div>
      </section>

      {/* 2. Əlaqə Bölməsi */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Sol Tərəf: Əlaqə Vasitələri (5 sütun) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3 text-white">
                <MessageSquare className="w-6 h-6 text-red-500" />
                <span>Əlaqə Vasitələri</span>
              </h2>

              <div className="space-y-4">
                {/* E-poçt */}
                <a
                  href="mailto:support@gamexstore.az"
                  className="flex items-center gap-5 p-5 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-red-500/40 hover:bg-slate-900 transition-all duration-200 group"
                >
                  <div className="p-3.5 bg-red-500/10 rounded-xl text-red-500 group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all shrink-0">
                    <Mail size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">
                      E-poçt Ünvanı
                    </p>
                    <p className="text-base font-bold text-white group-hover:text-red-400 transition-colors">
                      support@gamexstore.az
                    </p>
                  </div>
                </a>

                {/* Telefon */}
                <a
                  href="tel:+994551234567"
                  className="flex items-center gap-5 p-5 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-red-500/40 hover:bg-slate-900 transition-all duration-200 group"
                >
                  <div className="p-3.5 bg-red-500/10 rounded-xl text-red-500 group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all shrink-0">
                    <Phone size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">
                      Qaynar Xətt
                    </p>
                    <p className="text-base font-bold text-white group-hover:text-red-400 transition-colors">
                      +994 (55) 123 45 67
                    </p>
                  </div>
                </a>

                {/* Ünvan */}
                <div className="flex items-center gap-5 p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
                  <div className="p-3.5 bg-red-500/10 rounded-xl text-red-500 shrink-0">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">
                      Mərkəzi Ofis
                    </p>
                    <p className="text-base font-bold text-white">
                      Bakı şəhəri, Nizami küç. 42
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sosial Şəbəkələr */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                Bizi Sosial Şəbəkələrdə İzləyin
              </h3>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center hover:bg-red-600 hover:border-red-600 text-slate-400 hover:text-white transition-all active:scale-95"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center hover:bg-red-600 hover:border-red-600 text-slate-400 hover:text-white transition-all active:scale-95"
                >
                  <Twitter size={20} />
                </a>
              </div>
            </div>

            {/* Sual-Cavab Banneri */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-start gap-4">
              <HelpCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">
                  Tez-tez Verilən Suallar
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Ödəniş və ya kod aktivasiyası ilə bağlı hazır cavablar üçün
                  FAQ səhifəsinə nəzər yetirə bilərsiniz.
                </p>
                <Link
                  href="/faq"
                  className="text-xs font-bold text-red-400 hover:text-red-300 mt-2.5 inline-block"
                >
                  FAQ səhifəsinə keç ➔
                </Link>
              </div>
            </div>
          </div>

          {/* Sağ Tərəf: Əlaqə Formu (7 sütun) */}
          <div className="lg:col-span-7 bg-slate-900/80 p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl relative">
            <h2 className="text-2xl font-black uppercase italic mb-2 text-white">
              Birbaşa Mesaj Göndər
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mb-8">
              Müraciətiniz qeydə alındıqdan sonra dərhal e-poçtunuza cavab
              göndəriləcək.
            </p>

            {isSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-3 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>
                  Mesajınız qəbul edildi! Ən qısa zamanda sizinlə əlaqə
                  saxlayacağıq.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Adınız və Soyadınız
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Məs: Əli Məmmədov"
                  required
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  E-poçt Ünvanınız
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="nümunə@example.com"
                  required
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Mesajınız
                </label>
                <textarea
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Sualınızı və ya probleminizi ətraflı qeyd edin..."
                  required
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/30 active:scale-95 cursor-pointer disabled:opacity-60 text-xs sm:text-sm"
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
        </div>
      </div>
    </main>
  );
}
