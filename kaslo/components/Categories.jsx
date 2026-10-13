'use client'

import { useState } from 'react'
import { useStore } from '@/context/StoreContext'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'

export default function Categories() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({ name: '', icon: '📦' })

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category)
      setFormData({ name: category.name, icon: category.icon })
    } else {
      setEditingCategory(null)
      setFormData({ name: '', icon: '📦' })
    }
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingCategory) {
      updateCategory(editingCategory.id, formData)
    } else {
      addCategory(formData)
    }
    setShowModal(false)
  }

  const handleDelete = (id) => {
    const productCount = products.filter(p => p.categoryId === id).length
    if (productCount > 0) {
      alert(`Tidak bisa menghapus! Ada ${productCount} produk dalam kategori ini.`)
      return
    }
    if (confirm('Yakin ingin menghapus kategori ini?')) {
      deleteCategory(id)
    }
  }

  const emojiOptions = ['🍔', '🥤', '🍿', '🍕', '🍜', '🍱', '🥗', '🍰', '🍩', '☕', '🧃', '📦', '👕', '📱', '💊', '🧴']

  return (
    <div className="animate-slide-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Kategori</h1>
          <p className="text-slate-500 mt-1">Kelola kategori produk</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <FiPlus /> Tambah Kategori
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => {
          const productCount = products.filter(p => p.categoryId === category.id).length
          return (
            <div key={category.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">{category.icon}</div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openModal(category)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">{category.name}</h3>
              <p className="text-sm text-slate-500">{productCount} produk</p>
            </div>
          )
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 animate-slide-in">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Kategori</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Pilih Icon</label>
                <div className="grid grid-cols-8 gap-2">
                  {emojiOptions.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: emoji })}
                      className={`aspect-square text-2xl rounded-lg border-2 transition-all ${
                        formData.icon === emoji 
                          ? 'border-primary-600 bg-primary-50' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 border border-slate-200 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}