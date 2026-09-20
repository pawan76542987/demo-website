// Currency Formatter (INR format)
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Date Formatter
export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';

  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {})
  };

  return new Intl.DateTimeFormat('en-IN', options).format(date);
};

// Calculate percentage savings
export const calculateDiscountAmount = (price, discountPercent) => {
  if (!discountPercent || discountPercent <= 0) return 0;
  return Math.round(price * (discountPercent / 100));
};

export const calculateDiscountedPrice = (price, discountPercent) => {
  if (!discountPercent || discountPercent <= 0) return price;
  return Math.round(price - calculateDiscountAmount(price, discountPercent));
};
