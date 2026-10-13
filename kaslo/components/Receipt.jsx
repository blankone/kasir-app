'use client'

import { formatCurrency, formatDate } from '@/utils/helpers'
import { FiPrinter, FiX } from 'react-icons/fi'

export default function Receipt({ transaction, storeSettings, onClose }) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-sm w-full p-6 animate-slide-in">
        <div className="flex items-center justify-between mb-4 no-print">
          <h2 className="text-xl font-bold">Struk Pembayaran</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <FiX size={20} />
          </button>
        </div>

        <div className="receipt-print bg-slate-50 p-6 rounded-lg font-mono text-sm">
          <div className="text-center mb-4 border-b border-dashed border-slate-300 pb-4">
            <h3 className="text-lg font-bold">{storeSettings.name}</h3>
            <p className="text-xs">{storeSettings.address}</p>
            <p className="text-xs">Telp: {storeSettings.phone}</p>
          </div>

          <div className="mb-4 border-b border-dashed border-slate-300 pb-4 text-xs">
            <p>No: {transaction.transactionId}</p>
            <p>{formatDate(transaction.date)}</p>
            <p>Kasir: {transaction.cashier}</p>
          </div>

          <div className="mb-4 border-b border-dashed border-slate-300 pb-4">
            {transaction.items.map((item, idx) => (
              <div key={idx} className="mb-2">
                <p className="font-semibold">{item.name}</p>
                <div className="flex justify-between text-xs">
                  <span>{item.quantity} x {formatCurrency(item.price, storeSettings.currency)}</span>
                  <span>{formatCurrency(item.subtotal, storeSettings.currency)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(transaction.subtotal, storeSettings.currency)}</span>
            </div>
            {transaction.tax > 0 && (
              <div className="flex justify-between">
                <span>Pajak</span>
                <span>{formatCurrency(transaction.tax, storeSettings.currency)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base pt-2 border-t border-dashed border-slate-300">
              <span>TOTAL</span>
              <span>{formatCurrency(transaction.total, storeSettings.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Bayar</span>
              <span>{formatCurrency(transaction.payment, storeSettings.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Kembali</span>
              <span>{formatCurrency(transaction.change, storeSettings.currency)}</span>
            </div>
          </div>

          <div className="text-center mt-4 pt-4 border-t border-dashed border-slate-300">
            <p className="text-xs">Terima kasih atas kunjungan Anda!</p>
            <p className="text-xs">Barang yang sudah dibeli tidak dapat dikembalikan</p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="w-full mt-4 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 no-print"
        >
          <FiPrinter /> Cetak Struk
        </button>
      </div>
    </div>
  )
}