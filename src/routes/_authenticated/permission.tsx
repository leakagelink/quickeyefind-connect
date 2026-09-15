import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MapPin, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/permission")({
  head: () => ({
    meta: [
      { title: "Location Permission — Quike Eye" },
      {
        name: "description",
        content: "Allow location access so Quike Eye can show live employee locations on the map.",
      },
      { property: "og:title", content: "Location Permission — Quike Eye" },
      {
        property: "og:description",
        content: "Enable location access for live tracking in Quike Eye.",
      },
    ],
  }),
  component: PermissionPage,
});

function PermissionPage() {
  const navigate = useNavigate();

  const ask = () => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => navigate({ to: "/map" }),
        () => navigate({ to: "/map" }),
      );
    } else {
      navigate({ to: "/map" });
    }
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col items-center justify-center bg-background px-8 text-center sm:my-4 sm:min-h-[calc(100dvh-32px)] sm:rounded-[28px] sm:border sm:border-border sm:shadow-card">
      <div className="screen-enter relative flex h-40 w-28 items-center justify-center rounded-3xl border-2 border-border bg-card shadow-card">
        <Smartphone className="h-16 w-16 text-muted-foreground/40" strokeWidth={1} />
        <MapPin className="absolute h-10 w-10 text-primary" />
      </div>

      <h1 className="mt-8 text-xl font-semibold">Location Permission</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        To show live locations, we need access to your location.
      </p>

      <Button
        onClick={ask}
        size="lg"
        className="mt-8 w-full"
      >
        Allow Location Access
      </Button>
      <Link to="/map" className="mt-4 text-sm text-muted-foreground">
        Not Now
      </Link>
    </div>
  );
}
