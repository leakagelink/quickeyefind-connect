import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { PhoneShell } from "@/components/PhoneShell";
import { employees } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PhoneShell";

export const Route = createFileRoute("/_authenticated/users")({
  head: () => ({
    meta: [
      { title: "Online Users — Quike Eye" },
      {
        name: "description",
        content:
          "Browse and filter every employee, see who is online and open their live location instantly.",
      },
      { property: "og:title", content: "Online Users — Quike Eye" },
      {
        property: "og:description",
        content: "Search, filter and track employees in Quike Eye.",
      },
    ],
  }),
  component: UsersPage,
});

const filters = ["All", "Online", "Offline", "Field Sales", "Delivery", "Service"];

// Unique locations for the location filter chips
const areas = ["All locations", ...Array.from(new Set(employees.map((e) => e.area)))];

function UsersPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [area, setArea] = useState("All locations");

  const list = employees
    .filter((e) =>
      filter === "All"
        ? true
        : filter === "Online"
          ? e.online
          : filter === "Offline"
            ? !e.online
            : e.team === filter,
    )
    .filter((e) => area === "All locations" || e.area === area)
    .filter((e) => {
      const q = query.toLowerCase();
      return (
        e.name.toLowerCase().includes(q) ||
        e.phone.replace(/\s/g, "").includes(query.replace(/\s/g, "")) ||
        e.area.toLowerCase().includes(q) ||
        e.team.toLowerCase().includes(q)
      );
    });

  return (
    <PhoneShell>
      <PageHeader title="Team" subtitle={`${employees.filter((e) => e.online).length} active right now`} action={<Button variant="outline" size="icon" aria-label="Filters"><SlidersHorizontal /></Button>} />

      <div className="px-4 pt-4">
        <label className="flex h-12 items-center gap-2 rounded-2xl border border-input bg-card px-4 shadow-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, number, location or team..."
            className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>

        <div className="hide-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => (
            <Button
              variant={filter === f ? "default" : "outline"}
              size="sm"
              key={f}
              onClick={() => setFilter(f)}
              className="shrink-0 rounded-full"
            >
              {f}
            </Button>
          ))}
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary" /> Location
        </p>
        <div className="hide-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
          {areas.map((a) => (
            <Button
              variant={area === a ? "default" : "outline"}
              size="sm"
              key={a}
              onClick={() => setArea(a)}
              className="shrink-0 rounded-full"
            >
              {a}
            </Button>
          ))}
        </div>

        <p className="mt-4 text-xs font-medium text-primary">
          {list.filter((e) => e.online).length} Online
        </p>
      </div>

      {list.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          No employee found — try a different name, location or filter.
        </p>
      )}
      <ul className="screen-enter mt-2 space-y-2 px-4">
        {list.map((e) => (
          <li key={e.id}>
            <Link
              to="/employee/$id"
              params={{ id: e.id }}
              className="tap-feedback flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-sm"
            >
              <Avatar initials={e.initials} src={e.photo} alt={e.name} size={44} online={e.online} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{e.name}</span>
                <span className="block text-xs text-muted-foreground">{e.phone}</span>
                <span className="block truncate text-xs text-muted-foreground">{e.area}</span>
              </span>
              <span
                className={`text-xs font-medium ${
                  e.online ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {e.online ? "Live" : e.updated}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </PhoneShell>
  );
}
