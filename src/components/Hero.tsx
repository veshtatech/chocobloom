import React from 'react';
import { Sparkles, MessageCircle, ArrowRight, Award, ShieldCheck, Heart } from 'lucide-react';
import { StoreSettings } from '../types';
import { createQuickInquiryUrl } from '../utils/whatsapp';

interface HeroProps {
  settings: StoreSettings;
  onExploreCatalog: () => void;
  onOpenHamperBuilder: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onExploreCatalog,
  onOpenHamperBuilder,
}) => {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#2C1810] via-[#351D14] to-[#24130D] text-[#FAF7F2] py-16 sm:py-24">
      {/* Subtle luxury background filigree / glow */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Brand Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3D2318] border border-[#D4AF37]/40 text-[#E8C587] text-xs font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Diwali 2026 & Festive Gifting Collection Now Live</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FFFDF9] leading-[1.15]">
              Homemade Chocolates Crafted with Passion & Pure Cocoa.
            </h1>

            <p className="text-base sm:text-lg text-[#E3D1C4] max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              From our famous <strong className="text-[#F2E2C4] font-semibold">Cracker Chocolates</strong> and poker card boxes to bespoke wedding trousseaux and custom corporate logo pralines — every batch is handcrafted in Pitampura, New Delhi.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <button
                onClick={onExploreCatalog}
                className="w-full sm:w-auto px-7 py-3.5 bg-linear-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E5BF47] hover:to-[#D4AF37] text-[#2C1810] font-semibold text-sm rounded-xl shadow-lg shadow-[#D4AF37]/20 transition flex items-center justify-center gap-2 group"
              >
                <span>Browse Catalogue</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenHamperBuilder}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#402317] hover:bg-[#4E2B1D] text-[#FAF7F2] border border-[#6D422E] font-medium text-sm rounded-xl transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Customise Hamper</span>
              </button>

              <a
                href={createQuickInquiryUrl(settings, 'Direct WhatsApp Order Inquiry')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order on WhatsApp</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-[#4A2D1F] grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#E8C587] block">
                  100%
                </span>
                <span className="text-[11px] sm:text-xs text-[#C7B2A4]">
                  Pure Cocoa Butter (No Palm Oil)
                </span>
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#E8C587] block">
                  10,000+
                </span>
                <span className="text-[11px] sm:text-xs text-[#C7B2A4]">
                  Festive Hampers Delivered
                </span>
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#E8C587] block">
                  Since 2013
                </span>
                <span className="text-[11px] sm:text-xs text-[#C7B2A4]">
                  Master Handmade Chocolatier
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative card */}
              <div className="relative rounded-3xl p-3 bg-linear-to-b from-[#4A2E20] to-[#1D110C] border border-[#D4AF37]/50 shadow-2xl shadow-black/60">
                <div className="relative overflow-hidden rounded-2xl aspect-4/3 bg-[#1B0F09]">
                  <img
                    src="/assets/aistudio/IMG-20261023-WA0011_5183861f.jpg"
                    alt="ChocoBloom Diwali Cracker Chocolates"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#1D110C] via-transparent to-transparent opacity-80" />
                  
                  {/* Floating Price Tag */}
                  <div className="absolute bottom-3 left-3 right-3 bg-[#FAF7F2]/95 backdrop-blur-md p-3 rounded-xl border border-[#D4AF37]/40 text-[#2C1810] flex items-center justify-between shadow-lg">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5E35] block">
                        Signature Festive Box · CD 9
                      </span>
                      <h3 className="font-serif text-sm font-bold text-[#2C1810]">
                        Diwali Cracker Box with Diya
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-base font-extrabold text-[#2C1810]">
                        ₹290
                      </span>
                      <span className="text-[10px] text-emerald-800 font-semibold block">In Stock</span>
                    </div>
                  </div>
                </div>

                {/* Overlapping Secondary Card */}
                <div className="hidden sm:flex items-center gap-3 absolute -bottom-5 -left-5 bg-[#FAF7F2] text-[#2C1810] p-3 rounded-2xl border border-[#D4AF37] shadow-xl max-w-xs">
                  <img
                    src="/assets/aistudio/IMG-20261023-WA0012_28af9662.jpg"
                    alt="Poker Chocolate Box"
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#EADBCC]"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#A66228] block">Trending Viral</span>
                    <p className="text-xs font-semibold text-[#2C1810]">Poker Cards & Bitcoin Box</p>
                    <p className="text-[11px] text-[#7B6256]">From ₹390 · Direct UPI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
