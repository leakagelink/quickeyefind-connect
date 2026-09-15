import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, ChevronLeft, ChevronRight, Users2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Avatar } from "@/components/Avatar";
import { LogoManager } from "@/components/LogoManager";
import { DashboardShell } from "@/components/DashboardShell";
import { getAdminOverview } from "@/lib/tracking.functions";
import { fmtClock } from "@/lib/tracking.types";

export const Route = createFileRoute("/_authenticated/admin")({
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
  const fetchAdmin = useServerFn(getAdminOverview);
  const { data, isPending } = useQuery({
    queryKey: ["admin"],
    queryFn: fetchAdmin,
    refetchInterval: 30_000,
  });

  const stats = [
    { label: "Total staff", value: data?.stats.total ?? 0 },
    { label: "Online now", value: data?.stats.online ?? 0 },
    { label: "Offline", value: data?.stats.offline ?? 0 },
    { label: "Present today", value: data?.stats.present ?? 0 },
  ];
  const teams = data?.teams ?? [];
  const attendance = data?.attendance ?? [];

  return (
    <DashboardShell
      title="Admin Panel"
      mobileHeader={
        <header className="flex items-center gap-3 px-4 pt-5">
          <Link to="/profile" className="text-muted-foreground">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="flex-1 text-center text-base font-semibold">Admin Panel</h1>
          <span className="w-5" />
        </header>
      }
    >

      <div className="px-4 lg:max-w-2xl lg:px-0">
        <LogoManager />
      </div>

      <div className="px-4 pt-4 lg:max-w-2xl lg:px-0">
        <Link
          to="/reports"
          className="tap-feedback flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold">
            <BarChart3 className="h-5 w-5" />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-semibold">Reports &amp; Analytics</span>
            <span className="block text-xs text-muted-foreground">
              Attendance, hours, distance and team performance
            </span>
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>

      <div className="screen-enter grid grid-cols-2 gap-3 px-4 pt-4 lg:grid-cols-4 lg:gap-5 lg:px-0 lg:pt-6">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className="text-2xl font-semibold text-primary">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="px-4 pt-6 lg:px-0 lg:pt-8">
        <h2 className="text-sm font-semibold lg:text-base">Teams / Departments</h2>
        {isPending && (
          <p className="mt-3 text-xs text-muted-foreground">Loading teams…</p>
        )}
        <ul className="mt-3 space-y-2 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 xl:grid-cols-3">
          {teams.map((t) => (
            <li
              key={t.team}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/12 text-info">
                <Users2 className="h-5 w-5" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">{t.team}</span>
                <span className="block text-xs text-muted-foreground">
                  {t.members} members · {t.online} online
                </span>
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </li>
          ))}
        </ul>
      </section>

      <section className="px-4 pb-8 pt-6 lg:px-0 lg:pt-8">
        <h2 className="text-sm font-semibold lg:text-base">Today&apos;s attendance</h2>
        {!isPending && attendance.length === 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            No one has checked in today yet.
          </p>
        )}
        <ul className="mt-3 divide-y divide-border lg:rounded-2xl lg:border lg:border-border lg:bg-card lg:px-4">
          {attendance.map((r) => (
            <li key={r.id} className="flex items-center gap-3 py-3">
              <Avatar
                initials={r.initials}
                src={r.photoUrl ?? undefined}
                alt={r.name}
                size={36}
              />
              <span className="flex-1 text-sm font-medium">{r.name}</span>
              <span className="text-xs text-muted-foreground">
                {r.checkOut === "—" ? "On duty" : fmtClock(r.checkOut)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </DashboardShell>
  );
}
