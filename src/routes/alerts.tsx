import { createFileRoute } from "@tanstack/react-router";
import { Avatar } from "@/components/Avatar";
import { PhoneShell } from "@/components/PhoneShell";
import { alerts } from "@/lib/mock-data";
import { BellRing, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PhoneShell";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Alerts & Notifications — Quike Eye" },
      {
        name: "description",
        content:
          "Online and offline alerts for every employee, grouped by day, so nothing on the field is missed.",
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
  const days = ["Today", "Yesterday"];

  return (
    <PhoneShell>
      <PageHeader title="Alerts" subtitle="Team activity and status changes" action={<Button variant="ghost" size="icon" aria-label="Mark all read"><CheckCheck /></Button>} />
      <div className="mx-4 flex items-center gap-3 rounded-2xl bg-navy p-4 text-primary-foreground shadow-card">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/10"><BellRing className="h-5 w-5" /></span>
        <div><p className="text-sm font-semibold">3 new updates</p><p className="text-xs text-primary-foreground/70">Since your last visit</p></div>
      </div>

      {days.map((day) => (
        <section key={day} className="mt-5 px-4">
          <p className="text-xs font-medium text-muted-foreground">{day}</p>
           <ul className="screen-enter mt-2 space-y-2">
            {alerts
              .filter((a) => a.day === day)
              .map((a) => (
                <li key={a.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-sm">
                   <Avatar initials={a.initials} src={a.photo} alt={a.who} size={36} />
                  <span className="flex-1 text-sm">
                    <span className="font-semibold">{a.who}</span>{" "}
                    <span className="text-muted-foreground">{a.text}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{a.time}</span>
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
