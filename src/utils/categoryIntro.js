import { getProductsFromCategory } from "../services/catalog/index.js";

/**
 * Unique editorial intro per category (not duplicated site-wide boilerplate).
 * @param {Record<string, unknown> | null} category
 */
export function getCategoryIntroText(category) {
  if (!category) return "";

  const name = String(category.name ?? "this category").trim();
  const count = getProductsFromCategory(category).length;
  const custom = category.description;
  if (
    custom != null &&
    String(custom).trim() &&
    String(custom).trim() !== "Auto-created"
  ) {
    return String(custom).trim();
  }

  const lower = name.toLowerCase();

  if (
    lower.includes("beverage") ||
    lower.includes("drink") ||
    lower.includes("cold") ||
    lower.includes("thanda")
  ) {
    return `The ${name} section lists ${count} drinks and chilled items you can order for home delivery. Many customers use this aisle for soft drinks, juices, and water. Each product shows its current price; open a listing to confirm availability before you add it to your cart.`;
  }

  if (
    lower.includes("vegetable") ||
    lower.includes("fruit") ||
    lower.includes("fresh") ||
    lower.includes("sabzi")
  ) {
    return `Shop ${name} with ${count} listings updated from our store. We aim to carry produce and fresh items families cook with every day. Select what you need, review the line price, and check out from your cart when you are ready.`;
  }

  if (
    lower.includes("snack") ||
    lower.includes("biscuit") ||
    lower.includes("namkeen")
  ) {
    return `Our ${name} aisle includes ${count} packaged snacks and treats for quick purchases. This is helpful when you want to add items to a larger grocery order. Tap any product to read details and add the quantity you want.`;
  }

  if (
    lower.includes("dairy") ||
    lower.includes("milk") ||
    lower.includes("curd") ||
    lower.includes("paneer")
  ) {
    return `The ${name} category currently shows ${count} dairy and related products. Prices are listed in rupees on each row. Add items to your cart and complete checkout with your saved delivery address.`;
  }

  if (
    lower.includes("rice") ||
    lower.includes("atta") ||
    lower.includes("flour") ||
    lower.includes("dal") ||
    lower.includes("oil") ||
    lower.includes("spice")
  ) {
    return `Stock your kitchen from ${name}: ${count} staples and cooking essentials appear below. Families often reorder the same rice, flour, and spices each month. Open a product page to see the full description and price before ordering.`;
  }

  return `Browse ${count} products in ${name} on Bazzari. This category is part of our regular grocery catalogue for online ordering and home delivery. Each item below links to a product page with price and stock status.`;
}
