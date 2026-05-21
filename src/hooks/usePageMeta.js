import { useEffect } from "react";

const DEFAULT_TITLE = "Bazzari — Online grocery delivery";
const DEFAULT_DESCRIPTION =
  "Order groceries online with home delivery. Browse categories, search products, and pay online or cash on delivery.";

/**
 * @param {{ title?: string | null; description?: string; noindex?: boolean }} options
 */
export function usePageMeta({ title, description, noindex = false }) {
  useEffect(() => {
    document.title = title ? `${title} | Bazzari` : DEFAULT_TITLE;

    let descEl = document.querySelector('meta[name="description"]');
    if (!descEl) {
      descEl = document.createElement("meta");
      descEl.setAttribute("name", "description");
      document.head.appendChild(descEl);
    }
    descEl.setAttribute("content", description || DEFAULT_DESCRIPTION);

    let robotsEl = document.querySelector('meta[name="robots"]');
    if (noindex) {
      if (!robotsEl) {
        robotsEl = document.createElement("meta");
        robotsEl.setAttribute("name", "robots");
        document.head.appendChild(robotsEl);
      }
      robotsEl.setAttribute("content", "noindex, nofollow");
    } else if (robotsEl) {
      robotsEl.remove();
    }
  }, [title, description, noindex]);
}
