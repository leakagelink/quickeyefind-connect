import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { BarChart3, Bell, LayoutDashboard, LogOut, Map, UserCircle2, UserSquare2, Users2 } from "lucide-react";
import { AppLogo } from "@/components/AppLogo";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { to: "/map", label: "Live Map", icon: Map },
  { to: "/users", label: "Team", icon: Users2 },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/me", label: "My Panel", icon: UserSquare2 },
  { to: "/reports", label: "Reports & Analytics", icon: BarChart3 },
  { to: "/admin", label: "Admin Panel", icon: LayoutDashboard },
  { to: "/profile", label: "Profile", icon: UserCircle2 },
] as const;

/** Website-style left navigation shown only from `lg` up. */
export function DesktopSidebar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-[100dvh] lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-border lg:bg-card lg:px-4 lg:py-6">
      <Link to="/map" className="px-2">
        <AppLogo alt="Quike Eye" className="h-9 w-auto" width={200} height={80} />
      </Link>
      <nav aria-label="Main navigation" className="mt-8 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeProps={{ className: "bg-primary/10 text-primary" }}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{label}</span>
          </Link>
        ))}
      </nav>
      <button
        type="button"
        onClick={signOut}
        className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        Logout
      </button>
    </aside>
  );
}
