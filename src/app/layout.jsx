import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar, Footer } from "@/Components";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { StoreProvider } from "@/context/StoreContext";
import Toast from "@/Components/Toast";
import AuthModal from "@/Components/AuthModal";
import CartDrawer from "@/Components/CartDrawer";
import CheckoutModal from "@/Components/CheckoutModal";
import SellAccountModal from "@/Components/SellAccountModal";
import TopUpModal from "@/Components/TopUpModal";
import TrailerModal from "@/Components/TrailerModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO və Paylaşım üçün Metadata
export const metadata = {
  title: "Game X Store | Oyun Dünyasının Mərkəzi",
  description:
    "Ən yeni oyunlar, rəqəmsal kodlar və oyun hesabları ən sərfəli qiymətlərlə. Sürətli çatdırılma və 7/24 dəstək.",
  keywords: [
    "oyunlar",
    "ucuz oyun",
    "oyun hesabı",
    "game store azerbaijan",
    "ps5 oyunlari",
    "steam kodlari",
    "pubg uc",
    "valorant points",
  ],
  authors: [{ name: "GameX Store" }],
  openGraph: {
    title: "Game X Store | Oyun Dünyasının Mərkəzi",
    description: "Ən yeni oyunlar və rəqəmsal kodlar ən sərfəli qiymətlərlə.",
    locale: "az_AZ",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="az" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-[#090d16] text-slate-100 flex flex-col min-h-screen selection:bg-red-500 selection:text-white`}
      >
        <AuthProvider>
          <StoreProvider>
            <CartProvider>
              <Navbar />

              {/* Səhifələrin məzmunu (Footer həmişə ən aşağıda qalır) */}
              <div className="grow flex flex-col">{children}</div>

              <Footer />

              {/* Qlobal Modallar və Bildirişlər */}
              <Toast />
              <AuthModal />
              <CartDrawer />
              <CheckoutModal />
              <SellAccountModal />
              <TopUpModal />
              <TrailerModal />
            </CartProvider>
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
