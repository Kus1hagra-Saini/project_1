import { useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Tag, School, Package } from 'lucide-react';

/** Haversine distance (reused from ProductCard) */
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function ItemDetailModal({ item, onClose, userLat, userLng }) {
  const [imgIdx, setImgIdx] = useState(0);

  const images = item?.imageUrls?.length
    ? item.imageUrls
    : item?.imageUrl
    ? [item.imageUrl]
    : [];

  const prev = useCallback(() => setImgIdx((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setImgIdx((i) => (i + 1) % images.length), [images.length]);

  if (!item) return null;

  const priceLabel = item.isDonation ? 'Free / Donation' : `₹${item.price}`;

  let distanceLabel = null;
  if (userLat != null && userLng != null && item.lat != null && item.lng != null) {
    const km = haversineKm(userLat, userLng, item.lat, item.lng);
    distanceLabel = km < 1 ? `${Math.round(km * 1000)} m away` : `${km.toFixed(1)} km away`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md" />
      <div
        className="relative glass rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all shadow"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image gallery */}
        <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-t-3xl overflow-hidden">
          {images.length > 0 ? (
            <>
              <img
                src={images[imgIdx]}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              {images.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setImgIdx(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === imgIdx ? 'bg-white scale-125' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-6xl">{item.imagePlaceholder}</div>
          )}
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 flex-1">{item.title}</h2>
            <span className={`shrink-0 px-3 py-1.5 rounded-xl text-sm font-bold ${
              item.isDonation
                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                : 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'
            }`}>
              {priceLabel}
            </span>
          </div>

          {item.description && (
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{item.description}</p>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Tag className="w-4 h-4 text-primary-500" />
              <span>{item.category}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Package className="w-4 h-4 text-primary-500" />
              <span>{item.condition}</span>
            </div>
            {item.school && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 col-span-2">
                <School className="w-4 h-4 text-primary-500" />
                <span>{item.school}</span>
              </div>
            )}
            {distanceLabel && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 col-span-2">
                <MapPin className="w-4 h-4 text-primary-500" />
                <span>{distanceLabel}</span>
              </div>
            )}
          </div>

          {/* Contact via WhatsApp placeholder */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Listed by <span className="font-medium text-slate-600 dark:text-slate-300">{item.sellerName || 'a community member'}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
