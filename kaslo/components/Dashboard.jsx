'use client'

import { useStore } from '@/context/StoreContext'
import { formatCurrency, formatDateShort } from '@/utils/helpers'
import { FiTrendingUp, FiShoppingBag, FiPackage, FiDollarSign } from 'react-icons/fi'

export default function Dashboard() {
  const { products, transactions, storeSettings } = useStore()

  const today = new Date().toDateString()
  const todayTransactions = transactions.filter(t => new Date(t.date).toDateString() === today)
  const todayRevenue = todayTransactions.reduce((sum, t) => sum + t.total, 0)
  
  const lowStockProducts = products.filter(p => p.stock <= 10)
  
  const thisMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()
  const monthTransactions = transactions.filter(t => {
    const d = new Date(t.date)
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear
  })
  const monthRevenue = monthTransactions.reduce((sum, t) => sum + t.total, 0)

  const stats = [
    {
      label: 'Pendapatan Hari Ini',
      value: formatCurrency(todayRevenue, storeSettings.currency),
      icon: FiDollarSign,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      label: 'Transaksi Hari Ini',
      value: todayTransactions.length,
      icon: FiShoppingBag,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      label: 'Pendapatan Bulan Ini',
      value: formatCurrency(monthRevenue, storeSettings.currency),
      icon: FiTrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      label: 'Total Produk',
      value: products.length,
      icon: FiPackage,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
  ]

  return (
    <div className="animate-slide-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Selamat datang di sistem kasir Anda</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} ${stat.textColor} p-3 rounded-lg`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Transaksi Terbaru</h2>
          {transactions.length === 0 ? (
            <p className="text-slate-400 text-center py-8">Belum ada transaksi</p>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 5).map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-700">{t.id}</p>
                    <p className="text-sm text-slate-500">{formatDateShort(t.date)}</p>
                  </div>
                  <p className="font-semibold text-green-600">
                    {formatCurrency(t.total, storeSettings.currency)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Stok Menipis</h2>
          {lowStockProducts.length === 0 ? (
            <p className="text-slate-400 text-center py-8">Semua stok aman 👍</p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-700">{p.name}</p>
                    <p className="text-sm text-slate-500">Stok: {p.stock}</p>
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                    Rendah
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}