import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  Clock,
  LogIn,
  MapPin,
  Route as RouteIcon,
  ShieldCheck,
  Briefcase,
} from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { PhoneShell } from "@/components/PhoneShell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { history, myProfile } from "@/lib/mock-data";

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
              ? "Your admin can see your live location while you are on duty."
              : "Sharing is off — your location is not visible to anyone."}
          </p>
          <Button
            className="mt-4 w-full"
            variant={onDuty ? "outline" : "default"}
            onClick={() => setOnDuty((v) => !v)}
          >
            {onDuty ? "Check out for the day" : "Check in now"}
          </Button>
        </div>

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
