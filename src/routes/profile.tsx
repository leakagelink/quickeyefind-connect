import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronRight,
  FileBarChart,
  HelpCircle,
  Info,
  LogOut,
  MapPin,
  Settings,
  Shield,
  UserCog,
} from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { PhoneShell } from "@/components/PhoneShell";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Settings — Quike Eye" },
      {
        name: "description",
        content:
          "Manage live location sharing, account settings, privacy and admin tools from your Quike Eye profile.",
      },
      { property: "og:title", content: "Profile — Quike Eye" },
      {
        property: "og:description",
        content: "Location sharing and account settings in Quike Eye.",
      },
    ],
  }),
  component: ProfilePage,
});

const rows = [
  { icon: MapPin, label: "Location Settings" },
  { icon: UserCog, label: "Account Settings" },
  { icon: Shield, label: "Privacy Policy" },
  { icon: HelpCircle, label: "Help & Support" },
  { icon: Info, label: "About Us" },
];

function ProfilePage() {
  const [share, setShare] = useState(true);

  return (
    <PhoneShell>
      <header className="bg-navy px-6 pb-8 pt-9 text-center text-primary-foreground">
        <span className="inline-flex rounded-full bg-primary-foreground/15 p-1">
          <Avatar initials="RV" size={76} />
        </span>
        <h1 className="mt-3 text-lg font-semibold text-primary-foreground">Rahul Verma</h1>
        <p className="text-sm text-primary-foreground/80">+91 98765 43210</p>
      </header>

      <div className="mt-4 px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="flex-1 text-sm font-medium">Share Live Location</span>
          <Switch checked={share} onCheckedChange={setShare} aria-label="Toggle live location sharing" />
        </div>

        <Link
          to="/admin"
          className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
        >
          <FileBarChart className="h-5 w-5 text-info" />
          <span className="flex-1 text-sm font-medium">Admin Panel — Reports &amp; Teams</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>

        <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card">
          {rows.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3 p-4">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium">{label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </li>
          ))}
          <li className="flex items-center gap-3 p-4">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium">App Preferences</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </li>
        </ul>

        <Link
          to="/"
          className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-destructive"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-semibold">Logout</span>
        </Link>
      </div>
    </PhoneShell>
  );
}
