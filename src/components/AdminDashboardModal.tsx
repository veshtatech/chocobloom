import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Plus,
  Edit2,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Check,
  AlertCircle,
  Eye,
  Settings,
  Package,
  ShoppingBag,
  Sliders,
  DollarSign,
  Smartphone,
  Save,
  FileText,
  Lock,
  Globe,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';
import { Product, StoreSettings, OrderRecord, StockStatus, ProductCategory } from '../types';
import { initialProducts, defaultStoreSettings } from '../data/initialProducts';
import { saveProducts, saveSettings, updateOrderStatus } from '../utils/storage';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  settings: StoreSettings;
  onUpdateSettings: (settings: StoreSettings) => void;
  orders: OrderRecord[];
  onUpdateOrders: (orders: OrderRecord[]) => void;
  onOpenDossier?: () => void;
  isStandaloneRoute?: boolean;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProducts,
  settings,
  onUpdateSettings,
  orders,
  onUpdateOrders,
  onOpenDossier,
  isStandaloneRoute = false,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'settings'>('inventory');

  // Inventory Filter
  const [inventoryStockFilter, setInventoryStockFilter] = useState<'all' | StockStatus>('all');

  // Edit / Add Product State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Cooldown countdown timer
  useEffect(() => {
    if (!lockoutUntil) return;
    const interval = setInterval(() => {
      const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockoutUntil(null);
        setCooldownSeconds(0);
      } else {
        setCooldownSeconds(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  // Keep settings form in sync
  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutUntil && Date.now() < lockoutUntil) return;

    const targetPin = (settings.adminPin && settings.adminPin.trim()) || '241026';
    if (pinInput.trim() === targetPin) {
      setIsAuthenticated(true);
      setPinError(false);
      setFailedAttempts(0);
      setLockoutUntil(null);
    } else {
      const nextFailures = failedAttempts + 1;
      setFailedAttempts(nextFailures);
      setPinError(true);
      if (nextFailures >= 5) {
        setLockoutUntil(Date.now() + 30000);
        setCooldownSeconds(30);
      }
    }
  };

  const handleToggleStock = (product: Product) => {
    const nextStatus: StockStatus =
      product.stockStatus === 'in_stock'
        ? 'sold_out'
        : product.stockStatus === 'sold_out'
        ? 'in_stock'
        : 'in_stock';

    const updated = products.map((p) => (p.id === product.id ? { ...p, stockStatus: nextStatus } : p));
    onUpdateProducts(updated);
    saveProducts(updated);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updated = products.filter((p) => p.id !== productId);
      onUpdateProducts(updated);
      saveProducts(updated);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    let updated: Product[];
    if (isAddingNew) {
      updated = [editingProduct, ...products];
    } else {
      updated = products.map((p) => (p.id === editingProduct.id ? editingProduct : p));
    }

    onUpdateProducts(updated);
    saveProducts(updated);
    setEditingProduct(null);
    setIsAddingNew(false);
  };

  const handleStartAdd = () => {
    setEditingProduct({
      id: `prod_${Date.now()}`,
      code: `CB ${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      category: 'festive-hampers',
      price: 500,
      image: '/assets/aistudio/IMG-20261023-WA0011_5183861f.jpg',
      description: '',
      contains: '',
      flavours: ['Milk Chocolate', 'Dark Truffle'],
      dimensions: '8″ × 8″ Box',
      stockStatus: 'in_stock',
      isFestiveSpecial: true,
      customizationAvailable: true,
    });
    setIsAddingNew(true);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(settingsForm);
    saveSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleOrderStatusChange = (orderId: string, status: OrderRecord['status']) => {
    const updated = updateOrderStatus(orderId, status);
    onUpdateOrders(updated);
  };

  const handleExportOrders = () => {
    if (orders.length === 0) {
      alert('No orders to export yet.');
      return;
    }
    const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Address', 'Total Amount', 'Status', 'Items'];
    const rows = orders.map((o) => [
      o.orderNumber,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.customer.name}"`,
      `"${o.customer.phone}"`,
      `"${o.customer.address}, ${o.customer.cityPincode}"`,
      o.totalAmount,
      o.status,
      `"${o.items.map((i) => `${i.code}: ${i.name} x${i.quantity}`).join('; ')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ChocoBloom_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetCatalogue = () => {
    if (confirm('Reset catalogue back to initial catalogue from PDF? Any custom edits will be replaced.')) {
      onUpdateProducts(initialProducts);
      saveProducts(initialProducts);
      alert('Catalogue restored to factory default!');
    }
  };

  const filteredProducts =
    inventoryStockFilter === 'all'
      ? products
      : products.filter((p) => p.stockStatus === inventoryStockFilter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-5xl bg-[#FFFDF9] rounded-3xl border border-[#EADBCC] shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#EADBCC] bg-[#2C1810] text-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#4A2E20] text-[#E8C587] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <span>ChocoBloom Owner Management Studio</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700">
                  Secure
                </span>
              </h3>
              <p className="text-xs text-[#DAC4B6]">
                Manage catalog, prices, UPI details, WhatsApp inquiries & stock
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#DAC4B6] hover:text-white hover:bg-white/10 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Gate */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF0E4] border border-[#EADBCC] text-[#8C5E35] flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8 text-[#A66228]" />
            </div>
            <div>
              <h4 className="font-serif text-xl font-bold text-[#2C1810]">
                Store Owner Portal
              </h4>
              <p className="text-xs text-[#7B6256] mt-1">
                Enter your confidential administrative PIN to access inventory, pricing, and order controls.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={6}
                  autoFocus
                  disabled={cooldownSeconds > 0}
                  placeholder="Enter 6-Digit Owner PIN"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full text-center tracking-[0.3em] text-xl font-mono p-3 bg-white border border-[#DAC9B7] rounded-xl text-[#2C1810] focus:ring-2 focus:ring-[#D4AF37] disabled:bg-gray-100 disabled:cursor-not-allowed"
                />

                {cooldownSeconds > 0 ? (
                  <p className="text-xs text-rose-600 mt-2 flex items-center justify-center gap-1 font-medium bg-rose-50 p-2 rounded-lg border border-rose-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Too many failed attempts. Try again in {cooldownSeconds}s</span>
                  </p>
                ) : pinError ? (
                  <p className="text-xs text-rose-600 mt-2 flex items-center justify-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> Incorrect PIN. Please try again.
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={cooldownSeconds > 0 || !pinInput.trim()}
                className="w-full py-3 bg-[#2C1810] hover:bg-[#43261A] text-white font-semibold text-xs sm:text-sm rounded-xl transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4 text-[#D4AF37]" />
                <span>Unlock Management Studio</span>
              </button>

              <div className="pt-2 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-[#8C5E35] hover:text-[#2C1810] transition flex items-center gap-1 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Public Website</span>
                </button>
                <p className="text-[11px] text-[#A08B7F]">
                  🔒 Unlisted page · Direct address: <code className="bg-[#F4ECE3] px-1.5 py-0.5 rounded text-[#4A2E20]">/#admin</code>
                </p>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Top Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EADBCC]">
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F1E6DA] rounded-xl border border-[#DFCEBD]">
                <button
                  onClick={() => {
                    setActiveTab('inventory');
                    setEditingProduct(null);
                  }}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-2 ${
                    activeTab === 'inventory'
                      ? 'bg-white text-[#2C1810] shadow-xs'
                      : 'text-[#6D5144] hover:text-[#2C1810]'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Catalogue & Inventory ({products.length})</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('orders');
                    setEditingProduct(null);
                  }}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-2 ${
                    activeTab === 'orders'
                      ? 'bg-white text-[#2C1810] shadow-xs'
                      : 'text-[#6D5144] hover:text-[#2C1810]'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Orders Log ({orders.length})</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setEditingProduct(null);
                  }}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-2 ${
                    activeTab === 'settings'
                      ? 'bg-white text-[#2C1810] shadow-xs'
                      : 'text-[#6D5144] hover:text-[#2C1810]'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Store & UPI Settings</span>
                </button>
                {onOpenDossier && (
                  <button
                    onClick={onOpenDossier}
                    className="px-3.5 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-2 text-[#6D5144] hover:text-[#2C1810] hover:bg-white/60"
                    title="View Technical Architecture, Specifications & UX Strategy Dossier"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#8C5E35]" />
                    <span>Technical & UX Manual</span>
                  </button>
                )}
              </div>

              {activeTab === 'inventory' && !editingProduct && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleStartAdd}
                    className="px-3.5 py-2 bg-[#2C1810] hover:bg-[#43261A] text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Add New Product</span>
                  </button>
                  <button
                    onClick={handleResetCatalogue}
                    className="p-2 text-[#7B6256] hover:text-[#2C1810] hover:bg-[#F3E7DC] rounded-xl transition"
                    title="Restore Original PDF Catalogue"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* TAB 1: INVENTORY & CATALOGUE */}
            {activeTab === 'inventory' && (
              <div className="space-y-4">
                {editingProduct ? (
                  /* Edit / Add Form */
                  <form onSubmit={handleSaveProduct} className="bg-white p-6 rounded-2xl border border-[#EADBCC] space-y-4 shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-[#F0E4D7]">
                      <h4 className="font-serif text-base font-bold text-[#2C1810]">
                        {isAddingNew ? 'Create New Product' : `Edit Product: ${editingProduct.name}`}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="text-xs text-[#7B6256] hover:underline"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[#4A2E20] block mb-1">
                          Product Code (e.g. CD 9, CBHC 101)
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProduct.code}
                          onChange={(e) => setEditingProduct({ ...editingProduct, code: e.target.value })}
                          className="w-full text-xs p-2 bg-[#FAF7F2] border border-[#DAC9B7] rounded-xl text-[#2C1810]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-[#4A2E20] block mb-1">
                          Product Title
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          className="w-full text-xs p-2 bg-[#FAF7F2] border border-[#DAC9B7] rounded-xl text-[#2C1810]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[#4A2E20] block mb-1">
                          Category
                        </label>
                        <select
                          value={editingProduct.category}
                          onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })}
                          className="w-full text-xs p-2 bg-[#FAF7F2] border border-[#DAC9B7] rounded-xl text-[#2C1810]"
                        >
                          <option value="crackers">Diwali Cracker Chocolates</option>
                          <option value="homemade-chocolates">Artisan Chocolates & Truffles</option>
                          <option value="festive-hampers">Festive Hampers & Trays</option>
                          <option value="dry-fruits">Dry Fruit Platters</option>
                          <option value="cookies-brownies">Cookies & Brownies</option>
                          <option value="occasions-trousseau">Trousseau & Occasions</option>
                          <option value="corporate-gifting">Corporate & Custom Logo</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#4A2E20] block mb-1">
                          Price (₹ INR)
                        </label>
                        <input
                          type="number"
                          required
                          value={editingProduct.price}
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                          className="w-full text-xs p-2 bg-[#FAF7F2] border border-[#DAC9B7] rounded-xl text-[#2C1810]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#4A2E20] block mb-1">
                          Stock Status
                        </label>
                        <select
                          value={editingProduct.stockStatus}
                          onChange={(e) => setEditingProduct({ ...editingProduct, stockStatus: e.target.value as StockStatus })}
                          className="w-full text-xs p-2 bg-[#FAF7F2] border border-[#DAC9B7] rounded-xl text-[#2C1810]"
                        >
                          <option value="in_stock">In Stock (Available)</option>
                          <option value="low_stock">Low Stock (Few Left)</option>
                          <option value="sold_out">Sold Out</option>
                          <option value="on_request">On Request</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[#4A2E20] block mb-1">
                          Image URL or Asset Path
                        </label>
                        <input
                          type="text"
                          value={editingProduct.image}
                          onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                          className="w-full text-xs p-2 bg-[#FAF7F2] border border-[#DAC9B7] rounded-xl text-[#2C1810]"
                        />
                        <div className="mt-1 flex gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingProduct({ ...editingProduct, image: '/assets/aistudio/IMG-20261023-WA0011_5183861f.jpg' })}
                            className="text-[10px] text-[#8C5E35] underline"
                          >
                            Set Cracker Photo
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingProduct({ ...editingProduct, image: '/assets/aistudio/IMG-20261023-WA0012_28af9662.jpg' })}
                            className="text-[10px] text-[#8C5E35] underline"
                          >
                            Set Poker Photo
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingProduct({ ...editingProduct, image: '/assets/aistudio/viber_image_2026-10-23_23-40-34-814_5730688d.jpg' })}
                            className="text-[10px] text-[#8C5E35] underline"
                          >
                            Set Google Box Photo
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#4A2E20] block mb-1">
                          Box Dimensions / Size
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 24cm × 10cm"
                          value={editingProduct.dimensions || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, dimensions: e.target.value })}
                          className="w-full text-xs p-2 bg-[#FAF7F2] border border-[#DAC9B7] rounded-xl text-[#2C1810]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#4A2E20] block mb-1">
                        Box Contents Breakdown
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 3 Chakkari, 3 Bomb, 1 Floral Candle"
                        value={editingProduct.contains || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, contains: e.target.value })}
                        className="w-full text-xs p-2 bg-[#FAF7F2] border border-[#DAC9B7] rounded-xl text-[#2C1810]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#4A2E20] block mb-1">
                        Bulk / Corporate Price Notice (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bulk rate: ₹245 + GST (200+ pcs)"
                        value={editingProduct.bulkPriceNotice || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, bulkPriceNotice: e.target.value })}
                        className="w-full text-xs p-2 bg-[#FAF7F2] border border-[#DAC9B7] rounded-xl text-[#2C1810]"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 border border-[#DAC9B7] text-[#4A2E20] text-xs font-semibold rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#2C1810] text-[#FAF7F2] hover:bg-[#43261A] text-xs font-semibold rounded-xl flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Save Product</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    {/* Stock filter tabs */}
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        onClick={() => setInventoryStockFilter('all')}
                        className={`px-3 py-1.5 rounded-lg border ${
                          inventoryStockFilter === 'all'
                            ? 'bg-[#2C1810] text-white border-[#2C1810]'
                            : 'bg-white text-[#5C4337] border-[#DAC9B7]'
                        }`}
                      >
                        All ({products.length})
                      </button>
                      <button
                        onClick={() => setInventoryStockFilter('in_stock')}
                        className={`px-3 py-1.5 rounded-lg border ${
                          inventoryStockFilter === 'in_stock'
                            ? 'bg-emerald-800 text-white border-emerald-800'
                            : 'bg-white text-emerald-800 border-[#DAC9B7]'
                        }`}
                      >
                        In Stock ({products.filter((p) => p.stockStatus === 'in_stock').length})
                      </button>
                      <button
                        onClick={() => setInventoryStockFilter('low_stock')}
                        className={`px-3 py-1.5 rounded-lg border ${
                          inventoryStockFilter === 'low_stock'
                            ? 'bg-amber-700 text-white border-amber-700'
                            : 'bg-white text-amber-800 border-[#DAC9B7]'
                        }`}
                      >
                        Low Stock ({products.filter((p) => p.stockStatus === 'low_stock').length})
                      </button>
                      <button
                        onClick={() => setInventoryStockFilter('sold_out')}
                        className={`px-3 py-1.5 rounded-lg border ${
                          inventoryStockFilter === 'sold_out'
                            ? 'bg-rose-800 text-white border-rose-800'
                            : 'bg-white text-rose-800 border-[#DAC9B7]'
                        }`}
                      >
                        Sold Out ({products.filter((p) => p.stockStatus === 'sold_out').length})
                      </button>
                    </div>

                    {/* Products Table */}
                    <div className="border border-[#EADBCC] rounded-2xl overflow-hidden bg-white shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#FAF5EF] border-b border-[#EADBCC] text-[#7B6256] uppercase font-semibold">
                            <tr>
                              <th className="p-3">Item</th>
                              <th className="p-3">Code</th>
                              <th className="p-3">Category</th>
                              <th className="p-3">Price</th>
                              <th className="p-3">Status</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#F0E4D7]">
                            {filteredProducts.map((p) => (
                              <tr key={p.id} className="hover:bg-[#FFFDF9]">
                                <td className="p-3 flex items-center gap-2.5">
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-9 h-9 rounded-lg object-cover shrink-0 border border-[#EADBCC]"
                                  />
                                  <span className="font-semibold text-[#2C1810] line-clamp-1">
                                    {p.name}
                                  </span>
                                </td>
                                <td className="p-3 font-mono font-bold text-[#8C5E35]">{p.code}</td>
                                <td className="p-3 capitalize text-[#7B6256]">
                                  {p.category.replace('-', ' ')}
                                </td>
                                <td className="p-3 font-serif font-bold text-[#2C1810]">
                                  ₹{p.price.toLocaleString('en-IN')}
                                </td>
                                <td className="p-3">
                                  <button
                                    onClick={() => handleToggleStock(p)}
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${
                                      p.stockStatus === 'in_stock'
                                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                        : p.stockStatus === 'sold_out'
                                        ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}
                                    title="Click to toggle Available / Sold Out"
                                  >
                                    {p.stockStatus === 'in_stock' ? 'Available' : 'Sold Out'}
                                  </button>
                                </td>
                                <td className="p-3 text-right space-x-1 whitespace-nowrap">
                                  <button
                                    onClick={() => {
                                      setEditingProduct(p);
                                      setIsAddingNew(false);
                                    }}
                                    className="p-1.5 text-[#4A2E20] hover:text-[#D4AF37] hover:bg-[#FAF5EF] rounded-lg"
                                    title="Edit details and price"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg"
                                    title="Delete product"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* TAB 2: ORDERS & INQUIRIES LOG */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-base font-bold text-[#2C1810]">
                      Captured Order Inquiries
                    </h4>
                    <p className="text-xs text-[#7B6256]">
                      Every order placed on the website is tracked here for your reference.
                    </p>
                  </div>
                  <button
                    onClick={handleExportOrders}
                    className="px-3.5 py-2 bg-[#FAF0E4] hover:bg-[#F3E2CF] text-[#4A2E20] border border-[#E3CAAF] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5 text-[#8C5E35]" />
                    <span>Export to CSV</span>
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-[#EADBCC] text-[#8C766C] space-y-2">
                    <ShoppingBag className="w-8 h-8 mx-auto stroke-1 text-[#C4ADA1]" />
                    <p className="text-xs">No orders recorded yet. As customers check out, their details and cart breakdowns will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-4 bg-white rounded-2xl border border-[#EADBCC] shadow-xs space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#F0E4D7]">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#2C1810]">
                              #{order.orderNumber}
                            </span>
                            <span className="text-[11px] text-[#8C766C]">
                              {new Date(order.createdAt).toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#8C766C]">Status:</span>
                            <select
                              value={order.status}
                              onChange={(e) => handleOrderStatusChange(order.id, e.target.value as OrderRecord['status'])}
                              className="text-xs font-medium px-2 py-1 bg-[#FAF5EF] border border-[#DAC9B7] rounded-lg"
                            >
                              <option value="awaiting_payment">Awaiting Payment</option>
                              <option value="paid_confirmed">Paid & Confirmed</option>
                              <option value="dispatched">Dispatched</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#5C4337]">
                          <div>
                            <strong className="text-[#2C1810] block">Customer:</strong>
                            <p>{order.customer.name} ({order.customer.phone})</p>
                            <p className="text-[#7B6256]">{order.customer.address}, {order.customer.cityPincode}</p>
                            {order.customer.giftNote && (
                              <p className="text-[#A66228] italic mt-0.5">Card Note: "{order.customer.giftNote}"</p>
                            )}
                          </div>

                          <div>
                            <strong className="text-[#2C1810] block">Ordered Items:</strong>
                            <ul className="list-disc pl-4 space-y-0.5">
                              {order.items.map((i, idx) => (
                                <li key={idx}>
                                  {i.name} ({i.code}) — {i.quantity} pcs (₹{i.subtotal.toLocaleString('en-IN')})
                                </li>
                              ))}
                            </ul>
                            <p className="font-serif font-bold text-[#2C1810] mt-1">
                              Grand Total: ₹{order.totalAmount.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: STORE & UPI SETTINGS */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-[#EADBCC] space-y-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0E4D7]">
                  <div>
                    <h4 className="font-serif text-base font-bold text-[#2C1810]">
                      Store Contact & UPI Configuration
                    </h4>
                    <p className="text-xs text-[#7B6256]">
                      Control where customers message on WhatsApp and where UPI payments are directed.
                    </p>
                  </div>
                  {settingsSaved && (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded">
                      <Check className="w-3.5 h-3.5" /> Saved!
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#4A2E20] block mb-1">
                      Store WhatsApp Number (digits only, with country code)
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.whatsappNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                      className="w-full text-xs p-2 bg-[#FAF7F2] border border-[#DAC9B7] rounded-xl text-[#2C1810]"
                      placeholder="e.g. 919910770118"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4A2E20] block mb-1">
                      Display Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.displayPhone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, displayPhone: e.target.value })}
                      className="w-full text-xs p-2 bg-[#FAF7F2] border border-[#DAC9B7] rounded-xl text-[#2C1810]"
                      placeholder="+91 99107 70118"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#4A2E20] block mb-1">
                      UPI ID (VPA) for Payments & QR Code
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.upiId}
                      onChange={(e) => setSettingsForm({ ...settingsForm, upiId: e.target.value })}
                      className="w-full text-xs p-2 bg-[#FAF7F2] border border-[#DAC9B7] rounded-xl text-[#2C1810]"
                      placeholder="e.g. 9910770118@upi"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4A2E20] block mb-1">
                      UPI Payee Name
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.upiPayeeName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, upiPayeeName: e.target.value })}
                      className="w-full text-xs p-2 bg-[#FAF7F2] border border-[#DAC9B7] rounded-xl text-[#2C1810]"
                      placeholder="ChocoBloom Chocolates"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#4A2E20] block mb-1">
                      Minimum Order Value (₹)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.minOrderAmount}
                      onChange={(e) => setSettingsForm({ ...settingsForm, minOrderAmount: Number(e.target.value) })}
                      className="w-full text-xs p-2 bg-[#FAF7F2] border border-[#DAC9B7] rounded-xl text-[#2C1810]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4A2E20] block mb-1">
                      Free Shipping Above (₹)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.freeShippingAbove}
                      onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingAbove: Number(e.target.value) })}
                      className="w-full text-xs p-2 bg-[#FAF7F2] border border-[#DAC9B7] rounded-xl text-[#2C1810]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4A2E20] block mb-1">
                      Admin Access PIN
                    </label>
                    <input
                      type="text"
                      value={settingsForm.adminPin}
                      onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                      className="w-full text-xs p-2 bg-[#FAF7F2] border border-[#DAC9B7] rounded-xl text-[#2C1810]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#4A2E20] block mb-1">
                    Top Announcement Banner Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcementText}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                    className="w-full text-xs p-2 bg-[#FAF7F2] border border-[#DAC9B7] rounded-xl text-[#2C1810]"
                  />
                </div>

                {/* Private Access Guide */}
                <div className="p-4 bg-[#FAF5EF] rounded-xl border border-[#DFCEBD] space-y-2 text-xs text-[#5C4337]">
                  <div className="flex items-center gap-2 font-bold text-[#2C1810]">
                    <Globe className="w-4 h-4 text-[#8C5E35]" />
                    <span>How to Access Your Private Admin Page</span>
                  </div>
                  <p className="text-[#6D5144]">
                    The public Admin and Architecture icons are now completely hidden so regular visitors cannot see or tamper with them. You can access this portal anytime using any of these private methods:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 font-mono text-[11px] text-[#2C1810]">
                    <li>
                      <strong>Direct URL:</strong>{' '}
                      <span className="text-[#8C5E35] underline">{typeof window !== 'undefined' ? `${window.location.origin}/#admin` : '/#admin'}</span> (or <span className="text-[#8C5E35]">/admin</span>)
                    </li>
                    <li>
                      <strong>Custom Subdomain:</strong> If you set up <code className="bg-white px-1 py-0.5 rounded border border-[#DFCEBD]">admin.chocobloom.com</code>, visiting that domain will automatically launch this screen!
                    </li>
                    <li>
                      <strong>Secret Keyboard Shortcut:</strong> Press{' '}
                      <kbd className="bg-white px-1.5 py-0.5 rounded border border-[#DAC9B7] text-[#2C1810] font-sans font-bold shadow-xs">
                        Ctrl + Shift + A
                      </kbd>{' '}
                      (or <kbd className="bg-white px-1.5 py-0.5 rounded border border-[#DAC9B7] text-[#2C1810] font-sans font-bold shadow-xs">Cmd + Shift + A</kbd> on Mac) on any page.
                    </li>
                  </ul>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#2C1810] hover:bg-[#43261A] text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-xs transition"
                  >
                    <Save className="w-4 h-4 text-[#D4AF37]" />
                    <span>Save Store Settings</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
