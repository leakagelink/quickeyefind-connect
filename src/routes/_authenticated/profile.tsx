import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  ChevronRight,
  FileBarChart,
  UserCircle2,
  HelpCircle,
  Info,
  LogOut,
  MapPin,
  Settings,
  Shield,
  UserCog,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Avatar } from "@/components/Avatar";
import { PhoneShell } from "@/components/PhoneShell";
import { Switch } from "@/components/ui/switch";
import { getMyPanel, setSharing } from "@/lib/tracking.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/profile")({
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchMyPanel = useServerFn(getMyPanel);
  const setSharingFn = useServerFn(setSharing);

  const { data: panel } = useQuery({ queryKey: ["myPanel"], queryFn: fetchMyPanel });
  const profile = panel?.profile;
  const share = panel?.sharing ?? true;
  const isAdmin = profile?.role === "admin";

  const shareMutation = useMutation({
    mutationFn: (isSharing: boolean) => setSharingFn({ data: { isSharing } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myPanel"] });
      queryClient.invalidateQueries({ queryKey: ["overview"] });
    },
  });

  async function logout() {
    await supabase.auth.signOut();
    queryClient.clear();
    navigate({ to: "/" });
  }

  return (
    <PhoneShell>
      <header className="bg-navy px-6 pb-8 pt-9 text-center text-primary-foreground lg:rounded-3xl">
        <span className="inline-flex rounded-full bg-primary-foreground/15 p-1">
          <Avatar
            initials={profile?.initials ?? "…"}
            src={profile?.photoUrl ?? undefined}
            alt={profile?.name ?? "Me"}
            size={76}
          />
        </span>
        <h1 className="mt-3 text-lg font-semibold text-primary-foreground">
          {profile?.name ?? "Loading…"}
        </h1>
        <p className="text-sm text-primary-foreground/80">{profile?.phone ?? "—"}</p>
        {isAdmin && (
          <p className="mt-1 inline-flex rounded-full bg-primary-foreground/15 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
            Admin
          </p>
        )}
      </header>

      <div className="mt-4 px-4 lg:mx-auto lg:max-w-2xl lg:px-0">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="flex-1 text-sm font-medium">Share Live Location</span>
          <Switch
            checked={share}
            onCheckedChange={(v) => shareMutation.mutate(v)}
            aria-label="Toggle live location sharing"
          />
        </div>

        <Link
          to="/me"
          className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
        >
          <UserCircle2 className="h-5 w-5 text-primary" />
          <span className="flex-1 text-sm font-medium">My Panel — Attendance &amp; Sharing</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>

        {isAdmin && (
          <>
            <Link
              to="/admin"
              className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
            >
              <FileBarChart className="h-5 w-5 text-info" />
              <span className="flex-1 text-sm font-medium">Admin Panel — Teams &amp; Attendance</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            <Link
              to="/reports"
              className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
            >
              <BarChart3 className="h-5 w-5 text-gold" />
              <span className="flex-1 text-sm font-medium">Reports &amp; Analytics</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </>
        )}

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

        <button
          type="button"
          onClick={logout}
          className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-destructive"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </PhoneShell>
  );
}
