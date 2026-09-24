"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import {
  ShoppingCart,
  Check,
  Search,
  SlidersHorizontal,
  Gamepad2,
  Zap,
  Star,
  BadgeCheck,
  X,
  ArrowUpDown,
  Flame,
  Filter,
} from "lucide-react";

// Extended games data
const GAMES_DATA = [
  {
    id: 1,
    title: "Valorant Points (VP)",
    price: 12.0,
    originalPrice: null,
    cat: "PC",
    image: "/Valorant.webp",
    badge: "Populyar",
    badgeColor: "bg-red-600",
    rating: 4.9,
    reviews: 3820,
    stock: 999,
    instant: true,
    featured: true,
  },
  {
    id: 2,
    title: "PUBG Mobile UC",
    price: 5.5,
    originalPrice: null,
    cat: "Mobile",
    image: "/Pubg.webp",
    badge: "Çox Satılan",
    badgeColor: "bg-amber-500",
    rating: 4.8,
    reviews: 5241,
    stock: 999,
    instant: true,
    featured: true,
  },
  {
    id: 3,
    title: "Steam Gift Card",
    price: 20.0,
    originalPrice: null,
    cat: "PC",
    image: "/Steam.webp",
    badge: "Rəsmi",
    badgeColor: "bg-blue-600",
    rating: 4.7,
    reviews: 2100,
    stock: 150,
    instant: true,
    featured: false,
  },
  {
    id: 4,
    title: "Free Fire Diamonds",
    price: 3.2,
    originalPrice: 4.0,
    cat: "Mobile",
    image: "/Fire.webp",
    badge: "-20%",
    badgeColor: "bg-rose-600",
    rating: 4.6,
    reviews: 1850,
    stock: 999,
    instant: true,
    featured: false,
  },
  {
    id: 5,
    title: "PlayStation Plus 1 Month",
    price: 18.0,
    originalPrice: 22.0,
    cat: "Console",
    image: "/PSPlus.webp",
    badge: "Endirim",
    badgeColor: "bg-indigo-600",
    rating: 4.8,
    reviews: 960,
    stock: 45,
    instant: true,
    featured: true,
  },
  {
    id: 6,
    title: "Minecraft Java Edition",
    price: 45.0,
    originalPrice: null,
    cat: "PC",
    image: "/Minecraft.webp",
    badge: "Açar Kod",
    badgeColor: "bg-emerald-600",
    rating: 4.9,
    reviews: 7640,
    stock: 30,
    instant: true,
    featured: false,
  },
  {
    id: 7,
    title: "EA Sports FC 24",
    price: 79.99,
    originalPrice: 99.99,
    cat: "PC",
    image: "/EA.jpg",
    badge: "-20%",
    badgeColor: "bg-rose-600",
    rating: 4.8,
    reviews: 2341,
    stock: 15,
    instant: true,
    featured: false,
  },
  {
    id: 8,
    title: "Elden Ring",
    price: 55.5,
    originalPrice: 65.0,
    cat: "PC",
    image: "/Elden.jpg",
    badge: "-15%",
    badgeColor: "bg-rose-600",
    rating: 5.0,
    reviews: 9012,
    stock: 4,
    instant: true,
    featured: true,
  },
  {
    id: 9,
    title: "Cyberpunk 2077",
    price: 45.0,
    originalPrice: null,
    cat: "PC",
    image: "/Cyberpunk.jpg",
    badge: "Tövsiyə",
    badgeColor: "bg-yellow-600",
    rating: 4.9,
    reviews: 5820,
    stock: 8,
    instant: true,
    featured: false,
  },
  {
    id: 10,
    title: "Hogwarts Legacy",
    price: 65.0,
    originalPrice: null,
    cat: "PC",
    image: "/Hogwarts.jpg",
    badge: null,
    badgeColor: null,
    rating: 4.7,
    reviews: 3156,
    stock: 20,
    instant: true,
    featured: false,
  },
];

const CATEGORIES = [
  { id: "All", label: "Bütün Məhsullar", icon: "🎮" },
  { id: "PC", label: "PC Oyunları", icon: "🖥️" },
  { id: "Mobile", label: "Mobil", icon: "📱" },
  { id: "Console", label: "Konsol", icon: "🕹️" },
];

const formatPrice = (amount) => `${Number(amount).toFixed(2)} AZN`;

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3 h-3 ${s <= Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-slate-700"}`}
        />
      ))}
    </div>
  );
}

export default function MarketPage() {
  const [selectedCat, setSelectedCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [justAddedId, setJustAddedId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const { addToCart, cartItems = [] } = useCart();
  const { games = [] } = useStore();
  const isInCart = (id) => cartItems.some((item) => item.id === id);

  const displayGames = games.length > 0 ? games : GAMES_DATA;

  const filteredAndSortedGames = useMemo(() => {
    let result = displayGames.filter((game) => {
      const catMatches = game.cat ? game.cat : (game.platform === "Steam" || game.platform === "PC" ? "PC" : "Console");
      const matchesCategory = selectedCat === "All" || catMatches === selectedCat;
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "popular") result.sort((a, b) => b.reviews - a.reviews);

    return result;
  }, [selectedCat, searchQuery, sortBy, displayGames]);

  const handleAddToCart = (game) => {
    addToCart({
      id: game.id,
      title: game.title,
      category: game.cat,
      price: game.price,
      image: game.image,
    });
    setJustAddedId(game.id);
    setTimeout(() => setJustAddedId(null), 1500);
  };

  const featuredGames = GAMES_DATA.filter((g) => g.featured).slice(0, 3);

  return (
    <main className="bg-[#090d16] min-h-screen text-slate-100 pb-24 selection:bg-red-500 selection:text-white">

      {/* Header Banner */}
      <section className="relative py-14 md:py-20 bg-slate-900/30 border-b border-slate-800/60 overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/12 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-4 text-xs font-bold tracking-wider text-red-400 uppercase bg-red-950/40 border border-red-800/40 rounded-full">
                <Gamepad2 className="w-3.5 h-3.5 text-red-500" />
                <span>Rəqəmsal Oyun Mağazası</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tight">
                OYUN{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">
                  MAĞAZASI
                </span>
              </h1>
              <p className="text-slate-400 mt-3 text-sm max-w-xl">
                Lisenziyalı rəqəmsal kodlar, oyun valyutaları və açarlar anında çatdırılma ilə.
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
              {[
                { val: "10+", label: "Məhsul" },
                { val: "5000+", label: "Müştəri" },
                { val: "4.9★", label: "Reytinq" },
              ].map((s, i) => (
                <div key={i} className="text-center bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2">
                  <div className="text-lg font-black text-white">{s.val}</div>
                  <div className="text-[10px] text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-2">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-4 h-4 text-red-500" />
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Öne Çıxanlar</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {featuredGames.map((game) => (
            <div
              key={game.id}
              className="relative rounded-2xl overflow-hidden border border-slate-800/60 hover:border-red-500/40 transition-all duration-200 group cursor-pointer"
              onClick={() => handleAddToCart(game)}
            >
              <div className="relative h-32">
                <Image src={game.image} alt={game.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/50 to-transparent" />
              </div>
              <div className="absolute inset-0 flex flex-col justify-center px-5">
                {game.badge && (
                  <span className={`inline-block mb-1 text-[10px] font-black px-2 py-0.5 rounded-full ${game.badgeColor} text-white w-fit`}>
                    {game.badge}
                  </span>
                )}
                <h3 className="text-sm font-bold text-white">{game.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-base font-black text-white">{formatPrice(game.price)}</span>
                  {game.originalPrice && (
                    <span className="text-[11px] text-slate-500 line-through">{formatPrice(game.originalPrice)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-4">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-sm font-semibold"
          >
            <Filter className="w-4 h-4 text-red-500" />
            <span>Filtrlər</span>
            {showFilters ? <X className="w-4 h-4 ml-auto" /> : null}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Filters */}
          <aside className={`w-full lg:w-64 shrink-0 space-y-5 ${showFilters ? "block" : "hidden lg:block"}`}>
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Oyun və ya kod axtar..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-red-500" />
                <span>Kateqoriya</span>
              </h3>
              <div className="space-y-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCat(cat.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all text-xs font-bold flex items-center gap-3 cursor-pointer ${
                      selectedCat === cat.id
                        ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span>{cat.label}</span>
                    {selectedCat === cat.id && <Zap size={12} fill="currentColor" className="ml-auto" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <ArrowUpDown size={14} className="text-red-500" />
                Sıralama
              </h3>
              <div className="space-y-1.5">
                {[
                  { val: "default", label: "Standart" },
                  { val: "popular", label: "Ən Populyar" },
                  { val: "rating", label: "Ən Yüksək Reytinq" },
                  { val: "price-asc", label: "Ucuzdan Bahaya" },
                  { val: "price-desc", label: "Bahadan Ucuza" },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setSortBy(opt.val)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl transition-all text-xs font-semibold cursor-pointer ${
                      sortBy === opt.val
                        ? "bg-slate-700 text-white"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust badge */}
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-400">
              <BadgeCheck className="w-5 h-5 mb-2" />
              <p className="font-bold mb-1">100% Rəsmi Kodlar</p>
              <p className="text-emerald-600">Bütün məhsullar rəsmi distribyutorlardan təmin edilir.</p>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 w-full">
            {/* Result bar */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800 text-xs text-slate-400">
              <span>
                Tapılan:{" "}
                <strong className="text-white text-sm">{filteredAndSortedGames.length}</strong> məhsul
              </span>
              <span className="text-[11px] uppercase font-bold text-red-400 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Anında Çatdırılma
              </span>
            </div>

            {filteredAndSortedGames.length === 0 ? (
              <div className="text-center py-24 bg-slate-900/40 rounded-3xl border border-slate-800">
                <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">Məhsul Tapılmadı</h3>
                <p className="text-slate-400 text-xs">Axtarış sözünü dəyişərək yenidən yoxlayın.</p>
                <button
                  type="button"
                  onClick={() => { setSearchQuery(""); setSelectedCat("All"); }}
                  className="mt-4 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
                >
                  Filtrləri Sıfırla
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredAndSortedGames.map((game) => {
                  const inCart = isInCart(game.id) || justAddedId === game.id;
                  const isLowStock = game.stock < 10 && game.stock !== 999;

                  return (
                    <article
                      key={game.id}
                      className="bg-slate-900/80 border border-slate-800/70 rounded-2xl overflow-hidden hover:border-red-500/40 transition-all duration-300 flex flex-col group shadow-lg hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)] card-hover"
                    >
                      {/* Image */}
                      <div className="h-44 overflow-hidden relative bg-slate-950">
                        <Image
                          src={game.image}
                          alt={game.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                        {/* Category tag */}
                        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-200 border border-white/10 z-10">
                          {game.cat}
                        </div>

                        {/* Badge */}
                        {game.badge && (
                          <div className={`absolute top-3 right-3 ${game.badgeColor} text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow z-10`}>
                            {game.badge}
                          </div>
                        )}

                        {/* Low stock warning */}
                        {isLowStock && (
                          <div className="absolute bottom-3 left-3 bg-red-950/90 border border-red-500/30 text-red-400 text-[10px] font-bold px-2.5 py-1 rounded-lg z-10">
                            ⚠ Son {game.stock} ədəd
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="p-5 flex flex-col flex-1 gap-3">
                        <div>
                          <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors truncate mb-1.5">
                            {game.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <StarRating rating={game.rating} />
                            <span className="text-[11px] text-slate-500">{game.rating} ({game.reviews.toLocaleString("en-US")})</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                          <Zap size={11} className="shrink-0" />
                          <span>Anında avtomatik çatdırılma</span>
                        </div>

                        {/* Price & Button */}
                        <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2 mt-auto">
                          <div>
                            {game.originalPrice && (
                              <span className="text-[10px] text-slate-600 line-through block">
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
                            className={`px-4 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider transition-all flex items-center gap-1.5 active:scale-95 shadow-sm ${
                              inCart
                                ? "bg-emerald-600 text-white"
                                : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                            }`}
                          >
                            {inCart ? (
                              <>
                                <Check size={13} strokeWidth={2.5} />
                                <span>Əlavə Edildi</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart size={13} />
                                <span>Sifariş Et</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Bottom CTA */}
            <div className="mt-12 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <p className="text-sm text-slate-400 mb-3">Axtardığınızı tapmadınız?</p>
              <Link
                href="/support"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600/20 hover:bg-red-600 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-white font-bold text-xs transition-all duration-200"
              >
                <Gamepad2 className="w-4 h-4" />
                Xüsusi Sifariş Ver
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
