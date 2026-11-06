export function getStockStatus(quantity: number) {
  if (quantity === 0) {
    return "OUT_OF_STOCK";
  }

  if (quantity <= 5) {
    return "LOW_STOCK";
  }

  return "IN_STOCK";
}
