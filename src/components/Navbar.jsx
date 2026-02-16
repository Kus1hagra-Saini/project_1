import { useState } from 'react';
import { Search, User, LogIn, Menu } from 'lucide-react';

export default function Navbar({ onSearch, onMenuClick }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-sage-100 focus:ring-2 focus:ring-community-500"
            aria-label="Open filters"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-community-500 text-white font-bold text-lg shadow-md shadow-community-500/30">
              C
            </span>
            <span className="font-semibold text-slate-800 hidden sm:inline text-lg">
              Community Marketplace
            </span>
          </a>

          {/* Global search */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 max-w-xl mx-4 hidden sm:block"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search books, uniforms, notes..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-sage-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-community-500/40 focus:border-community-500 transition"
                aria-label="Search marketplace"
              />
            </div>
          </form>

          {/* Auth / profile */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="#login"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:bg-sage-100 hover:text-slate-800 transition text-sm font-medium"
            >
              <LogIn className="w-5 h-5" />
              <span className="hidden sm:inline">Log in</span>
            </a>
            <a
              href="#profile"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-community-100 text-community-700 hover:bg-community-200 transition"
              aria-label="Profile"
            >
              <User className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Mobile search bar */}
        <form onSubmit={handleSubmit} className="sm:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search books, uniforms, notes..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-sage-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-community-500/40"
              aria-label="Search marketplace"
            />
          </div>
        </form>
      </div>
    </header>
  );
}
