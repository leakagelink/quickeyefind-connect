import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Map,
  Menu,
  Navigation,
  Phone,
  Search,
  User,
  Users,
  X,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AppLogo } from "@/components/AppLogo";
import { Avatar } from "@/components/Avatar";
import { GoogleMapView } from "@/components/GoogleMapView";
import { PhoneShell } from "@/components/PhoneShell";
import { Button } from "@/components/ui/button";
import { getOverview } from "@/lib/tracking.functions";
import { type TrackedPerson, timeAgo } from "@/lib/tracking.types";
import { useLiveLocation } from "@/hooks/useLiveLocation";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/map")({
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
  const [selected, setSelected] = useState<TrackedPerson | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchOverview = useServerFn(getOverview);
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["overview"],
    queryFn: fetchOverview,
    refetchInterval: 30_000,
  });

  // Live updates when anyone's location changes.
  useEffect(() => {
    const channel = supabase
      .channel("employee_locations_live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "employee_locations" },
        () => queryClient.invalidateQueries({ queryKey: ["overview"] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // The signed-in employee shares their own live position while the map is open.
  useLiveLocation({ sharing: true });

  const people = data?.people ?? [];
  const online = people.filter((p) => p.online);

  const list = people.filter((e) => {
    const q = query.toLowerCase();
    return (
      e.name.toLowerCase().includes(q) ||
      e.phone.replace(/\s/g, "").includes(query.replace(/\s/g, "")) ||
      e.area.toLowerCase().includes(q) ||
      e.team.toLowerCase().includes(q)
    );
  });

  return (
    <PhoneShell immersive>
      <div className="relative h-[calc(100dvh-4.25rem)] min-h-[640px] sm:h-[calc(min(860px,100dvh-32px)-4.25rem)]">
        <GoogleMapView
          people={list}
          onSelect={setSelected}
          selectedId={selected?.id ?? undefined}
          className="absolute inset-0 h-full"
        />

        <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),1rem)]">
          <Button
            variant="outline"
            size="icon"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="rounded-full bg-card/90 shadow-pin backdrop-blur-xl"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <AppLogo alt="Quike Eye" className="h-10 w-auto drop-shadow-sm" width={200} height={80} priority />
          <Link
            to="/alerts"
            aria-label="Alerts"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/90 shadow-pin backdrop-blur-xl"
          >
            <Bell className="h-5 w-5 text-foreground" />
            {online.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-semibold text-destructive-foreground">
                {online.length}
              </span>
            )}
          </Link>
        </header>

        {menuOpen && (
          <div className="absolute inset-0 z-40">
            <Button
              variant="ghost"
              aria-label="Close navigation"
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 h-full w-full rounded-none bg-foreground/35 p-0 backdrop-blur-sm"
            />
            <aside className="screen-enter absolute inset-y-0 left-0 flex w-[78%] max-w-xs flex-col bg-card px-4 pb-6 pt-[max(env(safe-area-inset-top),1rem)] shadow-card">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <AppLogo alt="Quike Eye" className="h-11 w-auto" width={200} height={80} />
                <Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav aria-label="Main navigation" className="mt-5 space-y-1.5">
                {[
                  { to: "/map", label: "Live Map", icon: Map },
                  { to: "/users", label: "Team", icon: Users },
                  { to: "/alerts", label: "Alerts", icon: Bell },
                  { to: "/profile", label: "Profile", icon: User },
                  { to: "/me", label: "My Panel", icon: User },
                  { to: "/admin", label: "Admin Panel", icon: ShieldCheck },
                  { to: "/reports", label: "Reports & Analytics", icon: BarChart3 },
                ].map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    activeProps={{ className: "bg-primary/12 text-primary" }}
                    inactiveProps={{ className: "text-foreground hover:bg-muted" }}
                    className="tap-feedback flex h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold"
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto rounded-xl bg-secondary p-3">
                <p className="text-xs font-semibold text-foreground">Quike Eye</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Find · Connect · Complete</p>
              </div>
            </aside>
          </div>
        )}

        <div className="absolute inset-x-0 top-[4.75rem] z-10 px-4">
          <label className="flex h-12 items-center gap-2 rounded-2xl border border-border bg-card/92 px-4 shadow-pin backdrop-blur-xl">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, number, location or team"
              className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>
        </div>

        {selected ? (
          <section className="screen-enter absolute inset-x-0 bottom-0 z-20 rounded-t-[28px] border-t border-border bg-card/98 p-5 pb-6 shadow-card backdrop-blur-xl">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
            <div className="flex items-start gap-3">
              <Avatar initials={selected.initials} src={selected.photoUrl ?? undefined} alt={selected.name} size={46} online={selected.online} />
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
              <Navigation className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {selected.area}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Updated {timeAgo(selected.updatedAt)}</p>

            <div className="mt-4 space-y-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat ?? ""},${selected.lng ?? ""}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
              >
                <Navigation className="h-4 w-4" /> Navigate
              </a>
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
              {online.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No teammates online yet. Share your location to appear here.
                </p>
              )}
              {online.map((e) => (
                <Button
                  variant="ghost"
                  key={e.id}
                  onClick={() => setSelected(e)}
                  className="h-auto w-16 shrink-0 flex-col gap-1.5 p-0 py-1"
                >
                  <Avatar initials={e.initials} src={e.photoUrl ?? undefined} alt={e.name} size={48} online />
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
