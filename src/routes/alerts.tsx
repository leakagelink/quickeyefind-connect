import { createFileRoute } from "@tanstack/react-router";
import { Avatar } from "@/components/Avatar";
import { PhoneShell } from "@/components/PhoneShell";
import { alerts } from "@/lib/mock-data";

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
      <header className="px-4 pt-5">
        <h1 className="text-center text-base font-semibold">Alerts</h1>
      </header>

      {days.map((day) => (
        <section key={day} className="mt-5 px-4">
          <p className="text-xs font-medium text-muted-foreground">{day}</p>
          <ul className="mt-2 divide-y divide-border">
            {alerts
              .filter((a) => a.day === day)
              .map((a) => (
                <li key={a.id} className="flex items-center gap-3 py-3">
                  <Avatar initials={a.initials} size={36} />
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
