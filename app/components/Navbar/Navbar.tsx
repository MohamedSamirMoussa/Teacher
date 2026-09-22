// components/Navbar.tsx

"use client";

import Link from "next/link";

const Navbar = () => {
  const scrollToReport = () => {
    document.getElementById("report")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-gray-900"
        >
          تقريري
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-950"
          >
            الرئيسية
          </Link>

          <button
            onClick={scrollToReport}
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-950"
          >
            إنشاء تقرير
          </button>
        </div>

        {/* CTA */}
        <button
          onClick={scrollToReport}
          className="rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-95"
        >
          إنشاء تقرير
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
    