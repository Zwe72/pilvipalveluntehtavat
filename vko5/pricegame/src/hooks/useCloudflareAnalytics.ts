import { useCallback } from "react";

export function useCloudflareAnalytics() {
  const trackEvent = useCallback(
    (eventName: string, data?: Record<string, any>) => {
      // if (!getConsent()) return; // Jos haluaa tarkistaa 6.1 kohdan consentin
      if (!window._cfq) {
        window._cfq = [];
      }

      window._cfq.push([
        "trackEvent",
        {
          name: eventName,
          ...data,
          timestamp: new Date().toISOString(),
        },
      ]);
    },
    []
  );

  return { trackEvent };
}
 