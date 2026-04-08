import Link from "next/link";
import { MapPin } from "lucide-react";
import { HeaderCartLink } from "@/components/HeaderCartLink";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      {/* Top strip with Indore location pin */}
      <div className="bg-emerald-50 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 py-1.5 text-xs text-emerald-900 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
          <span>
            Delivering in <strong className="font-semibold">Indore</strong>
          </span>
        </div>
      </div>
      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="text-xl sm:text-2xl font-bold text-emerald-700">
            Marketplace
          </span>
          <span className="text-xl sm:text-2xl font-bold text-foreground">
            Fitness
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/"
            className="text-foreground hover:text-emerald-700 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-foreground hover:text-emerald-700 transition-colors"
          >
            Products
          </Link>
          <Link
            href="/about"
            className="text-foreground hover:text-emerald-700 transition-colors"
          >
            About Us
          </Link>
        </nav>
        <HeaderCartLink />
      </div>
    </header>
  );
}
