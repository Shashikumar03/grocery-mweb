/** Inline cold-drink bottle graphic for placeholders. */
export function DrinkBottleIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M26 8h12v6c0 2 4 4 4 8v52c0 4-3.6 8-8 8H30c-4.4 0-8-4-8-8V22c0-4 4-6 4-8V8z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M28 10h8v5c0 2 3 3.5 3 7v54c0 3-2.5 6-6 6H31c-3.5 0-6-3-6-6V22c0-3.5 3-5 3-7v-5z"
        stroke="currentColor"
        strokeWidth="2"
        fill="rgb(255 255 255 / 0.35)"
      />
      <rect x="30" y="36" width="4" height="28" rx="2" fill="currentColor" opacity="0.25" />
      <ellipse cx="32" cy="14" rx="10" ry="3" fill="currentColor" opacity="0.15" />
    </svg>
  );
}
