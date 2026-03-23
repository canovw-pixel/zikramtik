export const formatPrice = (price, symbol = '') => {
  const num = Number(price) || 0;
  const formatted = num.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formatted}`;
};
