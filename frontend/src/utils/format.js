export const formatPrice = (price, symbol = '') => {
  const num = Number(price) || 0;
  const formatted = num.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formatted}`;
};

/**
 * Returns base/final/discount info for a product in a given country.
 * - base: original price from prices[countryCode]
 * - discount: discount_percent (clamped 0-100)
 * - final: base * (1 - discount/100), rounded to 2 decimals
 * - hasDiscount: true if discount > 0 and base > 0
 */
export const getProductPricing = (product, countryCode) => {
  const countryPrice = product?.prices?.[countryCode];
  const base = Number(countryPrice?.price) || 0;
  const symbol = countryPrice?.symbol || '';
  const currency = countryPrice?.currency || '';
  const discount = Math.max(0, Math.min(100, Number(product?.discount_percent) || 0));
  const final = Math.round(base * (1 - discount / 100) * 100) / 100;
  return {
    base,
    final,
    discount,
    symbol,
    currency,
    hasDiscount: discount > 0 && base > 0,
  };
};

