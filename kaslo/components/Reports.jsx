'use client'

import { useState, useMemo } from 'react'
import { useStore } from '@/context/StoreContext'
import { formatCurrency, formatDateShort } from '@/utils/helpers'
import { FiCalendar, FiTrendingUp } from 'react-icons/fi'

export default function Reports() {
  const { transactions, storeSettings } = useStore()
  const [period, setPeriod] = useState('today')

  const filteredTransactions = useMemo(() => {
    const now = new Date()
    return transactions.filter(t => {
      const date = new Date(t.date)
      switch (period) {
        case 'today':
          return date.toDateString() === now.toDateString()
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return date >= weekAgo
        case 'month':
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
        case 'all':
          return true
        default:
          return true
      }
    })
  }, [transactions, period])

  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.total, 0)
  const totalTransactions = filteredTransactions.length
  const avgTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0

  // Group by date
  const byDate = useMemo(() => {
    const grouped = {}
    filteredTransactions.forEach(t => {
      const date = formatDateShort(t.date)
      if (!grouped[date]) grouped[date] = { count: 0, revenue: 0 }
      grouped[date].count++
      grouped[date].revenue += t.total
    })
    return Object.entries(grouped).sort((a, b) => new Date(b[0]) - new Date(a[0]))
  }, [filteredTransactions])

  // Top products
  const topProducts = useMemo(() => {
    const productMap = {}
    filteredTransactions.forEach(t => {
      t.items.forEach(item => {
        if (!productMap[item.name]) {
          productMap[item.name] = { name: item.name, quantity: 0, revenue: 0 }
        }
        productMap[item.name].quantity += item.quantity
        productMap[item.name].revenue += item.subtotal
      })
    })
    return Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5)
  }, [filteredTransactions])

  const maxRevenue = Math.max(...byDate.map(d => d[1].revenue), 1)

  return (
    <div className="animate-slide-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Laporan Penjualan</h1>
        <p className="text-slate-500 mt-1">Analisis performa penjualan</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <FiCalendar className="text-slate-400" />
          <span className="text-sm font-medium text-slate-600">Periode:</span>
          {[
            { id: 'today', label: 'Hari Ini' },
            { id: 'week', label: '7 Hari' },
            { id: 'month', label: 'Bulan Ini' },
            { id: 'all', label: 'Semua' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === p.id 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90">Total Pendapatan</p>
          <p className="text-3xl font-bold mt-2">{formatCurrency(totalRevenue, storeSettings.currency)}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90">Total Transaksi</p>
          <p className="text-3xl font-bold mt-2">{totalTransactions}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90">Rata-rata Transaksi</p>
          <p className="text-3xl font-bold mt-2">{formatCurrency(avgTransaction, storeSettings.currency)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiTrendingUp /> Grafik Penjualan
          </h2>
          {byDate.length === 0 ? (
            <p className="text-slate-400 text-center py-12">Belum ada data</p>
          ) : (
            <div className="space-y-3">
              {byDate.slice(0, 7).map(([date, data]) => (
                <div key={date}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{date}</span>
                    <span className="font-semibold">{formatCurrency(data.revenue, storeSettings.currency)}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all"
                      style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Produk Terlaris</h2>
          {topProducts.length === 0 ? (
            <p className="text-slate-400 text-center py-12">Belum ada data</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product, idx) => (
                <div key={product.name} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.quantity} terjual</p>
                  </div>
                  <p className="font-semibold text-green-600">
                    {formatCurrency(product.revenue, storeSettings.currency)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}