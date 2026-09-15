import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { DesktopSidebar } from "./DesktopSidebar";

/**
 * Phone-app layout up to `lg`, website layout (left navigation + wide content)
 * from `lg` up.
 */
export function PhoneShell({
  children,
  nav = true,
  immersive = false,
  title,
  mobileHeader,
}: {
  children: ReactNode;
  nav?: boolean;
  immersive?: boolean;
  /** Shown in the desktop top bar only. */
  title?: string;
  /** Shown on phone widths only (e.g. a back-button header). */
  mobileHeader?: ReactNode;
}) {
  return (
    <main className="min-h-[100dvh] bg-secondary/50 sm:grid sm:place-items-center sm:p-4 lg:flex lg:place-items-stretch lg:p-0">
      <DesktopSidebar />
      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-background sm:min-h-[min(860px,calc(100dvh-32px))] sm:rounded-[28px] sm:border sm:border-border sm:shadow-card lg:mx-0 lg:min-h-[100dvh] lg:max-w-none lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent lg:shadow-none">
        {title && (
          <div className="hidden lg:block lg:border-b lg:border-border lg:bg-card">
            <div className="mx-auto w-full max-w-6xl px-4 py-5">
              <h1 className="text-xl font-bold text-foreground">{title}</h1>
            </div>
          </div>
        )}
        {mobileHeader && <div className="lg:hidden">{mobileHeader}</div>}
        <div
          className={`min-h-0 flex-1 ${nav && !immersive ? "pb-20 lg:pb-0" : ""} ${
            immersive ? "" : "lg:mx-auto lg:w-full lg:max-w-6xl lg:px-4 lg:py-4"
          }`}
        >
          {children}
        </div>
        {nav && (
          <div className="lg:hidden">
            <BottomNav />
          </div>
        )}
      </div>
    </main>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 pb-3 pt-6 lg:px-0 lg:pt-2">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold text-foreground lg:text-2xl">{title}</h1>
        {subtitle && <p className="mt-1 truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
