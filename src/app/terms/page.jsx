import React from "react";
import {
  FileText,
  ShieldAlert,
  CreditCard,
  RefreshCcw,
  UserCheck,
  Scale,
  Calendar,
  Mail,
} from "lucide-react";

export const metadata = {
  title: "İstifadəçi Şərtləri | Game X Store",
  description:
    "Game X Store xidmətlərindən istifadə qaydaları, ödəniş, zəmanət və rəqəmsal məhsulların təslimat şərtləri.",
};

const SECTIONS = [
  {
    id: "general",
    title: "1. Ümumi Qaydalar",
    icon: FileText,
    content:
      "Game X Store platformasından istifadə etməklə siz saytın bütün istifadə qaydalarını və şərtlərini qəbul etmiş sayılırsınız. Platformamız video oyunların, rəqəmsal lisenziya açarlarının və oyun balanslarının təhlükəsiz onlayn satışı üçün nəzərdə tutulmuşdur.",
  },
  {
    id: "accounts",
    title: "2. İstifadəçi Hesabı və Məsuliyyət",
    icon: UserCheck,
    content:
      "Qeydiyyat zamanı təqdim olunan məlumatların (ad, e-poçt və s.) dəqiqliyinə istifadəçi birbaşa məsuliyyət daşıyır. Hesabın giriş məlumatlarını və şifrəsini gizli saxlamaq, yad şəxslərə ötürməmək müştərinin şəxsi öhdəliyindədir.",
  },
  {
    id: "payments",
    title: "3. Ödəniş və Qiymətləndirmə",
    icon: CreditCard,
    content:
      "Saytda təqdim olunan bütün qiymətlər Azərbaycan Manatı (AZN) ilə göstərilir. Game X Store məzənnə və ya təchizatçı qiymətləri dəyişdikdə öncədən xəbərdarlıq etmədən qiymətlərə düzəliş etmək hüququna malikdir. Səhvən edilən artıq ödənişlər dərhal müştərinin daxili balansına qaytarılır.",
  },
  {
    id: "refunds",
    title: "4. Geri Qaytarılma Siyasəti",
    icon: RefreshCcw,
    content:
      "Rəqəmsal kodlar (CD-Key, Gift Card, E-pin) təkistifadəlik və anında aktivləşən məhsul olduğu üçün çatdırıldıqdan sonra geri qaytarılmır və dəyişdirilmir. Əgər kodda hər hansı texniki qüsur yaranarsa, müştəri ödəniş qəbzi ilə birlikdə 24 saat ərzində dəstək xidmətinə müraciət edərək yenisi ilə əvəzlənməsini tələb edə bilər.",
  },
  {
    id: "prohibitions",
    title: "5. Qadağalar və Təhlükəsizlik",
    icon: ShieldAlert,
    content:
      "Platformanın fəaliyyətinə mane olacaq hər hansı kiberhücum, bot istifadəsi, saxta ödəniş cəhdləri və ya digər qanunsuz manipulyasiyalar qadağandır. Bu cür hallar aşkar edildikdə istifadəçinin hesabı dərhal bloklanır və qanunvericiliyə uyğun hüquqi tədbirlər görülür.",
  },
];

export default function TermsPage() {
  return (
    <main className="bg-[#090d16] min-h-screen text-slate-100 pb-24 selection:bg-red-500 selection:text-white">
      {/* 1. Üst Başlıq (Header) */}
      <section className="relative py-20 md:py-28 bg-slate-900/40 border-b border-slate-800/80 overflow-hidden text-center md:text-left">
        <div className="absolute -top-24 left-1/2 md:left-1/4 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 text-xs font-bold tracking-wider text-red-400 uppercase bg-red-950/40 border border-red-800/40 rounded-full">
            <Scale size={14} className="text-red-500" />
            <span>HÜQUQİ MƏLUMAT VƏ QAYDALAR</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tight leading-none">
            İSTİFADƏÇİ{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">
              ŞƏRTLƏRİ
            </span>
          </h1>

          <p className="text-slate-400 mt-4 text-base sm:text-lg max-w-2xl leading-relaxed">
            Game X Store xidmətlərindən istifadə etməzdən əvvəl xahiş edirik
            aşağıdakı rəsmi qaydalar və öhdəliklərlə tanış olasınız.
          </p>
        </div>
      </section>

      {/* 2. Şərtlər Bəndləri */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-12 space-y-10">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <article
                key={section.id}
                className="group space-y-3 pb-8 border-b border-slate-800/70 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/10 rounded-2xl text-red-500 ring-1 ring-red-500/20 group-hover:scale-110 group-hover:bg-red-500/20 transition-all shrink-0">
                    <Icon size={22} />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold uppercase italic tracking-tight text-white group-hover:text-red-400 transition-colors">
                    {section.title}
                  </h2>
                </div>

                <p className="text-slate-300 leading-relaxed pl-0 sm:pl-14 text-sm sm:text-base">
                  {section.content}
                </p>
              </article>
            );
          })}

          {/* Əlaqə Qeydi */}
          <div className="p-6 rounded-2xl bg-slate-950/80 border-l-4 border-red-500 shadow-inner mt-8">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed flex items-center gap-2">
              <Mail size={16} className="text-red-400 shrink-0" />
              <span>
                İstifadəçi şərtləri ilə bağlı hər hansı sualınız yaranarsa,{" "}
                <a
                  href="mailto:info@gamexstore.az"
                  className="text-red-400 hover:text-red-300 font-bold underline transition-colors"
                >
                  info@gamexstore.az
                </a>{" "}
                ünvanı vasitəsilə hüquq şöbəmizlə əlaqə saxlaya bilərsiniz.
              </span>
            </p>
          </div>
        </div>

        {/* Tarix */}
        <div className="mt-10 text-center text-slate-500 text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Calendar size={13} />
          <span>Son Redaktə: Sentyabr 2026 | Game X Store</span>
        </div>
      </section>
    </main>
  );
}
