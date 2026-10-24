import { Product, OrderRecord, StoreSettings } from '../types';
import { initialProducts, defaultStoreSettings } from '../data/initialProducts';

const STORAGE_KEYS = {
  PRODUCTS: 'chocobloom_products_v1',
  SETTINGS: 'chocobloom_settings_v1',
  ORDERS: 'chocobloom_orders_v1',
};

export function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      saveProducts(initialProducts);
      return initialProducts;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialProducts;
  } catch (err) {
    console.error('Error loading products from storage:', err);
    return initialProducts;
  }
}

export function saveProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (err) {
    console.error('Error saving products:', err);
  }
}

export function getStoredSettings(): StoreSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      saveSettings(defaultStoreSettings);
      return defaultStoreSettings;
    }
    const parsed = JSON.parse(raw);
    const merged: StoreSettings = { ...defaultStoreSettings, ...parsed };
    // Migrate old PIN 1234 to new PIN 241026
    if (!merged.adminPin || merged.adminPin === '1234') {
      merged.adminPin = '241026';
      saveSettings(merged);
    }
    return merged;
  } catch (err) {
    console.error('Error loading settings from storage:', err);
    return defaultStoreSettings;
  }
}

export function saveSettings(settings: StoreSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving settings:', err);
  }
}

export function getStoredOrders(): OrderRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading orders:', err);
    return [];
  }
}

export function saveOrder(order: OrderRecord): void {
  try {
    const existing = getStoredOrders();
    const updated = [order, ...existing];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving order:', err);
  }
}

export function saveOrdersList(orders: OrderRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (err) {
    console.error('Error saving orders list:', err);
  }
}

export function updateOrderRecord(orderId: string, partial: Partial<OrderRecord>): OrderRecord[] {
  try {
    const existing = getStoredOrders();
    const updated = existing.map((o) => (o.id === orderId ? { ...o, ...partial } : o));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error updating order record:', err);
    return [];
  }
}

export function updateOrderStatus(orderId: string, status: OrderRecord['status']): OrderRecord[] {
  return updateOrderRecord(orderId, { status });
}

export function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CB-${dateStr}-${randomSuffix}`;
}
