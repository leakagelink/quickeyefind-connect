import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Loader2, LogIn, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { AppLogo } from "@/components/AppLogo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in — Quike Eye" },
      {
        name: "description",
        content:
          "Sign in or create your Quike Eye account to start sharing and viewing live employee locations.",
      },
      { property: "og:title", content: "Sign in — Quike Eye" },
      {
        property: "og:description",
        content: "Create an account or sign in to Quike Eye.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [team, setTeam] = useState("Field Sales");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The chosen role is stashed by the role-select page; default to employee.
  const role =
    (typeof window !== "undefined" &&
      window.sessionStorage.getItem("qe_role")) ||
    "employee";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "signup") {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              full_name: name,
              team,
              role,
            },
          },
        });
        if (err) throw err;
        // A profile + role row is created by the handle_new_user trigger.
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (err) throw err;
      }
      navigate({ to: "/permission" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    setError(null);
    try {
      await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      // OAuth redirects; if it returns inline, go to the app.
      navigate({ to: "/permission" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google sign-in failed.");
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-md bg-background px-6 py-8 sm:my-4 sm:min-h-[calc(100dvh-32px)] sm:rounded-[28px] sm:border sm:border-border sm:shadow-card">
      <Link to="/role" className="text-muted-foreground">
        <ChevronLeft className="h-5 w-5" />
      </Link>

      <div className="screen-enter mt-4 text-center">
        <AppLogo className="mx-auto w-20" width={512} height={512} />
        <h1 className="mt-3 text-xl font-semibold">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Sign in to track your team live"
            : "Join Quike Eye to start sharing location"}
        </p>
      </div>

      <form onSubmit={submit} className="screen-enter mt-6 space-y-3">
        {mode === "signup" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Full name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Rahul Verma"
                className="qe-input"
              />
            </Field>
            <Field label="Team">
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="qe-input"
              >
                <option>Field Sales</option>
                <option>Delivery</option>
                <option>Service</option>
              </select>
            </Field>
          </div>
        )}
        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="qe-input"
            autoComplete="email"
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="At least 6 characters"
            className="qe-input"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
          />
        </Field>

        {error && (
          <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : mode === "signin" ? (
            <LogIn className="h-4 w-4" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          {mode === "signin" ? "Sign in" : "Create account"}
        </Button>
      </form>

      {/* Google sign-in temporarily hidden */}


      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "signin" ? "New to Quike Eye?" : "Already have an account?"}{" "}
        <button
          type="button"
          className="font-semibold text-primary"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin" ? "Create an account" : "Sign in"}
        </button>
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
