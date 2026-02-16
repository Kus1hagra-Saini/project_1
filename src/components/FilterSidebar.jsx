import { useState, useMemo } from 'react';
import { BookOpen, Shirt, FileText, MapPin, School, DollarSign } from 'lucide-react';
import { SCHOOLS } from '../data/mockItems';

const CATEGORIES = [
  { id: 'Books', label: 'Books', icon: BookOpen },
  { id: 'Uniforms', label: 'Uniforms', icon: Shirt },
  { id: 'Notes', label: 'Notes', icon: FileText },
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
      className={`bg-white rounded-2xl border border-slate-200 overflow-hidden ${
        isDrawer ? 'border-0 rounded-none' : 'p-5 shadow-sm'
      }`}
    >
      <div className={isDrawer ? 'p-5' : ''}>
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-community-100 text-community-600 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </span>
          Filters
        </h2>

        {/* Category */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-600 mb-2">Category</h3>
          <ul className="space-y-1.5">
            {CATEGORIES.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.category.includes(id)}
                    onChange={() => handleCategoryToggle(id)}
                    className="rounded border-slate-300 text-community-600 focus:ring-community-500"
                  />
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-community-500" />
                  <span className="text-slate-700">{label}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Price: Free vs Paid */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-600 mb-2">Price</h3>
          <div className="flex rounded-xl border border-slate-200 p-1 bg-slate-50/50">
            <button
              type="button"
              onClick={() => handlePriceToggle('free')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                filters.priceMode === 'free'
                  ? 'bg-emerald-500 text-white shadow'
                  : 'text-slate-600 hover:bg-white'
              }`}
            >
              Free / Donation
            </button>
            <button
              type="button"
              onClick={() => handlePriceToggle('paid')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                filters.priceMode === 'paid'
                  ? 'bg-community-500 text-white shadow'
                  : 'text-slate-600 hover:bg-white'
              }`}
            >
              Paid
            </button>
          </div>
        </div>

        {/* Location radius */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            Location (radius)
          </h3>
          <div className="flex gap-2">
            {RADIUS_OPTIONS.map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => handleRadiusChange(km)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${
                  filters.radiusKm === km
                    ? 'border-community-500 bg-community-50 text-community-700'
                    : 'border-slate-200 text-slate-600 hover:border-community-300 hover:bg-sage-50'
                }`}
              >
                {km} km
              </button>
            ))}
          </div>
        </div>

        {/* School dropdown */}
        <div className="mb-2">
          <h3 className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-1">
            <School className="w-4 h-4" />
            School
          </h3>
          <input
            type="text"
            value={schoolQuery}
            onChange={(e) => setSchoolQuery(e.target.value)}
            placeholder="Search school..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-sage-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-community-500/40 focus:border-community-500 text-sm"
          />
          <ul className="mt-1 max-h-40 overflow-y-auto rounded-lg border border-slate-200 bg-white divide-y divide-slate-100">
            {filteredSchools.map((school) => (
              <li key={school}>
                <button
                  type="button"
                  onClick={() => handleSchoolSelect(school)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-sage-50 transition ${
                    filters.school === school ? 'bg-community-50 text-community-800 font-medium' : 'text-slate-700'
                  }`}
                >
                  {school}
                </button>
              </li>
            ))}
          </ul>
          {filters.school && (
            <p className="mt-1 text-xs text-slate-500">
              Selected: <span className="font-medium text-community-700">{filters.school}</span>
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
