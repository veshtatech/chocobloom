import { CartItem, OrderCustomerDetails, StoreSettings } from '../types';

export function formatWhatsAppOrderMessage(
  customer: OrderCustomerDetails,
  items: CartItem[],
  totalAmount: number,
  orderNumber: string,
  settings: StoreSettings
): string {
  const lineSeparator = '━━━━━━━━━━━━━━━━━━━━';
  
  const itemsText = items
    .map((item, index) => {
      const opt = item.selectedOption ? ` (${item.selectedOption})` : '';
      const subtotal = item.product.price * item.quantity;
      return `${index + 1}. *${item.product.name}*${opt}\n   • Item Code: \`${item.product.code}\`\n   • Qty: ${item.quantity} × ₹${item.product.price.toLocaleString('en-IN')}\n   • Subtotal: *₹${subtotal.toLocaleString('en-IN')}*`;
    })
    .join('\n\n');

  const giftWrapNotice = customer.isGiftWrapped ? '🎁 Free Luxury Ribbon & Festive Card: *Yes, please!*' : '';
  const giftNoteText = customer.giftNote ? `💌 Gift Card Message: _"${customer.giftNote}"_` : '';
  const dateText = customer.preferredDeliveryDate ? `📅 Required By: *${customer.preferredDeliveryDate}*` : '';

  const message = `✨ *NEW ORDER — CHOCOBLOOM* ✨
Order ID: #${orderNumber}
${lineSeparator}

👤 *CUSTOMER DETAILS:*
• Name: *${customer.name}*
• Phone: *${customer.phone}*
• Delivery Address:
  ${customer.address}
  ${customer.cityPincode}
${dateText ? `• ${dateText}\n` : ''}${giftWrapNotice ? `• ${giftWrapNotice}\n` : ''}${giftNoteText ? `• ${giftNoteText}\n` : ''}
${lineSeparator}

📦 *ORDER ITEMS:*
${itemsText}

${lineSeparator}
💰 *GRAND TOTAL:* *₹${totalAmount.toLocaleString('en-IN')}*
${lineSeparator}

💳 *PAYMENT INSTRUCTIONS:*
1. UPI ID: *${settings.upiId}* (${settings.upiPayeeName})
2. Please transfer ₹${totalAmount.toLocaleString('en-IN')} using Google Pay / PhonePe / Paytm / BHIM.
3. Share the payment screenshot in this chat to confirm your order and begin fresh preparation!

📍 *ChocoBloom Chocolates, Pitampura, New Delhi*
Thank you for supporting artisanal homemade chocolatiers! 🍫🤎`;

  return message;
}

export function createWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function createQuickInquiryUrl(settings: StoreSettings, subject?: string): string {
  const text = subject
    ? `Hello ChocoBloom! 🍫 I would like to inquire about: "${subject}". Could you please share the details and availability?`
    : `Hello ChocoBloom! 🍫 I visited your website and would like to inquire about your homemade chocolates, cracker collections, and festive hampers.`;
  return createWhatsAppUrl(settings.whatsappNumber, text);
}

export function createCustomHamperUrl(
  settings: StoreSettings,
  occasion: string,
  budget: string,
  quantity: string,
  notes: string
): string {
  const text = `✨ *CUSTOM HAMPER / CORPORATE INQUIRY — CHOCOBLOOM* ✨
• Occasion/Celebration: *${occasion}*
• Approximate Quantity: *${quantity} boxes/hampers*
• Budget per box/hamper: *${budget}*
• Special Requirements / Logo Branding:
  _${notes || 'Customisation details as per catalogue'}_

Please guide me with the available packing options, flavors, and delivery timeline! Thank you.`;
  return createWhatsAppUrl(settings.whatsappNumber, text);
}
