import React from "react";
import Link from "next/link";
import {
  Shield,
  Zap,
  Users,
  Gamepad2,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Haqqımızda | Game X Store",
  description:
    "Game X Store olaraq, Azərbaycanda qeymerlər üçün ən təhlükəsiz, sərfəli və sürətli rəqəmsal oyun və hesab platformasını təqdim edirik.",
};

const STATS = [
  { value: "5 000+", label: "Məmnun Qeymer" },
  { value: "2 000+", label: "Rəqəmsal Məhsul" },
  { value: "99.9%", label: "Uğurlu Çatdırılma" },
  { value: "7/24", label: "Canlı Dəstək" },
];

const VALUES = [
  {
    icon: Shield,
    title: "100% Rəsmi Zəmanət",
    description:
      "Təqdim etdiyimiz bütün oyun lisenziyaları və hesablar rəsmi zəmanətlidir. İstənilən çətinlikdə komandamız dərhal həll təmin edir.",
  },
  {
    icon: Zap,
    title: "Anında Təhvil",
    description:
      "Avtomatlaşdırılmış sistemimiz sayəsində ödəniş təsdiqlənən kimi rəqəmsal kodlar və aktivasiya məlumatları şəxsi kabinetinizə çatdırılır.",
  },
  {
    icon: Users,
    title: "Böyük Oyun İcması",
    description:
      "Discord və sosial media kanallarımız vasitəsilə minlərlə yerli oyunçunu bir araya gətirir, ortaq turnirlər və xüsusi endirimlər təşkil edirik.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#090d16] text-slate-100 min-h-screen">
      {/* 1. Hero Banner Bölməsi */}
      <section className="relative py-24 md:py-32 bg-slate-900/40 border-b border-slate-800/80 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 text-xs font-bold tracking-wider text-red-400 uppercase bg-red-950/40 border border-red-800/40 rounded-full shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-red-500" />
            <span>BİZİM HEKAYƏMİZ VƏ DƏYƏRLƏRİMİZ</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight italic uppercase leading-none">
            BİZ{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500">
              KİMİK?
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Game X Store olaraq, Azərbaycanda qeymerlər üçün ən etibarlı,
            sərfəli və sürətli rəqəmsal oyun ekosistemini formalaşdırırıq.
          </p>
        </div>
      </section>

      {/* 2. Missiyamız və Hekayəmiz Bölməsi */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Mətn hissəsi */}
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Oyun Təcrübənizi <br />
              <span className="text-red-500">Zirvəyə Daşıyın</span>
            </h2>

            <p className="text-slate-300 leading-relaxed text-base sm:text-lg">
              Game X Store — oyunçuların ən son AAA oyunlara, rəsmi lisenziya
              açarlarına, təhlükəsiz oyun hesablarına və oyun valyutalarına ən
              rahat yolla çıxış əldə etməsi üçün qurulmuşdur.
            </p>

            <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
              Məqsədimiz sadəcə satış deyil, həm də yerli oyunçuların beynəlxalq
              oyun xidmətlərindən heç bir ödəniş və bloklanma problemi olmadan
              faydalanmasını təmin etməkdir.
            </p>

            {/* Statistika Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 hover:border-red-500/30 transition-all text-center shadow-md"
                >
                  <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-400 font-medium mt-1.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vizual blok */}
          <div className="relative aspect-video lg:aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/90 flex items-center justify-center group shadow-2xl">
            <div className="absolute inset-0 bg-radial-gradient from-red-600/10 via-transparent to-transparent pointer-events-none" />
            <Gamepad2 className="w-72 h-72 text-red-500/5 absolute transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700" />

            <div className="relative z-10 text-center p-8 max-w-sm">
              <div className="inline-flex p-5 rounded-3xl bg-red-500/10 text-red-500 mb-5 ring-1 ring-red-500/30 group-hover:scale-110 transition-transform duration-300">
                <Trophy className="w-14 h-14" />
              </div>
              <h3 className="text-2xl font-black text-white">
                Etibarlı Qeyminq Tərəfdaşınız
              </h3>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                Rəsmi rəqəmsal distribyusiya, şəffaf qiymətlər və 7/24 fasiləsiz
                müştəri xidməti.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Dəyərlərimiz (Niyə Biz?) */}
      <section className="py-20 md:py-28 bg-slate-900/30 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Niyə Məhz <span className="text-red-500">Biz?</span>
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              Bizi digər platformalardan fərqləndirən əsas prinsiplər və
              zəmanətlərimiz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="bg-slate-900/70 p-8 rounded-3xl border border-slate-800 hover:border-red-500/40 hover:-translate-y-1.5 transition-all duration-300 shadow-xl flex flex-col group"
                >
                  <div className="p-4 bg-red-500/10 rounded-2xl w-fit text-red-500 mb-6 ring-1 ring-red-500/20 group-hover:scale-110 group-hover:bg-red-500/20 transition-all duration-200">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">
                    {val.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Səhifə Sonu CTA (Call to action) */}
          <div className="mt-20 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-red-950/40 via-slate-900/80 to-slate-900/40 border border-red-500/20 text-center relative overflow-hidden">
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
              Yeni Bir Oyuna Başlamağa Hazırsınız?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
              Yüzlərlə populyar oyun və xüsusi endirimlər sizi gözləyir.
            </p>
            <Link
              href="/market"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm tracking-wider uppercase transition-all duration-200 shadow-lg shadow-red-600/30 hover:scale-105"
            >
              <span>Mağazaya Keçid Et</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
