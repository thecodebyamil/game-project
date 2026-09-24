"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Mail,
  Lock,
  LogIn,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Loader2,
  ShieldAlert,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "";

  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (isLogin) {
        const loggedUser = await login(formData.email.trim(), formData.password);
        setSuccessMsg(`Xoş gəldiniz, ${loggedUser.name || loggedUser.fullName}!`);
        setTimeout(() => {
          if (redirectUrl) {
            router.push(redirectUrl);
          } else if (loggedUser.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/profile");
          }
        }, 600);
      } else {
        const newUser = await register(
          formData.name.trim(),
          formData.email.trim(),
          formData.password
        );
        setSuccessMsg("Qeydiyyat uğurla tamamlandı! 50 ₼ bonus balans hədiyyə edildi.");
        setTimeout(() => {
          if (redirectUrl) {
            router.push(redirectUrl);
          } else if (newUser.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/profile");
          }
        }, 800);
      }
    } catch (err) {
      setErrorMsg(err.message || "Giriş zamanı xəta baş verdi.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (email, password) => {
    setFormData((prev) => ({ ...prev, email, password }));
    setIsLogin(true);
  };

  return (
    <div className="bg-slate-900/90 w-full max-w-md rounded-3xl border border-slate-800/90 shadow-[0_15px_50px_rgba(0,0,0,0.8)] overflow-hidden relative z-10 backdrop-blur-xl">
      {/* Keçid Düymələri */}
      <div className="flex border-b border-slate-800 bg-slate-950/60">
        <button
          type="button"
          onClick={() => {
            setIsLogin(true);
            setErrorMsg("");
            setSuccessMsg("");
          }}
          className={`flex-1 py-4 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
            isLogin
              ? "text-red-500 bg-red-500/10 border-red-500"
              : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40"
          }`}
        >
          Daxil Ol
        </button>
        <button
          type="button"
          onClick={() => {
            setIsLogin(false);
            setErrorMsg("");
            setSuccessMsg("");
          }}
          className={`flex-1 py-4 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
            !isLogin
              ? "text-red-500 bg-red-500/10 border-red-500"
              : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40"
          }`}
        >
          Yeni Hesab Aç
        </button>
      </div>

      <div className="p-6 sm:p-8">
        {/* Başlıq */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 text-[11px] font-bold text-red-400 bg-red-950/50 border border-red-800/40 rounded-full">
            <Sparkles className="w-3 h-3 text-red-500" />
            <span>TƏHLÜKƏSİZ QEYMİNQ HESABI</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight text-white">
            {isLogin ? "XOŞ" : "YENİ"}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">
              {isLogin ? "GƏLDİNİZ" : "QEYDİYYAT"}
            </span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5">
            {isLogin
              ? "Oyun dünyasına daxil olmaq üçün məlumatlarınızı qeyd edin."
              : "Yeni imkanlardan və endirimlərdən yararlanmaq üçün qeydiyyatdan keçin."}
          </p>
        </div>

        {/* Xəta Bildirişi */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Uğur Bildirişi */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative group">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Adınız və Soyadınız"
                required={!isLogin}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-3 pl-11 pr-4 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 text-sm text-white placeholder-slate-500 transition-all"
              />
            </div>
          )}

          {/* E-poçt */}
          <div className="relative group">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors"
              size={18}
            />
            <input
              type="email"
              placeholder="E-poçt ünvanınız"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-3 pl-11 pr-4 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 text-sm text-white placeholder-slate-500 transition-all"
            />
          </div>

          {/* Şifrə */}
          <div className="relative group">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors"
              size={18}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Şifrəniz"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-3 pl-11 pr-11 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 text-sm text-white placeholder-slate-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              aria-label="Şifrəni göstər və ya gizlət"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Göndər Düyməsi */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Yoxlanılır...</span>
              </>
            ) : (
              <>
                <LogIn size={16} />
                <span>{isLogin ? "Daxil Ol" : "Qeydiyyatdan Keç"}</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Hesablar ilə Sürətli Giriş */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
            Sınaq üçün Demo Girişlər:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillCredentials("admin@gamexstore.az", "Admin123!")}
              className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium transition-colors text-left cursor-pointer"
            >
              <span className="font-bold text-red-400 block">Baş Admin</span>
              <span className="text-[10px] text-slate-500">admin@gamexstore.az</span>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials("user@nexus.az", "user123")}
              className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium transition-colors text-left cursor-pointer"
            >
              <span className="font-bold text-blue-400 block">İstifadəçi</span>
              <span className="text-[10px] text-slate-500">user@nexus.az</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="bg-[#090d16] min-h-[calc(100vh-80px)] flex items-center justify-center p-4 relative overflow-hidden selection:bg-red-500 selection:text-white py-12">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] md:w-[600px] md:h-[600px] bg-red-600/15 blur-[140px] rounded-full pointer-events-none" />
      <Suspense fallback={<Loader2 className="animate-spin text-red-500" size={32} />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
