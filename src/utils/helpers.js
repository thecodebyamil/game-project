// Utilities for number formatting
export const formatPrice = (price) => {
  return new Intl.NumberFormat("az-AZ", {
    style: "currency",
    currency: "AZN",
  }).format(price);
};

// Utilities for cart calculations
export const calculateCartTotal = (items) => {
  return items.reduce((total, item) => {
    const price = parseFloat(item.price?.replace(/[^0-9.-]+/g, "") || 0);
    return total + price * (item.quantity || 1);
  }, 0);
};

// Utilities for string manipulation
export const truncateString = (str, length) => {
  if (!str) return "";
  if (str.length > length) {
    return str.substring(0, length) + "...";
  }
  return str;
};

// Utilities for validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
