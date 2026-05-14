/**
 * Map fetch/network failures to a short message (browser often reports "Failed to fetch" for CORS).
 * @param {unknown} err
 * @returns {string}
 */
export function getReadableFetchError(err) {
  if (err instanceof Error) {
    const m = err.message || "";
    if (m === "Failed to fetch" || m === "NetworkError when attempting to fetch resource.") {
      return "Could not reach the server. If the API is on another domain, the browser may be blocking it (CORS). This app uses a local proxy in dev/preview—run the latest build, or ask the API to allow your site’s origin.";
    }
    return m;
  }
  return "Something went wrong";
}
