export function calculateFinalPrice(originalPrice, discountType, discountValue) {
  if (!originalPrice || originalPrice <= 0) return 0;

  let finalPrice = originalPrice;

  if (discountType === 'fixed_amount') {
    finalPrice = Math.max(originalPrice - discountValue, 0);
  } else if (discountType === 'percentage') {
    finalPrice = Math.max(originalPrice - (originalPrice * discountValue) / 100, 0);
  }

  return finalPrice;
}
