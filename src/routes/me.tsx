import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  EyeOff,
  LogIn,
  MapPin,
  Route as RouteIcon,
  ShieldCheck,
  Briefcase,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { LiveMap } from "@/components/LiveMap";
import { PhoneShell } from "@/components/PhoneShell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { employees, history, myProfile } from "@/lib/mock-data";

export const Route = createFileRoute("/me")({
  head: () => ({
    meta: [
      { title: "My Panel — Attendance & Live Sharing | Quike Eye" },
      {
        name: "description",
        content:
          "Employee panel: check in or out, control live location sharing, and review your hours, distance and today's movement.",
      },
      { property: "og:title", content: "My Panel — Quike Eye" },
      {
        property: "og:description",
        content: "Your attendance, live sharing status and daily movement in Quike Eye.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MyPanelPage,
});

function MyPanelPage() {
  const [share, setShare] = useState(true);
  const [onDuty, setOnDuty] = useState(true);
  const [selectedMate, setSelectedMate] = useState<string | null>(null);

  const stats = [
    { icon: Clock, label: "Hours today", value: `${myProfile.hoursToday}h` },
    { icon: RouteIcon, label: "Distance", value: `${myProfile.distanceToday} km` },
    { icon: Briefcase, label: "Visits", value: myProfile.visitsToday },
    { icon: LogIn, label: "Check-in", value: myProfile.checkIn },
  ];

  const monthly = [
    { label: "Present", value: myProfile.monthPresent, tone: "text-primary" },
    { label: "Late", value: myProfile.monthLate, tone: "text-gold" },
    { label: "Absent", value: myProfile.monthAbsent, tone: "text-destructive" },
  ];

  return (
    <PhoneShell>
      <header className="bg-navy px-5 pb-8 pt-6 text-primary-foreground">
        <div className="flex items-center gap-3">
          <Link to="/profile" aria-label="Back" className="text-primary-foreground/80">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="flex-1 text-center text-base font-semibold text-primary-foreground">
            My Panel
          </h1>
          <span className="w-5" />
        </div>

        <div className="screen-enter mt-5 flex items-center gap-3">
          <Avatar initials={myProfile.initials} size={58} online={onDuty} />
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-primary-foreground">{myProfile.name}</p>
            <p className="truncate text-xs text-primary-foreground/75">
              {myProfile.code} · {myProfile.team}
            </p>
            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-primary-foreground/75">
              <MapPin className="h-3 w-3" /> {myProfile.area}
            </p>
          </div>
        </div>
      </header>

      <div className="px-4 pb-4">
        <div className="screen-enter -mt-5 rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="flex-1 text-sm font-semibold">Share my live location</span>
            <Switch
              checked={share}
              onCheckedChange={setShare}
              aria-label="Toggle live location sharing"
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {share
              ? "Your admin and team members can see your live location while you are on duty."
              : "Sharing is off — your location is hidden from admin and team."}
          </p>
          <Button
            className="mt-4 w-full"
            variant={onDuty ? "outline" : "default"}
            onClick={() => setOnDuty((v) => !v)}
          >
            {onDuty ? "Check out for the day" : "Check in now"}
          </Button>
        </div>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold">
              <Users className="h-4 w-4 text-primary" /> My team — live
            </h2>
            <Link
              to="/map"
              className="flex items-center gap-0.5 text-xs font-semibold text-primary"
            >
              Full map <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {share ? (
            <>
              <div className="screen-enter mt-3 overflow-hidden rounded-2xl border border-border shadow-card">
                <LiveMap
                  people={employees.filter((e) => e.team === myProfile.team)}
                  className="h-44"
                  controls={false}
                  onSelect={(e) => setSelectedMate(e.id)}
                  selectedId={selectedMate}
                />
              </div>
              <ul className="mt-3 space-y-2">
                {employees
                  .filter((e) => e.team === myProfile.team)
                  .map((e) => (
                    <li key={e.id}>
                      <Link
                        to="/employee/$id"
                        params={{ id: e.id }}
                        className="tap-feedback flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
                      >
                        <Avatar initials={e.initials} src={e.photo} alt={e.name} size={40} online={e.online} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-foreground">{e.name}</span>
                          <span className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" /> {e.area}
                          </span>
                        </span>
                        <span className={`text-[11px] font-medium ${e.online ? "text-primary" : "text-muted-foreground"}`}>
                          {e.updated}
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </>
          ) : (
            <div className="mt-3 flex items-start gap-3 rounded-2xl border border-dashed border-border bg-muted/50 p-4">
              <EyeOff className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Location sharing is off. Turn on "Share my live location" to see your team members
                live and let them see you.
              </p>
            </div>
          )}
        </section>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl border border-border bg-card p-4">
              <Icon className="h-4 w-4 text-primary" />
              <p className="mt-2 text-lg font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <section className="mt-6">
          <h2 className="text-sm font-semibold">This month</h2>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {monthly.map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-border bg-card p-3 text-center"
              >
                <p className={`text-xl font-bold ${m.tone}`}>{m.value}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-semibold">My movement today</h2>
          <ul className="mt-3 space-y-3">
            {history.map((h) => (
              <li key={h.time} className="flex gap-3">
                <span className="mt-1 flex flex-col items-center">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <span className="mt-1 w-px flex-1 bg-border" />
                </span>
                <span className="flex-1 rounded-2xl border border-border bg-card p-3">
                  <span className="block text-xs font-semibold text-primary">{h.time}</span>
                  <span className="mt-0.5 block text-sm font-medium text-foreground">{h.place}</span>
                  <span className="block text-xs text-muted-foreground">{h.note}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PhoneShell>
  );
}
