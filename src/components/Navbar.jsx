import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, LogIn, LogOut, Menu, Sun, Moon, LayoutList } from 'lucide-react';

export default function Navbar({ onSearch, onMenuClick, user, onLoginClick, onLogout, darkMode, onToggleDark, onMyListings }) {
  const [query, setQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const initials = user?.name
    ? user.name.trim().split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '';

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Mobile menu trigger */}
          <button type="button" onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open filters">
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0 group">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-600 text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-shadow">C</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100 hidden sm:inline text-lg">Scholars Connect</span>
          </a>

          {/* Global search */}
          <form onSubmit={handleSubmit} className="flex-1 max-w-xl mx-4 hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search books, uniforms, notes..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                aria-label="Search marketplace" />
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Dark mode toggle */}
            <button type="button" onClick={onToggleDark}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button type="button" onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="User menu">
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-600 text-white font-bold text-sm shadow">
                    {initials}
                  </span>
                  <span className="hidden sm:block text-sm font-medium text-slate-800 dark:text-slate-100 max-w-[120px] truncate">{user.name}</span>
                  {user.lat != null && <MapPin className="w-4 h-4 text-primary-500 hidden sm:block" title="Location saved" />}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">@{user.username}</p>
                      {user.lat != null
                        ? <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3 text-primary-500" />Location saved</p>
                        : <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">No location saved</p>
                      }
                    </div>
                    <button type="button" onClick={() => { setDropdownOpen(false); onMyListings?.(); }}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <LayoutList className="w-4 h-4" />
                      My Listings
                    </button>
                    <button type="button" onClick={() => { setDropdownOpen(false); onLogout?.(); }}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button type="button" onClick={onLoginClick}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors shadow-sm">
                <LogIn className="w-4 h-4" />
                <span>Log in</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSubmit} className="sm:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search books, uniforms, notes..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Search marketplace" />
          </div>
        </form>
      </div>
    </header>
  );
}
