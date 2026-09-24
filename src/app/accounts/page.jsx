"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import {
  Trophy,
  Globe,
  Star,
  Zap,
  Plus,
  X,
  ShoppingCart,
  Check,
  Search,
  SlidersHorizontal,
  Flame,
} from "lucide-react";

const INITIAL_ACCOUNTS = [
  {
    id: 101,
    game: "PUBG Mobile",
    rank: "Conqueror",
    skins: "M416 Glacier (Max), X-Suit",
    level: "78",
    price: 450.0,
    img: "/PUBGMobile.jpg",
    region: "Global",
    status: "Premium",
  },
  {
    id: 102,
    game: "Valorant",
    rank: "Ascendant 3",
    skins: "25+ Premium Skins",
    level: "142",
    price: 120.0,
    img: "/Valorant_Reyna.jpg",
    region: "EU",
    status: "Satılır",
  },
  {
    id: 103,
    game: "League of Legends",
    rank: "Diamond 1",
    skins: "110 Skins",
    level: "320",
    price: 250.0,
    img: "/League.png",
    region: "TR",
    status: "Yeni",
  },
  {
    id: 104,
    game: "Brawl Stars",
    rank: "45K Trophies",
    skins: "Legendary Skins",
    level: "210",
    price: 85.0,
    img: "/BrawlStars.webp",
    region: "Global",
    status: "Satılır",
  },
];

const GAME_FILTERS = [
  "Hamısı",
  "PUBG Mobile",
  "Valorant",
  "League of Legends",
  "Brawl Stars",
];

const formatPrice = (amount) => `${Number(amount).toFixed(2)} AZN`;

export default function AccountsPage() {
  const { addToCart } = useCart();
  const { accounts: storeAccounts = [] } = useStore();
  const [localAccounts, setLocalAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addedId, setAddedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Hamısı");

  // Form State
  const [newGame, setNewGame] = useState({
    game: "",
    rank: "",
    skins: "",
    level: "",
    price: "",
    region: "Global",
    img: "/PubgMobile.jpg",
  });

  const displayAccounts = [
    ...localAccounts,
    ...(storeAccounts.length > 0 ? storeAccounts : INITIAL_ACCOUNTS),
  ];

  // Səbətə atma
  const handleAddToCart = (acc) => {
    addToCart({
      id: acc.id,
      title: `${acc.game} (${acc.rank})`,
      category: "Oyun Hesabı",
      price:
        typeof acc.price === "number" ? acc.price : parseFloat(acc.price) || 0,
      image: acc.img || acc.image || null,
    });
    setAddedId(acc.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  // Yeni hesab əlavə etmə
  const handleAddAccount = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now(),
      ...newGame,
      price: parseFloat(newGame.price) || 0,
      status: "Yeni",
    };

    setLocalAccounts((prev) => [newEntry, ...prev]);

    setNewGame({
      game: "",
      rank: "",
      skins: "",
      level: "",
      price: "",
      region: "Global",
      img: "/PUBGMobile.jpg",
    });
    setIsModalOpen(false);
  };

  // Filtrlənmiş hesablar
  const filteredAccounts = displayAccounts.filter((acc) => {
    const matchesCategory =
      selectedFilter === "Hamısı" ||
      acc.game.toLowerCase().includes(selectedFilter.toLowerCase());
    const matchesSearch =
      acc.game.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.rank.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.skins.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="bg-[#090d16] min-h-screen text-slate-100 pb-24 selection:bg-red-500 selection:text-white">
      {/* 1. Üst Header */}
      <section className="relative py-20 md:py-28 flex items-center justify-center overflow-hidden border-b border-slate-800/80">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-red-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 text-xs font-bold tracking-wider text-red-400 uppercase bg-red-950/40 border border-red-800/40 rounded-full">
            <Flame className="w-3.5 h-3.5 text-red-500" />
            <span>TƏSDİQLƏNMİŞ VƏ GÜVƏNLİ PROFİLLƏR</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black italic tracking-tight uppercase">
            VIP{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500">
              Hesablar
            </span>
          </h1>
          <p className="text-slate-400 mt-4 text-sm sm:text-base max-w-xl mx-auto">
            Nadir silahlar, yüksək dərəcələr və eksklüziv kostyumlarla təchiz
            edilmiş təhlükəsiz oyun hesabları.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3.5 px-7 rounded-xl transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] inline-flex items-center gap-2 active:scale-95 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Hesabını Sat / Elan Yerləşdir</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Axtarış və Filtrlər */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-6 border-b border-slate-800/80">
          {/* Axtarış input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Hesab və ya skin axtar..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors placeholder-slate-500"
            />
          </div>

          {/* Kateqoriya Düymələri */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto pb-1">
            {GAME_FILTERS.map((game) => (
              <button
                key={game}
                type="button"
                onClick={() => setSelectedFilter(game)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedFilter === game
                    ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                    : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                }`}
              >
                {game}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Hesablar Grid-i */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {filteredAccounts.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800">
            <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">
              Axtarışa uyğun hesab tapılmadı
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Digər kateqoriyalara və ya axtarış sözünə baxın.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAccounts.map((acc) => {
              const isAdded = addedId === acc.id;

              const imgSrc = acc.img || acc.image || null;

              return (
                <article
                  key={acc.id}
                  className="bg-slate-900/80 rounded-3xl border border-slate-800/80 overflow-hidden hover:border-red-500/40 transition-all duration-300 group flex flex-col shadow-xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
                >
                  {/* Şəkil və Etiketlər */}
                  <div className="relative h-52 bg-slate-950 w-full overflow-hidden">
                    {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={`${acc.game} hesabı`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-108 transition-all duration-500"
                    />
                    ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      <span className="text-5xl">🎮</span>
                    </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />

                    {/* Status Etiketi */}
                    <span className="absolute top-3.5 left-3.5 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider shadow-md z-20">
                      {acc.status}
                    </span>

                    {/* Region */}
                    <div className="absolute bottom-3 left-4 z-20">
                      <span className="bg-slate-950/80 backdrop-blur-md border border-white/10 text-slate-200 text-[11px] px-2.5 py-1 rounded-md font-bold uppercase inline-flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-400" />
                        <span>{acc.region}</span>
                      </span>
                    </div>
                  </div>

                  {/* Detallar */}
                  <div className="p-6 flex flex-col grow justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-white group-hover:text-red-400 transition-colors">
                        {acc.game}
                      </h3>

                      {/* Rank və Səviyyə */}
                      <div className="grid grid-cols-2 gap-3 mt-5 mb-5">
                        <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
                          <p className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5 mb-1">
                            <Trophy className="w-3.5 h-3.5 text-red-500" />
                            <span>Rütbə</span>
                          </p>
                          <p
                            className="text-sm font-extrabold text-red-400 truncate"
                            title={acc.rank}
                          >
                            {acc.rank}
                          </p>
                        </div>

                        <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
                          <p className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5 mb-1">
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            <span>Səviyyə</span>
                          </p>
                          <p className="text-sm font-extrabold text-white">
                            {acc.level} LVL
                          </p>
                        </div>
                      </div>

                      {/* Skinlər */}
                      <div className="flex items-center gap-2 mb-6 text-slate-300 text-xs font-medium bg-slate-950/40 p-2.5 rounded-xl border border-slate-850">
                        <Star className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="truncate" title={acc.skins}>
                          {acc.skins}
                        </span>
                      </div>
                    </div>

                    {/* Qiymət və Səbət Düyməsi */}
                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">
                          Qiymət
                        </p>
                        <p className="text-2xl font-black text-white tracking-tight">
                          {formatPrice(acc.price)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(acc)}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-sm ${
                          isAdded
                            ? "bg-emerald-600 text-white"
                            : "bg-red-600 hover:bg-red-500 text-white shadow-red-600/20 shadow-lg"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Səbətdədir</span>
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
        )}
      </section>

      {/* 4. Hesab Yerləşdirmə Modalı (Popup) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-800 p-6 sm:p-8 relative shadow-2xl">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800 p-2 rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            <h2 className="text-2xl font-black italic uppercase mb-6 text-white">
              Hesab Satışa <span className="text-red-500">Yerləşdir</span>
            </h2>

            <form onSubmit={handleAddAccount} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-bold uppercase block mb-1.5">
                  Oyunun Adı
                </label>
                <input
                  type="text"
                  placeholder="Məs: Valorant, PUBG Mobile"
                  required
                  value={newGame.game}
                  onChange={(e) =>
                    setNewGame({ ...newGame, game: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase block mb-1.5">
                    Rütbə (Rank)
                  </label>
                  <input
                    type="text"
                    placeholder="Məs: Conqueror, Diamond"
                    required
                    value={newGame.rank}
                    onChange={(e) =>
                      setNewGame({ ...newGame, rank: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase block mb-1.5">
                    Səviyyə (LVL)
                  </label>
                  <input
                    type="number"
                    placeholder="Məs: 75"
                    required
                    value={newGame.level}
                    onChange={(e) =>
                      setNewGame({ ...newGame, level: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold uppercase block mb-1.5">
                  Skinlər və Xüsusiyyətlər
                </label>
                <input
                  type="text"
                  placeholder="Məs: M416 Glacier, Prime Vandal"
                  required
                  value={newGame.skins}
                  onChange={(e) =>
                    setNewGame({ ...newGame, skins: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase block mb-1.5">
                    Qiymət (AZN)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Məs: 150"
                    required
                    value={newGame.price}
                    onChange={(e) =>
                      setNewGame({ ...newGame, price: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase block mb-1.5">
                    Region
                  </label>
                  <input
                    type="text"
                    placeholder="Məs: Global, EU, TR"
                    required
                    value={newGame.region}
                    onChange={(e) =>
                      setNewGame({ ...newGame, region: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-wider py-4 rounded-xl transition-all shadow-lg shadow-red-600/30 active:scale-95 text-sm cursor-pointer"
              >
                Elanı Yerləşdir
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
