import { useMemo } from 'react';
import ProductCard from './ProductCard';

function filterItems(items, filters) {
  return items.filter((item) => {
    if (filters.category.length && !filters.category.includes(item.category)) return false;
    if (filters.priceMode === 'free' && !item.isDonation) return false;
    if (filters.priceMode === 'paid' && item.isDonation) return false;
    const milesPerKm = 0.621371;
    const maxMiles = filters.radiusKm * milesPerKm;
    if (item.distanceMiles > maxMiles) return false;
    if (filters.school && item.school !== filters.school) return false;
    return true;
  });
}

export default function ProductGrid({ items, filters, searchQuery }) {
  const filtered = useMemo(() => filterItems(items, filters), [items, filters]);

  const displayed = useMemo(() => {
    if (!searchQuery.trim()) return filtered;
    const q = searchQuery.toLowerCase();
    return filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.school.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [filtered, searchQuery]);

  if (displayed.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <p className="text-slate-500 text-lg">No items match your filters.</p>
        <p className="text-slate-400 text-sm mt-1">Try adjusting filters or search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {displayed.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  );
}
