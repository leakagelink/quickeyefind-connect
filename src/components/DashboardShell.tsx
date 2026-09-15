import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { BarChart3, LayoutDashboard, LogOut, Map, Users2, UserCircle2 } from "lucide-react";
import { AppLogo } from "@/components/AppLogo";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/reports", label: "Reports & Analytics", icon: BarChart3 },
  { to: "/users", label: "Team", icon: Users2 },
  { to: "/map", label: "Live Map", icon: Map },
  { to: "/profile", label: "Profile", icon: UserCircle2 },
] as const;

/**
 * Phone-app layout on small screens, full website layout (sidebar + wide
 * content) from `lg` up. Used by the admin-facing pages.
 */
export function DashboardShell({
  children,
  title,
  mobileHeader,
}: {
  children: ReactNode;
  title: string;
  mobileHeader?: ReactNode;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <main className="min-h-[100dvh] bg-secondary/50 sm:p-4 lg:flex lg:gap-0 lg:p-0">
      <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-[100dvh] lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-border lg:bg-card lg:px-4 lg:py-6">
        <Link to="/map" className="px-2">
          <AppLogo alt="Quike Eye" className="h-9 w-auto" width={200} height={80} />
        </Link>
        <nav aria-label="Admin navigation" className="mt-8 space-y-1">
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

      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-background sm:min-h-[min(860px,calc(100dvh-32px))] sm:rounded-[28px] sm:border sm:border-border sm:shadow-card lg:mx-0 lg:min-h-[100dvh] lg:max-w-none lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent lg:shadow-none">
        <div className="hidden lg:block lg:border-b lg:border-border lg:bg-card">
          <div className="mx-auto w-full max-w-6xl px-8 py-5">
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
          </div>
        </div>

        {mobileHeader && <div className="lg:hidden">{mobileHeader}</div>}

        <div className="min-h-0 flex-1 lg:mx-auto lg:w-full lg:max-w-6xl lg:px-4 lg:py-8">
          {children}
        </div>
      </div>
    </main>
  );
}
