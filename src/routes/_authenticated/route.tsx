import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

// Auth gate: every screen under this layout requires a signed-in session.
// ssr:false so the guard runs in the browser where the Supabase session lives.
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw redirect({ to: "/auth" });
    }
    return { userId: user.id };
  },
  component: () => <Outlet />,
});
