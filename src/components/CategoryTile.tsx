import Link from "next/link";
import Image from "next/image";

type Props = {
  slug: string;
  label: string;
  description: string;
  image: string;
};

export function CategoryTile({ slug, label, description, image }: Props) {
  return (
    <Link
      href={`/products/category/${slug}`}
      className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 hover:shadow-xl transition-shadow"
    >
      <Image
        src={image}
        alt={label}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        className="object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="font-bold text-lg leading-tight">{label}</h3>
        <p className="text-xs text-white/80 mt-0.5">{description}</p>
        <div className="text-xs text-emerald-300 font-semibold mt-2 group-hover:translate-x-1 transition-transform">
          Shop now →
        </div>
      </div>
    </Link>
  );
}
