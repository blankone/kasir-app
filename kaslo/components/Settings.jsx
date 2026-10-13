'use client'

import { useState } from 'react'
import { useStore } from '@/context/StoreContext'
import { FiSave, FiDownload, FiUpload, FiTrash2 } from 'react-icons/fi'

export default function Settings() {
  const { storeSettings, setStoreSettings } = useStore()
  const [formData, setFormData] = useState(storeSettings)
  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setStoreSettings(formData)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleExport = () => {
    const data = {
      categories: JSON.parse(localStorage.getItem('categories') || '[]'),
      products: JSON.parse(localStorage.getItem('products') || '[]'),
      transactions: JSON.parse(localStorage.getItem('transactions') || '[]'),
      settings: storeSettings
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kasir-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        if (data.categories) localStorage.setItem('categories', JSON.stringify(data.categories))
        if (data.products) localStorage.setItem('products', JSON.stringify(data.products))
        if (data.transactions) localStorage.setItem('transactions', JSON.stringify(data.transactions))
        if (data.settings) setStoreSettings(data.settings)
        alert('Data berhasil diimpor! Silakan refresh halaman.')
        window.location.reload()
      } catch (err) {
        alert('File tidak valid!')
      }
    }
    reader.readAsText(file)
  }

  const handleReset = () => {
    if (confirm('PERINGATAN: Semua data akan dihapus! Lanjutkan?')) {
      if (confirm('Apakah Anda benar-benar yakin? Tindakan ini tidak dapat dibatalkan!')) {
        localStorage.clear()
        window.location.reload()
      }
    }
  }

  return (
    <div className="animate-slide-in max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Pengaturan</h1>
        <p className="text-slate-500 mt-1">Konfigurasi aplikasi dan toko Anda</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Informasi Toko</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Toko</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Alamat</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows="2"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">No. Telepon</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mata Uang</label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Pajak (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formData.taxRate}
              onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <FiSave /> Simpan Pengaturan
        </button>
        {saved && (
          <p className="mt-3 text-green-600 text-sm">✓ Pengaturan berhasil disimpan</p>
        )}
      </form>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Backup & Restore</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 py-3 bg-green-50 text-green-600 rounded-lg font-semibold hover:bg-green-100 transition-colors"
          >
            <FiDownload /> Export Data
          </button>
          <label className="flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-colors cursor-pointer">
            <FiUpload /> Import Data
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-red-100">
        <h2 className="text-lg font-semibold text-red-600 mb-2">Zona Bahaya</h2>
        <p className="text-sm text-slate-500 mb-4">
          Tindakan ini akan menghapus semua data secara permanen.
        </p>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 py-2 px-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
        >
          <FiTrash2 /> Reset Semua Data
        </button>
      </div>
    </div>
  )
}