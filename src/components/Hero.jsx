import { Package, Gift } from 'lucide-react';

export default function Hero({ onListItem, onBrowseDonations }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-community-50 via-sage-50 to-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
            Buy, sell & share school items with your community
          </h1>
          <p className="mt-4 text-slate-600 text-lg">
            Textbooks, uniforms, and notes — all in one trusted place for students.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onListItem}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-white bg-community-600 hover:bg-community-700 shadow-lg shadow-community-500/25 focus:outline-none focus:ring-2 focus:ring-community-500 focus:ring-offset-2 transition"
            >
              <Package className="w-5 h-5" />
              List an Item
            </button>
            <button
              type="button"
              onClick={onBrowseDonations}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-community-700 bg-community-100 hover:bg-community-200 border border-community-200 focus:outline-none focus:ring-2 focus:ring-community-500 focus:ring-offset-2 transition"
            >
              <Gift className="w-5 h-5" />
              Browse Donations
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
