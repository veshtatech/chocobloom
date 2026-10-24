import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, QrCode, Smartphone, ArrowRight, ShieldCheck } from 'lucide-react';
import { StoreSettings } from '../types';

interface UpiPaymentCardProps {
  settings: StoreSettings;
  amount: number;
  orderNumber?: string;
  className?: string;
}

export const UpiPaymentCard: React.FC<UpiPaymentCardProps> = ({
  settings,
  amount,
  orderNumber,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(settings.upiId)}&pn=${encodeURIComponent(
    settings.upiPayeeName
  )}&am=${amount > 0 ? amount.toFixed(2) : ''}&cu=INR&tn=${encodeURIComponent(
    orderNumber ? `ChocoBloom ${orderNumber}` : 'ChocoBloom Order'
  )}`;

  useEffect(() => {
    QRCode.toDataURL(upiIntentUrl, {
      width: 280,
      margin: 2,
      color: {
        dark: '#2C1810',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate UPI QR code', err));
  }, [upiIntentUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(settings.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={`bg-[#FFFDF9] border border-[#EADBCC] rounded-2xl p-5 shadow-xs ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F0E4D7]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#F5EADB] flex items-center justify-center text-[#8C5E35]">
            <QrCode className="w-5 h-5 text-[#8C5E35]" />
          </div>
          <div>
            <h4 className="font-serif text-base font-semibold text-[#2C1810]">
              Direct UPI Payment
            </h4>
            <p className="text-xs text-[#7B6256]">Zero gateway surcharge · 100% Secure</p>
          </div>
        </div>
        {amount > 0 && (
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-[#9C7F72] block">Total to Pay</span>
            <span className="font-serif text-lg font-bold text-[#2C1810]">
              ₹{amount.toLocaleString('en-IN')}
            </span>
          </div>
        )}
      </div>

      {/* QR Code and Quick Details */}
      <div className="mt-4 flex flex-col sm:flex-row items-center gap-5">
        <div className="relative group shrink-0 bg-white p-3 rounded-xl border border-[#EEDBCC] shadow-xs flex flex-col items-center">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="ChocoBloom UPI QR Code"
              className="w-44 h-44 object-contain rounded-lg"
            />
          ) : (
            <div className="w-44 h-44 flex items-center justify-center text-xs text-gray-400">
              Generating QR...
            </div>
          )}
          <span className="mt-2 text-[10px] font-medium text-[#8C5E35] flex items-center gap-1">
            <Smartphone className="w-3 h-3" /> GPay · PhonePe · Paytm · BHIM
          </span>
        </div>

        <div className="flex-1 w-full space-y-3">
          {/* UPI ID Box */}
          <div>
            <label className="text-xs font-medium text-[#7B6256] block mb-1">
              Official UPI VPA / ID
            </label>
            <div className="flex items-center gap-2 bg-[#F6EFE9] border border-[#EADBCC] rounded-xl px-3 py-2">
              <span className="font-mono text-xs sm:text-sm font-semibold text-[#2C1810] select-all flex-1 truncate">
                {settings.upiId}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-[#2C1810] text-[#FDF9F5] hover:bg-[#43261A] transition rounded-lg"
                title="Copy UPI ID"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-[#8C766C] mt-1">
              Account Name: <strong className="text-[#2C1810]">{settings.upiPayeeName}</strong>
            </p>
          </div>

          {/* 3 Step Instruction Guide */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-semibold text-[#4A2E20] uppercase tracking-wider block">
              3 Simple Steps to Confirm:
            </span>
            <div className="grid grid-cols-1 gap-1.5 text-xs text-[#5C4337]">
              <div className="flex items-start gap-2 bg-[#FAF5EF] p-2 rounded-lg border border-[#F0E4D7]">
                <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <span>Send your order summary to our WhatsApp.</span>
              </div>
              <div className="flex items-start gap-2 bg-[#FAF5EF] p-2 rounded-lg border border-[#F0E4D7]">
                <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <span>Scan this QR code or transfer to UPI ID <strong>{settings.upiId}</strong>.</span>
              </div>
              <div className="flex items-start gap-2 bg-[#FAF5EF] p-2 rounded-lg border border-[#F0E4D7]">
                <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <span>Share the payment screenshot on WhatsApp to dispatch your fresh chocolates!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#F0E4D7] flex items-center justify-between text-[11px] text-[#8C766C]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Homemade fresh small-batch guarantee</span>
        </div>
        <span className="hidden sm:inline">Pitampura, New Delhi · Pan-India Dispatch</span>
      </div>
    </div>
  );
};
