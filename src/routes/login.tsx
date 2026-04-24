import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Shield, Eye, EyeOff } from "lucide-react";
import { auth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [{ title: "CareSync — Log In" }],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (auth.isLoggedIn()) {
      navigate({ to: "/dashboard" });
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (tab === "signup" && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    auth.login();
    navigate({ to: "/dashboard" });
  };

  const switchTab = (t: "login" | "signup") => {
    setTab(t);
    setError("");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex flex-col items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground transition-opacity group-hover:opacity-80">
              <Shield className="h-6 w-6 text-background" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">CareSync</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">Social work case management</p>
            </div>
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          {/* Tabs */}
          <div className="mb-7 flex rounded-xl border border-border bg-secondary p-1">
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                  tab === t
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "signup" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@agency.org"
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 pr-10 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-danger-soft px-3 py-2 text-xs font-medium text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-foreground py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              {tab === "login" ? "Log In" : "Create Account"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            {tab === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => switchTab(tab === "login" ? "signup" : "login")}
              className="font-medium text-primary hover:underline"
            >
              {tab === "login" ? "Sign up free" : "Log in"}
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-foreground">
            ← Back to homepage
          </Link>
        </p>

        <p className="mt-3 text-center text-[11px] text-muted-foreground/50">
          Demo: enter any email and password to continue
        </p>
      </div>
    </div>
  );
}
