import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import { prisma } from "@/lib/db";
import { CATEGORIES } from "@/lib/categories";
import { CategoryTile } from "@/components/CategoryTile";
import { ProductCard } from "@/components/ProductCard";

export default async function HomePage() {
  // Featured / bestseller picks
  const bestsellers = await prisma.product.findMany({
    where: { isBestseller: true },
    include: { brand: true },
    take: 5,
    orderBy: { rating: "desc" },
  });

  return (
    <>
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <MapPin className="w-3.5 h-3.5" />
              Now delivering in Indore
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight tracking-tight">
              Bringing you{" "}
              <span className="text-emerald-600">authentic products</span> to
              fulfil your nutritional needs.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">
              Trainer-recommended whey protein, creatine, fat burners, mass
              gainers and multivitamins — sourced and verified by working gym
              professionals.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg shadow-sm transition-colors"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-foreground hover:text-emerald-700 font-semibold px-6 py-3 transition-colors"
              >
                About Us
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% authentic — verified by your trainer
            </div>
          </div>
          <div className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1583500178690-f7fd39c79658?w=900&q=80"
              alt="Fitness supplements display"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Shop by Category
            </h2>
            <p className="text-muted-foreground mt-1">
              Find exactly what your goal needs.
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((c) => (
            <CategoryTile
              key={c.slug}
              slug={c.slug}
              label={c.label}
              description={c.description}
              image={c.image}
            />
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="bg-slate-50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Bestsellers
              </h2>
              <p className="text-muted-foreground mt-1">
                The picks our trainers reach for most.
              </p>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {bestsellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
