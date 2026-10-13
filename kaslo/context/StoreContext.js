'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const StoreContext = createContext()

export const useStore = () => {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore must be used within StoreProvider')
  return context
}

export function StoreProvider({ children }) {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [cart, setCart] = useState([])
  const [storeSettings, setStoreSettings] = useState({
    name: 'Toko Saya',
    address: 'Jl. Contoh No. 123',
    phone: '08123456789',
    taxRate: 0,
    currency: 'Rp'
  })

  // Load from localStorage
  useEffect(() => {
    const savedCategories = localStorage.getItem('categories')
    const savedProducts = localStorage.getItem('products')
    const savedTransactions = localStorage.getItem('transactions')
    const savedSettings = localStorage.getItem('storeSettings')

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    } else {
      // Default categories
      const defaults = [
        { id: 1, name: 'Makanan', icon: '🍔' },
        { id: 2, name: 'Minuman', icon: '🥤' },
        { id: 3, name: 'Snack', icon: '🍿' },
      ]
      setCategories(defaults)
      localStorage.setItem('categories', JSON.stringify(defaults))
    }

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      // Default products
      const defaults = [
        { id: 1, name: 'Nasi Goreng', price: 15000, stock: 50, categoryId: 1, barcode: '001' },
        { id: 2, name: 'Mie Ayam', price: 12000, stock: 30, categoryId: 1, barcode: '002' },
        { id: 3, name: 'Es Teh', price: 5000, stock: 100, categoryId: 2, barcode: '003' },
        { id: 4, name: 'Kopi', price: 8000, stock: 80, categoryId: 2, barcode: '004' },
        { id: 5, name: 'Keripik', price: 10000, stock: 40, categoryId: 3, barcode: '005' },
      ]
      setProducts(defaults)
      localStorage.setItem('products', JSON.stringify(defaults))
    }

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }

    if (savedSettings) {
      setStoreSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem('categories', JSON.stringify(categories))
    }
  }, [categories])

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('products', JSON.stringify(products))
    }
  }, [products])

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem('storeSettings', JSON.stringify(storeSettings))
  }, [storeSettings])

  // Category functions
  const addCategory = (category) => {
    const newCategory = { ...category, id: Date.now() }
    setCategories([...categories, newCategory])
  }

  const updateCategory = (id, updated) => {
    setCategories(categories.map(c => c.id === id ? { ...c, ...updated } : c))
  }

  const deleteCategory = (id) => {
    setCategories(categories.filter(c => c.id !== id))
  }

  // Product functions
  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now() }
    setProducts([...products, newProduct])
  }

  const updateProduct = (id, updated) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updated } : p))
  }

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id))
  }

  // Cart functions
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id)
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const updateCartQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.id !== id))
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity } : item
      ))
    }
  }

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const clearCart = () => setCart([])

  // Transaction functions
  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      date: new Date().toISOString()
    }
    setTransactions([newTransaction, ...transactions])
    
    // Update stock
    transaction.items.forEach(item => {
      updateProduct(item.id, { stock: item.stock - item.quantity })
    })
    
    clearCart()
    return newTransaction
  }

  const value = {
    categories,
    products,
    transactions,
    cart,
    storeSettings,
    setStoreSettings,
    addCategory,
    updateCategory,
    deleteCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    addTransaction,
  }

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  )
}