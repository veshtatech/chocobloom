import React, { useState } from 'react';
import { X, Sparkles, MessageCircle, Gift, Check, Palette, Building, HeartHandshake } from 'lucide-react';
import { StoreSettings } from '../types';
import { createCustomHamperUrl } from '../utils/whatsapp';

interface CustomHamperBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
}

export const CustomHamperBuilderModal: React.FC<CustomHamperBuilderModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  const [occasion, setOccasion] = useState('Diwali & Festive Gifting');
  const [quantity, setQuantity] = useState('25 - 50 boxes');
  const [budget, setBudget] = useState('₹500 – ₹1,000 per box');
  const [inclusions, setInclusions] = useState<string[]>([
    'Cracker Chocolates',
    'Dry Fruits & Diyas',
    'Custom Greeting Card',
  ]);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const toggleInclusion = (item: string) => {
    if (inclusions.includes(item)) {
      setInclusions(inclusions.filter((i) => i !== item));
    } else {
      setInclusions([...inclusions, item]);
    }
  };

  const handleSendInquiry = () => {
    const combinedNotes = `Inclusions: ${inclusions.join(', ')}. ${notes ? `Special Notes: ${notes}` : ''}`;
    const url = createCustomHamperUrl(settings, occasion, budget, quantity, combinedNotes);
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const occasionOptions = [
    'Diwali & Festive Gifting',
    'Corporate Diwali & Client Hampers',
    'Wedding Trousseau & Room Hampers',
    'Bachelorette & Bridesmaid Favours',
    'Baby Shower & Naming Ceremony',
    'Birthday & Anniversary Platters',
  ];

  const inclusionOptions = [
    'Cracker Chocolates (Sutli, Rocket, Chakri)',
    'Dry Fruits (Badam, Kaju, Kishmish)',
    'Handcrafted Cookies & Fudge Brownies',
    'Terracotta & Brass Diyas / Urli Candles',
    'Edible Corporate Logo Printed Chocolates',
    'Custom Printed Outer Sleeve / Brand Tag',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-xl bg-[#FFFDF9] rounded-3xl border border-[#EADBCC] shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#EADBCC] bg-[#2C1810] text-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#4A2E20] text-[#E8C587] flex items-center justify-center">
              <Gift className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Bespoke Hamper & Bulk Customizer
              </h3>
              <p className="text-xs text-[#E0C9BA]">
                Tailored around your budget, occasion, and packing preferences
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#E0C9BA] hover:text-white hover:bg-white/10 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Occasion */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8C5E35] block mb-2">
              1. Select Occasion
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {occasionOptions.map((occ) => (
                <button
                  key={occ}
                  type="button"
                  onClick={() => setOccasion(occ)}
                  className={`p-2.5 rounded-xl text-left border transition ${
                    occasion === occ
                      ? 'bg-[#2C1810] text-[#FAF7F2] border-[#2C1810] font-semibold shadow-xs'
                      : 'bg-white text-[#4A2E20] border-[#EADBCC] hover:bg-[#FAF5EF]'
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          {/* Budget & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#8C5E35] block mb-1.5">
                2. Approximate Quantity
              </label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-[#DAC9B7] rounded-xl text-[#2C1810]"
              >
                <option value="1 – 10 boxes (Family Gift)">1 – 10 boxes (Family Gift)</option>
                <option value="11 – 30 boxes (Celebration)">11 – 30 boxes (Celebration)</option>
                <option value="30 – 100 boxes (Corporate)">30 – 100 boxes (Corporate)</option>
                <option value="100 – 300 boxes (Bulk Festival)">100 – 300 boxes (Bulk Festival)</option>
                <option value="500+ boxes (Large Event)">500+ boxes (Large Event)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#8C5E35] block mb-1.5">
                3. Budget per Hamper
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-[#DAC9B7] rounded-xl text-[#2C1810]"
              >
                <option value="₹250 – ₹450 (Sweet Budget)">₹250 – ₹450 (Sweet Budget)</option>
                <option value="₹500 – ₹1,000 (Popular Festive)">₹500 – ₹1,000 (Popular Festive)</option>
                <option value="₹1,000 – ₹2,000 (Luxury Hamper)">₹1,000 – ₹2,000 (Luxury Hamper)</option>
                <option value="₹2,000 – ₹4,000 (Royal Grandeur)">₹2,000 – ₹4,000 (Royal Grandeur)</option>
              </select>
            </div>
          </div>

          {/* Inclusions */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8C5E35] block mb-2">
              4. Desired Inclusions
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {inclusionOptions.map((inc) => {
                const checked = inclusions.includes(inc);
                return (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => toggleInclusion(inc)}
                    className={`p-2.5 rounded-xl text-left border flex items-center justify-between transition ${
                      checked
                        ? 'bg-[#FAF2E8] border-[#D4AF37] text-[#2C1810] font-semibold'
                        : 'bg-white border-[#EADBCC] text-[#6D5144] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <span>{inc}</span>
                    {checked && <Check className="w-4 h-4 text-[#A66228] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8C5E35] block mb-1">
              5. Special Customizations or Corporate Branding:
            </label>
            <textarea
              placeholder="e.g. Need company logo printed on chocolates, gold ribbon, delivered to Delhi office by Oct 28..."
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-[#DAC9B7] rounded-xl text-[#2C1810] placeholder-[#A68F84]"
            />
          </div>

          {/* Action */}
          <div className="pt-2">
            <button
              onClick={handleSendInquiry}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Send Customised Spec to WhatsApp</span>
            </button>
            <p className="text-[11px] text-center text-[#8C766C] mt-2">
              Our master chocolatier will share sample photos, box mockups, and discounted quotes within 15 minutes!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
