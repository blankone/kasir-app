export const formatCurrency = (amount, currency = 'Rp') => {
  return `${currency} ${amount.toLocaleString('id-ID')}`
}

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatDateShort = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export const generateTransactionId = () => {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `TRX${date}${random}`
}

export const calculateCartTotal = (cart, taxRate = 0) => {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * (taxRate / 100)
  const total = subtotal + tax
  return { subtotal, tax, total }
}