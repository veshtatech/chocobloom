import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Menu, X, Sparkles, BookOpen, Truck } from 'lucide-react';
import { StoreSettings } from '../types';
import { createQuickInquiryUrl } from '../utils/whatsapp';

interface HeaderProps {
  settings: StoreSettings;
  cartCount: number;
  cartSubtotal: number;
  onOpenCart: () => void;
  onOpenAdmin?: () => void;
  onOpenDossier?: () => void;
  onOpenTracking?: () => void;
  onOpenHamperBuilder: () => void;
  onSelectCategory: (cat: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  cartCount,
  cartSubtotal,
  onOpenCart,
  onOpenAdmin,
  onOpenDossier,
  onOpenTracking,
  onOpenHamperBuilder,
  onSelectCategory,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (catId?: string) => {
    if (catId) {
      onSelectCategory(catId);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EADBCC]">
      {/* Top Announcement Bar */}
      {settings.showAnnouncement && (
        <div className="bg-[#2C1810] text-[#F3E7DC] text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
          <span>{settings.announcementText}</span>
          <a
            href={createQuickInquiryUrl(settings, 'Diwali Hamper Pre-Booking')}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline underline text-[#D4AF37] hover:text-[#F3E7DC] transition ml-1"
          >
            Pre-book on WhatsApp →
          </a>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#4A2E20] hover:text-[#2C1810] focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo & Monogram */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('all')}>
            <div className="w-11 h-11 rounded-full bg-linear-to-br from-[#4A2E20] to-[#1D110C] border border-[#D4AF37] flex items-center justify-center shadow-md shadow-[#2C1810]/15 shrink-0">
              <span className="font-serif italic font-bold text-lg text-[#F2E2C4] tracking-tighter">
                CB
              </span>
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2C1810] block leading-none">
                ChocoBloom
              </span>
              <span className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-[#8C5E35] font-semibold block mt-0.5">
                Artisanal Chocolates · Pitampura
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-[#4A2E20]">
            <button
              onClick={() => handleNavClick('all')}
              className="hover:text-[#8C5E35] transition py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#D4AF37] after:transition-all"
            >
              All Creations
            </button>
            <button
              onClick={() => handleNavClick('crackers')}
              className="hover:text-[#8C5E35] transition py-1 flex items-center gap-1.5"
            >
              <span>Cracker Chocolates</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-[#FAF0E4] text-[#A66228] font-bold rounded-sm border border-[#E9CBA8]">
                DIWALI
              </span>
            </button>
            <button
              onClick={() => handleNavClick('festive-hampers')}
              className="hover:text-[#8C5E35] transition py-1"
            >
              Luxury Hampers
            </button>
            <button
              onClick={() => handleNavClick('corporate-gifting')}
              className="hover:text-[#8C5E35] transition py-1"
            >
              Corporate & Logo
            </button>
            <button
              onClick={onOpenHamperBuilder}
              className="hover:text-[#8C5E35] text-[#8C5E35] transition py-1 font-semibold flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Custom Order</span>
            </button>
            <button
              onClick={onOpenTracking}
              className="hover:text-[#8C5E35] transition py-1 flex items-center gap-1.5 text-xs text-[#7B6256]"
              title="Track your order status live"
            >
              <Truck className="w-3.5 h-3.5 text-[#A66228]" />
              <span>Track Order</span>
            </button>
            <a
              href="/assets/aistudio/ChocoBloom_Premium_Catalogue_8414bb63.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#8C5E35] transition py-1 flex items-center gap-1 text-xs text-[#7B6256]"
              title="View Original Gifting Catalogue PDF"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#A66228]" />
              <span>PDF Catalogue</span>
            </a>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Direct WhatsApp Quick Contact */}
            <a
              href={createQuickInquiryUrl(settings)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl transition"
              title="Chat directly on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600/20" />
              <span className="font-semibold">WhatsApp Us</span>
            </a>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-[#2C1810] text-[#FDF9F5] hover:bg-[#43261A] px-3.5 py-2 rounded-xl shadow-xs transition"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#E8C587]" />
              {cartCount > 0 && (
                <span className="bg-[#D4AF37] text-[#2C1810] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                  {cartCount}
                </span>
              )}
              {cartSubtotal > 0 && (
                <span className="hidden xl:inline text-xs font-serif font-bold text-[#F2E2C4]">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFDF9] border-b border-[#EADBCC] px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <button
              onClick={() => handleNavClick('all')}
              className="text-left px-3 py-2 rounded-lg bg-[#FAF5EF] text-[#2C1810]"
            >
              All Creations
            </button>
            <button
              onClick={() => handleNavClick('crackers')}
              className="text-left px-3 py-2 rounded-lg bg-[#FAF5EF] text-[#8C5E35] font-semibold"
            >
              🎆 Cracker Chocolates
            </button>
            <button
              onClick={() => handleNavClick('festive-hampers')}
              className="text-left px-3 py-2 rounded-lg bg-[#FAF5EF] text-[#2C1810]"
            >
              🎁 Luxury Hampers
            </button>
            <button
              onClick={() => handleNavClick('corporate-gifting')}
              className="text-left px-3 py-2 rounded-lg bg-[#FAF5EF] text-[#2C1810]"
            >
              🏢 Corporate & Logo
            </button>
            <button
              onClick={() => handleNavClick('dry-fruits')}
              className="text-left px-3 py-2 rounded-lg bg-[#FAF5EF] text-[#2C1810]"
            >
              🥜 Dry Fruit Platters
            </button>
            <button
              onClick={() => handleNavClick('cookies-brownies')}
              className="text-left px-3 py-2 rounded-lg bg-[#FAF5EF] text-[#2C1810]"
            >
              🍪 Cookies & Brownies
            </button>
          </div>

          <div className="pt-2 border-t border-[#F0E4D7] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenHamperBuilder();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#4A2E20] text-[#FDF9F5] rounded-xl font-medium text-sm"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Custom Hamper & Bulk Inquiry</span>
            </button>

            {onOpenTracking && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTracking();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 bg-[#FAF0E4] text-[#4A2E20] border border-[#E3CAAF] rounded-xl font-medium text-xs transition"
              >
                <Truck className="w-4 h-4 text-[#8C5E35]" />
                <span>Track Your Order Status Live</span>
              </button>
            )}

            <a
              href="/assets/aistudio/ChocoBloom_Premium_Catalogue_8414bb63.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center text-xs text-[#7B6256] py-1 underline"
            >
              Download Original PDF Catalogue (27 Pages)
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
