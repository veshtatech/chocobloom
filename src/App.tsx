import React, { useState, useEffect, useMemo } from 'react';
import { MessageCircle, ShoppingBag, Sparkles, Heart, FileText, Gift, ArrowUp } from 'lucide-react';
import { Product, ProductCategory, CartItem, StoreSettings, OrderRecord } from './types';
import { getStoredProducts, getStoredSettings, getStoredOrders } from './utils/storage';
import { createQuickInquiryUrl } from './utils/whatsapp';

// Components
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BrandStory } from './components/BrandStory';
import { CategoryNav } from './components/CategoryNav';
import { ProductCard } from './components/ProductCard';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CustomHamperBuilderModal } from './components/CustomHamperBuilderModal';
import { Testimonials } from './components/Testimonials';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { StrategyDossierModal } from './components/StrategyDossierModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { Footer } from './components/Footer';

export default function App() {
  // State
  const [products, setProducts] = useState<Product[]>(getStoredProducts);
  const [settings, setSettings] = useState<StoreSettings>(getStoredSettings);
  const [orders, setOrders] = useState<OrderRecord[]>(getStoredOrders);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('chocobloom_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock'>('all');

  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isHamperBuilderOpen, setIsHamperBuilderOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState('');

  // Cart customization
  const [giftNote, setGiftNote] = useState('');
  const [isGiftWrapped, setIsGiftWrapped] = useState(true);

  // Check URL hash, path, query, and subdomain for secret admin access
  const checkAdminRoute = () => {
    if (typeof window === 'undefined') return false;
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    const host = window.location.hostname.toLowerCase();
    const search = window.location.search.toLowerCase();

    // 1. Subdomain: e.g. admin.chocobloom.com
    const isSubdomain = host.startsWith('admin.');
    // 2. Hash routing: #admin or #/admin or #owner
    const isHash = hash === '#admin' || hash.startsWith('#/admin') || hash === '#owner';
    // 3. Path routing: /admin
    const isPath = path === '/admin' || path.startsWith('/admin/');
    // 4. Query: ?admin or ?page=admin
    const isQuery = search.includes('admin');

    return isSubdomain || isHash || isPath || isQuery;
  };

  const checkDossierRoute = () => {
    if (typeof window === 'undefined') return false;
    const hash = window.location.hash.toLowerCase();
    return hash === '#dossier' || hash === '#docs' || hash === '#specs' || hash === '#manual';
  };

  const checkTrackingRoute = () => {
    if (typeof window === 'undefined') return { shouldOpen: false, id: '' };
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    if (hash.startsWith('#track') || hash.startsWith('#order') || search.includes('track=')) {
      const match = window.location.href.match(/(?:#track[=\/]|#order[=\/]|track=|order=)([\w-]+)/i);
      return { shouldOpen: true, id: match ? match[1] : '' };
    }
    return { shouldOpen: false, id: '' };
  };

  // Sync cart to local storage and bind secret URL routes
  useEffect(() => {
    try {
      localStorage.setItem('chocobloom_cart_v1', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    if (checkAdminRoute()) {
      setIsAdminOpen(true);
    }
    if (checkDossierRoute()) {
      setIsDossierOpen(true);
    }
    const trackingInfo = checkTrackingRoute();
    if (trackingInfo.shouldOpen) {
      if (trackingInfo.id) setTrackingOrderId(trackingInfo.id);
      setIsTrackingOpen(true);
    }

    const handleLocationChange = () => {
      if (checkAdminRoute()) {
        setIsAdminOpen(true);
      }
      if (checkDossierRoute()) {
        setIsDossierOpen(true);
      }
      const tInfo = checkTrackingRoute();
      if (tInfo.shouldOpen) {
        if (tInfo.id) setTrackingOrderId(tInfo.id);
        setIsTrackingOpen(true);
      }
    };

    // Secret shortcut: Ctrl+Shift+A (or Cmd+Shift+A on Mac)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#admin' || window.location.hash.startsWith('#/admin')) {
        window.history.replaceState(null, '', window.location.pathname);
      } else if (window.location.pathname.startsWith('/admin')) {
        window.history.replaceState(null, '', '/');
      }
    }
  };

  const handleOpenTracking = (orderId?: string) => {
    if (orderId) {
      setTrackingOrderId(orderId);
    }
    setIsTrackingOpen(true);
  };

  // Cart actions
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleOrderSuccess = () => {
    setCart([]);
    setGiftNote('');
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Stock filter
      if (stockFilter === 'in_stock' && p.stockStatus === 'sold_out') {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesCode = p.code.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesContains = p.contains.toLowerCase().includes(query);
        const matchesFlavours = p.flavours?.some((f) => f.toLowerCase().includes(query));
        return matchesName || matchesCode || matchesDesc || matchesContains || matchesFlavours;
      }
      return true;
    });
  }, [products, selectedCategory, stockFilter, searchQuery]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2C1810]">
      {/* Top Header */}
      <Header
        settings={settings}
        cartCount={cartCount}
        cartSubtotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracking={handleOpenTracking}
        onOpenHamperBuilder={() => setIsHamperBuilderOpen(true)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToCatalog();
        }}
      />

      {/* Main Hero Section */}
      <Hero
        settings={settings}
        onExploreCatalog={scrollToCatalog}
        onOpenHamperBuilder={() => setIsHamperBuilderOpen(true)}
      />

      {/* Brand Story & Artisanal Highlights */}
      <BrandStory
        settings={settings}
        onOpenHamperBuilder={() => setIsHamperBuilderOpen(true)}
      />

      {/* Interactive Catalog Section */}
      <main id="catalog-section" className="flex-1">
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          stockFilter={stockFilter}
          onStockFilterChange={setStockFilter}
          itemCount={filteredProducts.length}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#EADBCC] p-8 space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#FAF0E4] flex items-center justify-center mx-auto text-[#8C5E35]">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2C1810]">
                No matching chocolates found
              </h3>
              <p className="text-xs text-[#7B6256]">
                Try adjusting your search terms or view our all-time festive collections.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setStockFilter('all');
                }}
                className="px-5 py-2.5 bg-[#2C1810] text-[#FAF7F2] text-xs font-semibold rounded-xl hover:bg-[#43261A] transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const inCart = cart.some((i) => i.product.id === product.id);
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    settings={settings}
                    isInCart={inCart}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Testimonials */}
      <Testimonials />

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenTracking={handleOpenTracking}
        onOpenHamperBuilder={() => setIsHamperBuilderOpen(true)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToCatalog();
        }}
      />

      {/* Floating Sticky WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <a
          href={createQuickInquiryUrl(settings)}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-white"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-white" />
          <span className="text-xs font-bold tracking-wide hidden sm:inline">
            Direct WhatsApp
          </span>
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </span>
        </a>
      </div>

      {/* MODALS */}

      {/* 1. Product Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        settings={settings}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p, qty) => {
          handleAddToCart(p, qty);
          setQuickViewProduct(null);
          setIsCartOpen(true);
        }}
      />

      {/* 2. Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        settings={settings}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        giftNote={giftNote}
        onGiftNoteChange={setGiftNote}
        isGiftWrapped={isGiftWrapped}
        onToggleGiftWrap={setIsGiftWrapped}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 3. Checkout & WhatsApp Finalization Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onBackToCart={() => {
          setIsCheckoutOpen(false);
          setIsCartOpen(true);
        }}
        items={cart}
        settings={settings}
        giftNote={giftNote}
        isGiftWrapped={isGiftWrapped}
        onOrderSuccess={handleOrderSuccess}
        onTrackOrder={handleOpenTracking}
        onOrderCreated={(newOrder) => setOrders((prev) => [newOrder, ...prev])}
      />

      {/* 4. Custom Hamper Builder Modal */}
      <CustomHamperBuilderModal
        isOpen={isHamperBuilderOpen}
        onClose={() => setIsHamperBuilderOpen(false)}
        settings={settings}
      />

      {/* 5. Owner Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={handleCloseAdmin}
        products={products}
        onUpdateProducts={setProducts}
        settings={settings}
        onUpdateSettings={setSettings}
        orders={orders}
        onUpdateOrders={setOrders}
        onOpenDossier={() => setIsDossierOpen(true)}
      />

      {/* 6. Strategic Architecture & Wireframe Dossier */}
      <StrategyDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        settings={settings}
      />

      {/* 7. Live Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => {
          setIsTrackingOpen(false);
          setTrackingOrderId('');
        }}
        orders={orders}
        settings={settings}
        initialOrderId={trackingOrderId}
        onUpdateOrders={setOrders}
      />
    </div>
  );
}
