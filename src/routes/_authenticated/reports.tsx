import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Download, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Avatar } from "@/components/Avatar";
import { PhoneShell } from "@/components/PhoneShell";
import { Button } from "@/components/ui/button";
import { getReports } from "@/lib/tracking.functions";
import { fmtClock } from "@/lib/tracking.types";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Analytics — Attendance Insights | Quike Eye" },
      {
        name: "description",
        content:
          "Attendance reports and analytics: present, late and absent counts, working hours, distance covered and team-wise performance.",
      },
      { property: "og:title", content: "Reports & Analytics — Quike Eye" },
      {
        property: "og:description",
        content: "Attendance, working hours and team performance analytics in Quike Eye.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReportsPage,
});

const ranges = ["Today", "This week", "This month"] as const;
const filters = ["All", "Present", "Late", "Absent"] as const;

function ReportsPage() {
  const [range, setRange] = useState<(typeof ranges)[number]>("Today");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const fetchReports = useServerFn(getReports);
  const { data, isPending } = useQuery({
    queryKey: ["reports"],
    queryFn: fetchReports,
    refetchInterval: 60_000,
  });

  const attendance = data?.attendance ?? [];
  const weekly = data?.weekly ?? [];
  const teams = data?.teams ?? [];
  const totalHours = data?.totalHours ?? 0;
  const totalKm = data?.totalKm ?? 0;

  const rows = attendance.filter((r) => filter === "All" || r.status === filter);
  const present = attendance.filter((r) => r.status === "Present").length;
  const late = attendance.filter((r) => r.status === "Late").length;
  const absent = attendance.filter((r) => r.status === "Absent").length;
  const maxPresent = Math.max(1, ...weekly.map((w) => w.present));

  const summary = [
    { label: "Present", value: present, tone: "text-primary" },
    { label: "Late", value: late, tone: "text-gold" },
    { label: "Absent", value: absent, tone: "text-destructive" },
    {
      label: "Avg hours",
      value: attendance.length ? (totalHours / attendance.length).toFixed(1) : "0.0",
      tone: "text-info",
    },
  ];

  const statusTone: Record<string, string> = {
    Present: "bg-primary/12 text-primary",
    Late: "bg-gold/15 text-gold",
    Absent: "bg-destructive/12 text-destructive",
  };

  function exportCsv() {
    const header = "Name,Team,Check in,Check out,Hours,Distance km,Visits,Status";
    const body = attendance
      .map((r) =>
        [
          r.name,
          r.team,
          fmtClock(r.checkIn),
          fmtClock(r.checkOut),
          r.hours,
          r.distanceKm,
          r.visits,
          r.status,
        ].join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([`${header}\n${body}`], { type: "text/csv" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `quikeye-attendance-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <PhoneShell nav={false}>
      <header className="flex items-center gap-3 px-4 pt-5">
        <Link to="/admin" aria-label="Back" className="text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="flex-1 text-center text-base font-semibold">Reports &amp; Analytics</h1>
        <span className="w-5" />
      </header>

      <div className="hide-scrollbar mt-4 flex gap-2 overflow-x-auto px-4">
        {ranges.map((r) => (
          <Button
            key={r}
            size="sm"
            variant={range === r ? "default" : "outline"}
            className="shrink-0 rounded-full"
            onClick={() => setRange(r)}
          >
            {r}
          </Button>
        ))}
      </div>

      <div className="screen-enter mt-4 grid grid-cols-2 gap-3 px-4">
        {summary.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className={`text-2xl font-bold ${s.tone}`}>{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="px-4 pt-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h2 className="flex-1 text-sm font-semibold">Attendance trend</h2>
          <span className="text-xs text-muted-foreground">{range}</span>
        </div>
        <div className="mt-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex h-32 items-end justify-between gap-2">
            {weekly.map((w, i) => (
              <div key={`${w.day}-${i}`} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] font-semibold text-muted-foreground">{w.present}</span>
                <div
                  className="w-full rounded-t-md bg-primary/85"
                  style={{ height: `${(w.present / maxPresent) * 88}px` }}
                />
                <span className="text-[10px] text-muted-foreground">{w.day}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
            Total distance covered today:{" "}
            <span className="font-semibold text-foreground">{totalKm} km</span> · Working hours:{" "}
            <span className="font-semibold text-foreground">{totalHours.toFixed(1)}h</span>
          </p>
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="text-sm font-semibold">Team-wise performance</h2>
        <ul className="mt-3 space-y-2">
          {teams.map((t) => (
            <li key={t.team} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{t.team}</span>
                <span className="text-xs font-semibold text-primary">{t.onTime}% on time</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {t.members} members · {t.online} online · {t.visits} visits · {t.distanceKm} km
              </p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary" style={{ width: `${t.onTime}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-4 pb-6 pt-6">
        <h2 className="text-sm font-semibold">Attendance report</h2>
        <div className="hide-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {filters.map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "outline"}
              className="shrink-0 rounded-full"
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>

        {isPending && (
          <p className="mt-4 text-xs text-muted-foreground">Loading report…</p>
        )}
        {!isPending && rows.length === 0 && (
          <p className="mt-4 text-xs text-muted-foreground">
            No attendance records for this filter yet.
          </p>
        )}

        <ul className="mt-3 space-y-2">
          {rows.map((r) => (
            <li
              key={r.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
            >
              <Avatar
                initials={r.initials}
                src={r.photoUrl ?? undefined}
                alt={r.name}
                size={40}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{r.name}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {fmtClock(r.checkIn)} – {fmtClock(r.checkOut)} · {r.hours}h · {r.distanceKm} km
                </span>
              </span>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusTone[r.status] ?? "bg-secondary text-muted-foreground"}`}
              >
                {r.status}
              </span>
            </li>
          ))}
        </ul>

        <Button variant="outline" className="mt-4 w-full" onClick={exportCsv}>
          <Download className="mr-2 h-4 w-4" /> Export report (CSV)
        </Button>
      </section>
    </PhoneShell>
  );
}
