"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Send,
  CheckCircle2,
  Instagram,
  MessageSquare,
  ShieldCheck,
  Zap,
  Clock,
  Star,
  ArrowRight,
  Gamepad2,
} from "lucide-react";

const SHOP_LINKS = [
  { href: "/market", label: "Bütün Oyunlar" },
  { href: "/accounts", label: "Oyun Hesabları" },
  { href: "/game-cards", label: "Game Cards" },
  { href: "/topup", label: "Balans Artır" },
  { href: "/discounts", label: "Endirimlər" },
];

const SUPPORT_LINKS = [
  { href: "/faq", label: "FAQ — Sual Cavab" },
  { href: "/terms", label: "İstifadə Şərtləri" },
  { href: "/privacy", label: "Məxfilik Siyasəti" },
  { href: "/contact", label: "Bizimlə Əlaqə" },
  { href: "/support", label: "Texniki Dəstək" },
];

const TRUST_BADGES = [
  { icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />, text: "SSL Şifrələnmiş" },
  { icon: <Zap className="w-4 h-4 text-yellow-400" />, text: "Anında Çatdırılma" },
  { icon: <Star className="w-4 h-4 fill-amber-400 text-amber-400" />, text: "4.9 / 5 Reytinq" },
  { icon: <Clock className="w-4 h-4 text-blue-400" />, text: "7/24 Dəstək" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setEmail("");
    setTimeout(() => setIsSubscribed(false), 4000);
  };

  return (
    <footer className="bg-[#060a12] text-slate-400 border-t border-slate-800/60">
      {/* Trust bar */}
      <div className="border-b border-slate-800/60 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center sm:justify-between items-center gap-4 sm:gap-6 text-xs font-medium">
            {TRUST_BADGES.map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-400">
                {badge.icon}
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="space-y-5">
            <Link
              href="/"
              className="text-2xl font-black tracking-tight italic uppercase text-white inline-flex items-center gap-1 group"
            >
              <span>GAME</span>
              <span className="text-red-500 group-hover:scale-110 transition-transform duration-200">X</span>
              <span>STORE</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500">
              Azərbaycanın ən sürətli və etibarlı rəqəmsal oyun lisenziyaları,
              hesablar və balans doldurma platforması. Sizin üçün 7/24 xidmətdəyik.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                {
                  href: "https://instagram.com",
                  label: "Instagram",
                  icon: <Instagram size={16} />,
                  color: "hover:bg-pink-600/20 hover:border-pink-500/40 hover:text-pink-400",
                },
                {
                  href: "https://discord.com",
                  label: "Discord",
                  icon: <MessageSquare size={16} />,
                  color: "hover:bg-indigo-600/20 hover:border-indigo-500/40 hover:text-indigo-400",
                },
                {
                  href: "https://telegram.org",
                  label: "Telegram",
                  icon: <Send size={16} />,
                  color: "hover:bg-blue-600/20 hover:border-blue-500/40 hover:text-blue-400",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`p-2.5 rounded-xl border border-slate-700/60 text-slate-500 transition-all duration-200 ${social.color}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Rating display */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="flex">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
              </div>
              <span><strong className="text-white font-bold">4.9/5</strong> — 5000+ rəy əsasında</span>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-xs flex items-center gap-2">
              <Gamepad2 className="w-3.5 h-3.5 text-red-500" />
              Mağaza
            </h4>
            <ul className="space-y-3 text-sm">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-red-400 transition-colors duration-150 inline-flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-red-500" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-xs flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Məlumat & Dəstək
            </h4>
            <ul className="space-y-3 text-sm">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-red-400 transition-colors duration-150 inline-flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-red-500" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-xs">
              Yeniliklərdən Xəbərdar Ol
            </h4>
            <p className="text-xs mb-4 text-slate-500 leading-relaxed">
              Xüsusi kampaniyalar, endirimli oyunlar və eksklüziv kodlar üçün abunə olun.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-poçt ünvanınız"
                  required
                  className="bg-slate-900 border border-slate-700 border-r-0 text-white px-3.5 py-2.5 rounded-l-xl focus:outline-none focus:border-red-500 w-full text-sm placeholder-slate-600 transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Abunə ol"
                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-r-xl transition-colors text-sm font-semibold flex items-center justify-center shrink-0 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {isSubscribed && (
                <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Uğurla abunə olundunuz!</span>
                </p>
              )}
            </form>

            {/* Payment methods */}
            <div className="mt-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-3">
                Qəbul Edilən Ödəniş Üsulları
              </p>
              <div className="flex flex-wrap gap-2">
                {["VISA", "MC", "M10", "Kapital", "Birbank"].map((method) => (
                  <span
                    key={method}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[10px] font-bold text-slate-400"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-600">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-red-500 font-semibold">GAMEXSTORE</span>.
            Bütün hüquqlar qorunur.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Məxfilik</Link>
            <span className="text-slate-800">|</span>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Şərtlər</Link>
            <span className="text-slate-800">|</span>
            <Link href="/contact" className="hover:text-slate-400 transition-colors">Əlaqə</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
