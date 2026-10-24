import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageCircle,
  Copy,
  Check,
  Gift,
  MapPin,
  Calendar,
  AlertCircle,
  ArrowRight,
  Receipt,
  QrCode,
} from 'lucide-react';
import { OrderRecord, StoreSettings } from '../types';
import { createWhatsAppUrl } from '../utils/whatsapp';
import { UpiPaymentCard } from './UpiPaymentCard';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderRecord[];
  settings: StoreSettings;
  initialOrderId?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
  settings,
  initialOrderId = '',
}) => {
  const [searchInput, setSearchInput] = useState(initialOrderId);
  const [searchedId, setSearchedId] = useState(initialOrderId);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [showUpiCard, setShowUpiCard] = useState(false);

  // Sync initial order ID when opened
  useEffect(() => {
    if (initialOrderId) {
      setSearchInput(initialOrderId);
      setSearchedId(initialOrderId);
      setHasSearched(true);
    }
  }, [initialOrderId, isOpen]);

  if (!isOpen) return null;

  // Clean lookup: case-insensitive, strip '#' and whitespace
  const cleanQuery = searchedId.replace(/^[#\s]+|[#\s]+$/g, '').trim().toLowerCase();

  const matchedOrder = cleanQuery
    ? orders.find(
        (o) =>
          o.orderNumber.toLowerCase() === cleanQuery ||
          o.id.toLowerCase() === cleanQuery ||
          o.orderNumber.toLowerCase().includes(cleanQuery)
      )
    : null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSearchedId(searchInput.trim());
    setHasSearched(true);
    setShowUpiCard(false);
  };

  const handleQuickSelect = (orderNumber: string) => {
    setSearchInput(orderNumber);
    setSearchedId(orderNumber);
    setHasSearched(true);
    setShowUpiCard(false);
  };

  const handleCopyOrderId = (idToCopy: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(idToCopy);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Helper for status details
  const getStatusMeta = (status: OrderRecord['status']) => {
    switch (status) {
      case 'paid_confirmed':
        return {
          stepIndex: 2,
          label: 'Payment Verified & In Preparation',
          color: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dotColor: 'bg-emerald-500',
          desc: 'Your payment has been received and verified! Our artisan chocolatiers in Pitampura are crafting your fresh order.',
        };
      case 'dispatched':
        return {
          stepIndex: 3,
          label: 'Dispatched & On the Way',
          color: 'bg-indigo-50 text-indigo-900 border-indigo-300',
          dotColor: 'bg-indigo-500',
          desc: 'Your chocolate package has been securely sealed with protective thermal bubble wrap and handed to our delivery partner.',
        };
      case 'completed':
        return {
          stepIndex: 4,
          label: 'Delivered with Sweetness',
          color: 'bg-emerald-100 text-emerald-900 border-emerald-400',
          dotColor: 'bg-emerald-600',
          desc: 'Order successfully delivered! We hope you love every artisanal bite of your ChocoBloom creations.',
        };
      case 'awaiting_payment':
      case 'new_inquiry':
      default:
        return {
          stepIndex: 1,
          label: 'Order Placed · Awaiting Payment',
          color: 'bg-amber-50 text-amber-900 border-amber-300',
          dotColor: 'bg-amber-500',
          desc: 'Order details captured. Please share your UPI payment screenshot on WhatsApp to begin immediate preparation.',
        };
    }
  };

  const statusMeta = matchedOrder ? getStatusMeta(matchedOrder.status) : null;

  // Recent orders list from local storage
  const recentOrders = orders.slice(0, 3);

  // WhatsApp support link
  const createWhatsAppHelpUrl = (orderNumber: string, customerName?: string) => {
    const text = `Hello ChocoBloom! 🍫 I would like an update on my order *#${orderNumber}*${
      customerName ? ` for *${customerName}*` : ''
    }. Could you please share the current dispatch status?`;
    return createWhatsAppUrl(settings.whatsappNumber, text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-3xl border border-[#EADBCC] shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#EADBCC] bg-[#2C1810] text-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4A2E20] text-[#E8C587] flex items-center justify-center shadow-inner">
              <Truck className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <span>Track Your ChocoBloom Order</span>
                <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-full bg-[#4A2E20] text-[#E8C587] border border-[#6A4633]">
                  Live Status
                </span>
              </h3>
              <p className="text-xs text-[#DAC4B6]">
                Enter your Order ID (e.g. CB-261023-XXXX) to check preparation & dispatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#DAC4B6] hover:text-white hover:bg-white/10 rounded-xl transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar Area */}
        <div className="p-5 sm:p-6 bg-[#FAF5EF] border-b border-[#EADBCC] space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8C5E35] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Order ID (e.g. CB-261023-4819)"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DAC9B7] rounded-xl text-xs sm:text-sm font-mono text-[#2C1810] placeholder:text-[#9C8274] placeholder:font-sans focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
                autoFocus={!initialOrderId}
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#2C1810] hover:bg-[#43261A] text-white font-semibold text-xs sm:text-sm rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <span>Track</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Select Chips if orders exist in browser */}
          {recentOrders.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#7B6256]">
              <span className="text-[11px] font-medium text-[#8C5E35]">Recent Orders on this Device:</span>
              {recentOrders.map((ro) => (
                <button
                  key={ro.id}
                  type="button"
                  onClick={() => handleQuickSelect(ro.orderNumber)}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition ${
                    cleanQuery === ro.orderNumber.toLowerCase()
                      ? 'bg-[#2C1810] text-[#FDF9F5] border-[#2C1810]'
                      : 'bg-white text-[#4A2E20] border-[#E3CAAF] hover:border-[#D4AF37]'
                  }`}
                >
                  #{ro.orderNumber} (₹{ro.totalAmount.toLocaleString('en-IN')})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          {!hasSearched ? (
            /* Initial State */
            <div className="text-center py-10 px-4 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF0E4] border border-[#EADBCC] flex items-center justify-center mx-auto text-[#8C5E35]">
                <Package className="w-7 h-7" />
              </div>
              <h4 className="font-serif text-base font-bold text-[#2C1810]">
                Track Fresh Handcrafted Preparation & Delivery
              </h4>
              <p className="text-xs text-[#7B6256] max-w-sm mx-auto leading-relaxed">
                When you finalize an order with ChocoBloom, an Order ID like <code className="bg-[#FAF5EF] px-1 py-0.5 rounded font-mono text-[#8C5E35]">CB-261023-XXXX</code> is generated. Enter it above to view real-time status.
              </p>
            </div>
          ) : matchedOrder && statusMeta ? (
            /* Order Found State */
            <div className="space-y-6 animate-in fade-in">
              {/* Order Banner & Status Header */}
              <div className="bg-white p-5 rounded-2xl border border-[#EADBCC] shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0E4D7]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm sm:text-base font-bold text-[#2C1810]">
                      #{matchedOrder.orderNumber}
                    </span>
                    <button
                      onClick={() => handleCopyOrderId(matchedOrder.orderNumber)}
                      className="p-1 text-[#8C5E35] hover:text-[#2C1810] hover:bg-[#FAF5EF] rounded-md transition"
                      title="Copy Order ID"
                    >
                      {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    {copiedId && <span className="text-[10px] text-emerald-600 font-semibold">Copied!</span>}
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusMeta.color}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${statusMeta.dotColor} animate-pulse`}></span>
                    <span>{statusMeta.label}</span>
                  </span>
                </div>

                {/* Status Message */}
                <p className="text-xs text-[#5C4337] leading-relaxed">
                  {statusMeta.desc}
                </p>

                {/* 4-Step Visual Timeline */}
                <div className="pt-2">
                  <div className="relative flex items-center justify-between">
                    {/* Connecting line */}
                    <div className="absolute top-4 left-6 right-6 h-0.5 bg-[#EADBCC] -z-0"></div>
                    <div
                      className="absolute top-4 left-6 h-0.5 bg-[#D4AF37] transition-all duration-500 -z-0"
                      style={{
                        width: `${((statusMeta.stepIndex - 1) / 3) * 88}%`,
                      }}
                    ></div>

                    {/* Step 1 */}
                    <div className="flex flex-col items-center gap-1.5 z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                          statusMeta.stepIndex >= 1
                            ? 'bg-[#2C1810] text-[#D4AF37] shadow-sm'
                            : 'bg-white text-[#9C8274] border border-[#DAC9B7]'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-semibold text-[#4A2E20] text-center">
                        Order Placed
                      </span>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center gap-1.5 z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                          statusMeta.stepIndex >= 2
                            ? 'bg-[#2C1810] text-[#D4AF37] shadow-sm'
                            : 'bg-white text-[#9C8274] border border-[#DAC9B7]'
                        }`}
                      >
                        {statusMeta.stepIndex >= 2 ? <Check className="w-4 h-4" /> : '2'}
                      </div>
                      <span className="text-[10px] font-semibold text-[#4A2E20] text-center">
                        Payment & Prep
                      </span>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center gap-1.5 z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                          statusMeta.stepIndex >= 3
                            ? 'bg-[#2C1810] text-[#D4AF37] shadow-sm'
                            : 'bg-white text-[#9C8274] border border-[#DAC9B7]'
                        }`}
                      >
                        {statusMeta.stepIndex >= 3 ? <Check className="w-4 h-4" /> : '3'}
                      </div>
                      <span className="text-[10px] font-semibold text-[#4A2E20] text-center">
                        Dispatched
                      </span>
                    </div>

                    {/* Step 4 */}
                    <div className="flex flex-col items-center gap-1.5 z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                          statusMeta.stepIndex >= 4
                            ? 'bg-emerald-700 text-white shadow-sm'
                            : 'bg-white text-[#9C8274] border border-[#DAC9B7]'
                        }`}
                      >
                        {statusMeta.stepIndex >= 4 ? <Check className="w-4 h-4" /> : '4'}
                      </div>
                      <span className="text-[10px] font-semibold text-[#4A2E20] text-center">
                        Delivered
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Information & Customer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Delivery Information */}
                <div className="p-4 bg-white rounded-2xl border border-[#EADBCC] space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-[#8C5E35] font-bold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Delivery Details</span>
                  </div>
                  <div className="text-[#4A2E20] space-y-1">
                    <p className="font-semibold text-sm text-[#2C1810]">{matchedOrder.customer.name}</p>
                    <p className="text-xs text-[#6D5144]">{matchedOrder.customer.phone}</p>
                    <p className="text-xs text-[#6D5144] whitespace-pre-line leading-relaxed">
                      {matchedOrder.customer.address}
                      {matchedOrder.customer.cityPincode ? `, ${matchedOrder.customer.cityPincode}` : ''}
                    </p>
                  </div>
                  {matchedOrder.customer.preferredDeliveryDate && (
                    <div className="pt-2 border-t border-[#F0E4D7] flex items-center gap-1.5 text-[11px] text-[#A66228]">
                      <Calendar className="w-3 h-3" />
                      <span>Required By: <strong>{matchedOrder.customer.preferredDeliveryDate}</strong></span>
                    </div>
                  )}
                </div>

                {/* Payment & Gift Details */}
                <div className="p-4 bg-white rounded-2xl border border-[#EADBCC] space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-[#8C5E35] font-bold">
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Payment Summary</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[#6D5144]">
                      <span>Payment Method:</span>
                      <strong className="text-[#2C1810]">UPI Direct Transfer</strong>
                    </div>
                    <div className="flex justify-between text-[#6D5144]">
                      <span>Grand Total:</span>
                      <strong className="text-sm font-serif font-bold text-[#2C1810]">
                        ₹{matchedOrder.totalAmount.toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <div className="flex justify-between text-[#6D5144]">
                      <span>Booking Time:</span>
                      <span className="text-[11px] text-[#7B6256]">
                        {new Date(matchedOrder.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {matchedOrder.customer.giftNote && (
                    <div className="pt-2 border-t border-[#F0E4D7] text-[11px] text-[#7B6256] space-y-0.5">
                      <span className="font-semibold text-[#8C5E35] flex items-center gap-1">
                        <Gift className="w-3 h-3" /> Gift Card Message:
                      </span>
                      <p className="italic bg-[#FAF5EF] p-2 rounded-lg border border-[#EADBCC] text-[#4A2E20]">
                        "{matchedOrder.customer.giftNote}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Items in this Order */}
              <div className="bg-white p-4 rounded-2xl border border-[#EADBCC] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#F0E4D7]">
                  <span className="text-xs font-bold text-[#2C1810] uppercase tracking-wider">
                    Ordered Chocolates ({matchedOrder.items.reduce((sum, i) => sum + i.quantity, 0)} items)
                  </span>
                  <span className="text-xs font-serif font-bold text-[#8C5E35]">
                    Total: ₹{matchedOrder.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="divide-y divide-[#F5EFEB]">
                  {matchedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] bg-[#FAF5EF] text-[#8C5E35] px-1.5 py-0.5 rounded border border-[#E8C587]">
                            {item.code}
                          </span>
                          <span className="font-semibold text-[#2C1810]">{item.name}</span>
                        </div>
                        {item.option && (
                          <span className="text-[10px] text-[#8C766C] block mt-0.5">
                            Selection: {item.option}
                          </span>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[#7B6256] text-[11px]">
                          {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                        </span>
                        <span className="font-serif font-bold text-[#2C1810] block">
                          ₹{item.subtotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special UPI Card toggle if awaiting payment */}
              {matchedOrder.status === 'awaiting_payment' && (
                <div className="space-y-3">
                  {!showUpiCard ? (
                    <button
                      type="button"
                      onClick={() => setShowUpiCard(true)}
                      className="w-full py-2.5 px-4 bg-[#FAF0E4] hover:bg-[#F3E2CF] text-[#4A2E20] border border-[#E3CAAF] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition"
                    >
                      <QrCode className="w-4 h-4 text-[#8C5E35]" />
                      <span>View UPI QR Code & Payment Details (₹{matchedOrder.totalAmount.toLocaleString('en-IN')})</span>
                    </button>
                  ) : (
                    <UpiPaymentCard
                      settings={settings}
                      amount={matchedOrder.totalAmount}
                      orderNumber={matchedOrder.orderNumber}
                    />
                  )}
                </div>
              )}

              {/* Action Buttons: WhatsApp Support */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <a
                  href={createWhatsAppHelpUrl(matchedOrder.orderNumber, matchedOrder.customer.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl text-center flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Inquire Status on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 bg-[#FAF7F2] hover:bg-[#F3E7DC] text-[#4A2E20] border border-[#EADBCC] font-semibold text-xs sm:text-sm rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Order Not Found State */
            <div className="p-8 text-center bg-white rounded-2xl border border-[#EADBCC] space-y-4 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-serif text-base font-bold text-[#2C1810]">
                  Order ID Not Found Locally
                </h4>
                <p className="text-xs text-[#7B6256] leading-relaxed">
                  We couldn't locate an order matching <strong className="font-mono text-[#2C1810]">"{searchedId}"</strong> in this browser's saved records.
                </p>
              </div>

              <div className="text-left bg-[#FAF5EF] p-3.5 rounded-xl border border-[#EADBCC] text-xs text-[#5C4337] space-y-1">
                <span className="font-bold text-[#2C1810] block">Did you order directly on WhatsApp?</span>
                <p className="text-[11px] text-[#7B6256] leading-relaxed">
                  If you chatted directly with our boutique or placed this order from a different phone, our team tracks all orders manually on WhatsApp!
                </p>
              </div>

              <a
                href={createWhatsAppHelpUrl(searchedId)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl text-center flex items-center justify-center gap-2 shadow-sm transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ask Chocolatier on WhatsApp</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
