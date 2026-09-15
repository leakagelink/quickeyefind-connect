import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, Clock, Navigation, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Avatar } from "@/components/Avatar";
import { GoogleMapView } from "@/components/GoogleMapView";
import { PhoneShell } from "@/components/PhoneShell";
import { getEmployeeDetail } from "@/lib/tracking.functions";
import { fmtClock, timeAgo } from "@/lib/tracking.types";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/employee/$id")({
  head: () => ({
    meta: [
      { title: "Employee Live Location — Quike Eye" },
      {
        name: "description",
        content:
          "Live location, attendance and movement history for a single employee, with navigate and call actions.",
      },
      { property: "og:title", content: "Employee Live Location — Quike Eye" },
      {
        property: "og:description",
        content: "Live position and movement history for your team member.",
      },
    ],
  }),
  loader: async ({ params }) => {
    // Keep the 404 behavior without invoking a protected server fn during SSR.
    if (!params.id) throw notFound();
    return { userId: params.id };
  },
  component: EmployeePage,
});

function EmployeePage() {
  const { userId } = Route.useLoaderData();
  const fetchDetail = useServerFn(getEmployeeDetail);
  const { data, isLoading } = useQuery({
    queryKey: ["employee", userId],
    queryFn: () => fetchDetail({ data: { userId } }),
    refetchInterval: 20_000,
  });

  const person = data?.person;

  return (
    <PhoneShell nav={false}>
      <header className="flex items-center gap-3 px-4 pt-5">
        <Link to="/users" className="text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="flex-1 text-center text-base font-semibold">
          {person?.name ?? "Employee"}
        </h1>
        <span className="w-5" />
      </header>

      <div className="mt-4">
        <GoogleMapView
          people={person ? [person] : []}
          selectedId={person?.id}
          controls={false}
          className="h-64"
        />
      </div>

      {isLoading && !person && (
        <p className="mt-6 text-center text-sm text-muted-foreground">Loading…</p>
      )}

      {person && (
        <section className="px-4 py-4">
          <div className="screen-enter flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
            <Avatar initials={person.initials} src={person.photoUrl ?? undefined} alt={person.name} size={46} online={person.online} />
            <div className="flex-1">
              <p className="text-sm font-semibold">{person.name}</p>
              <p className="text-xs text-muted-foreground">
                {person.team} · {person.phone}
              </p>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                person.online ? "bg-primary/12 text-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              {person.online ? "Online" : "Offline"}
            </span>
          </div>

          <p className="mt-4 flex gap-1.5 text-sm">
            <Navigation className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {person.area}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Updated {timeAgo(person.updatedAt)}</p>

          <div className="mt-4 flex gap-2">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${person.lat ?? ""},${person.lng ?? ""}`}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
            >
              <Navigation className="h-4 w-4" /> Navigate
            </a>
            <a
              href={`tel:${person.phone.replace(/\s/g, "")}`}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border text-sm font-medium"
            >
              <Phone className="h-4 w-4" /> Call
            </a>
          </div>

          <h2 className="mt-6 text-sm font-semibold">Movement history</h2>
          {data?.history.length === 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              No movement recorded yet for today.
            </p>
          )}
          <ul className="mt-3 space-y-3">
            {data?.history.map((h) => (
              <li key={h.id} className="flex gap-3">
                <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                  <Clock className="h-3.5 w-3.5" />
                </span>
                <span className="flex-1 border-b border-border pb-3">
                  <span className="block text-sm font-medium">{h.label ?? "Location update"}</span>
                  <span className="block text-xs text-muted-foreground">
                    {fmtClock(h.recordedAt)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PhoneShell>
  );
}
