import { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FilterSidebar from './components/FilterSidebar';
import FilterDrawer from './components/FilterDrawer';
import ProductGrid from './components/ProductGrid';
import { MOCK_ITEMS } from './data/mockItems';

const DEFAULT_FILTERS = {
  category: ['Books', 'Uniforms', 'Notes'],
  priceMode: null,
  radiusKm: 10,
  school: null,
};

export default function App() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query ?? '');
  }, []);

  const handleListItem = useCallback(() => {
    setFilterDrawerOpen(false);
    // In a real app: open "List item" modal or navigate
  }, []);

  const handleBrowseDonations = useCallback(() => {
    setFilters((prev) => ({ ...prev, priceMode: 'free' }));
    setFilterDrawerOpen(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSearch={handleSearch} onMenuClick={() => setFilterDrawerOpen(true)} />

      <Hero onListItem={handleListItem} onBrowseDonations={handleBrowseDonations} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <FilterSidebar filters={filters} onFiltersChange={setFilters} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800">Listings</h2>
              <button
                type="button"
                onClick={() => setFilterDrawerOpen(true)}
                className="lg:hidden px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-sage-50 transition"
              >
                Filters
              </button>
            </div>
            <ProductGrid
              items={MOCK_ITEMS}
              filters={filters}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </main>

      <FilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  );
}
