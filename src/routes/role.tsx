import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, ShieldCheck, Users } from "lucide-react";

export const Route = createFileRoute("/role")({
  head: () => ({
    meta: [
      { title: "Select Your Role — Quike Eye" },
      {
        name: "description",
        content: "Continue as an employee sharing live location, or as an admin viewing your team.",
      },
      { property: "og:title", content: "Select Your Role — Quike Eye" },
      {
        property: "og:description",
        content: "Employee, user or admin panel access in Quike Eye.",
      },
    ],
  }),
  component: RolePage,
});

const roles = [
  {
    icon: Users,
    title: "User / Employee",
    desc: "Share my live location and see others.",
  },
  {
    icon: ShieldCheck,
    title: "Admin / Viewer",
    desc: "View live locations of users / employees.",
  },
];

function RolePage() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-6 py-12">
      <h1 className="text-center text-2xl font-semibold">Select Your Role</h1>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        Choose how you want to continue
      </p>

      <div className="mt-8 space-y-4">
        {roles.map(({ icon: Icon, title, desc }) => (
          <Link
            key={title}
            to="/login"
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold text-foreground">{title}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{desc}</span>
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
