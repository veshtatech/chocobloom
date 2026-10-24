import React, { useState } from 'react';
import { X, ShoppingBag, MessageCircle, Sparkles, Check, Package, ShieldCheck, Ruler, Cookie } from 'lucide-react';
import { Product, StoreSettings } from '../types';
import { createQuickInquiryUrl } from '../utils/whatsapp';

interface ProductQuickViewModalProps {
  product: Product | null;
  settings: StoreSettings;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  settings,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');
  const [added, setAdded] = useState(false);

  React.useEffect(() => {
    if (product) {
      setQuantity(1);
      setActiveImage(product.image);
      setAdded(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const isSoldOut = product.stockStatus === 'sold_out';

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const images = [product.image, ...(product.gallery || [])];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-[#FFFDF9] rounded-3xl border border-[#EADBCC] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-[#2C1810]/70 hover:bg-[#2C1810] text-[#FAF7F2] rounded-full transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery View */}
          <div className="bg-[#F6EFE8] p-6 flex flex-col justify-between">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-[#EADBCC] shadow-inner relative">
              <img
                src={activeImage || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 font-mono text-xs font-bold px-2.5 py-1 bg-[#2C1810] text-[#FAF7F2] rounded-lg shadow-xs">
                {product.code}
              </span>
            </div>

            {/* Thumbnail switcher if multiple images */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition ${
                      activeImage === img ? 'border-[#D4AF37] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-[#E8DACB] text-[11px] text-[#7B6256] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Small-batch handmade in Pitampura, New Delhi</span>
            </div>
          </div>

          {/* Details Column */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#8C5E35] font-semibold uppercase tracking-wider">
                  <span>{product.category.replace('-', ' ')}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{product.code}</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#2C1810] mt-1">
                  {product.name}
                </h3>
              </div>

              {/* Price & Bulk Note */}
              <div className="p-3.5 bg-[#FAF3EC] rounded-2xl border border-[#EDDFCF] space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-[#8C766C] uppercase font-semibold">Single Box Price:</span>
                  <span className="font-serif text-2xl font-extrabold text-[#2C1810]">
                    {product.price > 0 ? `₹${product.price.toLocaleString('en-IN')}` : 'On Request'}
                  </span>
                </div>
                {product.bulkPriceNotice && (
                  <p className="text-xs text-[#A66228] font-medium">
                    💼 {product.bulkPriceNotice}
                  </p>
                )}
              </div>

              {/* Contents & Dimensions */}
              <div className="space-y-2 text-xs text-[#5C4337]">
                <div className="flex items-start gap-2.5">
                  <Package className="w-4 h-4 text-[#8C5E35] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#2C1810] block">Box Contents:</strong>
                    <span>{product.contains || product.description}</span>
                  </div>
                </div>

                {product.flavours && product.flavours.length > 0 && (
                  <div className="flex items-start gap-2.5">
                    <Cookie className="w-4 h-4 text-[#8C5E35] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#2C1810] block">Available Flavours:</strong>
                      <span>{product.flavours.join(', ')}</span>
                    </div>
                  </div>
                )}

                {product.dimensions && (
                  <div className="flex items-center gap-2.5">
                    <Ruler className="w-4 h-4 text-[#8C5E35] shrink-0" />
                    <span>Dimensions: <strong>{product.dimensions}</strong></span>
                  </div>
                )}
              </div>

              <p className="text-xs text-[#7B6256] leading-relaxed italic">
                "{product.description}"
              </p>
            </div>

            {/* Actions / Quantity & Add */}
            <div className="space-y-3 pt-4 border-t border-[#F0E4D7]">
              {!isSoldOut ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#4A2E20]">Quantity:</span>
                    <div className="flex items-center border border-[#DAC9B7] rounded-xl overflow-hidden bg-white">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1.5 text-sm text-[#4A2E20] hover:bg-[#F6EFE8] font-bold"
                      >
                        -
                      </button>
                      <span className="px-4 py-1.5 text-xs font-bold text-[#2C1810]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-1.5 text-sm text-[#4A2E20] hover:bg-[#F6EFE8] font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleAdd}
                      className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 ${
                        added
                          ? 'bg-emerald-700 text-white'
                          : 'bg-[#2C1810] hover:bg-[#43261A] text-[#FAF7F2]'
                      }`}
                    >
                      {added ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                          <span>Add to Cart (₹{(product.price * quantity).toLocaleString('en-IN')})</span>
                        </>
                      )}
                    </button>

                    <a
                      href={createQuickInquiryUrl(settings, `${product.name} (Code: ${product.code}) - Qty: ${quantity}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                      title="Direct inquiry on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>
                  </div>
                </>
              ) : (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center text-xs text-rose-800 font-medium">
                  Currently Sold Out. Message on WhatsApp for fresh pre-orders!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
