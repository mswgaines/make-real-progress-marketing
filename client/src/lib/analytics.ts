// Google Analytics 4 event tracking utility
// Measurement ID: G-RSCVZWFK6X

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Track a GA4 event
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

/**
 * Track a click on the "Buy the Book on Amazon" CTA
 */
export function trackBuyBookClick(location: string) {
  trackEvent("buy_book_click", {
    event_category: "CTA",
    event_label: location,
    value: 1,
  });
}

/**
 * Track a click on the "Try the App Free" or "Create Account" CTA
 */
export function trackAppSignupClick(location: string) {
  trackEvent("app_signup_click", {
    event_category: "CTA",
    event_label: location,
    value: 1,
  });
}

/**
 * Track a click on the "Sign In" CTA
 */
export function trackSignInClick(location: string) {
  trackEvent("sign_in_click", {
    event_category: "CTA",
    event_label: location,
  });
}
