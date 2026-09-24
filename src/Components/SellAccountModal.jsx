"use client";

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CloseIcon, CrownIcon, ShieldCheckIcon } from './Icons';

export default function SellAccountModal() {
  const {
    user,
    isSellModalOpen,
    setIsSellModalOpen,
    refreshAccounts,
    showToast
  } = useStore();

  const [game, setGame] = useState('Valorant');
  const [title, setTitle] = useState('');
  const [rank, setRank] = useState('');
  const [region, setRegion] = useState('EU (Türkiyə/Avropa)');
  const [price, setPrice] = useState('');
  const [contact, setContact] = useState('');
  const [inventory, setInventory] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isSellModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !price) {
      showToast("Başlıq və qiymət mütləqdir!", "error");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game,
          title: title.trim(),
          rank: rank.trim() || "Qeyd olunmayıb",
          region: region.trim() || "Qlobal",
          price: Number(price),
          contact: contact.trim() || user?.email || "",
          inventory: inventory.trim(),
          createdBy: user?.email || user?.name || "İstifadəçi",
          isUserCreated: true,
          credentials: {
            username: username.trim() || "login_alqı_zamanı_təhvil",
            password: password.trim() || "parol_alqı_zamanı_təhvil",
            mailAccess: "Tam e-poçt dəyişməsi zəmanəti"
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast("Hesabınız uğurla satışa çıxarıldı və vitrində yerləşdirildi!", "success");
        refreshAccounts();
        setIsSellModalOpen(false);
        setTitle('');
        setRank('');
        setPrice('');
        setInventory('');
        setUsername('');
        setPassword('');
      } else {
        showToast(data.error || "Hesab əlavə edilərkən xəta", "error");
      }
    } catch (err) {
      showToast("Server xətası baş verdi", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="max-w-lg w-full bg-[#0d1222] border border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={() => setIsSellModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <CrownIcon className="w-4 h-4 text-amber-400" />
            <span>Hesabını Satışa Qoy</span>
          </div>
          <h3 className="text-2xl font-black text-white">Öz Oyun Hesabını Sat</h3>
          <p className="text-xs text-slate-400">
            Hesabınız yoxlanılaraq dərhal vitrinə yerləşdiriləcək. Satış baş tutduqda məbləğ birbaşa şəxsi balansınıza köçürülür.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Oyun Növü</label>
              <select
                value={game}
                onChange={(e) => setGame(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="Valorant">Valorant</option>
                <option value="Counter-Strike 2">Counter-Strike 2</option>
                <option value="Steam">Steam (Oyunlu)</option>
                <option value="GTA V">GTA V Online</option>
                <option value="Brawl Stars">Brawl Stars</option>
                <option value="PUBG Mobile">PUBG Mobile</option>
                <option value="Digər Oyun">Digər Oyun</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Qiymət (AZN)</label>
              <input
                type="number"
                step="0.5"
                required
                placeholder="Məs: 45.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Elanın Başlığı</label>
            <input
              type="text"
              required
              placeholder="Məs: Valorant Immortal 2 — Kuronami Vandal + Bıçaq"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Rütbə / Rank / Səviyyə</label>
              <input
                type="text"
                placeholder="Məs: Immortal 3 və ya 50 Level"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Region</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Dərilər / Nadir Əşyalar (Vergüllə ayırın)</label>
            <input
              type="text"
              placeholder="Məs: Kuronami Vandal, Prime Vandal, Oni Claw"
              value={inventory}
              onChange={(e) => setInventory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
              <ShieldCheckIcon className="w-4 h-4" />
              <span>Alıcıya Veriləcək Giriş Məlumatları (Məxfi Saxlanılır):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Hesab Logini / Mail</label>
                <input
                  type="text"
                  placeholder="login@email.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Hesab Şifrəsi</label>
                <input
                  type="text"
                  placeholder="Gizli şifrə"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:opacity-95 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Əlavə edilir..." : "Hesabı Vitrinə Əlavə Et 👑"}
          </button>
        </form>

      </div>
    </div>
  );
}
