/**
 * Visual hint for beverage cards when API has no imageUrl.
 * @param {string} productName
 * @returns {{ tone: string; emoji: string; label: string }}
 */
export function getBeverageVisualHint(productName) {
  const n = String(productName ?? "").toLowerCase();

  if (/coca|coke|pepsi|thums|limca/.test(n)) {
    return { tone: "cola", emoji: "🥤", label: "Cola" };
  }
  if (/sprite|7up|7-up|mountain|fanta|mirinda/.test(n)) {
    return { tone: "lime", emoji: "🍋", label: "Lime" };
  }
  if (/maaza|frooti|juice|mango|slice|appy|real/.test(n)) {
    return { tone: "juice", emoji: "🧃", label: "Juice" };
  }
  if (/water|bisleri|kinley|aquafina|bailey/.test(n)) {
    return { tone: "water", emoji: "💧", label: "Water" };
  }
  if (/lassi|chaas|buttermilk|milk/.test(n)) {
    return { tone: "dairy", emoji: "🥛", label: "Dairy" };
  }
  if (/energy|red bull|sting|monster/.test(n)) {
    return { tone: "energy", emoji: "⚡", label: "Energy" };
  }
  if (/beer|kingfisher|budweiser/.test(n)) {
    return { tone: "beer", emoji: "🍺", label: "Brew" };
  }

  return { tone: "cold", emoji: "🧊", label: "Chilled" };
}

/** First letter for faux “logo” badge when no product photo. */
export function getBeverageLogoLetter(productName) {
  const t = String(productName ?? "").trim();
  if (!t) return "D";
  return t.charAt(0).toUpperCase();
}
