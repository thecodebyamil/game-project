"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import {
  Rocket,
  ShieldCheck,
  Headphones,
  ArrowRight,
  ShoppingCart,
  Check,
  Star,
  Flame,
  Gamepad2,
  Zap,
  Clock,
  Tag,
  Users,
  Trophy,
  ChevronRight,
  BadgeCheck,
  Gift,
} from "lucide-react";

// Popular games data
const POPULAR_GAMES = [
  {
    id: 1,
    title: "EA Sports FC 24",
    category: "Futbol / İdman",
    price: 79.99,
    originalPrice: 99.99,
    image: "/EA.jpg",
    discount: 20,
    rating: 4.8,
    reviews: 2341,
    stock: 15,
    badge: "Bestseller",
  },
  {
    id: 2,
    title: "Cyberpunk 2077",
    category: "RPG / Açıq Dünya",
    price: 45.0,
    image: "/Cyberpunk.jpg",
    discount: null,
    rating: 4.9,
    reviews: 5820,
    stock: 8,
    badge: "Tövsiyə Edilir",
  },
  {
    id: 3,
    title: "Elden Ring",
    category: "Souls-like / Aksiyon",
    price: 55.5,
    originalPrice: 65.0,
    image: "/Elden.jpg",
    discount: 15,
    rating: 5.0,
    reviews: 9012,
    stock: 4,
    badge: "Çox Satılan",
  },
  {
    id: 4,
    title: "Hogwarts Legacy",
    category: "Məcarə / Sehr",
    price: 65.0,
    image: "/Hogwarts.jpg",
    discount: null,
    rating: 4.7,
    reviews: 3156,
    stock: 20,
    badge: null,
  },
];

// Categories
const CATEGORIES = [
  { id: 1, title: "PC Oyunları", icon: "🖥️", href: "/market?cat=PC", count: 120, color: "from-blue-600/20 to-blue-900/20 border-blue-500/20" },
  { id: 2, title: "Mobil Oyunlar", icon: "📱", href: "/market?cat=Mobile", count: 85, color: "from-emerald-600/20 to-emerald-900/20 border-emerald-500/20" },
  { id: 3, title: "PlayStation", icon: "🎮", href: "/market?cat=Console", count: 64, color: "from-blue-700/20 to-indigo-900/20 border-blue-600/20" },
  { id: 4, title: "Xbox & Game Pass", icon: "🟩", href: "/market?cat=Xbox", count: 47, color: "from-green-600/20 to-green-900/20 border-green-500/20" },
  { id: 5, title: "Steam Kartları", icon: "💨", href: "/game-cards", count: 32, color: "from-slate-600/20 to-slate-900/20 border-slate-500/20" },
  { id: 6, title: "Oyun Hesabları", icon: "👑", href: "/accounts", count: 210, color: "from-amber-600/20 to-amber-900/20 border-amber-500/20" },
];

// Features
const FEATURES = [
  {
    id: 1,
    icon: Rocket,
    title: "Anında Çatdırılma",
    description: "Rəqəmsal kodlar ödəniş tamamlanandan sonra 5 dəqiqə ərzində şəxsi kabinetinizə çatdırılır.",
    color: "text-red-500",
    bg: "bg-red-500/10 ring-red-500/20",
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: "100% Zəmanət",
    description: "Bütün məhsullar rəsmi mənbələrdən təmin edilir. Probleminiz olarsa tam geri ödəmə alırsınız.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 ring-emerald-500/20",
  },
  {
    id: 3,
    icon: Headphones,
    title: "7/24 Canlı Dəstək",
    description: "Günün istənilən saatında Telegram, WhatsApp vasitəsilə dəstək komandamıza müraciət edin.",
    color: "text-blue-400",
    bg: "bg-blue-500/10 ring-blue-500/20",
  },
];

// Testimonials
const TESTIMONIALS = [
  {
    id: 1,
    name: "Tural Həsənov",
    role: "Pro Oyunçu",
    avatar: "T",
    avatarColor: "from-red-500 to-rose-700",
    rating: 5,
    text: "Steam kartı aldım, 2 dəqiqəyə kodumu aldım. Çox sürətli və etibarlı platforma. Artıq daima buradan alacam!",
    date: "3 gün əvvəl",
    game: "Steam",
  },
  {
    id: 2,
    name: "Leyla Babayeva",
    role: "Casual Gamer",
    avatar: "L",
    avatarColor: "from-purple-500 to-pink-600",
    rating: 5,
    text: "PUBG UC-ni çox ucuza aldım. Qiymətlər rəqabətqabiliyyətlidir, kod dərhal gəldi. Tövsiyə edirəm!",
    date: "1 həftə əvvəl",
    game: "PUBG Mobile",
  },
  {
    id: 3,
    name: "Nicat Əliyev",
    role: "Esports Oyunçusu",
    avatar: "N",
    avatarColor: "from-blue-500 to-cyan-600",
    rating: 5,
    text: "Valorant VP aldım, anında hesabıma gəldi. Admin çox kömək etdi. 10/10 xidmət!",
    date: "2 həftə əvvəl",
    game: "Valorant",
  },
  {
    id: 4,
    name: "Günel Mustafayeva",
    role: "Mobile Gamer",
    avatar: "G",
    avatarColor: "from-emerald-500 to-teal-600",
    rating: 5,
    text: "Free Fire elmasını aldım. Proses çox asandı, ödəniş etdim, kodu aldım. Əla xidmət!",
    date: "3 həftə əvvəl",
    game: "Free Fire",
  },
];

// Ticker messages
const TICKER_MESSAGES = [
  "⚡ Sürətli çatdırılma — ortalama 5 dəqiqə",
  "🎮 500+ rəqəmsal məhsul",
  "🛡️ 100% əmin olun — tam zəmanət",
  "🔥 Yeni endirim: Elden Ring -15%",
  "👑 VIP müştərilərə xüsusi bonuslar",
  "💳 Visa, Mastercard, M10 ilə ödəniş",
  "🎁 Qeydiyyatdan keçin: 50 ₼ bonus balans",
  "⭐ 5000+ xoşbəxt oyunçu",
];

const formatPrice = (amount) => `${Number(amount).toFixed(2)} AZN`;

// Countdown Timer Component
function CountdownTimer() {
  const [time, setTime] = useState({ h: 5, m: 47, s: 32 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s -= 1;
        if (s < 0) { s = 59; m -= 1; }
        if (m < 0) { m = 59; h -= 1; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-1.5">
      {[pad(time.h), pad(time.m), pad(time.s)].map((val, i) => (
        <React.Fragment key={i}>
          <span className="countdown-digit bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-lg font-black text-red-400 min-w-[3ch] text-center tabular-nums">
            {val}
          </span>
          {i < 2 && <span className="text-red-500 font-black text-xl pb-0.5">:</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

// Star rating component
function StarRating({ rating, size = "sm" }) {
  const starSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} ${
            star <= Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : star - 0.5 <= rating
              ? "fill-amber-400/50 text-amber-400"
              : "text-slate-600"
          }`}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const { addToCart } = useCart();
  const { games = [] } = useStore();
  const [addedId, setAddedId] = useState(null);

  const displayGames = games.length > 0 ? games.slice(0, 4) : POPULAR_GAMES;

  const handleAddToCart = (game) => {
    addToCart(game);
    setAddedId(game.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <main className="min-h-screen bg-[#090d16] text-slate-100 selection:bg-red-500 selection:text-white overflow-x-hidden">

      {/* ── TICKER TAPE ─────────────────────────────── */}
      <div className="bg-red-600 text-white py-2 overflow-hidden relative">
        <div className="flex items-center gap-0">
          <div className="animate-marquee whitespace-nowrap">
            {[...TICKER_MESSAGES, ...TICKER_MESSAGES].map((msg, i) => (
              <span key={i} className="inline-flex items-center gap-6 mx-6 text-xs font-semibold tracking-wide">
                {msg}
                <span className="text-red-300 opacity-60">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── HERO SECTION ─────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-32 md:pb-40 border-b border-slate-800/60">
        {/* Ambient glows */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/15 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-600/8 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/8 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-[11px] font-bold tracking-widest text-red-400 bg-red-950/50 border border-red-800/40 rounded-full shadow-inner backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span>RƏSMİ RƏQƏMSAL OYUN DİSTRİBYUSİYASI — AZƏRBAYCANın №1 MAĞAZASI</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[90px] font-black tracking-tight uppercase italic leading-[0.9] mb-6">
            Oyun Dünyasının{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-orange-400">
              Mərkəzi
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Ən son çıxan oyunlar, lisenziyalı rəqəmsal açarlar və təhlükəsiz oyun hesabları{" "}
            <span className="text-white font-semibold">ən sərfəli qiymətlərlə</span> bir kliklə əlinizdədir.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap gap-4 justify-center items-center">
            <Link
              href="/market"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm tracking-wide shadow-[0_0_30px_rgba(239,68,68,0.35)] hover:shadow-[0_0_45px_rgba(239,68,68,0.55)] hover:-translate-y-1 transition-all duration-200 animate-glow-pulse"
            >
              <Gamepad2 className="w-5 h-5" />
              <span>Mağazaya Get</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <Link
              href="/accounts"
              className="px-8 py-4 rounded-2xl border border-slate-700/80 bg-slate-900/70 hover:bg-slate-800/80 hover:border-slate-500 text-slate-200 font-semibold text-sm transition-all duration-200 backdrop-blur-md hover:-translate-y-0.5 shadow-sm"
            >
              Oyun Hesabları
            </Link>
          </div>

          {/* Trust Stats */}
          <div className="mt-16 pt-10 border-t border-slate-800/60 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: "5 000+", label: "Xoşbəxt Oyunçu", color: "text-white" },
              { value: "⚡ 5 Dəq", label: "Orta Çatdırılma", color: "text-emerald-400" },
              { value: "4.9 / 5", label: "Müştəri Reytinqi", color: "text-amber-400", icon: <Star className="inline w-4 h-4 fill-amber-400 mb-0.5" /> },
              { value: "100%", label: "Tam Zəmanət", color: "text-blue-400" },
            ].map((stat, i) => (
              <div key={i}>
                <div className={`text-xl sm:text-2xl font-black ${stat.color} flex items-center justify-center gap-1`}>
                  {stat.icon}{stat.value}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────────── */}
      <section className="py-16 md:py-20 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-2">Kateqoriyalar</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Platformalarımız
              </h2>
            </div>
            <Link href="/market" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-red-400 transition-colors group">
              <span>Hamısına bax</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                className={`relative p-5 rounded-2xl bg-gradient-to-br ${cat.color} border backdrop-blur-sm hover:-translate-y-1 hover:brightness-110 transition-all duration-200 flex flex-col items-center text-center gap-2 group card-hover`}
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
                <h3 className="text-xs font-bold text-white leading-tight">{cat.title}</h3>
                <span className="text-[10px] text-slate-400">{cat.count} məhsul</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEAL OF THE DAY ─────────────────────────────── */}
      <section className="py-16 md:py-20 border-b border-slate-800/60 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/20 via-transparent to-orange-950/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-slate-900/80 border border-red-500/25 rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 backdrop-blur-xl shadow-2xl shadow-red-950/20">
            {/* Left side */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600/20 border border-red-500/30 rounded-full mb-4">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                <span className="text-xs font-black text-red-400 uppercase tracking-wider">Günün Təklifi</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 leading-tight">
                Elden Ring{" "}
                <span className="text-red-500">-15%</span>
              </h2>
              <p className="text-slate-400 text-sm mb-6 max-w-md">
                Soulslikes janrının şedevri, GameX Store&apos;da ən sərfəli qiymətlə. Limitli təklif — tükənmədən al!
              </p>
              <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start mb-6">
                <div>
                  <span className="text-slate-500 text-xs line-through block">65.00 AZN</span>
                  <span className="text-4xl font-black text-white">55.50 <span className="text-xl text-red-500">AZN</span></span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-2">Sona qədər qalan vaxt:</p>
                  <CountdownTimer />
                </div>
              </div>
              <Link
                href="/market"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm transition-all shadow-lg shadow-red-600/30 hover:-translate-y-0.5"
              >
                <ShoppingCart className="w-4 h-4" />
                İndi Al — Limitli Stok
              </Link>
            </div>

            {/* Right side: image */}
            <div className="relative w-60 h-60 sm:w-72 sm:h-72 shrink-0 animate-float">
              <div className="absolute inset-0 bg-red-500/20 rounded-3xl blur-2xl" />
              <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-red-500/30 shadow-2xl">
                <Image
                  src="/Elden.jpg"
                  alt="Elden Ring"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-600 text-white text-sm font-black px-3 py-1.5 rounded-xl shadow-lg">
                  -15%
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── POPULAR GAMES ─────────────────────────────── */}
      <section className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500 mb-2">
                <Flame className="w-4 h-4" />
                <span>Ən Çox Tələb Olunanlar</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                Populyar <span className="text-red-500">Oyunlar</span>
              </h2>
            </div>
            <Link href="/market" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-red-400 transition-colors group">
              <span>Bütün kataloqa bax</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayGames.map((game) => {
              const isJustAdded = addedId === game.id;
              const stockPct = Math.min(100, Math.round((game.stock / 20) * 100));
              const isLowStock = game.stock <= 5;

              return (
                <article
                  key={game.id}
                  className="bg-slate-900/80 border border-slate-800/70 hover:border-red-500/40 rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] transition-all duration-300 flex flex-col group card-hover"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-800">
                    <Image
                      src={game.image}
                      alt={game.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent opacity-90" />

                    {game.discount && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow tracking-wider">
                        -{game.discount}%
                      </span>
                    )}

                    {game.badge && (
                      <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 text-[10px] font-black px-2.5 py-1 rounded-lg">
                        {game.badge}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 flex flex-col flex-1 gap-3">
                    <div>
                      <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider block mb-1">
                        {game.category}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
                        {game.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <StarRating rating={game.rating} />
                        <span className="text-[11px] text-slate-500">({game.reviews.toLocaleString("en-US")})</span>
                      </div>
                    </div>

                    {/* Stock indicator */}
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                        <span>Stok</span>
                        <span className={isLowStock ? "text-red-400 font-bold" : "text-slate-400"}>
                          {isLowStock ? `⚠ Son ${game.stock} ədəd` : `${game.stock} ədəd qaldı`}
                        </span>
                      </div>
                      <div className="stock-bar" style={{ "--stock-pct": `${stockPct}%` }} />
                    </div>

                    {/* Price & Button */}
                    <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2 mt-auto">
                      <div>
                        {game.originalPrice && (
                          <span className="text-xs text-slate-600 line-through block">
                            {formatPrice(game.originalPrice)}
                          </span>
                        )}
                        <span className="text-xl font-black text-white">
                          {formatPrice(game.price)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(game)}
                        aria-label={`${game.title} səbətə at`}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 active:scale-95 shadow-sm ${
                          isJustAdded
                            ? "bg-emerald-600 text-white"
                            : "bg-red-600 hover:bg-red-500 text-white hover:shadow-[0_0_18px_rgba(239,68,68,0.5)]"
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Əlavə edildi</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            <span>Səbətə at</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PROMO BANNER ─────────────────────────────── */}
      <section className="py-10 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: <Gift className="w-8 h-8 text-purple-400" />,
                title: "İlk Alışa 10% Endirim",
                desc: "Qeydiyyatdan keç, ilk sifarişindən dərhal 10% endirim al.",
                href: "/login",
                border: "border-purple-500/20",
                bg: "from-purple-900/20 to-slate-900/60",
                btn: "bg-purple-600 hover:bg-purple-500",
              },
              {
                icon: <Trophy className="w-8 h-8 text-amber-400" />,
                title: "VIP Oyunçu Proqramı",
                desc: "100 ₼ üstündə alış-verişdə VIP statusa keçin, xüsusi endirimlər alın.",
                href: "/profile",
                border: "border-amber-500/20",
                bg: "from-amber-900/20 to-slate-900/60",
                btn: "bg-amber-600 hover:bg-amber-500 text-slate-900",
              },
              {
                icon: <Users className="w-8 h-8 text-blue-400" />,
                title: "Referral Proqramı",
                desc: "Dostunu dəvət et, hər alışından 5% komissiya qazan.",
                href: "/profile",
                border: "border-blue-500/20",
                bg: "from-blue-900/20 to-slate-900/60",
                btn: "bg-blue-600 hover:bg-blue-500",
              },
            ].map((promo, i) => (
              <div
                key={i}
                className={`relative p-6 rounded-2xl bg-gradient-to-br ${promo.bg} border ${promo.border} overflow-hidden group hover:-translate-y-1 transition-all duration-200`}
              >
                <div className="mb-3">{promo.icon}</div>
                <h3 className="text-base font-bold text-white mb-1.5">{promo.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{promo.desc}</p>
                <Link
                  href={promo.href}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold transition-colors ${promo.btn}`}
                >
                  <span>Ətraflı öyrən</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────── */}
      <section className="py-20 md:py-28 bg-slate-900/30 border-b border-slate-800/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">Niyə Biz?</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Güvənli Alış-Veriş <span className="text-red-500">Zəmanəti</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-600/80 hover:bg-slate-900/90 transition-all duration-300 flex flex-col items-center text-center group card-hover"
                >
                  <div className={`p-4 rounded-2xl ${feature.bg} mb-5 ring-1 group-hover:scale-110 transition-all duration-300`}>
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────── */}
      <section className="py-20 md:py-28 relative border-b border-slate-800/60">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/8 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">Müştəri Rəyləri</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Oyunçularımız <span className="text-red-500">Nə Deyir?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-600/60 transition-all duration-300 flex flex-col gap-4 card-hover"
              >
                {/* Stars */}
                <StarRating rating={t.rating} size="md" />

                {/* Text */}
                <p className="text-sm text-slate-300 leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-800/60">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white">{t.name}</span>
                      <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <span className="text-[11px] text-slate-500">{t.role} · {t.date}</span>
                  </div>
                </div>

                {/* Game badge */}
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <Gamepad2 className="w-3 h-3" />
                  {t.game}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────── */}
      <section className="py-20 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-slate-950 to-slate-900/50 pointer-events-none" />
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/15 border border-amber-500/30 rounded-full mb-6">
            <Gift className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Xüsusi Təklif</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black italic uppercase tracking-tight text-white mb-4">
            İndi Qeydiyyatdan Keç,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              50 ₼ Bonus Al!
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Yeni hesab açan hər oyunçuya 50 ₼ başlanğıc balansı hədiyyə edirik. Bu balansla
            istənilən oyun, kod və ya hesab ala bilərsiniz.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/login"
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-amber-600/30 hover:-translate-y-1"
            >
              Pulsuz Qeydiyyat
            </Link>
            <Link
              href="/market"
              className="px-10 py-4 rounded-2xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800/80 text-white font-semibold text-sm transition-all hover:-translate-y-0.5 backdrop-blur-md"
            >
              Kataloqa Bax
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-slate-500">
            {[
              { icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />, text: "Kart məlumatları saxlanılmır" },
              { icon: <Zap className="w-3.5 h-3.5 text-yellow-400" />, text: "Anında çatdırılma" },
              { icon: <Clock className="w-3.5 h-3.5 text-blue-400" />, text: "7/24 Müştəri dəstəyi" },
              { icon: <Tag className="w-3.5 h-3.5 text-red-400" />, text: "Ən aşağı qiymət zəmanəti" },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-1.5">
                {badge.icon}
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
