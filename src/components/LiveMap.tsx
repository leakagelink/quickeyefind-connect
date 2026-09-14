import { Crosshair, Minus, Plus } from "lucide-react";
import mapBg from "@/assets/map-bg.jpg";
import { Avatar } from "./Avatar";
import type { Employee } from "@/lib/mock-data";

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
    <div className={`relative w-full overflow-hidden ${className}`}>
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
          className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          aria-label={`${p.name}, ${p.area}`}
        >
          <span className="block rounded-full bg-card p-0.5 shadow-pin">
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
        <div className="absolute bottom-4 right-3 flex flex-col gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-primary shadow-pin">
            <Crosshair className="h-5 w-5" />
          </span>
          <span className="flex flex-col overflow-hidden rounded-full bg-card shadow-pin">
            <span className="flex h-9 w-10 items-center justify-center text-foreground">
              <Plus className="h-4 w-4" />
            </span>
            <span className="flex h-9 w-10 items-center justify-center border-t border-border text-foreground">
              <Minus className="h-4 w-4" />
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
