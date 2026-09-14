import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function PhoneShell({
  children,
  nav = true,
}: {
  children: ReactNode;
  nav?: boolean;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <div className={`flex-1 ${nav ? "pb-20" : ""}`}>{children}</div>
      {nav && <BottomNav />}
    </div>
  );
}
