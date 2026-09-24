import type { Metadata } from "next";
import { Cairo } from "next/font/google";

import "./globals.css";

import Navbar from "./components/Navbar/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer/Footer";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
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
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.className}`}
      >
        <Navbar />

        {children}
        <Footer />
        <Toaster position="bottom-right" reverseOrder={false} />
      </body>
    </html>
  );
}
