/**
 * Safe in-app path after login/sign-up (avoids open redirects).
 * @param {unknown} state
 * @returns {string}
 */
export function getPostAuthRedirect(state) {
  const from =
    state &&
    typeof state === "object" &&
    "from" in state &&
    typeof state.from === "string"
      ? state.from
      : null;
  if (!from || !from.startsWith("/") || from.startsWith("//")) {
    return "/account";
  }
  return from;
}
