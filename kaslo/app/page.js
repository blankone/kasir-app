'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/components/Dashboard'
import POS from '@/components/POS'
import Products from '@/components/Products'
import Categories from '@/components/Categories'
import Transactions from '@/components/Transactions'
import Reports from '@/components/Reports'
import Settings from '@/components/Settings'

export default function Home() {
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard': return <Dashboard />
      case 'pos': return <POS />
      case 'products': return <Products />
      case 'categories': return <Categories />
      case 'transactions': return <Transactions />
      case 'reports': return <Reports />
      case 'settings': return <Settings />
      default: return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      <main className={`flex-1 overflow-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}