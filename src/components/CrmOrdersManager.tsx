import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Users,
  CheckCircle2,
  Clock,
  Truck,
  Search,
  Filter,
  Download,
  MessageCircle,
  Copy,
  Check,
  AlertCircle,
  QrCode,
  DollarSign,
  TrendingUp,
  FileText,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
  Edit3,
  ExternalLink,
  Smartphone,
  Zap,
  Radio,
  Bell,
  RefreshCw,
  Play,
  KeyRound,
  X,
} from 'lucide-react';
import { OrderRecord, StoreSettings } from '../types';
import { updateOrderRecord, saveOrdersList } from '../utils/storage';
import { createWhatsAppUrl } from '../utils/whatsapp';

interface CrmOrdersManagerProps {
  orders: OrderRecord[];
  onUpdateOrders: (orders: OrderRecord[]) => void;
  settings: StoreSettings;
}

export const CrmOrdersManager: React.FC<CrmOrdersManagerProps> = ({
  orders,
  onUpdateOrders,
  settings,
}) => {
  // Sub-tabs: pipeline | auto_sms | upi_reconcile | customers
  const [subTab, setSubTab] = useState<'pipeline' | 'auto_sms' | 'upi_reconcile' | 'customers'>('pipeline');

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | OrderRecord['status']>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing order details
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [courierInput, setCourierInput] = useState('');
  const [trackingInput, setTrackingInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [utrInput, setUtrInput] = useState('');

  // Mobile Auto-Sync Listener state
  const [isListenerActive, setIsListenerActive] = useState(true);
  const [lastDetectedSms, setLastDetectedSms] = useState<string | null>(null);
  const [autoReconcileNotice, setAutoReconcileNotice] = useState<{
    orderNumber: string;
    customerName: string;
    amount: number;
    utr: string;
  } | null>(null);

  // Bank SMS Matcher State
  const [smsText, setSmsText] = useState('');
  const [parsedData, setParsedData] = useState<{ amount: number | null; utr: string | null } | null>(null);
  const [reconcileSuccess, setReconcileSuccess] = useState<string | null>(null);

  // Copy feedback
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(id);
      setTimeout(() => setCopiedText(null), 2000);
    }
  };

  // Metrics
  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const paidOrders = orders.filter((o) => o.status === 'paid_confirmed' || o.status === 'dispatched' || o.status === 'completed');
    const paidRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const awaitingPayment = orders.filter((o) => o.status === 'awaiting_payment' || o.status === 'new_inquiry');
    const awaitingRevenue = awaitingPayment.reduce((sum, o) => sum + o.totalAmount, 0);
    const dispatched = orders.filter((o) => o.status === 'dispatched');

    // Unique customers
    const uniquePhones = new Set(orders.map((o) => o.customer.phone.replace(/\D/g, '')));

    return {
      totalOrders,
      totalRevenue,
      paidOrdersCount: paidOrders.length,
      paidRevenue,
      awaitingPaymentCount: awaitingPayment.length,
      awaitingRevenue,
      dispatchedCount: dispatched.length,
      uniqueCustomersCount: uniquePhones.size,
    };
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchNumber = o.orderNumber.toLowerCase().includes(q);
        const matchName = o.customer.name.toLowerCase().includes(q);
        const matchPhone = o.customer.phone.includes(q);
        const matchUtr = o.upiReference?.toLowerCase().includes(q);
        const matchCity = o.customer.cityPincode?.toLowerCase().includes(q);
        return matchNumber || matchName || matchPhone || matchUtr || matchCity;
      }
      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  // Aggregated Customer Directory
  const customersList = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        phone: string;
        address: string;
        cityPincode: string;
        orderCount: number;
        totalSpent: number;
        lastOrderDate: string;
        tag?: 'New' | 'Repeat' | 'VIP' | 'Corporate';
        orders: OrderRecord[];
      }
    >();

    orders.forEach((o) => {
      const cleanPhone = o.customer.phone.replace(/\D/g, '') || o.customer.name;
      const existing = map.get(cleanPhone);
      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += o.totalAmount;
        if (new Date(o.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = o.createdAt;
          existing.address = o.customer.address;
          existing.cityPincode = o.customer.cityPincode;
        }
        existing.orders.push(o);
        if (existing.orderCount >= 3) existing.tag = 'VIP';
        else existing.tag = 'Repeat';
      } else {
        map.set(cleanPhone, {
          name: o.customer.name,
          phone: o.customer.phone,
          address: o.customer.address,
          cityPincode: o.customer.cityPincode,
          orderCount: 1,
          totalSpent: o.totalAmount,
          lastOrderDate: o.createdAt,
          tag: o.totalAmount > 3000 ? 'Corporate' : 'New',
          orders: [o],
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  // Core SMS Processing & Order Auto-Reconciliation Engine
  const processIncomingSms = (text: string, source = 'Auto-Sync Mobile Listener'): boolean => {
    if (!text.trim()) return false;

    // Amount extraction: Rs. 580, Rs 580.00, INR 580, etc.
    const amountMatch = text.match(/(?:rs\.?|inr)\s*([\d,]+(?:\.\d{1,2})?)/i);
    let amount: number | null = null;
    if (amountMatch) {
      amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    }

    // 12-digit UPI UTR / Ref No extraction
    const utrMatch =
      text.match(/(?:upi\/?|ref(?:\s*no)?\.?\s*:?|utr\s*:?|rrn\s*:?)\s*([0-9]{10,12})/i) ||
      text.match(/\b([0-9]{12})\b/);

    const utr = utrMatch ? utrMatch[1] : `AUTO-${Date.now().toString().slice(-6)}`;

    if (!amount) return false;

    // Find pending order matching this amount (or UTR if present)
    const candidate = orders.find(
      (o) =>
        (o.status === 'awaiting_payment' || o.status === 'new_inquiry') &&
        (Math.abs(o.totalAmount - amount!) < 1 || (o.upiReference && o.upiReference.includes(utr)))
    );

    if (candidate) {
      const updated = updateOrderRecord(candidate.id, {
        status: 'paid_confirmed',
        upiReference: utr,
        paymentVerifiedAt: new Date().toISOString(),
        paymentVerifiedBy: source,
      });
      onUpdateOrders(updated);
      setAutoReconcileNotice({
        orderNumber: candidate.orderNumber,
        customerName: candidate.customer.name,
        amount: candidate.totalAmount,
        utr,
      });
      setLastDetectedSms(text);
      return true;
    }
    return false;
  };

  // Clipboard Auto-Reader on Mobile
  const handleAutoReadClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          const matched = processIncomingSms(text, 'Mobile Clipboard Auto-Reader');
          if (!matched) {
            alert(`Detected text in clipboard: "${text.slice(0, 80)}...", but no pending order matched this amount.`);
          }
        } else {
          alert('Clipboard is empty. Copy your bank SMS notification first, then tap here!');
        }
      } else {
        alert('Clipboard reading requires secure browser permission. Please paste the SMS into the box below.');
      }
    } catch (err) {
      alert('To auto-detect, please allow clipboard access when prompted by your phone browser.');
    }
  };

  // Status Updater
  const handleUpdateStatus = (orderId: string, status: OrderRecord['status']) => {
    const partial: Partial<OrderRecord> = { status };
    if (status === 'paid_confirmed') {
      partial.paymentVerifiedAt = new Date().toISOString();
      partial.paymentVerifiedBy = 'Admin';
    }
    const updated = updateOrderRecord(orderId, partial);
    onUpdateOrders(updated);
  };

  // Quick UTR Save
  const handleSaveUtr = (orderId: string, utr: string) => {
    if (!utr.trim()) return;
    const updated = updateOrderRecord(orderId, {
      upiReference: utr.trim(),
      status: 'paid_confirmed',
      paymentVerifiedAt: new Date().toISOString(),
    });
    onUpdateOrders(updated);
    setEditingOrderId(null);
  };

  // Save Courier & Dispatch Info
  const handleSaveDispatch = (orderId: string) => {
    const updated = updateOrderRecord(orderId, {
      courierName: courierInput.trim() || 'Courier Delivery',
      trackingNumber: trackingInput.trim() || undefined,
      adminNotes: notesInput.trim() || undefined,
      status: 'dispatched',
    });
    onUpdateOrders(updated);
    setEditingOrderId(null);
  };

  // Parse Bank SMS
  const handleParseSms = (text: string) => {
    setSmsText(text);
    if (!text.trim()) {
      setParsedData(null);
      return;
    }

    // Amount extraction: Rs. 580 or INR 580 or Rs 580.00
    const amountMatch = text.match(/(?:rs\.?|inr)\s*([\d,]+(?:\.\d{1,2})?)/i);
    let amount: number | null = null;
    if (amountMatch) {
      amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    }

    // 12-digit UPI UTR / Ref No extraction
    const utrMatch =
      text.match(/(?:upi\/?|ref(?:\s*no)?\.?\s*:?|utr\s*:?|rrn\s*:?)\s*([0-9]{10,12})/i) ||
      text.match(/\b([0-9]{12})\b/);

    const utr = utrMatch ? utrMatch[1] : null;

    setParsedData({ amount, utr });
  };

  // Matches for parsed SMS
  const matchedOrdersForSms = useMemo(() => {
    if (!parsedData || (!parsedData.amount && !parsedData.utr)) return [];
    return orders.filter((o) => {
      // Direct UTR match
      if (parsedData.utr && o.upiReference && o.upiReference.includes(parsedData.utr)) {
        return true;
      }
      // Amount match among orders awaiting payment
      if (parsedData.amount && Math.abs(o.totalAmount - parsedData.amount) < 1) {
        return true;
      }
      return false;
    });
  }, [orders, parsedData]);

  // Reconcile order from SMS
  const handleReconcileOrder = (order: OrderRecord) => {
    const updated = updateOrderRecord(order.id, {
      status: 'paid_confirmed',
      upiReference: parsedData?.utr || order.upiReference || 'Verified via Bank SMS',
      paymentVerifiedAt: new Date().toISOString(),
      paymentVerifiedBy: 'Bank SMS Matcher',
    });
    onUpdateOrders(updated);
    setReconcileSuccess(`Order #${order.orderNumber} successfully marked as Paid & Verified!`);
    setSmsText('');
    setParsedData(null);
    setTimeout(() => setReconcileSuccess(null), 4000);
  };

  // WhatsApp Message Generators
  const sendWhatsAppConfirmation = (order: OrderRecord) => {
    const text = `Hello *${order.customer.name}*! ✨🍫
We have successfully received and verified your UPI payment of *₹${order.totalAmount.toLocaleString('en-IN')}* for *Order #${order.orderNumber}*!

👩‍🍳 *Status:* In Preparation
Your fresh artisanal chocolates are now queued for handcrafting at our boutique in Pitampura.

📦 You can track your order status live anytime:
${typeof window !== 'undefined' ? `${window.location.origin}/#track=${order.orderNumber}` : `/#track=${order.orderNumber}`}

Thank you for choosing ChocoBloom! 🤎`;
    const url = createWhatsAppUrl(order.customer.phone, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const sendWhatsAppDispatch = (order: OrderRecord) => {
    const courierInfo = order.courierName
      ? ` via *${order.courierName}*${order.trackingNumber ? ` (Tracking/AWB: \`${order.trackingNumber}\`)` : ''}`
      : '';
    const text = `Hello *${order.customer.name}*! 🚀📦
Great news! Your ChocoBloom artisanal chocolate package (*Order #${order.orderNumber}*) has been freshly packed with thermal bubble wrap and *dispatched*${courierInfo}!

📍 *Delivery Address:*
${order.customer.address}, ${order.customer.cityPincode}

🍫 Track live status here:
${typeof window !== 'undefined' ? `${window.location.origin}/#track=${order.orderNumber}` : `/#track=${order.orderNumber}`}

Please keep your phone handy to receive the package! Enjoy the chocolates! ✨`;
    const url = createWhatsAppUrl(order.customer.phone, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const sendWhatsAppDirect = (customerPhone: string, customerName: string) => {
    const text = `Hello *${customerName}*! 👋 Thank you for choosing ChocoBloom Chocolates. How can we assist you with your orders and gifting today?`;
    const url = createWhatsAppUrl(customerPhone, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Export CSV
  const handleExportCsv = () => {
    if (orders.length === 0) {
      alert('No orders to export.');
      return;
    }
    const headers = [
      'Order Number',
      'Date',
      'Customer Name',
      'Phone',
      'City & Pincode',
      'Delivery Address',
      'Total Amount',
      'Status',
      'UPI UTR / Ref',
      'Payment Verified At',
      'Courier Name',
      'Tracking Number',
      'Items Summary',
    ];
    const rows = orders.map((o) => [
      `"${o.orderNumber}"`,
      `"${new Date(o.createdAt).toLocaleDateString()}"`,
      `"${o.customer.name}"`,
      `"${o.customer.phone}"`,
      `"${o.customer.cityPincode}"`,
      `"${o.customer.address.replace(/"/g, '""')}"`,
      o.totalAmount,
      `"${o.status}"`,
      `"${o.upiReference || ''}"`,
      `"${o.paymentVerifiedAt ? new Date(o.paymentVerifiedAt).toLocaleDateString() : ''}"`,
      `"${o.courierName || ''}"`,
      `"${o.trackingNumber || ''}"`,
      `"${o.items.map((i) => `${i.code}: ${i.name} x${i.quantity}`).join('; ')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ChocoBloom_CRM_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#EADBCC] shadow-xs">
          <div className="flex items-center justify-between text-[#8C5E35] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Gross Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#A66228]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-serif text-[#2C1810]">
            ₹{metrics.totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-[#7B6256] mt-0.5 block">
            {metrics.totalOrders} total orders received
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#EADBCC] shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Verified Paid</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-serif text-emerald-900">
            ₹{metrics.paidRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-700 mt-0.5 block">
            {metrics.paidOrdersCount} orders confirmed
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#EADBCC] shadow-xs">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Awaiting UPI</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-serif text-amber-900">
            ₹{metrics.awaitingRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-amber-700 mt-0.5 block">
            {metrics.awaitingPaymentCount} pending transfers
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#EADBCC] shadow-xs">
          <div className="flex items-center justify-between text-purple-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Customers</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-serif text-[#2C1810]">
            {metrics.uniqueCustomersCount}
          </div>
          <span className="text-[11px] text-[#7B6256] mt-0.5 block">
            {metrics.dispatchedCount} in transit / dispatched
          </span>
        </div>
      </div>

      {/* AUTO-RECONCILIATION TOAST BANNER */}
      {autoReconcileNotice && (
        <div className="p-4 bg-emerald-100 border-2 border-emerald-500 rounded-2xl text-emerald-950 flex items-start justify-between gap-3 shadow-md animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="font-bold text-sm">
                🎉 Auto-Matched & Reconciled: Order #{autoReconcileNotice.orderNumber}
              </h4>
              <p className="text-xs text-emerald-900">
                Customer <strong>{autoReconcileNotice.customerName}</strong> paid <strong>₹{autoReconcileNotice.amount.toLocaleString('en-IN')}</strong> (UTR: <code className="bg-white/80 px-1 py-0.5 rounded font-mono">{autoReconcileNotice.utr}</code>). Status automatically updated to <strong>Paid & In Kitchen Prep</strong>!
              </p>
            </div>
          </div>
          <button
            onClick={() => setAutoReconcileNotice(null)}
            className="p-1 text-emerald-800 hover:text-black rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* CRM SUB-NAVIGATION TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#EADBCC]">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F1E6DA] rounded-xl border border-[#DFCEBD]">
          <button
            onClick={() => setSubTab('pipeline')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-2 ${
              subTab === 'pipeline'
                ? 'bg-white text-[#2C1810] shadow-xs'
                : 'text-[#6D5144] hover:text-[#2C1810]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders Pipeline ({filteredOrders.length})</span>
          </button>

          <button
            onClick={() => setSubTab('auto_sms')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-2 ${
              subTab === 'auto_sms'
                ? 'bg-white text-[#2C1810] shadow-xs'
                : 'text-[#6D5144] hover:text-[#2C1810]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-purple-700" />
            <span>Mobile SMS Auto-Sync</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>

          <button
            onClick={() => setSubTab('upi_reconcile')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-2 ${
              subTab === 'upi_reconcile'
                ? 'bg-white text-[#2C1810] shadow-xs'
                : 'text-[#6D5144] hover:text-[#2C1810]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-700" />
            <span>Manual UPI Matcher</span>
            {metrics.awaitingPaymentCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-white text-[10px] rounded-full font-bold">
                {metrics.awaitingPaymentCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setSubTab('customers')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-2 ${
              subTab === 'customers'
                ? 'bg-white text-[#2C1810] shadow-xs'
                : 'text-[#6D5144] hover:text-[#2C1810]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Customer Directory ({customersList.length})</span>
          </button>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-3.5 py-1.5 bg-[#FAF0E4] hover:bg-[#F3E2CF] text-[#4A2E20] border border-[#E3CAAF] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
        >
          <Download className="w-3.5 h-3.5 text-[#8C5E35]" />
          <span>Export CRM CSV</span>
        </button>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 1: ORDERS PIPELINE & LIFECYCLE MANAGEMENT */}
      {/* ────────────────────────────────────────────────────────── */}
      {subTab === 'pipeline' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8C5E35] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders by customer name, phone, order #, or UTR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#DAC9B7] rounded-xl text-xs text-[#2C1810] placeholder:text-[#9C8274] focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs font-medium">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'awaiting_payment', label: 'Awaiting Payment' },
                  { id: 'paid_confirmed', label: 'Paid & In Prep' },
                  { id: 'dispatched', label: 'Dispatched' },
                  { id: 'completed', label: 'Completed' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                    statusFilter === tab.id
                      ? 'bg-[#2C1810] text-[#FAF7F2] font-semibold'
                      : 'bg-[#FAF5EF] text-[#6D5144] hover:bg-[#F3E2CF]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-[#EADBCC] text-[#8C766C] space-y-2">
              <ShoppingBag className="w-8 h-8 mx-auto stroke-1 text-[#C4ADA1]" />
              <p className="text-xs font-medium text-[#4A2E20]">No orders match your filter criteria.</p>
              <p className="text-[11px] text-[#7B6256]">Orders placed by customers on your store will appear here automatically.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isEditing = editingOrderId === order.id;

                return (
                  <div
                    key={order.id}
                    className="p-5 bg-white rounded-2xl border border-[#EADBCC] shadow-xs space-y-4 hover:border-[#D4AF37]/50 transition"
                  >
                    {/* Top Row: Order ID, Date, Status Selector */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0E4D7]">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-sm font-bold text-[#2C1810] bg-[#FAF5EF] px-2.5 py-1 rounded-lg border border-[#EDDFCF]">
                          #{order.orderNumber}
                        </span>
                        <button
                          onClick={() => handleCopy(order.orderNumber, order.id)}
                          className="p-1 text-[#8C5E35] hover:text-[#2C1810] rounded transition"
                          title="Copy Order ID"
                        >
                          {copiedText === order.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <span className="text-[11px] text-[#8C766C]">
                          {new Date(order.createdAt).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {/* Status Change Dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#8C766C]">Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderRecord['status'])}
                          className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:ring-1 focus:ring-[#D4AF37] ${
                            order.status === 'paid_confirmed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : order.status === 'dispatched'
                              ? 'bg-indigo-50 text-indigo-900 border-indigo-300'
                              : order.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                              : 'bg-amber-50 text-amber-900 border-amber-300'
                          }`}
                        >
                          <option value="awaiting_payment">⏳ Awaiting Payment</option>
                          <option value="paid_confirmed">✅ Paid & In Kitchen Prep</option>
                          <option value="dispatched">🚀 Dispatched (In Transit)</option>
                          <option value="completed">🎉 Delivered & Completed</option>
                        </select>
                      </div>
                    </div>

                    {/* Middle Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#5C4337]">
                      {/* Customer Info */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <strong className="text-[#2C1810] font-bold flex items-center gap-1">
                            <span>{order.customer.name}</span>
                          </strong>
                          <a
                            href={createWhatsAppUrl(order.customer.phone, `Hello ${order.customer.name}! Inquiring regarding your ChocoBloom Order #${order.orderNumber}`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold hover:underline"
                          >
                            <MessageCircle className="w-3 h-3 text-emerald-600" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                        <p className="font-mono text-[11px] text-[#6D5144]">{order.customer.phone}</p>
                        <p className="text-[#7B6256] leading-relaxed">
                          {order.customer.address}, {order.customer.cityPincode}
                        </p>
                        {order.customer.preferredDeliveryDate && (
                          <p className="text-[#A66228] font-medium flex items-center gap-1 text-[11px]">
                            <Calendar className="w-3 h-3" /> Due by: {order.customer.preferredDeliveryDate}
                          </p>
                        )}
                        {order.customer.giftNote && (
                          <p className="text-pink-900 italic bg-pink-50/70 p-2 rounded-lg border border-pink-200/50">
                            💌 Card Note: "{order.customer.giftNote}"
                          </p>
                        )}
                      </div>

                      {/* Items Ordered */}
                      <div className="space-y-1.5">
                        <strong className="text-[#2C1810] font-bold block">
                          Chocolates Ordered ({order.items.reduce((s, i) => s + i.quantity, 0)} boxes):
                        </strong>
                        <ul className="space-y-1 pl-1">
                          {order.items.map((i, idx) => (
                            <li key={idx} className="flex justify-between items-start gap-2">
                              <span>
                                <span className="font-mono text-[10px] text-[#8C5E35]">[{i.code}]</span> {i.name} × {i.quantity}
                              </span>
                              <span className="font-mono font-semibold shrink-0">
                                ₹{i.subtotal.toLocaleString('en-IN')}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className="pt-2 border-t border-[#F0E4D7] flex justify-between font-bold text-sm text-[#2C1810]">
                          <span>Grand Total:</span>
                          <span className="font-serif text-[#A66228]">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* UPI & Dispatch Status */}
                      <div className="space-y-2 bg-[#FAF7F2] p-3 rounded-xl border border-[#EDDFCF]">
                        <div className="flex items-center justify-between">
                          <strong className="text-[#2C1810] font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#8C5E35]" />
                            <span>UPI Payment Verification</span>
                          </strong>
                          {order.upiReference ? (
                            <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                              UTR ADDED
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                              NO UTR
                            </span>
                          )}
                        </div>

                        {order.upiReference ? (
                          <div className="space-y-1">
                            <span className="text-[11px] text-[#7B6256] block">Customer UTR / Ref No:</span>
                            <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-[#DAC9B7] font-mono font-bold text-xs text-[#2C1810]">
                              <span>{order.upiReference}</span>
                              <button
                                onClick={() => handleCopy(order.upiReference!, `utr-${order.id}`)}
                                className="p-0.5 text-[#8C5E35]"
                              >
                                {copiedText === `utr-${order.id}` ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                            {order.paymentVerifiedAt && (
                              <span className="text-[10px] text-emerald-700 flex items-center gap-1 font-medium">
                                <CheckCircle2 className="w-3 h-3" /> Verified on{' '}
                                {new Date(order.paymentVerifiedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="text-[11px] text-[#7B6256] block">Awaiting customer payment screenshot/UTR.</span>
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                placeholder="Enter 12-digit UTR..."
                                className="text-xs p-1.5 bg-white border border-[#DAC9B7] rounded-lg font-mono flex-1 text-[#2C1810]"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSaveUtr(order.id, (e.target as HTMLInputElement).value);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Dispatch Details if any */}
                        {order.courierName && (
                          <div className="pt-2 border-t border-[#EDDFCF] text-[11px] space-y-0.5">
                            <span className="text-[#8C5E35] font-semibold flex items-center gap-1">
                              <Truck className="w-3 h-3" /> {order.courierName}
                            </span>
                            {order.trackingNumber && (
                              <p className="font-mono text-[#2C1810]">AWB: {order.trackingNumber}</p>
                            )}
                          </div>
                        )}

                        {order.adminNotes && (
                          <p className="text-[10px] text-[#6D5144] italic border-t border-[#EDDFCF] pt-1">
                            📝 Note: {order.adminNotes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F0E4D7]">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* 1-Click WhatsApp Payment Receipt */}
                        <button
                          type="button"
                          onClick={() => sendWhatsAppConfirmation(order)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                          title="Send official payment confirmation and kitchen prep notification to customer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Send WhatsApp Receipt</span>
                        </button>

                        {/* 1-Click WhatsApp Dispatch Notification */}
                        <button
                          type="button"
                          onClick={() => sendWhatsAppDispatch(order)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                          title="Notify customer with dispatch details and courier tracking"
                        >
                          <Truck className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Send Dispatch Update</span>
                        </button>

                        {/* Quick Mark Paid button if awaiting payment */}
                        {order.status === 'awaiting_payment' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(order.id, 'paid_confirmed')}
                            className="px-3 py-1.5 bg-[#2C1810] hover:bg-[#43261A] text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>1-Click Mark Paid</span>
                          </button>
                        )}
                      </div>

                      {/* Dispatch & Edit Toggle */}
                      <button
                        type="button"
                        onClick={() => {
                          if (isEditing) {
                            setEditingOrderId(null);
                          } else {
                            setEditingOrderId(order.id);
                            setCourierInput(order.courierName || 'Delhivery');
                            setTrackingInput(order.trackingNumber || '');
                            setNotesInput(order.adminNotes || '');
                          }
                        }}
                        className="px-3 py-1.5 bg-[#FAF0E4] hover:bg-[#F3E2CF] text-[#4A2E20] border border-[#E3CAAF] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#8C5E35]" />
                        <span>{isEditing ? 'Cancel Edit' : 'Edit Courier & Notes'}</span>
                      </button>
                    </div>

                    {/* Inline Dispatch & Notes Editor */}
                    {isEditing && (
                      <div className="p-4 bg-[#FAF5EF] rounded-xl border border-[#DAC9B7] space-y-3 animate-in fade-in">
                        <h5 className="font-serif font-bold text-xs text-[#2C1810]">
                          Update Dispatch & Internal Notes for Order #{order.orderNumber}
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="text-[11px] font-semibold text-[#4A2E20] block mb-1">
                              Courier Partner
                            </label>
                            <input
                              type="text"
                              value={courierInput}
                              onChange={(e) => setCourierInput(e.target.value)}
                              placeholder="e.g. Delhivery, BlueDart, WeFast, Porter, Hand Delivery"
                              className="w-full p-2 bg-white border border-[#DAC9B7] rounded-lg text-xs text-[#2C1810]"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-[#4A2E20] block mb-1">
                              Tracking / AWB Number
                            </label>
                            <input
                              type="text"
                              value={trackingInput}
                              onChange={(e) => setTrackingInput(e.target.value)}
                              placeholder="e.g. 12938472910 or live link"
                              className="w-full p-2 bg-white border border-[#DAC9B7] rounded-lg text-xs font-mono text-[#2C1810]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-[#4A2E20] block mb-1">
                            Internal Admin Notes (Packaging preferences, custom request, etc.)
                          </label>
                          <input
                            type="text"
                            value={notesInput}
                            onChange={(e) => setNotesInput(e.target.value)}
                            placeholder="e.g. Added complimentary sample bar; dispatch by 3 PM"
                            className="w-full p-2 bg-white border border-[#DAC9B7] rounded-lg text-xs text-[#2C1810]"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleSaveDispatch(order.id)}
                            className="px-4 py-2 bg-[#2C1810] hover:bg-[#43261A] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
                          >
                            <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Save & Mark Dispatched</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* SUB-TAB: MOBILE SMS AUTO-SYNC (ANDROID & IPHONE AUTO-READER) */}
      {/* ────────────────────────────────────────────────────────── */}
      {subTab === 'auto_sms' && (
        <div className="space-y-6">
          {/* Active Auto-Sync Header Card */}
          <div className="p-6 bg-linear-to-br from-[#2C1810] to-[#1A0E09] rounded-2xl text-white space-y-4 shadow-lg border border-[#D4AF37]/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#4A2E20] border border-[#D4AF37] flex items-center justify-center text-[#E8C587]">
                  <Smartphone className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-[#FAF7F2]">
                      Mobile SMS Payment Auto-Sync
                    </h3>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      ACTIVE ON THIS DEVICE
                    </span>
                  </div>
                  <p className="text-xs text-[#D7C4B7]">
                    Reads incoming bank transaction SMS and matches pending customer orders automatically with zero 2% gateway fees.
                  </p>
                </div>
              </div>

              {/* Quick Action Button for Mobile */}
              <button
                type="button"
                onClick={handleAutoReadClipboard}
                className="px-5 py-3 bg-linear-to-r from-[#D4AF37] to-[#B6922C] text-[#2C1810] font-bold text-xs sm:text-sm rounded-xl shadow-md hover:brightness-110 transition flex items-center justify-center gap-2 shrink-0"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Auto-Detect Bank SMS from Phone</span>
              </button>
            </div>

            {lastDetectedSms && (
              <div className="p-3 bg-black/40 rounded-xl border border-white/10 text-xs text-[#EADBCC] space-y-1 font-mono">
                <span className="text-[10px] text-[#D4AF37] uppercase font-bold block tracking-wider">
                  Last Processed SMS:
                </span>
                <p className="truncate">{lastDetectedSms}</p>
              </div>
            )}
          </div>

          {/* Dual OS Guide: Android vs Apple (iOS) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Android Auto-Sync Card */}
            <div className="p-5 bg-white rounded-2xl border border-[#EADBCC] shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Smartphone className="w-4 h-4" />
                </div>
                <span>Android Phone: 100% Background Automation</span>
              </div>
              <p className="text-xs text-[#5C4337] leading-relaxed">
                Android allows phone automation apps to detect bank transaction SMS and automatically notify your website in real-time.
              </p>
              <div className="bg-[#FAF5EF] p-3 rounded-xl border border-[#EDDFCF] text-xs space-y-2 text-[#4A2E20]">
                <strong className="block text-[11px] uppercase tracking-wider text-[#8C5E35]">Quick 2-Minute Setup:</strong>
                <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-[#6D5144]">
                  <li>Install free <strong>MacroDroid</strong> or <strong>SMS Forwarder</strong> from Google Play Store on your phone.</li>
                  <li>Set Trigger: <strong>Incoming SMS</strong> (from Bank / containing text "UPI" or "credited with").</li>
                  <li>Set Action: <strong>HTTP Request / Open Webhook</strong> to your site endpoint.</li>
                  <li>Result: The moment your bank sends you an SMS, the order turns <strong>Paid & Confirmed</strong> automatically!</li>
                </ol>
              </div>
              <div className="pt-1">
                <span className="text-[11px] text-[#8C766C] block mb-1">Your Store Webhook Sync URL:</span>
                <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-2 rounded-lg border border-[#DAC9B7] text-xs font-mono text-[#2C1810]">
                  <span className="truncate flex-1">
                    {typeof window !== 'undefined' ? `${window.location.origin}/#admin?sync=sms` : '/#admin?sync=sms'}
                  </span>
                  <button
                    onClick={() => handleCopy(typeof window !== 'undefined' ? `${window.location.origin}/#admin?sync=sms` : '/#admin?sync=sms', 'webhook-url')}
                    className="p-1 text-[#8C5E35] hover:text-[#2C1810]"
                  >
                    {copiedText === 'webhook-url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Apple iPhone (iOS) Card */}
            <div className="p-5 bg-white rounded-2xl border border-[#EADBCC] shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
                  <Smartphone className="w-4 h-4" />
                </div>
                <span>Apple iPhone: 1-Tap Clipboard Auto-Reader</span>
              </div>
              <p className="text-xs text-[#5C4337] leading-relaxed">
                Apple iOS strictly sandboxes all websites and third-party apps, blocking direct access to your personal Messages inbox for privacy reasons.
              </p>
              <div className="bg-[#FAF5EF] p-3 rounded-xl border border-[#EDDFCF] text-xs space-y-2 text-[#4A2E20]">
                <strong className="block text-[11px] uppercase tracking-wider text-[#8C5E35]">How iPhone Owners Reconcile in 2 Seconds:</strong>
                <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-[#6D5144]">
                  <li>When your bank notification arrives on your iPhone, long-press it and tap <strong>Copy</strong>.</li>
                  <li>Switch back to this Admin window and tap <strong>"Auto-Detect Bank SMS"</strong> above.</li>
                  <li>Our smart regex auto-parses the amount and 12-digit UTR, pairing it with the order with <strong>zero typing</strong>!</li>
                  <li>Tap <strong>"Send WhatsApp Receipt"</strong> to inform the client.</li>
                </ol>
              </div>
              <p className="text-[11px] text-[#7B6256] italic">
                💡 This protects customer trust while giving you full tracking without paying 2% payment gateway cut.
              </p>
            </div>
          </div>

          {/* Interactive Live Simulator: Test Auto-Sync Right Now */}
          <div className="p-6 bg-white rounded-2xl border border-[#EADBCC] shadow-xs space-y-4">
            <div>
              <h4 className="font-serif font-bold text-base text-[#2C1810] flex items-center gap-2">
                <Play className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                <span>Interactive Simulator: Test Live Bank SMS Matching</span>
              </h4>
              <p className="text-xs text-[#7B6256] mt-0.5">
                Click any of these real Indian bank SMS formats to see the auto-sync engine match pending orders in real time:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() =>
                  processIncomingSms(
                    'Dear Customer, your a/c ending 4819 is credited with Rs 280.00 on 23-Oct-26 by UPI ref no 429671829102.',
                    'Simulator: HDFC Bank SMS'
                  )
                }
                className="p-3 bg-[#FAF7F2] hover:bg-[#F3E7DC] border border-[#DAC9B7] rounded-xl text-left space-y-1.5 transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#2C1810]">🏦 HDFC Bank SMS</span>
                  <span className="text-[10px] font-mono font-bold bg-[#E8C587]/40 px-1.5 py-0.5 rounded text-[#2C1810]">₹280</span>
                </div>
                <p className="text-[10px] font-mono text-[#7B6256] line-clamp-2">
                  credited with Rs 280.00 by UPI ref 429671829102
                </p>
                <span className="text-[10px] text-[#8C5E35] font-semibold block group-hover:underline">
                  Click to Test Match →
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  processIncomingSms(
                    'SBI: INR 290.00 credited to A/C ...8102 on 23-Oct-26 via UPI/429618293019/PhonePe.',
                    'Simulator: SBI UPI SMS'
                  )
                }
                className="p-3 bg-[#FAF7F2] hover:bg-[#F3E7DC] border border-[#DAC9B7] rounded-xl text-left space-y-1.5 transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#2C1810]">🏦 SBI Bank SMS</span>
                  <span className="text-[10px] font-mono font-bold bg-[#E8C587]/40 px-1.5 py-0.5 rounded text-[#2C1810]">₹290</span>
                </div>
                <p className="text-[10px] font-mono text-[#7B6256] line-clamp-2">
                  INR 290.00 credited via UPI/429618293019
                </p>
                <span className="text-[10px] text-[#8C5E35] font-semibold block group-hover:underline">
                  Click to Test Match →
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  processIncomingSms(
                    'ICICI Bank: Acct ...3910 credited with INR 580.00 on 23-Oct-26 by UPI-429671829102.',
                    'Simulator: ICICI Bank SMS'
                  )
                }
                className="p-3 bg-[#FAF7F2] hover:bg-[#F3E7DC] border border-[#DAC9B7] rounded-xl text-left space-y-1.5 transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#2C1810]">🏦 ICICI Bank SMS</span>
                  <span className="text-[10px] font-mono font-bold bg-[#E8C587]/40 px-1.5 py-0.5 rounded text-[#2C1810]">₹580</span>
                </div>
                <p className="text-[10px] font-mono text-[#7B6256] line-clamp-2">
                  credited with INR 580.00 by UPI-429671829102
                </p>
                <span className="text-[10px] text-[#8C5E35] font-semibold block group-hover:underline">
                  Click to Test Match →
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  processIncomingSms(
                    'PhonePe: Received Rs. 1400 from Rahul Kumar. UTR: 429618291024',
                    'Simulator: PhonePe Notification'
                  )
                }
                className="p-3 bg-[#FAF7F2] hover:bg-[#F3E7DC] border border-[#DAC9B7] rounded-xl text-left space-y-1.5 transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#2C1810]">📱 PhonePe / GPay</span>
                  <span className="text-[10px] font-mono font-bold bg-[#E8C587]/40 px-1.5 py-0.5 rounded text-[#2C1810]">₹1,400</span>
                </div>
                <p className="text-[10px] font-mono text-[#7B6256] line-clamp-2">
                  Received Rs. 1400. UTR: 429618291024
                </p>
                <span className="text-[10px] text-[#8C5E35] font-semibold block group-hover:underline">
                  Click to Test Match →
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 3: ZERO-COST MANUAL UPI VERIFIER */}
      {/* ────────────────────────────────────────────────────────── */}
      {subTab === 'upi_reconcile' && (
        <div className="space-y-6">
          {/* Informational Guidance Banner */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <h4 className="font-serif font-bold text-sm">
                How Zero-Fee Direct UPI Payment Tracking Works
              </h4>
            </div>
            <p className="text-xs leading-relaxed text-emerald-800">
              Payment gateways (like Razorpay/PhonePe for Business) charge <strong>1.5% to 2% + GST</strong> on every order just to send an automated webhook. By having customers transfer directly to your UPI ID (<strong>{settings.upiId}</strong>), you keep <strong>100% of your earnings with ₹0 fees</strong>.
            </p>
            <p className="text-xs leading-relaxed text-emerald-800">
              When a customer completes a transfer, their bank assigns a <strong>12-digit UTR (Unique Transaction Reference)</strong>. You can simply paste your bank SMS or type the UTR below to automatically match and confirm the order in 1 click!
            </p>
          </div>

          {/* SMS / Statement Parser Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#EADBCC] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E4D7]">
              <div>
                <h4 className="font-serif font-bold text-base text-[#2C1810] flex items-center gap-2">
                  <span>Smart Bank SMS & UPI Notification Matcher</span>
                  <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                    0% Commission Reconciler
                  </span>
                </h4>
                <p className="text-xs text-[#7B6256] mt-0.5">
                  Copy the SMS you received from your bank (SBI, HDFC, ICICI, Paytm, PhonePe) and paste it below.
                </p>
              </div>
            </div>

            {reconcileSuccess && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{reconcileSuccess}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-[#4A2E20] block mb-1">
                Paste Bank SMS / Notification Text:
              </label>
              <textarea
                rows={3}
                value={smsText}
                onChange={(e) => handleParseSms(e.target.value)}
                placeholder="Example: Dear Customer, your a/c ... is credited with Rs 580.00 on 23-Oct-26 by UPI ref no 429671829102."
                className="w-full text-xs p-3 bg-[#FAF7F2] border border-[#DAC9B7] rounded-xl text-[#2C1810] focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            {/* Extracted Data Pills */}
            {parsedData && (
              <div className="p-4 bg-[#FAF5EF] rounded-xl border border-[#E3CAAF] space-y-3">
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#8C5E35]">Detected Amount:</span>
                    <span className="font-mono text-sm font-bold text-[#2C1810] bg-white px-2 py-0.5 rounded border border-[#DAC9B7]">
                      {parsedData.amount ? `₹${parsedData.amount.toLocaleString('en-IN')}` : 'Not detected'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[#8C5E35]">12-Digit UTR Ref:</span>
                    <span className="font-mono text-sm font-bold text-[#2C1810] bg-white px-2 py-0.5 rounded border border-[#DAC9B7]">
                      {parsedData.utr || 'Not detected'}
                    </span>
                  </div>
                </div>

                {/* Candidate Matches */}
                <div className="space-y-2 pt-2 border-t border-[#EDDFCF]">
                  <span className="text-xs font-bold text-[#2C1810] block">
                    Matching Pending Orders ({matchedOrdersForSms.length} found):
                  </span>

                  {matchedOrdersForSms.length === 0 ? (
                    <p className="text-xs text-[#7B6256] italic">
                      No pending orders found matching this amount or UTR. Please check the order list below.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {matchedOrdersForSms.map((mo) => (
                        <div
                          key={mo.id}
                          className="p-3 bg-white rounded-xl border border-[#DAC9B7] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-[#2C1810]">#{mo.orderNumber}</span>
                              <span className="font-semibold text-xs text-[#4A2E20]">{mo.customer.name}</span>
                              <span className="text-[11px] text-[#7B6256]">({mo.customer.phone})</span>
                            </div>
                            <span className="text-xs font-serif font-bold text-[#A66228]">
                              Order Total: ₹{mo.totalAmount.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[11px] text-[#8C766C] block">
                              Ordered {mo.items.length} items on {new Date(mo.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleReconcileOrder(mo)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Confirm Payment & Mark Paid</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Pending Orders Awaiting UTR / Payment */}
          <div className="bg-white p-6 rounded-2xl border border-[#EADBCC] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E4D7]">
              <div>
                <h4 className="font-serif font-bold text-base text-[#2C1810]">
                  Pending Orders Awaiting Payment Verification ({metrics.awaitingPaymentCount})
                </h4>
                <p className="text-xs text-[#7B6256]">
                  Match incoming UPI credits from your Google Pay, PhonePe, or BHIM app against these orders.
                </p>
              </div>
            </div>

            {orders.filter((o) => o.status === 'awaiting_payment').length === 0 ? (
              <div className="text-center py-8 text-[#8C766C] space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-medium text-[#2C1810]">All caught up!</p>
                <p className="text-[11px] text-[#7B6256]">There are no pending unverified orders at this moment.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders
                  .filter((o) => o.status === 'awaiting_payment')
                  .map((order) => (
                    <div
                      key={order.id}
                      className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EDDFCF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#2C1810]">#{order.orderNumber}</span>
                          <span className="font-semibold text-[#4A2E20]">{order.customer.name}</span>
                          <span className="text-[#8C766C]">({order.customer.phone})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-serif font-bold text-sm text-[#A66228]">
                            Amount: ₹{order.totalAmount.toLocaleString('en-IN')}
                          </span>
                          {order.upiReference ? (
                            <span className="font-mono text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                              UTR: {order.upiReference}
                            </span>
                          ) : (
                            <span className="text-[11px] text-amber-700 italic">No UTR entered by buyer yet</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order.id, 'paid_confirmed')}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1.5 transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verify & Confirm Paid</span>
                        </button>
                        <a
                          href={createWhatsAppUrl(
                            order.customer.phone,
                            `Hi ${order.customer.name}! Following up on your ChocoBloom Order #${order.orderNumber} for ₹${order.totalAmount}. Have you shared the UPI payment screenshot?`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white text-emerald-700 border border-emerald-300 rounded-lg hover:bg-emerald-50 transition"
                          title="Remind on WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 3: CUSTOMER CRM DIRECTORY & CLIENT PROFILES */}
      {/* ────────────────────────────────────────────────────────── */}
      {subTab === 'customers' && (
        <div className="bg-white p-6 rounded-2xl border border-[#EADBCC] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0E4D7]">
            <div>
              <h4 className="font-serif font-bold text-base text-[#2C1810]">
                Customer Relationships & Lifetime Value (LTV)
              </h4>
              <p className="text-xs text-[#7B6256]">
                Track high-value repeat clients, corporate buyers, and delivery locations for targeted gifting offers.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#8C5E35] bg-[#FAF5EF] px-3 py-1.5 rounded-xl border border-[#E3CAAF]">
              {customersList.length} Unique Customer Profiles
            </span>
          </div>

          {customersList.length === 0 ? (
            <div className="text-center py-10 text-[#8C766C] space-y-1">
              <Users className="w-8 h-8 mx-auto text-[#C4ADA1]" />
              <p className="text-xs font-medium text-[#4A2E20]">No customer profiles recorded yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#4A2E20]">
                <thead className="bg-[#FAF5EF] text-[#8C5E35] uppercase text-[10px] tracking-wider border-b border-[#EADBCC]">
                  <tr>
                    <th className="p-3">Customer Name</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Delivery Location</th>
                    <th className="p-3">Total Orders</th>
                    <th className="p-3">Lifetime Spend (LTV)</th>
                    <th className="p-3">Customer Segment</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E4D7]">
                  {customersList.map((c, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF7F2] transition">
                      <td className="p-3 font-bold text-[#2C1810] flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-full bg-[#FAF0E4] text-[#8C5E35] flex items-center justify-center font-serif text-[11px] font-bold">
                          {c.name.charAt(0).toUpperCase()}
                        </span>
                        <span>{c.name}</span>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-[#6D5144]">{c.phone}</td>
                      <td className="p-3 max-w-xs truncate text-[#7B6256]">
                        {c.cityPincode || c.address || 'Delhi NCR'}
                      </td>
                      <td className="p-3 font-semibold text-center">{c.orderCount}</td>
                      <td className="p-3 font-serif font-bold text-[#A66228]">
                        ₹{c.totalSpent.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            c.tag === 'VIP'
                              ? 'bg-purple-100 text-purple-900 border border-purple-300'
                              : c.tag === 'Corporate'
                              ? 'bg-blue-100 text-blue-900 border border-blue-300'
                              : c.tag === 'Repeat'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          {c.tag || 'Customer'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => sendWhatsAppDirect(c.phone, c.name)}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition"
                          title="Message customer on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Chat</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
