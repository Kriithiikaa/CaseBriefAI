import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Shield,
  LayoutGrid,
  Calendar,
  StickyNote,
  Sparkles,
  ArrowRight,
  ListChecks,
  CheckCircle,
} from "lucide-react";
import { auth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "CareSync — Smarter Case Management" },
      {
        name: "description",
        content:
          "CareSync helps social workers manage cases, track clients, and generate AI-powered case briefs.",
      },
    ],
  }),
});

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isLoggedIn()) {
      navigate({ to: "/dashboard" });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
              <Shield className="h-4 w-4 text-background" fill="currentColor" />
            </div>
            <span className="text-base font-semibold text-foreground">CareSync</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Log In
            </Link>
            <Link
              to="/login"
              className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-28 text-center">
        <div
          className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2"
          style={{
            width: 900,
            height: 600,
            background:
              "radial-gradient(ellipse at center, oklch(0.94 0.05 175 / 0.55) 0%, transparent 68%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-powered case briefs in seconds
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl">
            Case management built
            <br />
            for <span className="text-primary">social workers</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground">
            CareSync helps your team track clients, manage high-risk cases, schedule home visits,
            and generate compliant case notes — all in one platform.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition-opacity hover:opacity-90"
            >
              Start for free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Log in to your account
            </Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <div className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-4xl grid-cols-3 divide-x divide-border px-6 py-8">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1 px-6">
              <span className="text-3xl font-bold text-foreground">{s.value}</span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 text-center">
          <h2 className="mb-3 text-3xl font-bold text-foreground">Everything your team needs</h2>
          <p className="text-muted-foreground">
            Designed for the realities of frontline social work.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <CheckCircle className="h-3.5 w-3.5 text-success" /> Free to get started
          </div>
          <h2 className="mb-4 text-4xl font-bold text-foreground">
            Ready to manage your caseload smarter?
          </h2>
          <p className="mb-10 text-muted-foreground">
            Join caseworkers and agencies already using CareSync to cut paperwork and focus on
            clients.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            Create your free account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

const stats = [
  { value: "2,400+", label: "Cases processed monthly" },
  { value: "150+", label: "Agencies served" },
  { value: "60%", label: "Less time on paperwork" },
];

const features = [
  {
    icon: LayoutGrid,
    title: "Case Dashboard",
    desc: "Track all active cases at a glance with risk scores, live metrics, and team activity.",
  },
  {
    icon: Sparkles,
    title: "AI Case Briefs",
    desc: "Turn raw intake notes into structured summaries, risk assessments, and action steps instantly.",
  },
  {
    icon: Calendar,
    title: "Integrated Calendar",
    desc: "Schedule home visits, court hearings, and client calls in one unified weekly view.",
  },
  {
    icon: StickyNote,
    title: "Quick Notes",
    desc: "Pin, color-code, and search notes across your entire caseload — like Google Keep for casework.",
  },
  {
    icon: ListChecks,
    title: "Compliance Checklists",
    desc: "Automated intake compliance tracking catches missing documents and required supervisor reviews.",
  },
  {
    icon: Shield,
    title: "Secure by Design",
    desc: "Role-based access control, audit trails, and encrypted storage built in from day one.",
  },
];
