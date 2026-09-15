import type { ReactNode } from "react";
import { PhoneShell } from "@/components/PhoneShell";

/** Admin-facing pages: phone layout on mobile, website layout on desktop. */
export function DashboardShell({
  children,
  title,
  mobileHeader,
}: {
  children: ReactNode;
  title: string;
  mobileHeader?: ReactNode;
}) {
  return (
    <PhoneShell nav={false} title={title} mobileHeader={mobileHeader}>
      {children}
    </PhoneShell>
  );
}
