import { Link, useRouterState } from "@tanstack/react-router";
import { Map, Users, Bell, User } from "lucide-react";

const items = [
  { to: "/map", label: "Map", icon: Map },
  { to: "/users", label: "Users", icon: Users },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const path = useRouterState({ select: (r) => r.location.pathname });

  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 pb-[max(env(safe-area-inset-bottom),0.25rem)] backdrop-blur-xl">
      <ul className="grid grid-cols-4">
        {items.map(({ to, label, icon: Icon }) => {
          const active = path.startsWith(to);
          return (
            <li key={to}>
              <Link
                to={to}
                className={`tap-feedback relative flex min-h-16 flex-col items-center justify-center gap-1 text-[10px] font-semibold ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {active && <span className="absolute top-0 h-0.5 w-6 rounded-full bg-primary" />}
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.8} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
