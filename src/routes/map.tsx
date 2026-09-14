import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Menu, Phone, Navigation, Search, X, MapPin } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/quikeye-logo.png.asset.json";
import { Avatar } from "@/components/Avatar";
import { LiveMap } from "@/components/LiveMap";
import { PhoneShell } from "@/components/PhoneShell";
import { employees, type Employee } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Live Map — Quike Eye Employee Tracking" },
      {
        name: "description",
        content:
          "See every online employee on one live map, search by name or number and navigate or call in one tap.",
      },
      { property: "og:title", content: "Live Map — Quike Eye" },
      {
        property: "og:description",
        content: "All your employees on one live map in Quike Eye.",
      },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Employee | null>(null);

  const list = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(query.toLowerCase()) ||
      e.phone.replace(/\s/g, "").includes(query.replace(/\s/g, "")),
  );
  const online = employees.filter((e) => e.online);

  return (
    <PhoneShell immersive>
      <div className="relative h-[calc(100dvh-4.25rem)] min-h-[640px] sm:h-[calc(min(860px,100dvh-32px)-4.25rem)]">
      <LiveMap people={list} onSelect={setSelected} selectedId={selected?.id ?? null} className="absolute inset-0 h-full" />
      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),1rem)]">
        <Button variant="outline" size="icon" aria-label="Open menu" className="rounded-full bg-card/90 shadow-pin backdrop-blur-xl"><Menu className="h-5 w-5" /></Button>
        <img src={logo.url} alt="Quike Eye" className="h-10 w-auto drop-shadow-sm" width={200} height={80} />
        <Link to="/alerts" aria-label="Alerts" className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/90 shadow-pin backdrop-blur-xl">
          <Bell className="h-5 w-5 text-foreground" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-semibold text-destructive-foreground">
            3
          </span>
        </Link>
      </header>

      <div className="absolute inset-x-0 top-[4.75rem] z-10 px-4">
        <label className="flex h-12 items-center gap-2 rounded-2xl border border-border bg-card/92 px-4 shadow-pin backdrop-blur-xl">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search user by name or number"
            className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>
      </div>

      {selected ? (
        <section className="screen-enter absolute inset-x-0 bottom-0 z-20 rounded-t-[28px] border-t border-border bg-card/98 p-5 pb-6 shadow-card backdrop-blur-xl">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
          <div className="flex items-start gap-3">
            <Avatar initials={selected.initials} size={46} online={selected.online} />
            <div className="flex-1">
              <p className="flex items-center gap-2 text-sm font-semibold">
                {selected.name}
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    selected.online
                      ? "bg-primary/12 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {selected.online ? "Online" : "Offline"}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">{selected.phone}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelected(null)} aria-label="Close" className="h-9 w-9">
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>

          <p className="mt-3 text-[11px] uppercase tracking-wide text-muted-foreground">
            Current location
          </p>
          <p className="mt-1 flex gap-1.5 text-sm text-foreground">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {selected.area}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Updated {selected.updated}</p>

          <div className="mt-4 space-y-2">
            <Button className="w-full">
              <Navigation className="h-4 w-4" /> Navigate
            </Button>
            <a
              href={`tel:${selected.phone.replace(/\s/g, "")}`}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-medium"
            >
              <Phone className="h-4 w-4" /> Call
            </a>
          </div>
        </section>
      ) : (
        <section className="screen-enter absolute inset-x-0 bottom-0 z-20 rounded-t-[28px] border-t border-border bg-card/96 p-5 pb-5 shadow-card backdrop-blur-xl">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Online Users</h2>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" /> {online.length}
            </span>
          </div>
          <div className="hide-scrollbar mt-4 flex gap-4 overflow-x-auto pb-1">
            {online.map((e) => (
              <Button variant="ghost"
                key={e.id}
                onClick={() => setSelected(e)}
                className="h-auto w-16 shrink-0 flex-col gap-1.5 p-0 py-1"
              >
                <Avatar initials={e.initials} size={48} online />
                <span className="truncate text-[10px] text-muted-foreground">
                  {e.name.split(" ")[0]}
                </span>
              </Button>
            ))}
          </div>
        </section>
      )}
      </div>
    </PhoneShell>
  );
}
