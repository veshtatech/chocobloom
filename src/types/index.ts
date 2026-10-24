export type ProductCategory =
  | 'all'
  | 'crackers'
  | 'festive-hampers'
  | 'homemade-chocolates'
  | 'dry-fruits'
  | 'cookies-brownies'
  | 'occasions-trousseau'
  | 'corporate-gifting';

export type StockStatus = 'in_stock' | 'low_stock' | 'sold_out' | 'on_request';

export interface Product {
  id: string;
  code: string; // e.g. "CD 9", "CD 25", "CBHC 101", "CBD 105", "CBCO 102"
  name: string;
  category: ProductCategory;
  price: number; // 0 if on_request
  priceDisplay?: string; // e.g. "Rs 290", "On request", "Rs 1,400"
  bulkPriceNotice?: string; // e.g. "Bulk rate: Rs 245 + GST (200+ pcs)" or "Rs 1,200 for 50 packings"
  image: string;
  gallery?: string[];
  description: string;
  contains: string; // e.g. "3 Chakkari, 3 Bomb, 1 Floral Candle"
  flavours?: string[]; // e.g. ["Crunchy", "Paan", "Jam", "White"]
  dimensions?: string; // e.g. "24cm × 10cm" or "12″ × 12″"
  stockStatus: StockStatus;
  isBestSeller?: boolean;
  isFestiveSpecial?: boolean;
  customizationAvailable?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
  customNote?: string;
}

export interface OrderCustomerDetails {
  name: string;
  phone: string;
  address: string;
  cityPincode: string;
  preferredDeliveryDate?: string;
  giftNote?: string;
  isGiftWrapped?: boolean;
  notes?: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: OrderCustomerDetails;
  items: {
    code: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
    option?: string;
  }[];
  totalAmount: number;
  status: 'new_inquiry' | 'awaiting_payment' | 'paid_confirmed' | 'dispatched' | 'completed';
  upiReference?: string; // 12-digit UTR or Transaction ID
  paymentVerifiedAt?: string;
  paymentVerifiedBy?: string;
  courierName?: string;
  trackingNumber?: string;
  adminNotes?: string;
  customerTag?: 'New' | 'Repeat' | 'VIP' | 'Corporate';
}

export interface StoreSettings {
  brandName: string;
  whatsappNumber: string; // formatted with country code e.g. "919910770118"
  displayPhone: string; // "+91 99107 70118"
  upiId: string; // "9910770118@upi"
  upiPayeeName: string; // "ChocoBloom Chocolates"
  email: string;
  instagramHandle: string;
  location: string;
  currencySymbol: string;
  announcementText: string;
  showAnnouncement: boolean;
  minOrderAmount: number;
  freeShippingAbove: number;
  adminPin: string;
}
