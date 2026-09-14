import { Crosshair, Minus, Plus } from "lucide-react";
import mapBg from "@/assets/map-bg.jpg";
import { Avatar } from "./Avatar";
import type { Employee } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export function LiveMap({
  people,
  onSelect,
  selectedId,
  className = "h-[52vh]",
  controls = true,
}: {
  people: Employee[];
  onSelect?: (e: Employee) => void;
  selectedId?: string | null;
  className?: string;
  controls?: boolean;
}) {
  return (
    <div className={`relative w-full overflow-hidden bg-muted ${className}`}>
      <img
        src={mapBg}
        alt="Live map of employee locations"
        className="absolute inset-0 h-full w-full object-cover"
        width={1024}
        height={1536}
      />
      <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-info ring-4 ring-info/25" />

      {people.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onSelect?.(p)}
          className="group absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-105 active:scale-95"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          aria-label={`${p.name}, ${p.area}`}
        >
          {p.online && <span className="absolute inset-0 rounded-full bg-primary/35 [animation:live-ring_2.2s_ease-out_infinite]" />}
          <span className="relative block rounded-full bg-card p-0.5 shadow-pin">
            <Avatar
              initials={p.initials}
              size={38}
              online={p.online}
              ring={selectedId === p.id}
            />
          </span>
        </button>
      ))}

      {controls && (
        <div className="absolute bottom-5 right-4 flex flex-col gap-2">
          <Button variant="outline" size="icon" aria-label="Center map" className="h-11 w-11 rounded-xl bg-card/95 text-primary shadow-pin backdrop-blur">
            <Crosshair className="h-5 w-5" />
          </Button>
          <span className="flex flex-col overflow-hidden rounded-xl border border-border bg-card/95 shadow-pin backdrop-blur">
            <Button variant="ghost" size="icon" aria-label="Zoom in" className="h-10 w-11 rounded-none">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Zoom out" className="h-10 w-11 rounded-none border-t border-border">
              <Minus className="h-4 w-4" />
            </Button>
          </span>
        </div>
      )}
    </div>
  );
}
