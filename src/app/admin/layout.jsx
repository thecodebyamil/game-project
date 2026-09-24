"use client";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#090d16] font-sans selection:bg-rose-500 selection:text-white">
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}
