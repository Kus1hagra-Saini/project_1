import { useState, useCallback, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FilterSidebar from './components/FilterSidebar';
import FilterDrawer from './components/FilterDrawer';
import ProductGrid from './components/ProductGrid';
import { createItem, listItems, createUploadUrl, uploadFileToS3, deleteItemAPI } from './lib/api';
import Modal from './components/ui/Modal';
import LoginModal from './components/LoginModal';
import ItemDetailModal from './components/ItemDetailModal';
import MyListings from './components/MyListings';
import { useAuth } from './context/AuthContext';
import { useToast } from './components/ui/ToastContainer';

const DEFAULT_FILTERS = {
  category: ['Books', 'Uniforms', 'Notes', 'Other'],
  priceMode: null,
  radiusKm: 10,
  school: null,
};

const ITEM_CATEGORIES = ['Books', 'Uniforms', 'Notes', 'Other'];
const PREDEFINED_SCHOOLS = [
  'None',
  'Campion School, Bhopal',
  "St. Joseph's Co-ed School",
  'Carmel Convent School',
  'Sagar Public School',
  'Delhi Public School, Bhopal',
  'Christ Church School',
  "St. Xavier's School",
  'Billabong High International School',
  'Other'
];

/** Shows a thumbnail preview of a local File object. */
function PhotoPreview({ file }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!src) return null;

  return (
    <img
      src={src}
      alt={file.name}
      className="w-20 h-20 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
    />
  );
}

export default function App() {
  const { user, logout } = useAuth();
  const { addToast } = useToast();

  // Dark mode
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('cm_dark');
    return saved ? saved === 'true' : true; // default dark
  });
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('cm_dark', String(darkMode));
  }, [darkMode]);

  const [view, setView] = useState('browse'); // 'browse' | 'my-listings'
  const [sortBy, setSortBy] = useState('newest');
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [listItemModalOpen, setListItemModalOpen] = useState(false);
  const [isSubmittingListing, setIsSubmittingListing] = useState(false);
  const [listItemMessage, setListItemMessage] = useState('');
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemsError, setItemsError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Books',
    condition: 'Used',
    school: 'None',
    customSchool: '',
    price: 0,
  });
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const photoInputRef = useRef(null);

  const mapApiItemToUiItem = useCallback((item) => ({
    id: item.itemId,
    ownerId: item.ownerId || (item.pk ? item.pk.replace('USER#', '') : null),
    title: item.title,
    description: item.description || '',
    category: item.category || 'Books',
    price: Number(item.price || 0),
    isDonation: Number(item.price || 0) === 0,
    condition: item.condition || 'Used',
    school: item.school || 'Scholars Connect',
    distanceMiles: Number(item.distanceMiles || 0),
    lat: item.lat ?? null,
    lng: item.lng ?? null,
    imagePlaceholder: '📦',
    imageUrl: item.imageUrl || item.imageUrls?.[0] || null,
    imageUrls: item.imageUrls || (item.imageUrl ? [item.imageUrl] : []),
    sellerName: item.sellerName || null,
    status: item.status || 'ACTIVE',
  }), []);

  const fetchItems = useCallback(async () => {
    setItemsLoading(true);
    setItemsError('');
    try {
      const data = await listItems();
      const apiItems = Array.isArray(data?.items) ? data.items : [];
      setItems(apiItems.map(mapApiItemToUiItem));
    } catch (error) {
      setItemsError(error.message || 'Failed to load items');
      setItems([]);
    } finally {
      setItemsLoading(false);
    }
  }, [mapApiItemToUiItem]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query ?? '');
  }, []);

  const resetListingForm = useCallback(() => {
    setForm({
      title: '',
      description: '',
      category: 'Books',
      condition: 'Used',
      school: 'None',
      customSchool: '',
      price: 0,
    });
    setSelectedPhotos([]);
    if (photoInputRef.current) photoInputRef.current.value = '';
  }, []);

  const handleListItem = useCallback(() => {
    if (!user) {
      setLoginModalOpen(true);
      return;
    }
    setFilterDrawerOpen(false);
    setListItemMessage('');
    resetListingForm();
    setListItemModalOpen(true);
  }, [resetListingForm, user]);

  const submitListing = useCallback(async () => {
    setListItemMessage('');
    setIsSubmittingListing(true);
    try {
      const title = form.title.trim();
      if (!title) throw new Error('Title is required');
      if (!ITEM_CATEGORIES.includes(form.category)) throw new Error('Invalid category');

      const imageKeys = [];
      for (const file of selectedPhotos) {
        const presign = await createUploadUrl({
          fileName: file.name,
          contentType: file.type || 'application/octet-stream',
          ownerId: user?.id || 'u1',
        });

        await uploadFileToS3(
          presign.uploadUrl,
          file,
          file.type || 'application/octet-stream'
        );

        if (presign.fileKey) imageKeys.push(presign.fileKey);
      }

      const finalSchool = form.school === 'None' ? undefined 
                        : form.school === 'Other' ? form.customSchool.trim() || undefined
                        : form.school;

      const createdItem = await createItem({
        ownerId: user?.id || 'u1',
        title,
        description: form.description || '',
        category: form.category,
        price: Number(form.price || 0),
        condition: form.condition,
        school: finalSchool,
        imageKeys,
        lat: user?.lat ?? undefined,
        lng: user?.lng ?? undefined,
        sellerName: user?.name ?? undefined,
      });

      setListItemModalOpen(false);
      fetchItems();
      addToast(`“${title}” listed successfully!`, 'success');
    } catch (error) {
      setListItemMessage(error.message || 'Failed to create item');
    } finally {
      setIsSubmittingListing(false);
    }
  }, [fetchItems, form, selectedPhotos]);

  const handleBrowseDonations = useCallback(() => {
    setFilters((prev) => ({ ...prev, priceMode: 'free' }));
    setFilterDrawerOpen(false);
  }, []);

  const handleListingDeleteClick = useCallback((item) => {
    setItemToDelete(item);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!user || !itemToDelete) return;
    try {
      await deleteItemAPI(itemToDelete.id, itemToDelete.ownerId || user.id);
      setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
      addToast(`Deleted "${itemToDelete.title}"`, 'success');
      setItemToDelete(null);
    } catch (e) {
      addToast(e.message, 'error');
      // Intentionally not closing the modal on failure so they can see the error toast
    }
  }, [user, itemToDelete, addToast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        onSearch={handleSearch}
        onMenuClick={() => setFilterDrawerOpen(true)}
        user={user}
        onLoginClick={() => setLoginModalOpen(true)}
        onLogout={() => { setView('browse'); logout(); }}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(d => !d)}
        onMyListings={() => setView('my-listings')}
        onLogoClick={() => setView('browse')}
      />

      {view === 'browse' && (
        <Hero
          onListItem={handleListItem}
          onBrowseDonations={handleBrowseDonations}
          listItemLoading={isSubmittingListing}
          listItemMessage={''}
        />
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {view === 'my-listings' ? (
          <MyListings
            items={items.filter(i => i.ownerId === user?.id || !i.ownerId)} // Show items matching user ID, or items without ownerId (legacy) if we want to be safe, but actually better to strictly match
            loading={itemsLoading}
            onListItem={handleListItem}
            onDelete={handleListingDeleteClick}
            onItemClick={setSelectedItem}
            user={user}
          />
        ) : (
          <div className="flex gap-8 lg:gap-10">
            {/* Desktop sidebar */}
            <div className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-28">
                <FilterSidebar filters={filters} onFiltersChange={setFilters} />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Browse Listings</h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Find exactly what you need</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="nearest">Nearest</option>
                  </select>
                  <button
                    type="button"
                    onClick={fetchItems}
                    disabled={itemsLoading}
                    className="hidden sm:block px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {itemsLoading ? 'Refreshing...' : 'Refresh'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterDrawerOpen(true)}
                    className="lg:hidden px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Filters
                  </button>
                </div>
              </div>
              <ProductGrid
                items={items}
                filters={filters}
                searchQuery={searchQuery}
                userLat={user?.lat ?? null}
                userLng={user?.lng ?? null}
                sortBy={sortBy}
                onItemClick={setSelectedItem}
                user={user}
                onDelete={handleListingDeleteClick}
              />
              {itemsLoading && (
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading latest items...</p>
              )}
              {itemsError && (
                <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">{itemsError}</p>
              )}
            </div>
          </div>
        )}
      </main>

      <FilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      <Modal
        isOpen={listItemModalOpen}
        onClose={() => {
          if (!isSubmittingListing) {
            setListItemModalOpen(false);
            resetListingForm();
            setListItemMessage('');
          }
        }}
        title="List an Item"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Title *
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Algebra II Textbook"
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Add details (condition, edition, notes...)"
              rows={3}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-sm resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-sm"
              >
                {ITEM_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Price (₹) *
              </label>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-sm"
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Set `0` for donation/free items.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Condition
              </label>
              <select
                value={form.condition}
                onChange={(e) => setForm((p) => ({ ...p, condition: e.target.value }))}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-sm"
              >
                <option value="Used">Used</option>
                <option value="New">New</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                School
              </label>
              <select
                value={form.school}
                onChange={(e) => setForm((p) => ({ ...p, school: e.target.value }))}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-sm"
              >
                {PREDEFINED_SCHOOLS.map(s => (
                  <option key={s} value={s}>{s === 'None' ? 'None / Not Applicable' : s}</option>
                ))}
              </select>
              {form.school === 'Other' && (
                <input
                  value={form.customSchool}
                  onChange={(e) => setForm((p) => ({ ...p, customSchool: e.target.value }))}
                  placeholder="Enter school name"
                  className="mt-2 w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-sm"
                />
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Photos
            </label>
            <input
              ref={photoInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                setSelectedPhotos(Array.from(e.target.files || []));
              }}
              className="mt-1 w-full text-sm text-slate-600 dark:text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-200 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-slate-800 hover:file:bg-slate-300 dark:file:bg-slate-700 dark:text-slate-100 dark:hover:file:bg-slate-600"
            />
            {selectedPhotos.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedPhotos.map((file, i) => (
                  <PhotoPreview key={i} file={file} />
                ))}
              </div>
            )}
          </div>

          {listItemMessage ? (
            <p
              className={`text-sm ${
                listItemMessage.startsWith('Item created') ||
                listItemMessage.includes('successfully')
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-amber-600 dark:text-amber-300'
              }`}
            >
              {listItemMessage}
            </p>
          ) : null}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                if (!isSubmittingListing) {
                  setListItemModalOpen(false);
                  resetListingForm();
                  setListItemMessage('');
                }
              }}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmittingListing}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submitListing}
              disabled={isSubmittingListing}
              className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmittingListing ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          userLat={user?.lat ?? null}
          userLng={user?.lng ?? null}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            Are you sure you want to delete <strong>&quot;{itemToDelete?.title}&quot;</strong>? This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setItemToDelete(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
