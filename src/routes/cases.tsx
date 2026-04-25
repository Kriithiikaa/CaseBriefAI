import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { Sidebar } from "@/components/dashboard/Sidebar";
import {
  FolderOpen,
  Search,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle2,
  CircleDot,
} from "lucide-react";

export const Route = createFileRoute("/cases")({
  component: CasesPage,
  head: () => ({
    meta: [
      { title: "CaseBrief AI — Cases" },
      { name: "description", content: "All active cases." },
    ],
  }),
});

type Tag =
  | "Child & Family Services"
  | "Child Care"
  | "Public Health"
  | "Behavioural Care"
  | "Housing Assistance"
  | "Aging & Disbility"
  | "Violence";
type Status = "Open" | "In Progress" | "Pending Review" | "Closed";
type Risk = "High" | "Medium" | "Low";

type Case = {
  id: string;
  title: string;
  client: string;
  tag: Tag;
  status: Status;
  risk: Risk;
  summary: string;
  assignee: string;
  updatedAt: number;
};

const SEED: Case[] = [
  {
    id: "CS-1042",
    title: "Domestic Violence — Urgent Placement",
    client: "Amara W.",
    tag: "Violence",
    status: "In Progress",
    risk: "High",
    summary:
      "Client presented with visible injuries following reported incident at home. Emergency shelter placement arranged. Restraining order referral in progress. Children (ages 5 and 8) are currently with maternal grandmother while safety plan is being finalised.",
    assignee: "J. Reyes",
    updatedAt: Date.now() - 1000 * 60 * 40,
  },
  {
    id: "CS-1037",
    title: "Peer Support — Post-Hospitalisation",
    client: "Daniel F.",
    tag: "Behavioural Care",
    status: "Open",
    risk: "Medium",
    summary:
      "Client discharged from psychiatric unit after a 14-day stay. Requires weekly check-ins, connection to community mental health program, and benefits navigation support. No stable housing confirmed post-discharge. Referral to transitional housing submitted.",
    assignee: "M. Okonkwo",
    updatedAt: Date.now() - 1000 * 60 * 60 * 3,
  },
  {
    id: "CS-1029",
    title: "Disability Access — Employment Support",
    client: "Priya S.",
    tag: "Aging & Disbility",
    status: "Pending Review",
    risk: "Low",
    summary:
      "Client has a documented mobility impairment and is seeking workplace accommodation support following a change in employer. Reasonable adjustments assessment needed. OT referral and employer liaison letter drafted, awaiting supervisor sign-off before submission.",
    assignee: "T. Brennan",
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: "CS-1051",
    title: "Behavioural Concerns — School Referral",
    client: "Marcus L. (minor)",
    tag: "Behavioural Care",
    status: "Open",
    risk: "Medium",
    summary:
      "Referred by school counsellor following three exclusions in five weeks. Client (age 14) presents with anger dysregulation and suspected ADHD — no formal diagnosis yet. Home environment reported as chaotic. Parent engagement has been inconsistent. CBT referral and CAMHS assessment submitted.",
    assignee: "J. Reyes",
    updatedAt: Date.now() - 1000 * 60 * 90,
  },
];

const TAG_STYLES: Record<Tag, string> = {
  "Child & Family Services":
    "bg-[oklch(0.95_0.04_15)] text-[oklch(0.45_0.18_15)] border-[oklch(0.85_0.08_15)]",
  "Child Care":
    "bg-[oklch(0.95_0.04_240)] text-[oklch(0.45_0.12_240)] border-[oklch(0.85_0.08_240)]",
  "Public Health":
    "bg-[oklch(0.95_0.04_280)] text-[oklch(0.45_0.12_280)] border-[oklch(0.85_0.08_280)]",
  "Behavioural Care":
    "bg-[oklch(0.95_0.06_60)] text-[oklch(0.45_0.15_60)] border-[oklch(0.85_0.1_60)]",
  "Housing Assistance":
    "bg-[oklch(0.95_0.04_150)] text-[oklch(0.45_0.12_150)] border-[oklch(0.85_0.08_150)]",
  "Aging & Disbility":
    "bg-[oklch(0.95_0.04_175)] text-[oklch(0.45_0.12_175)] border-[oklch(0.85_0.08_175)]",
  Violence: "bg-[oklch(0.95_0.04_95)] text-[oklch(0.45_0.15_95)] border-[oklch(0.85_0.1_95)]",
};

const RISK_STYLES: Record<Risk, string> = {
  High: "text-destructive",
  Medium: "text-[oklch(0.6_0.15_60)]",
  Low: "text-[oklch(0.5_0.12_150)]",
};

const STATUS_ICON: Record<Status, typeof CircleDot> = {
  Open: CircleDot,
  "In Progress": Clock,
  "Pending Review": AlertTriangle,
  Closed: CheckCircle2,
};

const STATUS_STYLE: Record<Status, string> = {
  Open: "text-muted-foreground",
  "In Progress": "text-primary",
  "Pending Review": "text-[oklch(0.6_0.15_60)]",
  Closed: "text-[oklch(0.5_0.12_150)]",
};

function timeAgo(ts: number) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function CasesPage() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<Tag | "All">("All");

  const tags: (Tag | "All")[] = [
    "All",
    "Violence",
    "Child & Family Services",
    "Child Care",
    "Behavioural Care",
    "Housing Assistance",
    "Public Health",
    "Aging & Disbility",
  ];

  const filtered = SEED.filter((c) => {
    const matchTag = activeTag === "All" || c.tag === activeTag;
    const q = query.trim().toLowerCase();
    const matchQuery =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.client.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q);
    return matchTag && matchQuery;
  });

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-background">
        <Sidebar />

        <main className="flex-1 px-8 py-6">
          <div className="mb-6 text-sm text-muted-foreground">
            <Link to="/dashboard" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="font-semibold text-foreground">Cases</span>
          </div>

          <header className="mb-6 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <FolderOpen className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Cases</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {SEED.length} active cases · {SEED.filter((c) => c.risk === "High").length} high
                  risk
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search cases, clients..."
                  className="w-56 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <Link
                to="/intake"
                className="flex h-10 items-center gap-2 rounded-lg bg-foreground px-4 text-sm font-semibold text-background hover:opacity-90"
              >
                <Plus className="h-4 w-4" /> New Case
              </Link>
            </div>
          </header>

          {/* Tag filter */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTag(t)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeTag === t
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground hover:bg-secondary border border-border"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Case list */}
          {filtered.length === 0 ? (
            <div className="mt-24 flex flex-col items-center text-center text-muted-foreground">
              <FolderOpen className="mb-3 h-10 w-10 opacity-40" />
              <p className="text-sm">No cases match your search.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((c) => {
                const StatusIcon = STATUS_ICON[c.status];
                return (
                  <div
                    key={c.id}
                    className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">{c.id}</span>
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${TAG_STYLES[c.tag]}`}
                          >
                            {c.tag}
                          </span>
                          <span
                            className={`flex items-center gap-1 text-xs font-medium ${STATUS_STYLE[c.status]}`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {c.status}
                          </span>
                          <span className={`text-xs font-semibold ${RISK_STYLES[c.risk]}`}>
                            {c.risk} Risk
                          </span>
                        </div>
                        <h2 className="mb-1 text-base font-semibold text-foreground">{c.title}</h2>
                        <p className="mb-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                          {c.summary}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>
                            Client: <span className="font-medium text-foreground">{c.client}</span>
                          </span>
                          <span>
                            Assigned:{" "}
                            <span className="font-medium text-foreground">{c.assignee}</span>
                          </span>
                          <span>Updated {timeAgo(c.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
