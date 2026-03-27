import { MapPin, Trash2 } from 'lucide-react';
import Badge from './ui/Badge';

/** Haversine formula — returns distance in km between two lat/lng points */
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

export default function ProductCard({ item, userLat, userLng, onClick, user, onDelete }) {
  const isAdmin = user?.username === 'kushagra';
  const canDelete = isAdmin || (user?.id && user.id === item.ownerId);
  const priceLabel = item.isDonation ? 'Free' : `₹${item.price}`;

  // Compute distance: prefer real coords, fall back to distanceMiles
  let distanceLabel = null;
  if (userLat != null && userLng != null && item.lat != null && item.lng != null) {
    const km = haversineKm(userLat, userLng, item.lat, item.lng);
    distanceLabel = km < 1 ? `${Math.round(km * 1000)} m away` : `${km.toFixed(1)} km away`;
  } else if (item.distanceMiles != null) {
    distanceLabel = `${item.distanceMiles} ${item.distanceMiles === 1 ? 'mile' : 'miles'} away`;
  }

  return (
    <article
      className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200 cursor-pointer hover:scale-[1.01]"
      onClick={() => onClick?.(item)}
    >
      {/* Item image */}
      <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-5xl overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <span
          className="text-5xl flex items-center justify-center w-full h-full"
          style={{ display: item.imageUrl ? 'none' : 'flex' }}
        >
          {item.imagePlaceholder}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 line-clamp-2 flex-1 min-w-0">
            {item.title}
          </h3>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <Badge variant={item.isDonation ? 'success' : 'default'} size="md">
              {priceLabel}
            </Badge>
            {canDelete && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onDelete?.(item); }}
                className="p-1.5 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 transition-colors shadow-sm"
                title="Delete listing"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{item.school}</p>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Badge variant="outline" size="sm">
            {item.condition}
          </Badge>
          {distanceLabel && (
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <MapPin className="w-4 h-4 text-primary-500" />
              {distanceLabel}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
