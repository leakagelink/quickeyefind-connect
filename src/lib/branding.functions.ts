import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

export type AppBranding = { logoUrl: string | null; updatedAt: string | null };

/** Public read — works for signed-out visitors and during SSR. */
export const getBranding = createServerFn({ method: "GET" }).handler(async (): Promise<AppBranding> => {
  const sb = createClient<Database>(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"]!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );

  const { data } = await sb
    .from("app_settings")
    .select("logo_url,updated_at")
    .eq("id", "app")
    .maybeSingle();

  return { logoUrl: data?.logo_url ?? null, updatedAt: data?.updated_at ?? null };
});

/** Admin-only write. Accepts a data URL (image) or null to reset to the default logo. */
export const setAppLogo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        logoUrl: z
          .string()
          .max(1_400_000)
          .refine((v) => /^data:image\/(png|jpeg|webp|svg\+xml);base64,/.test(v), {
            message: "Only PNG, JPG, WEBP or SVG images are allowed",
          })
          .nullable(),
      })
      .parse(data),
  )
  .handler(async ({ context, data }) => {
    const sb = context.supabase;

    const { data: roleRow } = await sb
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleRow) throw new Error("Only an admin can change the app logo");

    const { error } = await sb
      .from("app_settings")
      .update({ logo_url: data.logoUrl, updated_by: context.userId })
      .eq("id", "app");

    if (error) throw new Error(error.message);

    return { logoUrl: data.logoUrl } satisfies { logoUrl: string | null };
  });
