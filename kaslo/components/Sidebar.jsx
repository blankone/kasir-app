'use client'

import { FiHome, FiShoppingCart, FiPackage, FiGrid, FiFileText, FiBarChart2, FiSettings, FiMenu } from 'react-icons/fi'

export default function Sidebar({ activeMenu, setActiveMenu, isOpen, setIsOpen }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'pos', label: 'Kasir (POS)', icon: FiShoppingCart },
    { id: 'products', label: 'Produk', icon: FiPackage },
    { id: 'categories', label: 'Kategori', icon: FiGrid },
    { id: 'transactions', label: 'Transaksi', icon: FiFileText },
    { id: 'reports', label: 'Laporan', icon: FiBarChart2 },
    { id: 'settings', label: 'Pengaturan', icon: FiSettings },
  ]

  return (
    <aside className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-50 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center justify-between p-4 border-b">
        {isOpen && <h1 className="text-xl font-bold text-primary-600">🛒 KasirApp</h1>}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <FiMenu size={20} />
        </button>
      </div>

      <nav className="mt-4">
        {menuItems.map(item => {
          const Icon = item.icon
          const isActive = activeMenu === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                isActive 
                  ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon size={20} />
              {isOpen && <span className="font-medium">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {isOpen && (
        <div className="absolute bottom-4 left-4 right-4 p-4 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg text-white">
          <p className="text-sm font-semibold">KasirApp v1.0</p>
          <p className="text-xs opacity-90 mt-1">Sistem Point of Sale</p>
        </div>
      )}
    </aside>
  )
}