import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { PhoneShell } from "@/components/PhoneShell";
import { employees } from "@/lib/mock-data";

export const Route = createFileRoute("/users")({
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

function UsersPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

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
    .filter((e) => e.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <PhoneShell>
      <header className="flex items-center gap-3 px-4 pt-5">
        <Link to="/map" className="text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="flex-1 text-center text-base font-semibold">Online Users</h1>
        <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
      </header>

      <div className="px-4 pt-4">
        <label className="flex h-11 items-center gap-2 rounded-xl border border-input bg-card px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search user..."
            className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <p className="mt-4 text-xs font-medium text-primary">
          {list.filter((e) => e.online).length} Online
        </p>
      </div>

      <ul className="mt-2 divide-y divide-border px-4">
        {list.map((e) => (
          <li key={e.id}>
            <Link
              to="/employee/$id"
              params={{ id: e.id }}
              className="flex items-center gap-3 py-3"
            >
              <Avatar initials={e.initials} size={44} online={e.online} />
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
