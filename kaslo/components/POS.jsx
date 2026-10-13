'use client'

import { useState, useMemo } from 'react'
import { useStore } from '@/context/StoreContext'
import { formatCurrency, calculateCartTotal, generateTransactionId } from '@/utils/helpers'
import { FiSearch, FiPlus, FiMinus, FiTrash2, FiShoppingCart } from 'react-icons/fi'
import Receipt from './Receipt'

export default function POS() {
  const { products, categories, cart, storeSettings, addToCart, updateCartQuantity, removeFromCart, addTransaction } = useStore()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCheckout, setShowCheckout] = useState(false)
  const [payment, setPayment] = useState(0)
  const [lastTransaction, setLastTransaction] = useState(null)

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                         p.barcode?.includes(search)
      const matchCategory = selectedCategory === 'all' || p.categoryId === parseInt(selectedCategory)
      return matchSearch && matchCategory
    })
  }, [products, search, selectedCategory])

  const { subtotal, tax, total } = calculateCartTotal(cart, storeSettings.taxRate)
  const change = payment - total

  const handleCheckout = () => {
    if (payment < total) {
      alert('Pembayaran kurang!')
      return
    }

    const transaction = {
      transactionId: generateTransactionId(),
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        stock: item.stock,
        subtotal: item.price * item.quantity
      })),
      subtotal,
      tax,
      total,
      payment,
      change,
      cashier: 'Admin'
    }

    const saved = addTransaction(transaction)
    setLastTransaction(saved)
    setPayment(0)
    setShowCheckout(false)
  }

  const quickPayment = (amount) => {
    setPayment(amount)
  }

  return (
    <div className="animate-slide-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Kasir (POS)</h1>
        <p className="text-slate-500 mt-1">Mulai transaksi penjualan</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products */}
        <div className="lg:col-span-2">
          {/* Search & Filter */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <div className="relative mb-3">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Cari produk atau scan barcode..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === 'all' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => product.stock > 0 && addToCart(product)}
                disabled={product.stock === 0}
                className={`bg-white rounded-xl shadow-sm p-4 text-left transition-all hover:shadow-md ${
                  product.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                <div className="aspect-square bg-slate-100 rounded-lg mb-3 flex items-center justify-center text-4xl">
                  {categories.find(c => c.id === product.categoryId)?.icon || '📦'}
                </div>
                <h3 className="font-semibold text-slate-800 text-sm mb-1 truncate">{product.name}</h3>
                <p className="text-primary-600 font-bold text-sm">
                  {formatCurrency(product.price, storeSettings.currency)}
                </p>
                <p className={`text-xs mt-1 ${product.stock <= 10 ? 'text-red-500' : 'text-slate-500'}`}>
                  Stok: {product.stock}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="bg-white rounded-xl shadow-sm p-4 h-fit sticky top-6">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b">
            <FiShoppingCart size={24} className="text-primary-600" />
            <h2 className="text-lg font-bold text-slate-800">Keranjang</h2>
            <span className="ml-auto bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-sm font-semibold">
              {cart.reduce((sum, i) => sum + i.quantity, 0)} item
            </span>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FiShoppingCart size={48} className="mx-auto mb-3 opacity-30" />
              <p>Keranjang kosong</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-slate-700 text-sm">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        {formatCurrency(item.price, storeSettings.currency)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 bg-white border border-slate-200 rounded flex items-center justify-center hover:bg-slate-100"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 bg-white border border-slate-200 rounded flex items-center justify-center hover:bg-slate-100"
                      >
                        <FiPlus size={14} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-7 h-7 bg-red-50 text-red-500 rounded flex items-center justify-center hover:bg-red-100 ml-1"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal, storeSettings.currency)}</span>
                </div>
                {tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Pajak ({storeSettings.taxRate}%)</span>
                    <span className="font-medium">{formatCurrency(tax, storeSettings.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary-600">{formatCurrency(total, storeSettings.currency)}</span>
                </div>
              </div>

              <button
                onClick={() => setShowCheckout(true)}
                className="w-full mt-4 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Bayar ({formatCurrency(total, storeSettings.currency)})
              </button>
            </>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 animate-slide-in">
            <h2 className="text-xl font-bold mb-4">Pembayaran</h2>
            
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-slate-500">Total Pembayaran</p>
              <p className="text-3xl font-bold text-primary-600">
                {formatCurrency(total, storeSettings.currency)}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Jumlah Bayar
              </label>
              <input
                type="number"
                value={payment || ''}
                onChange={(e) => setPayment(Number(e.target.value))}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="0"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[total, 50000, 100000, 150000, 200000, 500000].map(amount => (
                <button
                  key={amount}
                  onClick={() => quickPayment(amount)}
                  className="py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                >
                  {formatCurrency(amount, storeSettings.currency)}
                </button>
              ))}
            </div>

            {payment >= total && (
              <div className="bg-green-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-slate-600">Kembalian</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(change, storeSettings.currency)}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowCheckout(false)}
                className="flex-1 py-3 border border-slate-200 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleCheckout}
                disabled={payment < total}
                className="flex-1 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proses
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt */}
      {lastTransaction && (
        <Receipt 
          transaction={lastTransaction} 
          storeSettings={storeSettings}
          onClose={() => setLastTransaction(null)}
        />
      )}
    </div>
  )
}