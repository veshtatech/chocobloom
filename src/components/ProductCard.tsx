import React from 'react';
import { ShoppingBag, Eye, MessageCircle, Sparkles, Check } from 'lucide-react';
import { Product, StoreSettings } from '../types';
import { createQuickInquiryUrl } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  settings: StoreSettings;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  isInCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  settings,
  onAddToCart,
  onQuickView,
  isInCart = false,
}) => {
  const isSoldOut = product.stockStatus === 'sold_out';
  const isLowStock = product.stockStatus === 'low_stock';

  return (
    <div className="group bg-[#FFFDF9] rounded-2xl border border-[#EADBCC] overflow-hidden shadow-xs hover:shadow-lg hover:border-[#D4AF37]/60 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image Container */}
        <div className="relative aspect-4/3 bg-[#F4EDE5] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              isSoldOut ? 'grayscale opacity-75' : ''
            }`}
            loading="lazy"
          />

          {/* Top Overlays */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            {/* Item Code badge styled cleanly */}
            <span className="font-mono text-[11px] font-bold px-2 py-0.5 bg-[#2C1810]/90 backdrop-blur-xs text-[#FAF7F2] rounded-md shadow-xs">
              {product.code}
            </span>

            {/* Status or Best Seller */}
            <div className="flex items-center gap-1.5">
              {isSoldOut ? (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-rose-700 text-white rounded-md shadow-xs">
                  Sold Out
                </span>
              ) : isLowStock ? (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-600 text-white rounded-md shadow-xs">
                  Only few left
                </span>
              ) : product.isFestiveSpecial ? (
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#FAF0E4] text-[#8C5E35] border border-[#E0C7AC] rounded-md shadow-xs flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Diwali Special</span>
                </span>
              ) : null}
            </div>
          </div>

          {/* Quick View Hover Button */}
          <div className="absolute inset-0 bg-[#2C1810]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-4 pointer-events-auto">
            <button
              onClick={() => onQuickView(product)}
              className="px-3.5 py-2 bg-white text-[#2C1810] hover:bg-[#FAF7F2] text-xs font-semibold rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-[#8C5E35]" />
              <span>Quick View</span>
            </button>
            <a
              href={createQuickInquiryUrl(settings, `${product.name} (${product.code})`)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition"
              title="Quick WhatsApp inquiry for this box"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-2.5">
          {/* Metadata clean unboxed row */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#8C766C]">
            <span className="font-semibold text-[#8C5E35] uppercase tracking-wider">
              {product.category.replace('-', ' ')}
            </span>
            {product.dimensions && (
              <>
                <span aria-hidden="true">·</span>
                <span>{product.dimensions}</span>
              </>
            )}
          </div>

          <h3
            onClick={() => onQuickView(product)}
            className="font-serif text-base sm:text-lg font-bold text-[#2C1810] group-hover:text-[#8C5E35] transition cursor-pointer line-clamp-1"
            title={product.name}
          >
            {product.name}
          </h3>

          <p className="text-xs text-[#6B5347] line-clamp-2 leading-relaxed">
            {product.contains || product.description}
          </p>

          {/* Flavours inline snippet */}
          {product.flavours && product.flavours.length > 0 && (
            <div className="text-[11px] text-[#7B6256] truncate">
              <span className="font-medium text-[#4A2E20]">Flavours:</span>{' '}
              {product.flavours.join(', ')}
            </div>
          )}

          {/* Bulk rate footnote */}
          {product.bulkPriceNotice && (
            <div className="text-[10px] text-[#A66228] bg-[#FDF7EE] border border-[#F4E4CE] px-2 py-1 rounded-md line-clamp-1">
              💼 {product.bulkPriceNotice}
            </div>
          )}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="p-4 sm:p-5 pt-0 border-t border-[#F3E7DC] mt-2 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#9C7F72] block">Price</span>
          <span className="font-serif text-lg font-bold text-[#2C1810]">
            {product.price > 0 ? `₹${product.price.toLocaleString('en-IN')}` : 'On Request'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {isSoldOut ? (
            <button
              disabled
              className="px-3.5 py-2 bg-gray-200 text-gray-500 rounded-xl text-xs font-semibold cursor-not-allowed"
            >
              Sold Out
            </button>
          ) : (
            <button
              onClick={() => onAddToCart(product)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                isInCart
                  ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                  : 'bg-[#2C1810] hover:bg-[#4A2E20] text-[#FFFDF9]'
              }`}
            >
              {isInCart ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-[#E8C587]" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
