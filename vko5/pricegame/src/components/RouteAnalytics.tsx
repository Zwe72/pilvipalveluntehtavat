import { useEffect, useRef } from "react";
import { useCloudflareAnalytics } from "../hooks/useCloudflareAnalytics";

export default function RouteAnalytics() {
  const { trackEvent } = useCloudflareAnalytics();
  const initialReferrer = useRef(document.referrer || "direct");

  useEffect(() => {
    trackEvent("page_view", {
      referrer: initialReferrer.current,
      landingPath: window.location.pathname,
    });
  }, [trackEvent]);

  return null;
}