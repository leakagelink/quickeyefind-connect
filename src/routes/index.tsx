import { createFileRoute, Link } from "@tanstack/react-router";
import { UserRound } from "lucide-react";
import logo from "@/assets/quikeye-logo.png.asset.json";
import mapBg from "@/assets/map-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Quike Eye — Live Employee Tracking App" },
      {
        name: "description",
        content:
          "Quike Eye — find, connect, complete. Live employee location tracking with maps, alerts and team management.",
      },
      { property: "og:title", content: "Quike Eye — Live Employee Tracking" },
      {
        property: "og:description",
        content: "Live location tracking for teams. Find, connect, complete.",
      },
    ],
  }),
  component: Splash,
});

function Splash() {
  return (
    <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-background sm:my-4 sm:min-h-[calc(100dvh-32px)] sm:rounded-[28px] sm:border sm:border-border sm:shadow-card">
      <div className="absolute inset-0 opacity-45">
        <LiveMap people={employees.slice(0, 5)} controls={false} className="h-full" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />

      <div className="screen-enter relative z-10 mt-auto px-6 pb-10 text-center">
        <img
          src={logo.url}
          alt="Quike Eye logo"
          className="mx-auto w-56"
          width={512}
          height={512}
        />
        <h1 className="mt-2 text-xl font-semibold text-foreground">Quike Eye</h1>
        <p className="mt-1 text-sm text-muted-foreground">Find · Connect · Complete</p>

        <div className="mt-8 space-y-3">
          <Link
            to="/role"
            className="flex h-12 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-card"
          >
            Login / Register
          </Link>
          <Link
            to="/auth"
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-medium text-foreground"
          >
            <UserRound className="h-4 w-4" /> Continue as Guest
          </Link>
        </div>
      </div>
    </div>
  );
}
