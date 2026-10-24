import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Layout,
  Layers,
  Server,
  Zap,
  CheckCircle,
  Copy,
  Check,
  TrendingUp,
  FileCode,
  DollarSign,
  Smartphone,
  Shield,
  Search,
  ExternalLink,
} from 'lucide-react';
import { StoreSettings } from '../types';

interface StrategyDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
}

export const StrategyDossierModal: React.FC<StrategyDossierModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  const [activeTab, setActiveTab] = useState<'strategy' | 'wireframes' | 'tech' | 'workflows' | 'seo-hosting' | 'templates'>('strategy');
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  if (!isOpen) return null;

  const sampleTemplate = `✨ *NEW ORDER — CHOCOBLOOM* ✨
Order ID: #CB-20261023-4819
━━━━━━━━━━━━━━━━━━━━

👤 *CUSTOMER DETAILS:*
• Name: *Ananya Sharma*
• Phone: *+91 98112 34567*
• Delivery Address:
  B-4/12, Deepali Enclave, Pitampura
  New Delhi - 110034
• Required By: *26 October 2026*
• Free Luxury Ribbon & Festive Card: *Yes, please!*
• Gift Card Message: _"Wishing you and your family a sweetest Diwali filled with love and prosperity!"_

━━━━━━━━━━━━━━━━━━━━

📦 *ORDER ITEMS:*
1. *Diwali Cracker Box with Floral Diya Candle*
   • Item Code: \`CD 9\`
   • Qty: 2 × ₹290
   • Subtotal: *₹580*

2. *Diwali Poker Night Chocolate Box (Classic)*
   • Item Code: \`CD 25\`
   • Qty: 1 × ₹390
   • Subtotal: *₹390*

3. *Artisan Box of 9 Gourmet Chocolates*
   • Item Code: \`CBHC 103\`
   • Qty: 1 × ₹320
   • Subtotal: *₹320*

━━━━━━━━━━━━━━━━━━━━
💰 *GRAND TOTAL:* *₹1,290*
━━━━━━━━━━━━━━━━━━━━

💳 *PAYMENT INSTRUCTIONS:*
1. UPI ID: *${settings.upiId}* (${settings.upiPayeeName})
2. Please transfer ₹1,290 using Google Pay / PhonePe / Paytm / BHIM.
3. Share the payment screenshot in this chat to confirm your order and begin fresh preparation!

📍 *ChocoBloom Chocolates, Pitampura, New Delhi*
Thank you for supporting artisanal homemade chocolatiers! 🍫🤎`;

  const copyTemplate = () => {
    navigator.clipboard.writeText(sampleTemplate);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

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
              <BookOpen className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <span>ChocoBloom Strategy, Architecture & Wireframes Dossier</span>
              </h3>
              <p className="text-xs text-[#DAC4B6]">
                Comprehensive 18-part deliverables for non-technical owner & engineering team
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

        {/* Tab Navigation */}
        <div className="bg-[#FAF5EF] px-5 py-3 border-b border-[#EADBCC] overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 min-w-max text-xs font-semibold">
            <button
              onClick={() => setActiveTab('strategy')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                activeTab === 'strategy'
                  ? 'bg-[#2C1810] text-[#FFFDF9] shadow-xs'
                  : 'text-[#6D4C3D] hover:bg-[#EADBCC]/50'
              }`}
            >
              1–4. UX Strategy & Architecture
            </button>
            <button
              onClick={() => setActiveTab('wireframes')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                activeTab === 'wireframes'
                  ? 'bg-[#2C1810] text-[#FFFDF9] shadow-xs'
                  : 'text-[#6D4C3D] hover:bg-[#EADBCC]/50'
              }`}
            >
              5–9. Wireframes & Mobile Design
            </button>
            <button
              onClick={() => setActiveTab('tech')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                activeTab === 'tech'
                  ? 'bg-[#2C1810] text-[#FFFDF9] shadow-xs'
                  : 'text-[#6D4C3D] hover:bg-[#EADBCC]/50'
              }`}
            >
              10. Tech Stack Benchmark
            </button>
            <button
              onClick={() => setActiveTab('workflows')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                activeTab === 'workflows'
                  ? 'bg-[#2C1810] text-[#FFFDF9] shadow-xs'
                  : 'text-[#6D4C3D] hover:bg-[#EADBCC]/50'
              }`}
            >
              11–13. Database, WhatsApp & UPI
            </button>
            <button
              onClick={() => setActiveTab('seo-hosting')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                activeTab === 'seo-hosting'
                  ? 'bg-[#2C1810] text-[#FFFDF9] shadow-xs'
                  : 'text-[#6D4C3D] hover:bg-[#EADBCC]/50'
              }`}
            >
              14–17. SEO, Free Host & Scaling
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                activeTab === 'templates'
                  ? 'bg-[#2C1810] text-[#FFFDF9] shadow-xs'
                  : 'text-[#6D4C3D] hover:bg-[#EADBCC]/50'
              }`}
            >
              18. WhatsApp Order Template
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-6 text-[#2C1810]">
          {/* TAB 1: UX STRATEGY & IA */}
          {activeTab === 'strategy' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-[#EADBCC] space-y-3">
                <h4 className="font-serif text-base font-bold text-[#2C1810] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FAF0E4] text-[#8C5E35] flex items-center justify-center text-xs font-bold">1</span>
                  Complete UX Strategy
                </h4>
                <p className="text-xs text-[#5C4337] leading-relaxed">
                  <strong>The Zero-Friction Luxury Funnel:</strong> Traditional e-commerce carts suffer from up to <strong>72% cart abandonment</strong> in India due to compulsory account creation, password resets, and failed payment gateway 3D-Secure OTPs. For ChocoBloom, an artisan chocolate business, trust is built through personal connection and visual appetizing imagery.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADBCC] text-xs">
                    <strong className="text-[#8C5E35] block mb-1">Visual-First Appetite Appeal</strong>
                    High-definition photography of actual gift hampers, showing crisp textures, golden wrappers, and packaging sizes.
                  </div>
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADBCC] text-xs">
                    <strong className="text-[#8C5E35] block mb-1">Zero Authentication</strong>
                    No signup or passwords. Direct input of recipient name and address saves over 3 minutes per checkout.
                  </div>
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADBCC] text-xs">
                    <strong className="text-[#8C5E35] block mb-1">Conversational WhatsApp Close</strong>
                    Customers love interacting directly with the business owner to confirm delivery timing, freshness, and custom notes.
                  </div>
                </div>
              </div>

              {/* 2. Information Architecture */}
              <div className="bg-white p-5 rounded-2xl border border-[#EADBCC] space-y-3">
                <h4 className="font-serif text-base font-bold text-[#2C1810] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FAF0E4] text-[#8C5E35] flex items-center justify-center text-xs font-bold">2</span>
                  Information Architecture (IA)
                </h4>
                <div className="p-3 bg-[#2C1810] text-[#FAF7F2] rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
{`CHOCOBLOOM INFORMATION ARCHITECTURE
├── 1.0 Top Utility Bar [Announcement | WhatsApp Pre-book]
├── 2.0 Global Header [Brand Monogram | Collection Nav | Cart Counter | Admin Pin Access]
├── 3.0 Hero Experience [Value Proposition | Signature Box Highlights | Direct CTAs]
├── 4.0 Brand Heritage [Handmade Story | Pure Cocoa Butter | Pitampura Studio]
├── 5.0 Interactive Catalog Engine
│   ├── Category Tabs [All | Cracker Chocolates | Truffles | Hampers | Dry Fruit | Cookies | Occasions | Corporate]
│   ├── Instant Search & Stock Filters [Search by Name / CD Code / In-Stock Only]
│   ├── Product Cards [Thumbnails | Price | Dimensions | Contents | Quick Add | Instant WhatsApp]
│   └── Quick View Modal [Deep Nutrition/Flavor Matrix | Quantity Selector | Custom Notes]
├── 6.0 Custom Hamper Builder [Occasion Selector | Budget | Quantities | WhatsApp Spec]
├── 7.0 Social Proof & Testimonials [Diwali Hosts | Corporate HR | Wedding Trousseau]
├── 8.0 Frictionless Cart & Checkout
│   ├── Slide-Over Cart [Subtotal | Free Delivery Meter | Complimentary Gift Card Input]
│   └── Checkout Modal [Name | Phone | Address | Auto-Calculated UPI QR & Direct WhatsApp Dispatch]
├── 9.0 Owner Admin Studio [PIN Protection | Catalog CRUD | Stock Toggles | Order Log | CSV Export]
└── 10.0 Footer [Contact | Instagram @thechocobloom | WhatsApp +91 99107 70118 | PDF Catalogue]`}
                </div>
              </div>

              {/* 3 & 4. User Flow & Sitemap */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#EADBCC] space-y-3">
                  <h4 className="font-serif text-sm font-bold text-[#2C1810] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FAF0E4] text-[#8C5E35] flex items-center justify-center text-[10px] font-bold">3</span>
                    User Flow Diagram
                  </h4>
                  <div className="text-xs text-[#5C4337] space-y-2">
                    <div className="p-2.5 bg-[#FAF7F2] rounded-lg border border-[#EADBCC] flex items-center justify-between">
                      <span>1. Customer lands on mobile store</span>
                      <span className="text-[#8C5E35] font-bold">→</span>
                    </div>
                    <div className="p-2.5 bg-[#FAF7F2] rounded-lg border border-[#EADBCC] flex items-center justify-between">
                      <span>2. Browses by category or search "CD 9"</span>
                      <span className="text-[#8C5E35] font-bold">→</span>
                    </div>
                    <div className="p-2.5 bg-[#FAF7F2] rounded-lg border border-[#EADBCC] flex items-center justify-between">
                      <span>3. Adds boxes to cart & writes gift note</span>
                      <span className="text-[#8C5E35] font-bold">→</span>
                    </div>
                    <div className="p-2.5 bg-[#FAF7F2] rounded-lg border border-[#EADBCC] flex items-center justify-between">
                      <span>4. Enters Name, Mobile & Delivery Address</span>
                      <span className="text-[#8C5E35] font-bold">→</span>
                    </div>
                    <div className="p-2.5 bg-[#FAF7F2] rounded-lg border border-[#EADBCC] flex items-center justify-between">
                      <span>5. Clicks "Send Order to WhatsApp"</span>
                      <span className="text-emerald-700 font-bold">✔ Dispatched</span>
                    </div>
                    <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 font-medium">
                      6. Scans UPI QR or pays to UPI ID → Sends screenshot in WhatsApp chat!
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#EADBCC] space-y-3">
                  <h4 className="font-serif text-sm font-bold text-[#2C1810] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FAF0E4] text-[#8C5E35] flex items-center justify-center text-[10px] font-bold">4</span>
                    Full Sitemap
                  </h4>
                  <ul className="text-xs text-[#5C4337] space-y-1.5 list-disc pl-4">
                    <li><strong>/ (Home)</strong>: Hero, Brand Story, Collections, Best Sellers, Reviews, Footer</li>
                    <li><strong>#crackers</strong>: Diwali Cracker Assortments (CD 1 to CD 26)</li>
                    <li><strong>#hampers</strong>: Wooden Trays, Baskets, Festive Combos (CBHC series)</li>
                    <li><strong>#corporate</strong>: Custom Logo Edible Printing (Google / IOCL models)</li>
                    <li><strong>#custom-builder</strong>: Interactive 5-step custom hamper generator</li>
                    <li><strong>#cart</strong>: Dynamic slide-over drawer with free shipping progress</li>
                    <li><strong>#checkout</strong>: Name, address, preferred delivery date, and UPI modal</li>
                    <li><strong>#admin</strong>: Secured studio for inventory, price changes, orders export</li>
                    <li><strong>/assets/catalogue.pdf</strong>: Downloadable original 27-page brochure</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WIREFRAMES & MOBILE DESIGN */}
          {activeTab === 'wireframes' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-[#EADBCC] space-y-4">
                <h4 className="font-serif text-base font-bold text-[#2C1810]">
                  5–8. Visual Low-Fidelity Wireframes
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  {/* Homepage Wireframe */}
                  <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#DAC9B7] space-y-2">
                    <strong className="text-[#2C1810] block font-serif">5. Homepage Architecture Wireframe</strong>
                    <div className="border border-dashed border-[#8C5E35] p-2 rounded bg-white text-[10px]">
                      [Top Announcement Banner: Festive Booking Open · Free Gift Note]<br/>
                      [Header: CB Monogram | Nav Tabs | Cart (Count) | Admin Lock]<br/>
                      [Hero: Headline + Luxury CTA "Browse" + WhatsApp Order + Live Hero Box]<br/>
                      [Trust Pillars: Pure Cocoa Butter · Handcrafted · Pitampura, Delhi]<br/>
                      [Category Filter Tabs: Cracker | Truffles | Hampers | Dry Fruit | Corporate]<br/>
                      [Product Grid: 2 cols on mobile, 3-4 cols on desktop]<br/>
                      [Custom Hamper Builder Trigger Banner]<br/>
                      [Social Proof / Reviews Carousel]<br/>
                      [Footer: Instagram @thechocobloom · Phone · UPI FAQ · Copyright]
                    </div>
                  </div>

                  {/* Product Modal Wireframe */}
                  <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#DAC9B7] space-y-2">
                    <strong className="text-[#2C1810] block font-serif">6. Product Detail / Quick View Wireframe</strong>
                    <div className="border border-dashed border-[#8C5E35] p-2 rounded bg-white text-[10px]">
                      [Modal Overlay: Backdrop Blur 60%]<br/>
                      [Left / Top: HD Product Image + Code Overlay (e.g. CD 9) + Thumbs]<br/>
                      [Right / Bottom: Category · Title · Big Price ₹290]<br/>
                      [Bulk Price Callout: e.g. Special rate for 200+ units]<br/>
                      [Contents: 3 Chakkari, 3 Bomb, 1 Floral Candle]<br/>
                      [Flavour Matrix: Crunchy, Paan, Jam, White]<br/>
                      [Quantity Stepper: (-) [ 1 ] (+)]<br/>
                      [Buttons: [Add to Cart (₹290)] | [Inquire on WhatsApp]]
                    </div>
                  </div>

                  {/* Cart & Checkout Wireframe */}
                  <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#DAC9B7] space-y-2">
                    <strong className="text-[#2C1810] block font-serif">7. Cart & Checkout Wireframe</strong>
                    <div className="border border-dashed border-[#8C5E35] p-2 rounded bg-white text-[10px]">
                      [Slide Drawer: Title "Your Chocolate Hamper" (X)]<br/>
                      [Free Delivery Progress Meter: Add ₹X for Free Shipping]<br/>
                      [Item Rows: Thumbnail · Title · Code · Qty Stepper · Subtotal · Delete]<br/>
                      [Gift Add-ons: [x] Free Festive Ribbon & Greeting Card Message Box]<br/>
                      [Order Form: Name * | WhatsApp * | Address & Pincode * | Date]<br/>
                      [UPI Payment Card: Live QR Code + VPA 9910770118@upi + Copy Button]<br/>
                      [CTA Button: "Send Order to WhatsApp (+91 99107 70118)"]
                    </div>
                  </div>

                  {/* Admin Dashboard Wireframe */}
                  <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#DAC9B7] space-y-2">
                    <strong className="text-[#2C1810] block font-serif">8. Admin Dashboard Wireframe</strong>
                    <div className="border border-dashed border-[#8C5E35] p-2 rounded bg-white text-[10px]">
                      [Auth Gate: 4-digit PIN Pad (1234)]<br/>
                      [Tab 1: Inventory Table (Edit, Delete, Available/Sold Out Toggle, Add New)]<br/>
                      [Tab 2: Orders Log (Customer, Items, Amount, Status, CSV Export)]<br/>
                      [Tab 3: Settings (WhatsApp Number, UPI ID, Payee Name, Min Order, PIN)]<br/>
                      [Backup / Restore Original PDF Catalogue Button]
                    </div>
                  </div>
                </div>
              </div>

              {/* 9. Mobile-First Design Recommendations */}
              <div className="bg-white p-5 rounded-2xl border border-[#EADBCC] space-y-3">
                <h4 className="font-serif text-base font-bold text-[#2C1810] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FAF0E4] text-[#8C5E35] flex items-center justify-center text-xs font-bold">9</span>
                  Mobile-First Design Recommendations
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#5C4337]">
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADBCC]">
                    <strong className="text-[#2C1810] block mb-1">Thumb-Zone CTAs</strong>
                    All primary actions (Add to Cart, View Hamper, Send WhatsApp) maintain minimum 48px touch heights and reside in natural thumb reach.
                  </div>
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADBCC]">
                    <strong className="text-[#2C1810] block mb-1">Optimized Image Compression</strong>
                    Catalog images load in modern responsive ratios with lazy-loading and blur placeholders to guarantee under 1.2s first contentful paint over 4G mobile networks.
                  </div>
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADBCC]">
                    <strong className="text-[#2C1810] block mb-1">Deep-Linked WhatsApp URI</strong>
                    Utilizes `https://wa.me/` protocols with URI encoding so both Android and iOS devices seamlessly trigger the native WhatsApp app without prompting for web login.
                  </div>
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADBCC]">
                    <strong className="text-[#2C1810] block mb-1">Single-Handed UPI Scanning</strong>
                    The UPI QR code is auto-sized to 180px–220px on mobile screens, allowing another family member or phone to scan effortlessly or click "Copy UPI ID" to paste into Google Pay.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TECH STACK BENCHMARK */}
          {activeTab === 'tech' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-[#EADBCC] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-base font-bold text-[#2C1810] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#FAF0E4] text-[#8C5E35] flex items-center justify-center text-xs font-bold">10</span>
                      Technology Stack Benchmark & Comparison
                    </h4>
                    <p className="text-xs text-[#7B6256]">
                      Comprehensive analysis of all requested options specifically for ChocoBloom's manual UPI + WhatsApp commerce model.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto border border-[#EADBCC] rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FAF5EF] text-[#6D4C3D] uppercase font-semibold border-b border-[#EADBCC]">
                      <tr>
                        <th className="p-2.5">Platform Stack</th>
                        <th className="p-2.5">Annual Cost</th>
                        <th className="p-2.5">Ease for Owner</th>
                        <th className="p-2.5">Mobile Speed</th>
                        <th className="p-2.5">WhatsApp / UPI Fit</th>
                        <th className="p-2.5">Maintenance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0E4D7]">
                      <tr className="bg-emerald-50/60 font-medium">
                        <td className="p-2.5">
                          <strong className="text-[#2C1810] block">React / Vite SPA + Static Hosting</strong>
                          <span className="text-[10px] text-emerald-700 font-bold">RECOMMENDED</span>
                        </td>
                        <td className="p-2.5 text-emerald-800 font-bold">₹0 / year (Free Vercel/Netlify)</td>
                        <td className="p-2.5">High (PIN Admin in UI)</td>
                        <td className="p-2.5 text-emerald-800 font-bold">98/100 (Instant)</td>
                        <td className="p-2.5 text-emerald-800">100% Native (No gateway fees)</td>
                        <td className="p-2.5 text-emerald-800">Zero (Never crashes)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5"><strong>WordPress + WooCommerce</strong></td>
                        <td className="p-2.5">₹4,000 – ₹9,000 / yr</td>
                        <td className="p-2.5">Medium (Heavy dashboard)</td>
                        <td className="p-2.5 text-amber-700">45–65/100 (Bloated)</td>
                        <td className="p-2.5">Requires 3rd party plugins</td>
                        <td className="p-2.5 text-rose-700">High (Plugin updates, security patches)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5"><strong>Shopify Starter</strong></td>
                        <td className="p-2.5">₹4,800 + 5% transaction fees</td>
                        <td className="p-2.5">High</td>
                        <td className="p-2.5">85/100</td>
                        <td className="p-2.5 text-rose-700">Poor (Forces credit card/Shopify checkout)</td>
                        <td className="p-2.5">Low</td>
                      </tr>
                      <tr>
                        <td className="p-2.5"><strong>Wix E-commerce</strong></td>
                        <td className="p-2.5">₹7,000 – ₹12,000 / yr</td>
                        <td className="p-2.5">High</td>
                        <td className="p-2.5 text-amber-700">55/100 (Slow in India)</td>
                        <td className="p-2.5">Complex custom code for WhatsApp</td>
                        <td className="p-2.5">Low</td>
                      </tr>
                      <tr>
                        <td className="p-2.5"><strong>Hostinger Web Builder</strong></td>
                        <td className="p-2.5">₹3,000 – ₹6,000 / yr</td>
                        <td className="p-2.5">Medium</td>
                        <td className="p-2.5">65/100</td>
                        <td className="p-2.5">No native dynamic UPI QR generator</td>
                        <td className="p-2.5">Medium</td>
                      </tr>
                      <tr>
                        <td className="p-2.5"><strong>Next.js + Supabase / Firebase</strong></td>
                        <td className="p-2.5">₹0 (Free tier)</td>
                        <td className="p-2.5">High</td>
                        <td className="p-2.5">95/100</td>
                        <td className="p-2.5">Excellent (Overkill for single seller)</td>
                        <td className="p-2.5">Low</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EADBCC] text-xs space-y-2">
                  <h5 className="font-serif font-bold text-[#2C1810]">Final Strategic Recommendation for ChocoBloom:</h5>
                  <p className="text-[#5C4337] leading-relaxed">
                    <strong>Choose React SPA with Static Edge Hosting (Vercel / Cloudflare / GitHub Pages)</strong>. Why?
                  </p>
                  <ul className="list-disc pl-4 text-[#5C4337] space-y-1">
                    <li><strong>Cost: Exact ₹0 hosting forever</strong>. Only expense is an optional custom domain name (~₹800/yr for .store or .in).</li>
                    <li><strong>Zero Maintenance</strong>: Unlike WordPress, there is no database to hack, no MySQL to crash during Diwali traffic spikes, and no monthly plugin license fees.</li>
                    <li><strong>Instant WhatsApp + UPI Experience</strong>: Formats the WhatsApp message directly in browser memory and generates dynamic UPI QR codes locally with zero server lag.</li>
                    <li><strong>Simple Owner Management</strong>: The owner uses the on-page PIN dashboard to edit prices, toggle sold out, and export orders without ever touching raw code.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WORKFLOWS & ARCHITECTURE */}
          {activeTab === 'workflows' && (
            <div className="space-y-6">
              {/* 11. Database Design */}
              <div className="bg-white p-5 rounded-2xl border border-[#EADBCC] space-y-3">
                <h4 className="font-serif text-base font-bold text-[#2C1810] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FAF0E4] text-[#8C5E35] flex items-center justify-center text-xs font-bold">11</span>
                  Database Design Schema
                </h4>
                <p className="text-xs text-[#5C4337]">
                  Lightweight, resilient JSON / relational schema that runs locally in `localStorage` and can effortlessly hydrate into Firestore / Supabase when scale demands:
                </p>
                <div className="p-3 bg-[#1D110C] text-[#FAF7F2] rounded-xl text-xs font-mono overflow-x-auto">
{`// 1. PRODUCTS COLLECTION
interface Product {
  id: string;               // e.g. "prod-cd-09"
  code: string;             // e.g. "CD 9" (Catalogue Code)
  name: string;             // e.g. "Diwali Cracker Box with Diya"
  category: ProductCategory;// 'crackers' | 'festive-hampers' | 'homemade-chocolates' | ...
  price: number;            // e.g. 290
  bulkPriceNotice?: string; // e.g. "Bulk rate ₹240 for 200+ units"
  image: string;            // URL or public asset path
  contains: string;         // e.g. "3 Chakkari, 3 Bomb, 1 Floral Candle"
  flavours: string[];       // ["Crunchy", "Paan", "Jam", "White"]
  dimensions?: string;      // e.g. "24cm × 10cm"
  stockStatus: 'in_stock' | 'low_stock' | 'sold_out';
}

// 2. ORDERS COLLECTION
interface OrderRecord {
  id: string;               // "ord_1729683920"
  orderNumber: string;      // "CB-20261023-4819"
  createdAt: string;        // ISO timestamp
  customer: {
    name: string;
    phone: string;
    address: string;
    cityPincode: string;
    preferredDate?: string;
    giftNote?: string;
  };
  items: Array<{
    code: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
  }>;
  totalAmount: number;      // Grand total in INR
  status: 'awaiting_payment' | 'paid_confirmed' | 'dispatched' | 'completed';
}`}
                </div>
              </div>

              {/* 12 & 13. WhatsApp & UPI Workflows */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#EADBCC] space-y-3">
                  <h4 className="font-serif text-sm font-bold text-[#2C1810] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FAF0E4] text-[#8C5E35] flex items-center justify-center text-[10px] font-bold">12</span>
                    WhatsApp Integration Protocol
                  </h4>
                  <p className="text-xs text-[#5C4337] leading-relaxed">
                    Uses the universal <code>https://wa.me/919910770118?text=...</code> API specification with complete URL encoding. Works seamlessly across:
                  </p>
                  <ul className="text-xs text-[#5C4337] space-y-1 list-disc pl-4">
                    <li><strong>WhatsApp Mobile App</strong> (Android / iOS)</li>
                    <li><strong>WhatsApp Web</strong> on laptops / desktops</li>
                    <li><strong>WhatsApp Desktop Native App</strong></li>
                  </ul>
                  <p className="text-[11px] text-[#8C766C] bg-[#FAF7F2] p-2 rounded-lg border border-[#EADBCC]">
                    Unlike third-party WhatsApp Business API providers (Twilio, Gupshup, Wati) that charge ₹0.80 per conversation, this deep-link method is <strong>100% free with unlimited messages</strong>.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#EADBCC] space-y-3">
                  <h4 className="font-serif text-sm font-bold text-[#2C1810] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FAF0E4] text-[#8C5E35] flex items-center justify-center text-[10px] font-bold">13</span>
                    UPI Payment Workflow Specification
                  </h4>
                  <p className="text-xs text-[#5C4337] leading-relaxed">
                    Implements the National Payments Corporation of India (NPCI) UPI Deep Link URI Standard:
                  </p>
                  <div className="p-2 bg-[#FAF7F2] rounded-lg border border-[#EADBCC] font-mono text-[10px] text-[#2C1810] break-all">
                    upi://pay?pa=9910770118@upi&pn=ChocoBloom&am=1290.00&cu=INR&tn=CB-Order-4819
                  </div>
                  <div className="text-xs text-[#5C4337] space-y-1">
                    <p>• <strong>pa</strong>: Payee VPA / UPI ID</p>
                    <p>• <strong>pn</strong>: Payee Registered Name</p>
                    <p>• <strong>am</strong>: Dynamic exact total from cart</p>
                    <p>• <strong>cu</strong>: Currency code (INR)</p>
                    <p>• <strong>tn</strong>: Transaction Note with Order ID</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SEO, HOSTING & SCALING */}
          {activeTab === 'seo-hosting' && (
            <div className="space-y-6">
              {/* 14. SEO Strategy */}
              <div className="bg-white p-5 rounded-2xl border border-[#EADBCC] space-y-3">
                <h4 className="font-serif text-base font-bold text-[#2C1810] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FAF0E4] text-[#8C5E35] flex items-center justify-center text-xs font-bold">14</span>
                  SEO Strategy & Local Search Engine Dominance
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#5C4337]">
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADBCC]">
                    <strong className="text-[#2C1810] block mb-1">Local Delhi-NCR SEO</strong>
                    Target keywords: <em>"homemade chocolates in Pitampura Delhi"</em>, <em>"Diwali cracker chocolate box Delhi"</em>, <em>"wedding trousseau chocolate packing Delhi"</em>.
                  </div>
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADBCC]">
                    <strong className="text-[#2C1810] block mb-1">Structured Schema.org JSON-LD</strong>
                    Embedded <code>Product</code>, <code>Bakery / Store</code>, and <code>LocalBusiness</code> schema so Google displays rich snippets with prices and star ratings.
                  </div>
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADBCC]">
                    <strong className="text-[#2C1810] block mb-1">OpenGraph Social Cards</strong>
                    Every shared link on WhatsApp, Facebook, or Instagram previews a lavish high-resolution photo card of ChocoBloom gift hampers.
                  </div>
                </div>
              </div>

              {/* 15. Free Hosting */}
              <div className="bg-white p-5 rounded-2xl border border-[#EADBCC] space-y-3">
                <h4 className="font-serif text-base font-bold text-[#2C1810] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FAF0E4] text-[#8C5E35] flex items-center justify-center text-xs font-bold">15</span>
                  Free Hosting Recommendations
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#5C4337]">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <strong className="text-emerald-900 block font-semibold mb-1">1. Vercel (Recommended)</strong>
                    100GB bandwidth/month free forever, worldwide CDN edges in Mumbai, automatic SSL certificate, 1-click GitHub deployment.
                  </div>
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADBCC]">
                    <strong className="text-[#2C1810] block font-semibold mb-1">2. Cloudflare Pages</strong>
                    Unlimited free bandwidth, ultra-fast TTFB in India, zero cold starts, custom domain with DDoS shield.
                  </div>
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADBCC]">
                    <strong className="text-[#2C1810] block font-semibold mb-1">3. Netlify</strong>
                    100GB/month free tier, instant rollback capability, built-in form handling if needed.
                  </div>
                </div>
              </div>

              {/* 16 & 17. Scaling Roadmap & Effort */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#EADBCC] space-y-3">
                  <h4 className="font-serif text-sm font-bold text-[#2C1810] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FAF0E4] text-[#8C5E35] flex items-center justify-center text-[10px] font-bold">16</span>
                    Future Scaling Roadmap
                  </h4>
                  <div className="space-y-2 text-xs text-[#5C4337]">
                    <div className="p-2 bg-[#FAF7F2] rounded-lg border border-[#EADBCC]">
                      <strong>Phase 1 (Current):</strong> WhatsApp Direct + UPI QR + Local Admin Studio. (Zero operational cost).
                    </div>
                    <div className="p-2 bg-[#FAF7F2] rounded-lg border border-[#EADBCC]">
                      <strong>Phase 2 (500+ orders/month):</strong> Cloud Firestore / Supabase sync for real-time inventory multi-device syncing.
                    </div>
                    <div className="p-2 bg-[#FAF7F2] rounded-lg border border-[#EADBCC]">
                      <strong>Phase 3 (Festive Peak):</strong> Shiprocket / Delhivery Courier API integration for automated airway bill (AWB) generation.
                    </div>
                    <div className="p-2 bg-[#FAF7F2] rounded-lg border border-[#EADBCC]">
                      <strong>Phase 4:</strong> Optional Razorpay / Cashfree UPI Intent auto-webhook verification when volume exceeds manual WhatsApp checking.
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#EADBCC] space-y-3">
                  <h4 className="font-serif text-sm font-bold text-[#2C1810] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FAF0E4] text-[#8C5E35] flex items-center justify-center text-[10px] font-bold">17</span>
                    Development Effort Estimation
                  </h4>
                  <div className="text-xs text-[#5C4337] space-y-1.5">
                    <p>• <strong>UX Design & Mobile Prototypes</strong>: 16 Hours</p>
                    <p>• <strong>E-Commerce Storefront Development</strong>: 24 Hours</p>
                    <p>• <strong>WhatsApp Order Engine & Dynamic UPI QR</strong>: 8 Hours</p>
                    <p>• <strong>Admin Studio & Inventory Manager</strong>: 14 Hours</p>
                    <p>• <strong>Catalogue Data Extraction & Formatting</strong>: 6 Hours</p>
                    <p>• <strong>Testing & SEO Optimization</strong>: 6 Hours</p>
                    <div className="mt-2 pt-2 border-t border-[#EADBCC] font-bold text-[#2C1810]">
                      Total Project Scope: 74 Engineering Hours
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: WHATSAPP ORDER TEMPLATE */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-base font-bold text-[#2C1810] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#FAF0E4] text-[#8C5E35] flex items-center justify-center text-xs font-bold">18</span>
                    Production WhatsApp Order Message Template
                  </h4>
                  <p className="text-xs text-[#7B6256]">
                    This is the exact, beautifully structured format automatically generated and sent to the owner's WhatsApp number.
                  </p>
                </div>
                <button
                  onClick={copyTemplate}
                  className="px-3 py-1.5 bg-[#2C1810] text-white hover:bg-[#43261A] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
                >
                  {copiedTemplate ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Template</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-[#2C1810] text-[#F5EFEB] p-4 rounded-2xl font-mono text-xs whitespace-pre-wrap leading-relaxed border border-[#EADBCC] shadow-inner select-all">
                {sampleTemplate}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
