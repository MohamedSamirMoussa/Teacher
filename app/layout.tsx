import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { Toaster } from "react-hot-toast";

import "./globals.css";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "إنشاء التقارير",
  description: "إنشاء وطباعة التقارير بسهولة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${cairo.className} ${cairo.variable}`}
      >
        <div className="no-print">
          <Navbar />
        </div>

        {children}

        <div className="no-print">
          <Footer />

        </div>

        <div className="no-print">
          <Toaster position="bottom-right" reverseOrder={false} />
        </div>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
