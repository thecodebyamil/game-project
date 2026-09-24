import React from "react";
import {
  ShieldCheck,
  Eye,
  Lock,
  Share2,
  Bell,
  Cookie,
  Mail,
  Calendar,
} from "lucide-react";

export const metadata = {
  title: "Məxfilik Siyasəti | Game X Store",
  description:
    "Game X Store istifadəçilərinin şəxsi məlumatlarının qorunması, SSL təhlükəsizliyi və məxfilik qaydaları.",
};

const POLICIES = [
  {
    id: 1,
    title: "Məlumatların Toplanması",
    icon: Eye,
    description:
      "Biz sizin adınız, e-poçt ünvanınız və əməliyyat tarixçəniz kimi məlumatları toplayırıq. Bu məlumatlar yalnız sizə daha keyfiyyətli xidmət göstərmək və rəqəmsal sifarişlərinizi təhlükəsiz çatdırmaq məqsədilə istifadə olunur.",
  },
  {
    id: 2,
    title: "Məlumatların Təhlükəsizliyi",
    icon: Lock,
    description:
      "Şəxsi məlumatlarınız 256-bit SSL şifrələmə protokolları ilə tam qorunur. Bank kartı məlumatlarınız qətiyyən bizim serverlərdə saxlanılmır və birbaşa lisenziyalı bank emal mərkəzlərinə ötürülür.",
  },
  {
    id: 3,
    title: "Üçüncü Tərəflərlə Paylaşım",
    icon: Share2,
    description:
      "Şəxsi məlumatlarınız heç bir halda kənar şəxslərə satılmır və ya marketinq məqsədilə üçüncü tərəflərlə paylaşılmır. Yalnız qanunvericiliyin tələb etdiyi hüquqi hallarda və ya ödənişin icrası üçün banklarla zəruri məlumat mübadiləsi aparıla bilər.",
  },
  {
    id: 4,
    title: "Kuki (Cookie) Siyasəti",
    icon: Cookie,
    description:
      "Saytımızın sürətini artırmaq, sessiyanızı yadda saxlamaq və sizə ən uyğun oyun təkliflərini göstərmək üçün kukilərdən istifadə edirik. Brauzerinizin parametrlərindən kukiləri istədiyiniz vaxt deaktiv edə bilərsiniz.",
  },
  {
    id: 5,
    title: "Bildirişlər və Kampaniyalar",
    icon: Bell,
    description:
      "Yalnız sizin razılığınız əsasında yeni endirimlər, hədiyyə kodları və turnirlər barədə e-poçt bildirişləri göndərilir. İstənilən zaman e-poçtun altındakı link vasitəsilə abunəlikdən imtina edə bilərsiniz.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-[#090d16] min-h-screen text-slate-100 pb-24 selection:bg-red-500 selection:text-white">
      {/* 1. Header Bölməsi */}
      <section className="relative py-20 md:py-28 bg-slate-900/40 border-b border-slate-800/80 overflow-hidden text-center md:text-left">
        {/* Ambient Glow */}
        <div className="absolute -top-24 left-1/2 md:left-1/4 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 text-xs font-bold tracking-wider text-red-400 uppercase bg-red-950/40 border border-red-800/40 rounded-full">
            <ShieldCheck size={14} className="text-red-500" />
            <span>MƏXFİLİK VƏ İNFORMASİYA TƏHLÜKƏSİZLİYİ</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tight leading-none">
            MƏXFİLİK{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">
              SİYASƏTİ
            </span>
          </h1>

          <p className="text-slate-400 mt-4 text-base sm:text-lg max-w-2xl leading-relaxed">
            Şəxsi məlumatlarınızın təhlükəsizliyi bizim üçün ən ali
            prioritetdir. Məlumatlarınızın necə toplandığı və qorunduğu ilə
            ətraflı tanış olun.
          </p>
        </div>
      </section>

      {/* 2. Siyasət Bəndləri */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="space-y-6">
          {POLICIES.map((policy) => {
            const Icon = policy.icon;
            return (
              <article
                key={policy.id}
                className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800/90 hover:border-red-500/40 transition-all duration-300 shadow-xl flex flex-col sm:flex-row items-start gap-6 group"
              >
                <div className="p-4 bg-red-500/10 rounded-2xl text-red-500 ring-1 ring-red-500/20 group-hover:scale-110 group-hover:bg-red-500/20 transition-all duration-200 shrink-0">
                  <Icon size={24} />
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                    {policy.title}
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {policy.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* 3. Əlaqə və Son Yenilənmə */}
        <div className="mt-16 p-8 rounded-3xl bg-slate-900/50 border border-slate-800 text-center shadow-lg">
          <p className="text-slate-300 text-sm sm:text-base">
            Məxfilik siyasəti və məlumatlarınızla bağlı hər hansı sualınız
            yaranarsa,{" "}
            <a
              href="mailto:privacy@gamexstore.az"
              className="text-red-400 hover:text-red-300 font-bold underline transition-colors"
            >
              privacy@gamexstore.az
            </a>{" "}
            ünvanına müraciət edə bilərsiniz.
          </p>
          <p className="text-slate-500 text-xs mt-4 uppercase tracking-widest font-bold flex items-center justify-center gap-1.5">
            <Calendar size={13} />
            <span>Son Yenilənmə: Sentyabr 2026</span>
          </p>
        </div>
      </section>
    </main>
  );
}
