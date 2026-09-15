import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { updateMyLocation } from "@/lib/tracking.functions";

/**
 * Streams the signed-in employee's live GPS position to the backend.
 * Sends an update at most once every `intervalMs` (default 30s) and on
 * significant movement. Stops sending when `sharing` is false, but keeps
 * watching so we can resume immediately when sharing turns back on.
 */
export function useLiveLocation(opts?: {
  sharing?: boolean;
  intervalMs?: number;
}) {
  const sharing = opts?.sharing ?? true;
  const intervalMs = opts?.intervalMs ?? 30_000;

  const [status, setStatus] = useState<"idle" | "watching" | "error">("idle");
  const [coords, setCoords] = useState<{
    lat: number;
    lng: number;
    accuracy: number | null;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendLocation = useServerFn(updateMyLocation);
  const watchRef = useRef<number | null>(null);
  const lastSentRef = useRef<number>(0);
  const sharingRef = useRef(sharing);

  useEffect(() => {
    sharingRef.current = sharing;
  }, [sharing]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("error");
      setError("Geolocation is not supported on this device.");
      return;
    }

    const push = (pos: GeolocationPosition) => {
      const now = Date.now();
      setCoords({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy ?? null,
      });
      if (!sharingRef.current) return;
      if (now - lastSentRef.current < intervalMs) return;
      lastSentRef.current = now;
      void sendLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy ?? null,
        speed: pos.coords.speed ?? null,
        heading: pos.coords.heading ?? null,
        battery: null,
      }).catch(() => {});
    };

    const onError = (e: GeolocationPositionError) => {
      setStatus("error");
      setError(e.message || "Unable to read your location.");
    };

    setStatus("watching");
    watchRef.current = navigator.geolocation.watchPosition(push, onError, {
      enableHighAccuracy: true,
      maximumAge: 10_000,
      timeout: 20_000,
    });

    return () => {
      if (watchRef.current !== null) {
        navigator.geolocation.clearWatch(watchRef.current);
        watchRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { status, coords, error };
}
