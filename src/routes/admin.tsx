import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Users2 } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { PhoneShell } from "@/components/PhoneShell";
import { employees } from "@/lib/mock-data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — Reports & Teams | Quike Eye" },
      {
        name: "description",
        content:
          "Admin overview of attendance, online staff, team-wise breakdown and daily reports for your field team.",
      },
      { property: "og:title", content: "Admin Panel — Quike Eye" },
      {
        property: "og:description",
        content: "Reports, analytics and team management for field staff.",
      },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const online = employees.filter((e) => e.online).length;
  const teams = [...new Set(employees.map((e) => e.team))];

  const stats = [
    { label: "Total staff", value: employees.length },
    { label: "Online now", value: online },
    { label: "Offline", value: employees.length - online },
    { label: "Present today", value: employees.length - 1 },
  ];

  return (
    <PhoneShell nav={false}>
      <header className="flex items-center gap-3 px-4 pt-5">
        <Link to="/profile" className="text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="flex-1 text-center text-base font-semibold">Admin Panel</h1>
        <span className="w-5" />
      </header>

       <div className="screen-enter grid grid-cols-2 gap-3 px-4 pt-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className="text-2xl font-semibold text-primary">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="px-4 pt-6">
        <h2 className="text-sm font-semibold">Teams / Departments</h2>
        <ul className="mt-3 space-y-2">
          {teams.map((t) => {
            const members = employees.filter((e) => e.team === t);
            return (
              <li
                key={t}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/12 text-info">
                  <Users2 className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold">{t}</span>
                  <span className="block text-xs text-muted-foreground">
                    {members.length} members · {members.filter((m) => m.online).length} online
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </li>
            );
          })}
        </ul>
      </section>

      <section className="px-4 pb-4 pt-6">
        <h2 className="text-sm font-semibold">Today&apos;s attendance</h2>
        <ul className="mt-3 divide-y divide-border">
          {employees.map((e) => (
            <li key={e.id} className="flex items-center gap-3 py-3">
              <Avatar initials={e.initials} size={36} online={e.online} />
              <span className="flex-1 text-sm font-medium">{e.name}</span>
              <span
                className={`text-xs ${e.online ? "text-primary" : "text-muted-foreground"}`}
              >
                {e.online ? "On duty" : e.updated}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </PhoneShell>
  );
}
