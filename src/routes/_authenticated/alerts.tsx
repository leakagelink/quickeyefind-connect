import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Avatar } from "@/components/Avatar";
import { PhoneShell, PageHeader } from "@/components/PhoneShell";
import { getOverview } from "@/lib/tracking.functions";
import { timeAgo } from "@/lib/tracking.types";
import { BellRing, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/alerts")({
  head: () => ({
    meta: [
      { title: "Alerts & Notifications — Quike Eye" },
      {
        name: "description",
        content:
          "Online and offline alerts for every employee, grouped by recency, so nothing on the field is missed.",
      },
      { property: "og:title", content: "Alerts — Quike Eye" },
      {
        property: "og:description",
        content: "Online/offline notifications for your team in Quike Eye.",
      },
    ],
  }),
  component: AlertsPage,
});

function AlertsPage() {
  const fetchOverview = useServerFn(getOverview);
  const { data } = useQuery({ queryKey: ["overview"], queryFn: fetchOverview });
  const alerts = data?.alerts ?? [];

  const today = alerts.filter(
    (a) => Date.now() - new Date(a.createdAt).getTime() < 86_400_000,
  );
  const earlier = alerts.filter(
    (a) => Date.now() - new Date(a.createdAt).getTime() >= 86_400_000,
  );

  const groups = [
    { label: "Today", items: today },
    { label: "Earlier", items: earlier },
  ].filter((g) => g.items.length);

  return (
    <PhoneShell>
      <PageHeader
        title="Alerts"
        subtitle="Team activity and status changes"
        action={
          <Button variant="ghost" size="icon" aria-label="Mark all read">
            <CheckCheck />
          </Button>
        }
      />
      <div className="mx-4 flex items-center gap-3 rounded-2xl bg-navy p-4 text-primary-foreground shadow-card">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/10">
          <BellRing className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold">{today.length} new updates</p>
          <p className="text-xs text-primary-foreground/70">Latest team activity</p>
        </div>
      </div>

      {alerts.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          No alerts yet. When teammates go online or offline, you'll see them here.
        </p>
      )}

      {groups.map((group) => (
        <section key={group.label} className="mt-5 px-4">
          <p className="text-xs font-medium text-muted-foreground">{group.label}</p>
          <ul className="screen-enter mt-2 space-y-2">
            {group.items.map((a) => (
              <li
                key={a.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-sm"
              >
                <Avatar initials={a.initials} src={a.photoUrl ?? undefined} alt={a.name} size={36} online={a.online} />
                <span className="flex-1 text-sm">
                  <span className="font-semibold">{a.name}</span>{" "}
                  <span className="text-muted-foreground">{a.message}</span>
                </span>
                <span className="text-xs text-muted-foreground">{timeAgo(a.createdAt)}</span>
                <span
                  className={`h-2 w-2 rounded-full ${
                    a.online ? "bg-primary" : "bg-destructive"
                  }`}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </PhoneShell>
  );
}
