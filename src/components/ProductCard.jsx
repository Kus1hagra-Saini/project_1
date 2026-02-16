import { MapPin } from 'lucide-react';

export default function ProductCard({ item }) {
  const priceLabel = item.isDonation ? 'Free' : `$${item.price}`;

  return (
    <article className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-community-200/80 transition-all duration-200">
      {/* Image placeholder */}
      <div className="aspect-[4/3] bg-gradient-to-br from-sage-100 to-community-50 flex items-center justify-center text-5xl">
        {item.imagePlaceholder}
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-800 line-clamp-2 flex-1 min-w-0">
            {item.title}
          </h3>
          <span
            className={`shrink-0 px-2.5 py-1 rounded-lg text-sm font-semibold ${
              item.isDonation
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {priceLabel}
          </span>
        </div>

        <p className="mt-1 text-sm text-slate-500">{item.school}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="px-2 py-0.5 rounded-md bg-sage-100 text-sage-800">
            {item.condition}
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <MapPin className="w-4 h-4 text-community-500" />
            {item.distanceMiles} {item.distanceMiles === 1 ? 'mile' : 'miles'} away
          </span>
        </div>
      </div>
    </article>
  );
}
