import Image from "next/image";
import Link from "next/link";
import { Dumbbell, ShieldCheck, Users, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About Us — Marketplace Fitness",
  description:
    "We are gym trainers selling supplements we actually use ourselves. Honest recommendations, authentic products, delivered locally in Indore.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            Our Story
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            We sell what we{" "}
            <span className="text-emerald-600">actually use</span>.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Marketplace Fitness is run by working gym trainers in Indore. Every
            product on this site is one we use in our own training and
            recommend to our clients — based on results, not commission.
          </p>
        </div>
      </section>

      {/* Story body */}
      <section className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
          <Image
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80"
            alt="Gym trainer at work"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="space-y-5">
          <h2 className="text-3xl font-bold text-foreground">
            Honest recommendations from your trainer
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We started Marketplace Fitness because we got tired of seeing our
            clients waste money on counterfeit supplements and overpriced
            products that don&apos;t deliver. As trainers, we&apos;re in the
            gym every day — we know what works, what doesn&apos;t, and what
            you actually need at each stage of your journey.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Every product we stock is sourced from authorised distributors and
            personally vetted. If we wouldn&apos;t use it ourselves, it
            doesn&apos;t go on the shelf.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Use your trainer&apos;s unique code at checkout to get a{" "}
            <strong className="text-emerald-700">10% discount</strong> — our
            way of saying thanks for trusting us.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 border-y border-border">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            What we stand for
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-border">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground">
                100% Authentic
              </h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Every product is sourced from authorised distributors. No grey
                market, no counterfeits.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-border">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground">
                Trainer Tested
              </h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                We use what we sell. Recommendations are based on what
                actually works in the gym.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-border">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground">
                Local to Indore
              </h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Fast local delivery and a real human you can actually reach
                when you need help.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-foreground">
          Ready to fuel your goals?
        </h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          Browse our trainer-curated catalog of authentic supplements.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg shadow-sm transition-colors"
        >
          Shop Products
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
