import { useState, useMemo } from 'react';
import { BookOpen, Shirt, FileText, MapPin, School, DollarSign, Package } from 'lucide-react';
import { SCHOOLS } from '../data/mockItems';

const CATEGORIES = [
  { id: 'Books', label: 'Books', icon: BookOpen },
  { id: 'Uniforms', label: 'Uniforms', icon: Shirt },
  { id: 'Notes', label: 'Notes', icon: FileText },
  { id: 'Other', label: 'Other', icon: Package },
];

const RADIUS_OPTIONS = [5, 10, 20];

export default function FilterSidebar({ filters, onFiltersChange, isDrawer = false }) {
  const [schoolQuery, setSchoolQuery] = useState('');

  const filteredSchools = useMemo(() => {
    if (!schoolQuery.trim()) return SCHOOLS;
    const q = schoolQuery.toLowerCase();
    return SCHOOLS.filter((s) => s.toLowerCase().includes(q));
  }, [schoolQuery]);

  const handleCategoryToggle = (id) => {
    const next = filters.category.includes(id)
      ? filters.category.filter((c) => c !== id)
      : [...filters.category, id];
    onFiltersChange({ ...filters, category: next.length ? next : CATEGORIES.map((c) => c.id) });
  };

  const handlePriceToggle = (mode) => {
    const next = filters.priceMode === mode ? null : mode;
    onFiltersChange({ ...filters, priceMode: next });
  };

  const handleRadiusChange = (km) => {
    onFiltersChange({ ...filters, radiusKm: km });
  };

  const handleSchoolSelect = (school) => {
    const next = filters.school === school ? null : school;
    onFiltersChange({ ...filters, school: next });
    setSchoolQuery('');
  };

  return (
    <aside
      className={`glass rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm ${
        isDrawer ? 'border-0 rounded-none shadow-none' : 'p-5'
      }`}
    >
      <div className={isDrawer ? 'p-5' : ''}>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </span>
          Filters
        </h2>

        {/* Category */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Category</h3>
          <ul className="space-y-1.5">
            {CATEGORIES.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <label className="flex items-center gap-2 cursor-pointer group p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.category.includes(id)}
                    onChange={() => handleCategoryToggle(id)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary-600 dark:text-primary-400 focus:ring-2 focus:ring-primary-500/50 bg-white dark:bg-slate-700 cursor-pointer"
                  />
                  <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors" />
                  <span className="text-slate-700 dark:text-slate-200">{label}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Price: Free vs Paid */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Price</h3>
          <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 p-1 bg-slate-50 dark:bg-slate-700/50">
            <button
              type="button"
              onClick={() => handlePriceToggle('free')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                filters.priceMode === 'free'
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600'
              }`}
            >
              Free / Donation
            </button>
            <button
              type="button"
              onClick={() => handlePriceToggle('paid')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                filters.priceMode === 'paid'
                  ? 'bg-primary-500 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600'
              }`}
            >
              Paid
            </button>
          </div>
        </div>

        {/* Location radius */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            Location (radius)
          </h3>
          <div className="flex gap-2">
            {RADIUS_OPTIONS.map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => handleRadiusChange(km)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  filters.radiusKm === km
                    ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {km} km
              </button>
            ))}
          </div>
        </div>

        {/* School dropdown */}
        <div className="mb-2">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1">
            <School className="w-4 h-4" />
            School
          </h3>
          <input
            type="text"
            value={schoolQuery}
            onChange={(e) => setSchoolQuery(e.target.value)}
            placeholder="Search school..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-sm"
          />
          <ul className="mt-1 max-h-40 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700">
            {filteredSchools.map((school) => (
              <li key={school}>
                <button
                  type="button"
                  onClick={() => handleSchoolSelect(school)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                    filters.school === school 
                      ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300 font-medium' 
                      : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {school}
                </button>
              </li>
            ))}
          </ul>
          {filters.school && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Selected: <span className="font-medium text-primary-700 dark:text-primary-400">{filters.school}</span>
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
