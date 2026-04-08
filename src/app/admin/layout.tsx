import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

export const metadata = {
  title: "Admin — Marketplace Fitness",
};

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/trainers", label: "Trainers", icon: Users },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  {
    href: "/admin/sales-by-trainer",
    label: "Sales by Trainer",
    icon: TrendingUp,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50 min-h-[calc(100vh-150px)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2 mb-6 text-xs text-emerald-900">
          Admin portal — protected by HTTP Basic Auth via middleware. Sign out
          by closing your browser.
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3">
            <nav className="bg-white border border-border rounded-2xl p-3 sticky top-24">
              {NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-foreground hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
          <div className="lg:col-span-9">{children}</div>
        </div>
      </div>
    </div>
  );
}
