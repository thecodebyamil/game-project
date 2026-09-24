"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  HelpCircle,
  MessageCircle,
  ShieldCheck,
  Zap,
  Search,
  ArrowRight,
  Headphones,
} from "lucide-react";

const FAQ_DATA = [
  {
    id: 1,
    question: "Sifariş etdiyim rəqəmsal kod nə vaxt çatdırılır?",
    answer:
      "Bütün sifarişlər avtomatlaşdırılmış sistem tərəfindən dərhal emal edilir və adətən 1-5 dəqiqə ərzində qeydiyyatdan keçdiyiniz e-poçt ünvanınıza və şəxsi kabinetinizə göndərilir.",
    icon: Zap,
    iconColor: "text-amber-400 bg-amber-500/10",
  },
  {
    id: 2,
    question: "Hansı ödəniş üsullarını qəbul edirsiniz?",
    answer:
      "Bütün yerli bank kartları (Visa, Mastercard, Birbank, LeoBank), həmçinin MilliÖN və eManat terminalları vasitəsilə 0% komissiya ilə balansınızı artıra bilərsiniz.",
    icon: ShieldCheck,
    iconColor: "text-emerald-400 bg-emerald-500/10",
  },
  {
    id: 3,
    question: "Aldığım oyunu və ya kodu geri qaytara bilərəmmi?",
    answer:
      "Rəqəmsal lisenziya açarları birbaşa aktivasiya üçün nəzərdə tutulduğundan, təhvil verildikdən sonra geri qaytarılmır. Əgər kodda hər hansı texniki qüsur yaranarsa, 100% zəmanət çərçivəsində dərhal yenisi ilə əvəzlənir və ya ödənişiniz geri qaytarılır.",
    icon: MessageCircle,
    iconColor: "text-blue-400 bg-blue-500/10",
  },
  {
    id: 4,
    question: "Hesab alarkən təhlükəsizlik necə təmin olunur?",
    answer:
      "VIP hesablar satışa çıxarılmamışdan əvvəl ekspertlərimiz tərəfindən yoxlanılır. Satışdan dərhal sonra hesabın e-poçt və şifrə məlumatları tamamilə sizin adınıza keçirilir.",
    icon: HelpCircle,
    iconColor: "text-red-400 bg-red-500/10",
  },
  {
    id: 5,
    question: "Balansımı artırdım, lakin görünmür, nə etməliyəm?",
    answer:
      "Bəzi bank əməliyyatlarında 1-2 dəqiqəlik ləngimə ola bilər. 5 dəqiqə ərzində balansınız yenilənməzsə, ödəniş qəbzi və ya çıxarışı ilə canlı dəstəyə yazmağınız kifayətdir, dərhal təsdiqlənəcək.",
    icon: Headphones,
    iconColor: "text-purple-400 bg-purple-500/10",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Axtarış üzrə süzülmə
  const filteredFAQ = FAQ_DATA.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <main className="bg-[#090d16] min-h-screen text-slate-100 pb-24 selection:bg-red-500 selection:text-white">
      {/* 1. Hero Header */}
      <section className="relative py-20 md:py-28 bg-slate-900/40 border-b border-slate-800/80 text-center overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 text-xs font-bold tracking-wider text-red-400 uppercase bg-red-950/40 border border-red-800/40 rounded-full">
            <HelpCircle size={14} className="text-red-500" />
            <span>KÖMƏK VƏ MƏLUMAT BAZASI</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tight leading-none">
            SUALINIZ{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">
              VAR?
            </span>
          </h1>

          <p className="text-slate-400 mt-4 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Sifariş, ödəniş və zəmanət haqqında ən çox verilən sualların
            cavabları.
          </p>

          {/* Sual Axtarış Qutusu */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sualınızı axtarın..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* 2. Suallar Siyahısı (Accordion) */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {filteredFAQ.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
            <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">
              Axtarışınıza uyğun sual tapılmadı.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFAQ.map((item, index) => {
              const isOpen = openIndex === index;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  className={`bg-slate-900/80 border rounded-2xl overflow-hidden transition-all duration-300 shadow-md ${
                    isOpen
                      ? "border-red-500/50 bg-slate-900"
                      : "border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                    className="w-full p-5 sm:p-6 flex items-center justify-between text-left transition-colors cursor-pointer gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className={`p-2.5 rounded-xl shrink-0 ${item.iconColor}`}
                      >
                        <Icon size={20} />
                      </div>
                      <span className="font-bold text-sm sm:text-base text-white">
                        {item.question}
                      </span>
                    </div>

                    <ChevronDown
                      className={`text-slate-400 transition-transform duration-300 shrink-0 ${
                        isOpen ? "rotate-180 text-red-500" : ""
                      }`}
                      size={20}
                    />
                  </button>

                  {/* Cavab Bloku */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-6 pt-0 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800/60 mt-1">
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 3. Dəstək Banneri */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-red-950/40 via-slate-900/90 to-slate-900/50 border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-xl font-black uppercase italic text-white">
              Axtardığınız cavabı tapmadınız?
            </h3>
            <p className="text-slate-400 mt-1 text-xs sm:text-sm">
              Texniki dəstək komandamız 7/24 sizə yardım etməyə hazırdır.
            </p>
          </div>

          <Link
            href="/contact"
            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-7 py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider transition-all shadow-lg shadow-red-600/30 active:scale-95 inline-flex items-center gap-2 shrink-0"
          >
            <span>Dəstəyə Yaz</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
