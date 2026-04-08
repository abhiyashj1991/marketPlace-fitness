import Link from "next/link";
import { MapPin, ShieldCheck, Truck, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20">
      {/* Trust strip */}
      <div className="bg-emerald-50 border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-700 flex-shrink-0" />
            <div>
              <div className="text-sm font-semibold text-foreground">
                100% Authentic
              </div>
              <div className="text-xs text-muted-foreground">
                Every product verified
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-emerald-700 flex-shrink-0" />
            <div>
              <div className="text-sm font-semibold text-foreground">
                Trainer Recommended
              </div>
              <div className="text-xs text-muted-foreground">
                Used by gym pros
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-emerald-700 flex-shrink-0" />
            <div>
              <div className="text-sm font-semibold text-foreground">
                Indore Local Delivery
              </div>
              <div className="text-xs text-muted-foreground">
                Fast & reliable
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">
              Marketplace Fitness
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Trainer-recommended supplements, 100% authentic, delivered
              locally in Indore.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
              Categories
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products/category/whey-protein"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Whey Protein
                </Link>
              </li>
              <li>
                <Link
                  href="/products/category/creatine"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Creatine
                </Link>
              </li>
              <li>
                <Link
                  href="/products/category/fat-burner"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Fat Burner
                </Link>
              </li>
              <li>
                <Link
                  href="/products/category/mass-gainer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Mass Gainer
                </Link>
              </li>
              <li>
                <Link
                  href="/products/category/multivitamin"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Multivitamin
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-emerald-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-emerald-400 transition-colors"
                >
                  All Products
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
              Visit Us
            </h4>
            <div className="text-sm flex items-start gap-2 text-slate-400">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500" />
              <span>
                Indore, Madhya Pradesh
                <br />
                India
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Marketplace Fitness. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
