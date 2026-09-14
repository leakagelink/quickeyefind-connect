import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function PhoneShell({
  children,
  nav = true,
  immersive = false,
}: {
  children: ReactNode;
  nav?: boolean;
  immersive?: boolean;
}) {
  return (
    <main className="min-h-[100dvh] bg-secondary/50 sm:grid sm:place-items-center sm:p-4">
      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-background sm:min-h-[min(860px,calc(100dvh-32px))] sm:rounded-[28px] sm:border sm:border-border sm:shadow-card">
        <div className={`min-h-0 flex-1 ${nav && !immersive ? "pb-20" : ""}`}>{children}</div>
        {nav && <BottomNav />}
      </div>
    </main>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 pb-3 pt-6">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="mt-1 truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
    </div>
  );
}
