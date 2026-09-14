import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Menu, Phone, Navigation, Search, X, MapPin } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/quikeye-logo.png.asset.json";
import { Avatar } from "@/components/Avatar";
import { LiveMap } from "@/components/LiveMap";
import { PhoneShell } from "@/components/PhoneShell";
import { employees, type Employee } from "@/lib/mock-data";

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
    <PhoneShell>
      <header className="flex items-center justify-between px-4 pt-4">
        <Menu className="h-5 w-5 text-foreground" />
        <img src={logo.url} alt="Quike Eye" className="h-9" width={200} height={80} />
        <Link to="/alerts" className="relative">
          <Bell className="h-5 w-5 text-foreground" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-semibold text-destructive-foreground">
            3
          </span>
        </Link>
      </header>

      <div className="px-4 pb-3 pt-3">
        <label className="flex h-11 items-center gap-2 rounded-xl border border-input bg-card px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search user by name or number"
            className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>
      </div>

      <LiveMap people={list} onSelect={setSelected} selectedId={selected?.id ?? null} />

      {selected ? (
        <section className="-mt-4 rounded-t-3xl border-t border-border bg-card p-4 shadow-card">
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
            <button onClick={() => setSelected(null)} aria-label="Close">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
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
            <button className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
              <Navigation className="h-4 w-4" /> Navigate
            </button>
            <a
              href={`tel:${selected.phone.replace(/\s/g, "")}`}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-medium"
            >
              <Phone className="h-4 w-4" /> Call
            </a>
          </div>
        </section>
      ) : (
        <section className="-mt-4 rounded-t-3xl border-t border-border bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Online Users</h2>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" /> {online.length}
            </span>
          </div>
          <div className="mt-3 flex gap-4 overflow-x-auto pb-1">
            {online.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelected(e)}
                className="flex w-16 shrink-0 flex-col items-center gap-1.5"
              >
                <Avatar initials={e.initials} size={48} online />
                <span className="truncate text-[10px] text-muted-foreground">
                  {e.name.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
    </PhoneShell>
  );
}
