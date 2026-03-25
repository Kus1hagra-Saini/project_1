import { useMemo } from 'react';
import ProductCard from './ProductCard';

/** Haversine in km */
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

function filterItems(items, filters, userLat, userLng) {
  return items.filter((item) => {
    if (filters.category.length && !filters.category.includes(item.category)) return false;
    if (filters.priceMode === 'free' && !item.isDonation) return false;
    if (filters.priceMode === 'paid' && item.isDonation) return false;
    if (filters.school && item.school !== filters.school) return false;
    // Radius filter: use Haversine if real coords available, else legacy distanceMiles
    if (userLat != null && userLng != null && item.lat != null && item.lng != null) {
      const km = haversineKm(userLat, userLng, item.lat, item.lng);
      if (km > filters.radiusKm) return false;
    } else {
      const milesPerKm = 0.621371;
      const maxMiles = filters.radiusKm * milesPerKm;
      if (item.distanceMiles > maxMiles) return false;
    }
    return true;
  });
}

function sortItems(items, sortBy, userLat, userLng) {
  const arr = [...items];
  switch (sortBy) {
    case 'price_asc':  return arr.sort((a, b) => a.price - b.price);
    case 'price_desc': return arr.sort((a, b) => b.price - a.price);
    case 'nearest':
      if (userLat != null && userLng != null) {
        return arr.sort((a, b) => {
          const da = (a.lat != null && a.lng != null) ? haversineKm(userLat, userLng, a.lat, a.lng) : Infinity;
          const db = (b.lat != null && b.lng != null) ? haversineKm(userLat, userLng, b.lat, b.lng) : Infinity;
          return da - db;
        });
      }
      return arr;
    case 'newest':
    default:
      return arr;
  }
}

export default function ProductGrid({ items, filters, searchQuery, userLat, userLng, sortBy = 'newest', onItemClick }) {
  const filtered = useMemo(() => filterItems(items, filters, userLat, userLng), [items, filters, userLat, userLng]);

  const searched = useMemo(() => {
    if (!searchQuery.trim()) return filtered;
    const q = searchQuery.toLowerCase();
    return filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.school.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [filtered, searchQuery]);

  const displayed = useMemo(() => sortItems(searched, sortBy, userLat, userLng), [searched, sortBy, userLat, userLng]);

  if (displayed.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
          <svg className="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-xl font-semibold">No items match your filters.</p>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Try adjusting filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {displayed.map((item) => (
        <ProductCard
          key={item.id}
          item={item}
          userLat={userLat}
          userLng={userLng}
          onClick={onItemClick}
        />
      ))}
    </div>
  );
}
