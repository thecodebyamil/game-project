"use client";

import React from 'react';
import { useStore } from '../context/StoreContext';

export default function Toast() {
  const { toast } = useStore();

  if (!toast) return null;

  const bgStyles = {
    success: 'bg-emerald-500/90 border-emerald-400 text-white shadow-emerald-500/30',
    error: 'bg-rose-600/90 border-rose-400 text-white shadow-rose-600/30',
    info: 'bg-indigo-600/90 border-indigo-400 text-white shadow-indigo-600/30'
  };

  const icons = {
    success: '✅',
    error: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
      <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl ${bgStyles[toast.type] || bgStyles.info}`}>
        <span className="text-xl">{icons[toast.type]}</span>
        <p className="text-sm font-bold tracking-wide">{toast.message}</p>
      </div>
    </div>
  );
}
