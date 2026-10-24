import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, MessageCircle, ArrowLeft, ShieldCheck, CheckCircle2, QrCode, Truck } from 'lucide-react';
import { CartItem, OrderCustomerDetails, StoreSettings, OrderRecord } from '../types';
import { formatWhatsAppOrderMessage, createWhatsAppUrl } from '../utils/whatsapp';
import { generateOrderNumber, saveOrder } from '../utils/storage';
import { UpiPaymentCard } from './UpiPaymentCard';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToCart: () => void;
  items: CartItem[];
  settings: StoreSettings;
  giftNote: string;
  isGiftWrapped: boolean;
  onOrderSuccess: () => void;
  onTrackOrder?: (orderNumber: string) => void;
  onOrderCreated?: (order: OrderRecord) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onBackToCart,
  items,
  settings,
  giftNote,
  isGiftWrapped,
  onOrderSuccess,
  onTrackOrder,
  onOrderCreated,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [cityPincode, setCityPincode] = useState('');
  const [preferredDeliveryDate, setPreferredDeliveryDate] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);

  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert('Please fill in your Name, Phone Number, and Delivery Address.');
      return;
    }

    const orderNumber = generateOrderNumber();
    const customerDetails: OrderCustomerDetails = {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      cityPincode: cityPincode.trim(),
      preferredDeliveryDate: preferredDeliveryDate.trim(),
      giftNote: giftNote.trim(),
      isGiftWrapped,
      notes: specialNotes.trim(),
    };

    const orderRecord: OrderRecord = {
      id: `ord_${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      customer: customerDetails,
      items: items.map((i) => ({
        code: i.product.code,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        subtotal: i.product.price * i.quantity,
        option: i.selectedOption,
      })),
      totalAmount,
      status: 'awaiting_payment',
    };

    // Save order record for Admin history & local tracking
    saveOrder(orderRecord);
    if (onOrderCreated) {
      onOrderCreated(orderRecord);
    }
    setCompletedOrder(orderRecord);
    setHasSubmitted(true);

    // Launch festive confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#8C5E35', '#E8C587', '#2C1810'],
    });

    // Format WhatsApp message & launch
    const whatsappMessage = formatWhatsAppOrderMessage(
      customerDetails,
      items,
      totalAmount,
      orderNumber,
      settings
    );
    const whatsappUrl = createWhatsAppUrl(settings.whatsappNumber, whatsappMessage);

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const resetAndClose = () => {
    if (hasSubmitted) {
      onOrderSuccess();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-3xl border border-[#EADBCC] shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-[#EADBCC] bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!hasSubmitted && (
              <button
                onClick={onBackToCart}
                className="p-1.5 text-[#7B6256] hover:text-[#2C1810] hover:bg-[#F0E4D7] rounded-lg transition mr-1"
                title="Back to cart"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                {hasSubmitted ? 'Order Transmitted to WhatsApp!' : 'Finalize & Send Order to WhatsApp'}
              </h3>
              <p className="text-xs text-[#7B6256]">
                {hasSubmitted
                  ? `Order #${completedOrder?.orderNumber} · Complete your payment below`
                  : 'Zero signup required · Direct order directly with the Chocolatier'}
              </p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="p-2 text-[#7B6256] hover:text-[#2C1810] hover:bg-[#F3E7DC] rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[80vh] space-y-6">
          {hasSubmitted && completedOrder ? (
            <div className="space-y-6 animate-in fade-in">
              {/* Success Badge */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3.5 text-emerald-900">
                <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">WhatsApp Pre-filled Message Generated!</h4>
                  <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                    If WhatsApp didn't open automatically, you can click the button below to resend your order summary to <strong>{settings.displayPhone}</strong>.
                  </p>
                </div>
              </div>

              {/* UPI Card */}
              <UpiPaymentCard
                settings={settings}
                amount={completedOrder.totalAmount}
                orderNumber={completedOrder.orderNumber}
              />

              {/* Direct Reopen Button */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={createWhatsAppUrl(
                    settings.whatsappNumber,
                    formatWhatsAppOrderMessage(
                      completedOrder.customer,
                      items,
                      completedOrder.totalAmount,
                      completedOrder.orderNumber,
                      settings
                    )
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl text-center flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Re-open WhatsApp Chat</span>
                </a>
                <button
                  onClick={resetAndClose}
                  className="px-5 py-3 bg-[#FAF7F2] hover:bg-[#F3E7DC] text-[#4A2E20] border border-[#EADBCC] font-semibold text-xs sm:text-sm rounded-xl transition"
                >
                  Done / Close
                </button>
              </div>

              {onTrackOrder && (
                <div className="pt-2 text-center border-t border-[#F0E4D7]">
                  <button
                    type="button"
                    onClick={() => {
                      const num = completedOrder.orderNumber;
                      resetAndClose();
                      onTrackOrder(num);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-[#8C5E35] hover:text-[#2C1810] font-semibold transition hover:underline"
                  >
                    <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>View Live Order Tracking Status (#{completedOrder.orderNumber}) →</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Order Summary Pill */}
              <div className="bg-[#FAF5EF] p-4 rounded-2xl border border-[#EDDFCF] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#8C766C] block">Total Items:</span>
                  <span className="font-bold text-[#2C1810]">
                    {items.reduce((s, i) => s + i.quantity, 0)} boxes / assortments
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[#8C766C] block">Payable Total:</span>
                  <span className="font-serif text-lg font-bold text-[#2C1810]">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Customer Inputs */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C5E35]">
                  1. Your Delivery Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#4A2E20] block mb-1">
                      Full Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-[#DAC9B7] rounded-xl text-[#2C1810] focus:ring-2 focus:ring-[#D4AF37]/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4A2E20] block mb-1">
                      WhatsApp / Mobile Number <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-[#DAC9B7] rounded-xl text-[#2C1810] focus:ring-2 focus:ring-[#D4AF37]/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#4A2E20] block mb-1">
                    Complete Delivery Address & Landmark <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    required
                    placeholder="House/Flat No, Street, Landmark, Area..."
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-[#DAC9B7] rounded-xl text-[#2C1810] focus:ring-2 focus:ring-[#D4AF37]/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#4A2E20] block mb-1">
                      City & Pincode <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. New Delhi - 110034"
                      value={cityPincode}
                      onChange={(e) => setCityPincode(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-[#DAC9B7] rounded-xl text-[#2C1810] focus:ring-2 focus:ring-[#D4AF37]/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4A2E20] block mb-1">
                      Required By Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={preferredDeliveryDate}
                      onChange={(e) => setPreferredDeliveryDate(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-[#DAC9B7] rounded-xl text-[#2C1810] focus:ring-2 focus:ring-[#D4AF37]/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#4A2E20] block mb-1">
                    Special Packaging or Customization Note (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Please pack in individual golden gift bags"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-[#DAC9B7] rounded-xl text-[#2C1810] focus:ring-2 focus:ring-[#D4AF37]/50"
                  />
                </div>
              </div>

              {/* UPI Payment Preview Card */}
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C5E35] mb-3">
                  2. Payment Method: Direct UPI
                </h4>
                <UpiPaymentCard
                  settings={settings}
                  amount={totalAmount}
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/20 transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>Send Order to WhatsApp ({settings.displayPhone})</span>
                </button>
                <p className="text-[11px] text-center text-[#8C766C] mt-2">
                  ✨ Instant response from ChocoBloom · Pay via UPI after message dispatch
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
