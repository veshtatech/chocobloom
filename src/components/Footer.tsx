import React from 'react';
import { Heart, MessageCircle, Instagram, Mail, MapPin, Phone, Sparkles, BookOpen, Truck } from 'lucide-react';
import { StoreSettings } from '../types';
import { createQuickInquiryUrl } from '../utils/whatsapp';

interface FooterProps {
  settings: StoreSettings;
  onOpenAdmin?: () => void;
  onOpenDossier?: () => void;
  onOpenTracking?: () => void;
  onOpenHamperBuilder: () => void;
  onSelectCategory: (cat: any) => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenAdmin,
  onOpenDossier,
  onOpenTracking,
  onOpenHamperBuilder,
  onSelectCategory,
}) => {
  return (
    <footer className="bg-[#24130D] text-[#FAF7F2] border-t border-[#3D2318] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#3D2318]">
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#4A2E20] to-[#140B07] border border-[#D4AF37] flex items-center justify-center">
                <span className="font-serif italic font-bold text-base text-[#F2E2C4]">CB</span>
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                ChocoBloom
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#D7C4B7] leading-relaxed max-w-sm">
              Artisanal homemade chocolates, Diwali cracker collections, festive hampers, and bespoke wedding trousseaux. Handcrafted with love in Pitampura, New Delhi.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={createQuickInquiryUrl(settings)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-emerald-700/80 hover:bg-emerald-700 text-white rounded-xl transition flex items-center gap-2 text-xs font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={`https://instagram.com/${settings.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-pink-900/60 hover:bg-pink-900 text-white rounded-xl transition flex items-center gap-2 text-xs font-semibold border border-pink-700/40"
              >
                <Instagram className="w-4 h-4 text-pink-300" />
                <span>@{settings.instagramHandle}</span>
              </a>
            </div>
          </div>

          {/* Quick Collections */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#E8C587] uppercase tracking-wider">
              Signature Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#D7C4B7]">
              <li>
                <button
                  onClick={() => onSelectCategory('crackers')}
                  className="hover:text-[#D4AF37] transition text-left"
                >
                  Diwali Cracker Chocolates (CD Series)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('homemade-chocolates')}
                  className="hover:text-[#D4AF37] transition text-left"
                >
                  Artisan Chocolates & Truffles (9, 16, 25 pcs)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('festive-hampers')}
                  className="hover:text-[#D4AF37] transition text-left"
                >
                  Big Festive Trays & Wooden Baskets
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('corporate-gifting')}
                  className="hover:text-[#D4AF37] transition text-left"
                >
                  Corporate Custom Edible Logo Boxes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('dry-fruits')}
                  className="hover:text-[#D4AF37] transition text-left"
                >
                  Dry Fruit Jars & Chocolate Clusters
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenHamperBuilder}
                  className="text-[#D4AF37] font-semibold hover:underline flex items-center gap-1 pt-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Custom Hamper Inquiry</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Studio Contacts & Payment Info */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#E8C587] uppercase tracking-wider">
              Boutique Studio & UPI
            </h4>
            <div className="space-y-2 text-xs text-[#D7C4B7]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{settings.location}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href={`tel:${settings.whatsappNumber}`} className="hover:text-white transition">
                  {settings.displayPhone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition">
                  {settings.email}
                </a>
              </div>
            </div>

            <div className="pt-3 border-t border-[#3D2318] text-xs space-y-1">
              <span className="text-[#8C766C] block">Direct UPI Payments:</span>
              <p className="font-mono text-[11px] text-[#F2E2C4] font-semibold bg-[#351D14] p-2 rounded-lg border border-[#4A2D1F]">
                VPA: {settings.upiId} ({settings.upiPayeeName})
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A08B7F]">
          <p>© {new Date().getFullYear()} ChocoBloom. All rights reserved. Handmade with love.</p>

          <div className="flex items-center gap-4">
            {onOpenTracking && (
              <button
                onClick={onOpenTracking}
                className="hover:text-[#D4AF37] transition flex items-center gap-1.5 text-xs text-[#D7C4B7]"
              >
                <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Track Order</span>
              </button>
            )}

            <a
              href="/assets/aistudio/ChocoBloom_Premium_Catalogue_8414bb63.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D4AF37] transition flex items-center gap-1.5 text-xs text-[#D7C4B7]"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Original PDF Catalogue</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
