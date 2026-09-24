"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, User, ShieldCheck, Wallet } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

// Menyu linkləri
const NAV_LINKS = [
  { href: "/market", label: "Mağaza" },
  { href: "/accounts", label: "Hesablar" },
  { href: "/game-cards", label: "Game Cards" },
  { href: "/topup", label: "Balans" },
  { href: "/support", label: "Dəstək" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { cartItems = [] } = useCart();
  const { user } = useAuth();

  // Səhifə dəyişdikdə menyunu təhlükəsiz bağlayırıq (React Compiler qaydalarına uyğun)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  // Səbətdəki ümumi məhsul sayı
  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );

  // Aktiv link yoxlanışı
  const isActive = (path) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#090d16]/95 backdrop-blur-md border-b border-red-500/20 text-white shadow-xl shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Loqo */}
          <div className="shrink-0 flex items-center">
            <Link
              href="/"
              className="text-2xl font-black tracking-tighter italic uppercase group inline-flex items-center gap-1"
            >
              <span>GAME</span>
              <span className="text-red-500 text-3xl not-italic group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(239,68,68,0.8)] transition-all duration-200">
                X
              </span>
              <span>STORE</span>
            </Link>
          </div>

          {/* Desktop Menyu */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-all duration-200 px-3 py-1.5 rounded-lg ${
                    active
                      ? "text-red-500 font-extrabold bg-red-500/10 shadow-inner"
                      : "text-slate-300 hover:text-white hover:bg-slate-900/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Səbət və Giriş/Profil */}
          <div className="hidden md:flex items-center space-x-5">
            <Link
              href="/cart"
              aria-label="Səbət"
              className="relative p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-colors group cursor-pointer"
            >
              <ShoppingCart className="w-6 h-6 group-hover:text-red-500 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-black h-4 min-w-4 px-1 flex items-center justify-center rounded-full animate-bounce shadow-[0_0_10px_rgba(239,68,68,0.6)] ring-2 ring-[#090d16]">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="px-3.5 py-2 rounded-xl bg-red-600/10 border border-red-500/40 text-red-400 hover:bg-red-600 hover:text-white transition-all text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <ShieldCheck size={14} />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-all text-xs font-bold flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-red-500" />
                  <span className="max-w-[120px] truncate">{user.name || user.fullName}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {(Number(user.balance) || 0).toFixed(2)} ₼
                  </span>
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-xl border border-red-500/80 bg-red-500/5 hover:bg-red-600 hover:text-white text-red-400 transition-all text-xs font-black uppercase tracking-wider active:scale-95 shadow-md hover:shadow-red-600/20 inline-flex items-center gap-2 cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Giriş</span>
              </Link>
            )}
          </div>

          {/* Mobil İkonlar */}
          <div className="md:hidden flex items-center gap-3">
            <Link
              href="/cart"
              aria-label="Səbət"
              className="relative p-2 text-slate-300 hover:text-white cursor-pointer"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-[#090d16]">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="Menyunu aç və ya bağla"
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6 text-red-500" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobil Menyu */}
      {isOpen && (
        <div className="md:hidden bg-[#090d16]/98 border-t border-slate-800/80 px-4 pt-3 pb-6 space-y-2 backdrop-blur-2xl">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-red-500/10 text-red-500 border border-red-500/20"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block w-full py-3 text-center bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-wider"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white"
                >
                  <span className="flex items-center gap-2">
                    <User size={14} className="text-red-500" />
                    {user.name || user.fullName}
                  </span>
                  <span className="text-emerald-400">
                    {(Number(user.balance) || 0).toFixed(2)} ₼
                  </span>
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full py-3 text-center bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-red-600/30"
              >
                Daxil Ol / Qeydiyyat
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
