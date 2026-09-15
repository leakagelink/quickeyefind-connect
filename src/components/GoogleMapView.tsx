import { useEffect, useRef, useState } from "react";
import type { TrackedPerson } from "@/lib/tracking.types";

const BROWSER_KEY = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"] as
  | string
  | undefined;
const TRACKING_ID = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID"] as
  | string
  | undefined;

// Default center (Noida Sector 63) used until the first person reports a fix.
const DEFAULT_CENTER = { lat: 28.6139, lng: 77.209 };
const DEFAULT_ZOOM = 12;

type GMaps = any;
type GMap = any;
type GMarker = any;

let loaderPromise: Promise<GMaps> | null = null;

function loadMapsApi(): Promise<GMaps> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("window unavailable"));
  }
  const w = window as any;
  if (w.google?.maps) {
    return Promise.resolve(w.google);
  }
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise<GMaps>((resolve, reject) => {
    const cb = "__qe_maps_init__" + Date.now();
    w[cb] = () => {
      delete w[cb];
      if (w.google?.maps) resolve(w.google);
      else reject(new Error("Maps API failed to load"));
    };
    const src =
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
        BROWSER_KEY ?? "",
      )}&loading=async&callback=${cb}` +
      (TRACKING_ID ? `&channel=${encodeURIComponent(TRACKING_ID)}` : "");
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
  return loaderPromise;
}

function markerIcon(g: GMaps, person: TrackedPerson): any {
  const online = person.online;
  const fill = online ? "%230E7C66" : "%2364748B";
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="46" height="56" viewBox="0 0 46 56">` +
    `<path d="M23 1C11.4 1 2 10.4 2 22c0 14 21 33 21 33s21-19 21-33C44 10.4 34.6 1 23 1z" fill="${fill}" stroke="white" stroke-width="2.5"/>` +
    `<circle cx="23" cy="22" r="11" fill="white"/>` +
    `<text x="23" y="23" font-family="Manrope,Arial,sans-serif" font-size="12" font-weight="700" fill="${fill.replace("%23", "#")}" text-anchor="middle" dominant-baseline="central">${person.initials}</text>` +
    `</svg>`;
  return {
    url: "data:image/svg+xml;utf8," + encodeURIComponent(svg).replace(/%25/g, "%"),
    scaledSize: new g.maps.Size(46, 56),
    anchor: new g.maps.Point(23, 52),
  };
}

export function GoogleMapView({
  people,
  selectedId,
  onSelect,
  className,
  controls = true,
}: {
  people: TrackedPerson[];
  selectedId?: string | undefined;
  onSelect?: (p: TrackedPerson) => void;
  className?: string;
  controls?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<GMap | null>(null);
  const markersRef = useRef<Map<string, GMarker>>(new Map());
  const [ready, setReady] = useState(false);

  // Init map once.
  useEffect(() => {
    if (!BROWSER_KEY) return;
    let cancelled = false;
    loadMapsApi()
      .then((g) => {
        if (cancelled || !containerRef.current) return;
        mapRef.current = new g.maps.Map(containerRef.current, {
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          clickableIcons: false,
          fullscreenControl: controls,
          streetViewControl: controls,
          mapTypeControl: false,
          zoomControl: controls,
          styles: [
            { featureType: "poi", stylers: [{ visibility: "off" }] },
          ],
        });
        setReady(true);
      })
      .catch(() => setReady(false));
    return () => {
      cancelled = true;
    };
  }, [controls]);

  // Sync markers.
  useEffect(() => {
    const map = mapRef.current;
    const g = (window as any).google;
    if (!map || !g?.maps || !ready) return;

    const seen = new Set<string>();
    for (const p of people) {
      if (p.lat == null || p.lng == null) continue;
      seen.add(p.id);
      let marker = markersRef.current.get(p.id);
      if (!marker) {
        marker = new g.maps.Marker({
          map,
          position: { lat: p.lat, lng: p.lng },
          title: p.name,
          icon: markerIcon(g, p),
        });
        if (onSelect) {
          g.maps.event.addListener(marker, "click", () => onSelect(p));
        }
        markersRef.current.set(p.id, marker);
      } else {
        marker.setPosition({ lat: p.lat, lng: p.lng });
        marker.setIcon(markerIcon(g, p));
      }
    }
    // Remove stale markers.
    for (const [id, marker] of markersRef.current) {
      if (!seen.has(id)) {
        marker.setMap(null);
        markersRef.current.delete(id);
      }
    }
    // Re-center on selected person, else on first with coords.
    if (selectedId) {
      const sel = people.find((p) => p.id === selectedId);
      if (sel?.lat != null && sel?.lng != null) {
        map.panTo({ lat: sel.lat, lng: sel.lng });
        map.setZoom(15);
      }
    } else if (people.length) {
      const first = people.find((p) => p.lat != null && p.lng != null);
      if (first) {
        map.setCenter({ lat: first.lat!, lng: first.lng! });
      }
    }
  }, [people, selectedId, onSelect, ready]);

  if (!BROWSER_KEY) {
    return (
      <div
        className={`flex items-center justify-center bg-secondary text-sm text-muted-foreground ${className ?? ""}`}
      >
        Map unavailable — Google Maps key not configured.
      </div>
    );
  }

  return (
    <div className={`relative ${className ?? ""}`}>
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary text-sm text-muted-foreground">
          Loading map…
        </div>
      )}
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
