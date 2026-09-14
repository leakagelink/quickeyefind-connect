import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Lock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Welcome Back — Quike Eye Login" },
      {
        name: "description",
        content: "Login to Quike Eye with your mobile number or OTP to start live tracking.",
      },
      { property: "og:title", content: "Login — Quike Eye" },
      { property: "og:description", content: "Sign in to Quike Eye live tracking." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-6 py-8">
      <Link to="/role" className="inline-flex text-muted-foreground">
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <h1 className="mt-10 text-center text-2xl font-semibold">Welcome Back</h1>
      <p className="mt-1 text-center text-sm text-muted-foreground">Login to continue</p>

      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/permission" });
        }}
      >
        <div className="flex h-12 items-center overflow-hidden rounded-xl border border-input bg-card">
          <span className="px-4 text-sm text-muted-foreground">+91</span>
          <span className="h-6 w-px bg-border" />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="numeric"
            maxLength={10}
            placeholder="Enter mobile number"
            className="h-full flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <button
          type="submit"
          className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
        >
          Continue
        </button>

        <p className="text-center text-xs text-muted-foreground">or</p>

        <Link
          to="/permission"
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-medium"
        >
          <Lock className="h-4 w-4" /> Login with OTP
        </Link>
      </form>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        By continuing, you agree to our
        <br />
        <span className="text-primary">Terms &amp; Conditions</span> —{" "}
        <span className="text-primary">Privacy Policy</span>
      </p>
    </div>
  );
}
