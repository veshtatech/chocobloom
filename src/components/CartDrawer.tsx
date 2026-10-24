import React from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, Gift, Sparkles, AlertCircle } from 'lucide-react';
import { CartItem, StoreSettings } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  settings: StoreSettings;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  giftNote: string;
  onGiftNoteChange: (note: string) => void;
  isGiftWrapped: boolean;
  onToggleGiftWrap: (val: boolean) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  settings,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  giftNote,
  onGiftNoteChange,
  isGiftWrapped,
  onToggleGiftWrap,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isMinMet = subtotal >= settings.minOrderAmount;
  const freeShippingDelta = Math.max(0, settings.freeShippingAbove - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] border-l border-[#EADBCC] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-[#EADBCC] bg-[#FFFDF9] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#2C1810] text-[#E8C587] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                  Your Chocolate Hamper
                </h3>
                <p className="text-xs text-[#7B6256]">
                  {items.length} {items.length === 1 ? 'selection' : 'selections'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#7B6256] hover:text-[#2C1810] hover:bg-[#F3E7DC] rounded-xl transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Shipping notice */}
          {items.length > 0 && (
            <div className="bg-[#FAF0E4] px-5 py-2.5 border-b border-[#EADBCC] text-xs text-[#6D4C3D] flex items-center justify-between">
              {freeShippingDelta > 0 ? (
                <span>
                  Add <strong className="text-[#2C1810]">₹{freeShippingDelta.toLocaleString('en-IN')}</strong> more for complimentary delivery!
                </span>
              ) : (
                <span className="text-emerald-800 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> You unlocked Complimentary Delivery!
                </span>
              )}
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-[#8C766C]">
                <div className="w-16 h-16 rounded-full bg-[#F3E7DC] flex items-center justify-center text-[#B08968]">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-semibold text-[#2C1810]">
                    Your Hamper is Empty
                  </h4>
                  <p className="text-xs text-[#7B6256] mt-1 max-w-xs">
                    Explore our festive cracker chocolates, dry fruit boxes, or artisan pralines to create a delicious gift.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#2C1810] text-[#FAF7F2] rounded-xl text-xs font-semibold hover:bg-[#43261A] transition"
                >
                  Start Browsing
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white p-3.5 rounded-2xl border border-[#EADBCC] shadow-xs flex gap-3.5"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-18 h-18 rounded-xl object-cover border border-[#EADBCC] shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-[#8C5E35] bg-[#FAF2E8] px-1.5 py-0.5 rounded">
                          {item.product.code}
                        </span>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-[#A0887D] hover:text-rose-700 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h5 className="font-serif text-xs font-bold text-[#2C1810] truncate mt-1">
                        {item.product.name}
                      </h5>
                      <span className="text-xs font-bold text-[#4A2E20] block mt-0.5">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center border border-[#DAC9B7] rounded-lg overflow-hidden bg-[#FAF7F2]">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-[#4A2E20] hover:bg-[#EDE1D3]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-[#2C1810]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-[#4A2E20] hover:bg-[#EDE1D3]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-xs font-serif font-bold text-[#2C1810]">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Packaging and Card Add-ons */}
            {items.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-[#EADBCC]">
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#EADBCC] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGiftWrapped}
                    onChange={(e) => onToggleGiftWrap(e.target.checked)}
                    className="w-4 h-4 accent-[#2C1810] rounded"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-[#2C1810] flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Complimentary Luxury Festive Ribbon & Greeting Card
                    </span>
                    <span className="text-[#8C766C] block text-[11px]">Free of charge</span>
                  </div>
                </label>

                {isGiftWrapped && (
                  <div>
                    <label className="text-[11px] font-semibold text-[#4A2E20] block mb-1">
                      Custom Message for Recipient:
                    </label>
                    <textarea
                      value={giftNote}
                      onChange={(e) => onGiftNoteChange(e.target.value)}
                      placeholder="e.g. Wishing you and family a sweet and prosperous Diwali! Warm regards from..."
                      rows={2}
                      className="w-full text-xs p-2.5 bg-white border border-[#DAC9B7] rounded-xl text-[#2C1810] placeholder-[#A68F84] focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]/50"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Checkout Bar */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#EADBCC] bg-[#FFFDF9] space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-[#7B6256]">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-[#2C1810]">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#7B6256]">
                  <span>Delivery:</span>
                  <span className="font-semibold text-emerald-800">
                    {subtotal >= settings.freeShippingAbove ? 'FREE' : 'Calculated on WhatsApp'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t border-[#F0E4D7]">
                  <span className="font-serif font-bold text-[#2C1810]">Estimated Total:</span>
                  <span className="font-serif text-xl font-bold text-[#2C1810]">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {!isMinMet && (
                <div className="flex items-center gap-1.5 p-2 bg-amber-50 border border-amber-200 text-amber-900 text-[11px] rounded-lg">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Minimum order value is ₹{settings.minOrderAmount}. Please add ₹{settings.minOrderAmount - subtotal} more.</span>
                </div>
              )}

              <button
                disabled={!isMinMet}
                onClick={onProceedToCheckout}
                className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 ${
                  isMinMet
                    ? 'bg-[#2C1810] hover:bg-[#43261A] text-[#FAF7F2] shadow-lg shadow-[#2C1810]/20'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>Enter Delivery Details & WhatsApp Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-[#8C766C]">
                🔒 No credit card or login needed · Instant WhatsApp confirmation
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
