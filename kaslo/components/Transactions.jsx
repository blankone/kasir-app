'use client'

import { useState } from 'react'
import { useStore } from '@/context/StoreContext'
import { formatCurrency, formatDate } from '@/utils/helpers'
import { FiSearch, FiEye } from 'react-icons/fi'

export default function Transactions() {
  const { transactions, storeSettings } = useStore()
  const [search, setSearch] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  const filtered = transactions.filter(t => 
    t.transactionId?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-slide-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Riwayat Transaksi</h1>
        <p className="text-slate-500 mt-1">Lihat semua transaksi yang telah dilakukan</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Cari nomor transaksi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-slate-600">No. Transaksi</th>
              <th className="text-left p-4 text-sm font-semibold text-slate-600">Tanggal</th>
              <th className="text-left p-4 text-sm font-semibold text-slate-600">Item</th>
              <th className="text-left p-4 text-sm font-semibold text-slate-600">Total</th>
              <th className="text-left p-4 text-sm font-semibold text-slate-600">Bayar</th>
              <th className="text-right p-4 text-sm font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id} className="border-b hover:bg-slate-50">
                <td className="p-4 font-mono text-sm">{t.transactionId}</td>
                <td className="p-4 text-sm">{formatDate(t.date)}</td>
                <td className="p-4 text-sm">
                  {t.items.reduce((sum, i) => sum + i.quantity, 0)} item
                </td>
                <td className="p-4 font-semibold text-green-600">
                  {formatCurrency(t.total, storeSettings.currency)}
                </td>
                <td className="p-4 text-sm">
                  {formatCurrency(t.payment, storeSettings.currency)}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => setSelectedTransaction(t)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <FiEye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            Belum ada transaksi
          </div>
        )}
      </div>

      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 animate-slide-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Detail Transaksi</h2>
              <button 
                onClick={() => setSelectedTransaction(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-500">No. Transaksi</p>
                <p className="font-mono font-semibold">{selectedTransaction.transactionId}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-500">Tanggal</p>
                  <p className="font-semibold text-sm">{formatDate(selectedTransaction.date)}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-500">Kasir</p>
                  <p className="font-semibold">{selectedTransaction.cashier}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Item</h3>
                <div className="border rounded-lg overflow-hidden">
                  {selectedTransaction.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between p-3 border-b last:border-0">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-slate-500">
                          {item.quantity} x {formatCurrency(item.price, storeSettings.currency)}
                        </p>
                      </div>
                      <p className="font-semibold">{formatCurrency(item.subtotal, storeSettings.currency)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(selectedTransaction.subtotal, storeSettings.currency)}</span>
                </div>
                {selectedTransaction.tax > 0 && (
                  <div className="flex justify-between">
                    <span>Pajak</span>
                    <span>{formatCurrency(selectedTransaction.tax, storeSettings.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary-600">{formatCurrency(selectedTransaction.total, storeSettings.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bayar</span>
                  <span>{formatCurrency(selectedTransaction.payment, storeSettings.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kembali</span>
                  <span className="text-green-600">{formatCurrency(selectedTransaction.change, storeSettings.currency)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}