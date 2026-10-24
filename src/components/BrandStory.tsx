import React from 'react';
import { Heart, Sparkles, Shield, Gift, Truck, CheckCircle2, FileDown, ArrowRight } from 'lucide-react';
import { StoreSettings } from '../types';

interface BrandStoryProps {
  settings: StoreSettings;
  onOpenHamperBuilder: () => void;
}

export const BrandStory: React.FC<BrandStoryProps> = ({ settings, onOpenHamperBuilder }) => {
  return (
    <section className="py-16 sm:py-20 bg-[#FAF7F2] border-b border-[#EADBCC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro Tagline */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#8C5E35]">
            Handmade with Love · Since 2013
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810]">
            The ChocoBloom Craft & Heritage
          </h2>
          <p className="text-sm sm:text-base text-[#684C3F] font-light leading-relaxed">
            We believe chocolate should taste like celebration, warmth, and genuine craftsmanship. Starting as a boutique kitchen in Pitampura, Delhi, ChocoBloom has grown through word-of-mouth trust into one of the most loved artisanal chocolate and bespoke gifting studios.
          </p>
        </div>

        {/* 4 Core Pillars */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#EADBCC] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FAF0E4] text-[#8C5E35] flex items-center justify-center">
              <Heart className="w-6 h-6 text-[#A66228]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#2C1810]">Pure Ingredients</h3>
            <p className="text-xs sm:text-sm text-[#7B6256] leading-relaxed">
              Crafted with fine imported cocoa butter and roasted California nuts. No hydrogenated compound fats, no synthetic fillers.
            </p>
          </div>

          <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#EADBCC] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FAF0E4] text-[#8C5E35] flex items-center justify-center">
              <Gift className="w-6 h-6 text-[#A66228]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#2C1810]">Complete Customisation</h3>
            <p className="text-xs sm:text-sm text-[#7B6256] leading-relaxed">
              Tell us your occasion, budget, and count. We design custom sleeves, edible logo printing, personalized greeting cards, and ribbons.
            </p>
          </div>

          <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#EADBCC] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FAF0E4] text-[#8C5E35] flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#A66228]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#2C1810]">Zero Gateway Friction</h3>
            <p className="text-xs sm:text-sm text-[#7B6256] leading-relaxed">
              No passwords or confusing payment gateways. Send your cart directly to WhatsApp, pay safely via UPI, and chat directly with the chocolatier.
            </p>
          </div>

          <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#EADBCC] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FAF0E4] text-[#8C5E35] flex items-center justify-center">
              <Truck className="w-6 h-6 text-[#A66228]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#2C1810]">Pan-India Safe Pack</h3>
            <p className="text-xs sm:text-sm text-[#7B6256] leading-relaxed">
              Insulated temperature-conscious packaging for safe transit across Delhi-NCR and major Indian cities, ensuring zero melting.
            </p>
          </div>
        </div>

        {/* Custom Order Callout Banner */}
        <div className="mt-12 bg-linear-to-r from-[#3A1F14] to-[#25120B] rounded-3xl p-6 sm:p-10 text-[#FAF7F2] border border-[#D4AF37]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#D4AF37]">
              Corporate & Special Occasions
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Planning a Wedding, Baby Shower, or Corporate Festive Order?
            </h3>
            <p className="text-xs sm:text-sm text-[#D7C4B7] max-w-xl">
              We provide corporate GST billing, branded company logos on chocolates, custom wooden trays, and dedicated bulk pricing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={onOpenHamperBuilder}
              className="px-6 py-3 bg-[#D4AF37] hover:bg-[#E2BF4C] text-[#2C1810] font-semibold text-xs sm:text-sm rounded-xl transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Hamper Builder</span>
            </button>

            <a
              href="/assets/aistudio/ChocoBloom_Premium_Catalogue_8414bb63.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm rounded-xl transition flex items-center gap-2 border border-white/20"
            >
              <FileDown className="w-4 h-4 text-[#D4AF37]" />
              <span>PDF Catalogue (27 pgs)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
