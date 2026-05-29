/**
 * Unique editorial copy per product when the API description is empty.
 * @param {Record<string, unknown> | null | undefined} product
 */
export function getProductIntroText(product) {
  if (!product) return "";

  const name = String(product.name ?? "this product").trim();
  const lower = name.toLowerCase();
  const unit = product.unit != null ? String(product.unit).trim() : "";
  const unitBit = unit ? ` Prices are shown per ${unit}.` : "";

  if (
    lower.includes("milk") ||
    lower.includes("curd") ||
    lower.includes("paneer") ||
    lower.includes("butter") ||
    lower.includes("cheese")
  ) {
    return `${name} is listed in our dairy section for home delivery.${unitBit} Refrigerated items are packed for transport; open the product and add the quantity you need before checkout.`;
  }

  if (
    lower.includes("rice") ||
    lower.includes("atta") ||
    lower.includes("flour") ||
    lower.includes("dal") ||
    lower.includes("oil") ||
    lower.includes("masala") ||
    lower.includes("spice")
  ) {
    return `${name} is a pantry staple many households reorder regularly.${unitBit} Check stock on this page, then add it to your cart with other cooking essentials from the same category.`;
  }

  if (
    lower.includes("cola") ||
    lower.includes("pepsi") ||
    lower.includes("juice") ||
    lower.includes("water") ||
    lower.includes("drink") ||
    lower.includes("soda")
  ) {
    return `${name} is available in our beverages section.${unitBit} Chilled drinks are popular add-ons to a larger grocery order — combine with snacks or staples in one delivery.`;
  }

  if (
    lower.includes("potato") ||
    lower.includes("onion") ||
    lower.includes("tomato") ||
    lower.includes("vegetable") ||
    lower.includes("fruit") ||
    lower.includes("sabzi")
  ) {
    return `${name} is part of our fresh produce listings.${unitBit} Fresh items are subject to daily availability; the badge above shows whether you can add it to your cart right now.`;
  }

  if (lower.includes("biscuit") || lower.includes("chips") || lower.includes("namkeen")) {
    return `${name} is a packaged snack you can add to a weekly grocery run.${unitBit} Open your cart anytime to review the total before you pay online or choose cash on delivery.`;
  }

  return `Order ${name} online with ${unit ? `pricing per ${unit}` : "clear pricing"} on this page.${unitBit} Add the quantity you want, then complete checkout from your cart with your delivery address.`;
}
