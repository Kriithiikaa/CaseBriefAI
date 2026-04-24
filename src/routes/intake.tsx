import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import {
  Mic,
  Paperclip,
  FileText,
  AlertTriangle,
  ClipboardList,
  ListChecks,
  Copy,
  Pencil,
  RefreshCw,
  FileDown,
  Check,
  X,
  Sparkles,
  ChevronDown,
  Loader2,
  Info,
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";

export const Route = createFileRoute("/intake")({
  component: IntakePage,
  head: () => ({
    meta: [
      { title: "CareSync — New Intake" },
      { name: "description", content: "Create a new case intake." },
    ],
  }),
});

const sampleNotes = [
  {
    label: "Housing — Single Mother, Eviction Risk",
    text: `Client is a 34-year-old single mother of two children (ages 6 and 9) currently facing eviction from her rental unit. She lost her job as a retail associate three weeks ago and has been unable to pay rent for the current month. The landlord has issued a formal eviction notice with a deadline of May 3rd. The family currently has no food in the home and utilities are at risk of being shut off. Client contacted the agency by phone and was in visible distress. She has no immediate family support in the area. She is requesting emergency housing assistance and food vouchers. No prior assistance records on file. Income verification and lease documentation are missing.`,
  },
  {
    label: "Child Welfare — Neglect Concern",
    text: `Caseworker conducted an unannounced home visit following a report from a school counselor. The household consists of a 28-year-old mother and her three children aged 4, 7, and 11. The home was found in an unsanitary condition with limited food available. The 4-year-old had visible bruising on the left arm. The mother appeared disoriented and was unable to coherently explain the child's injury. She stated the child had fallen from a chair but could not provide further detail. The 11-year-old reported that the mother frequently leaves them alone at night. The school counselor noted irregular attendance and declining hygiene in the older children. A safety plan has not yet been established. Supervisor review is pending. Emergency placement options should be evaluated.`,
  },
  {
    label: "Mental Health — Veteran Crisis",
    text: `Client is a 52-year-old male veteran referred by the VA outreach team after a wellness check was requested by a neighbor. During the office visit the client disclosed experiencing frequent nightmares, social isolation, and stated he has had thoughts of self-harm in the past two weeks but denied a specific plan. He was discharged from military service 12 years ago and has not maintained consistent mental health treatment since. He currently lives alone and has no emergency contacts on file. He reported consuming alcohol daily to manage anxiety. He was cooperative during the visit but expressed reluctance to engage in formal treatment. Immediate risk assessment is required. Referral to crisis counseling and substance use support is recommended. Follow-up appointment should be scheduled within 48 hours.`,
  },
  {
    label: "Immigration — Family Seeking Asylum",
    text: `Family of four presented at the office requesting assistance navigating the asylum application process. The family consists of a 39-year-old father, 35-year-old mother, and two children aged 8 and 13. They arrived in the country six weeks ago and are currently staying with a distant relative in a shared two-bedroom apartment with five other individuals. The father reported they fled due to targeted gang violence in their home country and that a family member was killed prior to their departure. They have had an initial immigration court date scheduled but do not have legal representation. The mother reported signs of anxiety and difficulty sleeping. The children have not yet been enrolled in school. Documents in possession include passports and a preliminary court notice. Legal aid referral and school enrollment support are priority next steps.`,
  },
];

const categories = [
  "Housing Assistance",
  "Health",
  "Child Care",
  "Child Assistance",
  "Support",
  "Immigration",
  "Violence",
  "Disability",
];

type RiskLevel = "Low" | "Medium" | "High" | "Critical";

const riskStyles: Record<RiskLevel, { bar: string; badge: string; border: string; icon: string }> = {
  Critical: {
    bar: "bg-danger-soft",
    badge: "text-destructive font-bold",
    border: "border-l-destructive",
    icon: "text-destructive",
  },
  High: {
    bar: "bg-danger-soft",
    badge: "text-destructive font-bold",
    border: "border-l-destructive",
    icon: "text-destructive",
  },
  Medium: {
    bar: "bg-[oklch(0.97_0.04_75)]",
    badge: "text-[oklch(0.5_0.15_60)] font-bold",
    border: "border-l-[oklch(0.75_0.15_60)]",
    icon: "text-[oklch(0.5_0.15_60)]",
  },
  Low: {
    bar: "bg-success-soft",
    badge: "text-success font-bold",
    border: "border-l-success",
    icon: "text-success",
  },
};

function IntakePage() {
  const [category, setCategory] = useState("Housing Assistance");
  const [summaryTab, setSummaryTab] = useState<"summary" | "client">("summary");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [urgency, setUrgency] = useState<"Low" | "Medium" | "High Risk">("High Risk");
  const [urgencyOpen, setUrgencyOpen] = useState(false);
  const [jurisdiction, setJurisdiction] = useState("");
  const [jurisdictionOpen, setJurisdictionOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [caseBrief, setCaseBrief] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;
  const canGenerate = wordCount >= 50;

  async function handleGenerateCaseBrief() {
    if (!canGenerate) return;
    try {
      setIsGenerating(true);
      setError(null);

      const response = await fetch("http://localhost:3001/api/analyze-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseType: category,
          rawNotes: notes,
          urgencyLevel: urgency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate case brief");
      }

      setCaseBrief(data);
    } catch (err: any) {
      setError(err.message || "Failed to generate case brief");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleCopy() {
    if (!caseBrief?.caseworker_note) return;
    await navigator.clipboard.writeText(caseBrief.caseworker_note);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const risk = caseBrief?.risk_assessment;
  const riskLevel = (risk?.risk_level ?? "Low") as RiskLevel;
  const styles = riskStyles[riskLevel] ?? riskStyles.Low;

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-background">
        <Sidebar />

        <main className="flex-1 grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT: Intake Form */}
          <section className="border-r border-border px-8 py-6 flex flex-col">
            <div className="mb-6 text-sm text-muted-foreground">
              <Link to="/dashboard" className="hover:text-foreground">Cases</Link>
              <span className="mx-2">/</span>
              <span className="font-semibold text-foreground">New Intake</span>
            </div>

            <div className="mb-5 grid grid-cols-3 gap-4">
              <div>
                <p className="mb-2 text-sm font-semibold text-foreground">Case Type</p>
                <button
                  onClick={() => {
                    setCategoryOpen((o) => !o);
                    setUrgencyOpen(false);
                    setJurisdictionOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:opacity-90"
                >
                  <span className="truncate">{category}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform ${categoryOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-foreground">Urgency Level</p>
                <button
                  onClick={() => {
                    setUrgencyOpen((o) => !o);
                    setCategoryOpen(false);
                    setJurisdictionOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-full px-4 py-2.5 text-sm font-medium transition-colors hover:opacity-90 ${
                    urgency === "High Risk"
                      ? "bg-danger-soft text-destructive"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  <span>{urgency}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${urgencyOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-foreground">Jurisdiction</p>
                <button
                  onClick={() => {
                    setJurisdictionOpen((o) => !o);
                    setCategoryOpen(false);
                    setUrgencyOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-full px-4 py-2.5 text-sm font-medium transition-colors hover:opacity-90 ${
                    jurisdiction
                      ? "bg-accent text-accent-foreground"
                      : "border border-border bg-card text-muted-foreground"
                  }`}
                >
                  <span>{jurisdiction || "Select state"}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${jurisdictionOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            </div>

            {categoryOpen && (
              <div className="mb-5 flex flex-wrap gap-2 rounded-xl border border-border bg-card p-3">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCategory(c);
                      setCategoryOpen(false);
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      category === c
                        ? "bg-accent text-accent-foreground"
                        : "border border-border bg-card text-foreground hover:bg-secondary"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            {urgencyOpen && (
              <div className="mb-5 flex flex-wrap gap-2 rounded-xl border border-border bg-card p-3">
                {(["Low", "Medium", "High Risk"] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => {
                      setUrgency(u);
                      setUrgencyOpen(false);
                    }}
                    className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      urgency === u
                        ? u === "High Risk"
                          ? "bg-danger-soft text-destructive"
                          : "bg-accent text-accent-foreground"
                        : "border border-border bg-card text-foreground hover:bg-secondary"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            )}

            {jurisdictionOpen && (
              <div className="mb-5 rounded-xl border border-border bg-card p-3">
                <input
                  autoFocus
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setJurisdictionOpen(false);
                  }}
                  placeholder="Type state name (e.g. California)"
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                />
              </div>
            )}

            <div className="flex flex-1 flex-col">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Intake Notes</p>
                <span className="flex items-center gap-1.5 text-xs text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Autosaved just now
                </span>
              </div>
              <div className="flex flex-1 flex-col rounded-xl border border-border bg-card">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Start typing the client's situation, background, and immediate needs..."
                  className="min-h-48 flex-1 resize-none rounded-xl bg-transparent p-4 text-sm outline-none placeholder:text-muted-foreground"
                />
                <div className="flex items-center justify-between border-t border-border px-3 py-2">
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-secondary">
                      <Mic className="h-3.5 w-3.5" /> Voice (Beta)
                    </button>
                    <button
                      onClick={() => setImportOpen((o) => !o)}
                      className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-secondary"
                    >
                      <Paperclip className="h-3.5 w-3.5" /> Import File
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    {canGenerate ? (
                      <span className="flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-xs font-medium text-success">
                        <Check className="h-3 w-3" /> {wordCount} words
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-danger-soft px-2.5 py-1 text-xs font-medium text-destructive">
                        <AlertTriangle className="h-3 w-3" /> {wordCount} words (Need 50+)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {importOpen && (
              <div className="mt-3 rounded-xl border border-border bg-card overflow-hidden">
                <p className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
                  Select a sample note
                </p>
                <ul>
                  {sampleNotes.map((sample) => (
                    <li key={sample.label}>
                      <button
                        onClick={() => {
                          setNotes(sample.text);
                          setImportOpen(false);
                        }}
                        className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-secondary transition-colors border-b border-border/50 last:border-0"
                      >
                        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-sm font-medium text-foreground">{sample.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {error && (
              <p className="mt-3 rounded-lg border border-destructive/30 bg-danger-soft px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            )}

            <button
              onClick={handleGenerateCaseBrief}
              disabled={!canGenerate || isGenerating}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[oklch(0.55_0.22_265)] text-sm font-semibold text-white shadow-md hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Generate Case Brief
                </>
              )}
            </button>
          </section>

          {/* RIGHT: Generated Brief */}
          <section className="bg-secondary/40 px-6 py-6 overflow-y-auto">
            {isGenerating ? (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm">Analyzing notes and generating case brief…</p>
                </div>
              </div>
            ) : !caseBrief ? (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-center text-muted-foreground">
                  <Sparkles className="h-8 w-8 text-primary/40" />
                  <p className="text-sm font-medium">No brief generated yet</p>
                  <p className="max-w-xs text-xs">
                    Add at least 50 words of intake notes and click Generate Case Brief.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Top bar */}
                <div className="mb-5 flex items-center gap-3">
                  <div className={`flex flex-1 items-center gap-2 rounded-full px-3 py-1.5 text-xs ${styles.bar}`}>
                    <span className={`flex items-center gap-1.5 ${styles.badge}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {riskLevel.toUpperCase()}
                    </span>
                    <span className="font-medium text-foreground">{risk?.risk_reasoning}</span>
                  </div>
                  <button
                    onClick={() => setCaseBrief(null)}
                    title="Clear and start over"
                    className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">
                    <FileDown className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  {/* Case Summary */}
                  <div className="rounded-xl border border-border bg-card p-5">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold text-foreground">
                          {summaryTab === "summary" ? "Case Summary" : "Client Info"}
                        </h3>
                      </div>
                      <div className="inline-flex rounded-md border border-border bg-secondary p-0.5 text-xs">
                        {(["summary", "client"] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => setSummaryTab(t)}
                            className={`rounded px-2.5 py-1 font-medium transition-colors ${
                              summaryTab === t
                                ? "bg-card text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {t === "summary" ? "Summary" : "Client Info"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {summaryTab === "summary" ? (
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {caseBrief.case_summary}
                      </p>
                    ) : (
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                        {[
                          { label: "Name", value: caseBrief.client_info?.name },
                          { label: "Age", value: caseBrief.client_info?.age },
                          { label: "Case Type", value: caseBrief.client_info?.case_type },
                          { label: "Visit Type", value: caseBrief.client_info?.visit_type },
                          { label: "Worker", value: caseBrief.client_info?.assigned_caseworker },
                          { label: "Visit Date", value: caseBrief.client_info?.visit_date },
                          { label: "Jurisdiction", value: jurisdiction || "[NOT STATED]" },
                        ].map((f) => (
                          <div key={f.label}>
                            <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                              {f.label}
                            </dt>
                            <dd className="mt-0.5 text-foreground">{f.value || "[NOT STATED]"}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </div>

                  {/* Risk Assessment */}
                  <div
                    className={`rounded-xl border-l-4 ${styles.border} border border-border bg-card p-5`}
                  >
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Risk Assessment
                    </p>
                    <div className="mb-4 flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${styles.bar}`}
                      >
                        <AlertTriangle className={`h-5 w-5 ${styles.icon}`} />
                      </div>
                      <div>
                        <p className="text-base font-bold text-foreground">{riskLevel} Priority</p>
                        <p className="text-xs text-muted-foreground">{risk?.risk_reasoning}</p>
                      </div>
                    </div>
                    {risk?.flags?.length > 0 && (
                      <div className={`rounded-lg border border-current/20 p-3 ${styles.bar}`}>
                        <p className={`mb-2 flex items-center gap-1.5 text-xs font-semibold ${styles.icon}`}>
                          <AlertTriangle className="h-3 w-3" /> FLAGS
                        </p>
                        <ul className="space-y-1 text-xs text-foreground">
                          {risk.flags.map((flag: string) => (
                            <li key={flag} className="flex items-center gap-2">
                              <AlertTriangle className={`h-3 w-3 ${styles.icon}`} /> {flag}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Key Facts */}
                  <div className="rounded-xl border border-border bg-card p-5">
                    <h3 className="mb-3 text-sm font-semibold text-foreground">Key Facts Extracted</h3>
                    {caseBrief.key_facts?.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {caseBrief.key_facts.map((fact: string) => (
                          <span
                            key={fact}
                            className="inline-flex items-center rounded-md border border-border bg-secondary px-2.5 py-1.5 text-xs font-medium text-foreground"
                          >
                            {fact}
                          </span>
                        ))}
                      </div>
                    )}
                    {caseBrief.missing_information?.length > 0 && (
                      <div className="rounded-lg bg-[oklch(0.97_0.04_75)] p-3">
                        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[oklch(0.55_0.15_60)]">
                          <AlertTriangle className="h-3 w-3" /> MISSING INFORMATION
                        </p>
                        <ul className="space-y-1 text-xs text-foreground">
                          {caseBrief.missing_information.map((m: string) => (
                            <li key={m} className="flex items-center gap-2">
                              <X className="h-3 w-3 text-destructive" /> {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Formal Note */}
                  <div className="rounded-xl border border-border bg-card p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground">Formal Caseworker Note</h3>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-1 hover:text-foreground"
                        >
                          {copied ? (
                            <Check className="h-3 w-3 text-success" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          {copied ? "Copied" : "Copy"}
                        </button>
                        <button className="flex items-center gap-1 hover:text-foreground">
                          <Pencil className="h-3 w-3" /> Edit
                        </button>
                      </div>
                    </div>
                    <pre className="whitespace-pre-wrap rounded-lg bg-secondary/60 p-3 font-mono text-[11px] leading-relaxed text-foreground">
                      {caseBrief.caseworker_note}
                    </pre>
                  </div>

                  {/* Recommended Next Steps */}
                  <div className="rounded-xl border border-border bg-card p-5 xl:col-span-2">
                    <div className="mb-3 flex items-center gap-2">
                      <ListChecks className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-semibold text-foreground">Recommended Next Steps</h3>
                    </div>
                    <ol className="space-y-2.5">
                      {caseBrief.recommended_next_steps?.map((step: string, i: number) => (
                        <li key={i} className="flex gap-3 text-sm text-foreground">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Compliance Checklist */}
                  <div className="rounded-xl border border-border bg-card p-5 xl:col-span-2">
                    <div className="mb-3 flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-semibold text-foreground">Intake Compliance Checklist</h3>
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
                          <th className="py-2 text-left font-semibold">Requirement</th>
                          <th className="py-2 text-left font-semibold">Status</th>
                          <th className="py-2 text-left font-semibold">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {caseBrief.documentation_checklist?.map(
                          (row: { requirement: string; status: string; notes: string }) => (
                            <tr key={row.requirement} className="border-b border-border/60 last:border-0">
                              <td className="py-3 font-medium text-foreground">{row.requirement}</td>
                              <td className="py-3">
                                {row.status === "Complete" ? (
                                  <Check className="h-4 w-4 text-success" />
                                ) : row.status === "Missing" ? (
                                  <X className="h-4 w-4 text-destructive" />
                                ) : (
                                  <AlertTriangle className="h-4 w-4 text-[oklch(0.65_0.15_60)]" />
                                )}
                              </td>
                              <td
                                className={`py-3 ${
                                  row.status === "Complete"
                                    ? "text-muted-foreground"
                                    : "text-destructive"
                                }`}
                              >
                                {row.notes}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Confidence Notes */}
                  {caseBrief.confidence_notes?.length > 0 && (
                    <div className="rounded-xl border border-border bg-card p-5 xl:col-span-2">
                      <div className="mb-3 flex items-center gap-2">
                        <Info className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold text-foreground">Confidence Notes</h3>
                      </div>
                      <ul className="space-y-1.5">
                        {caseBrief.confidence_notes.map((note: string) => (
                          <li key={note} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <Info className="mt-0.5 h-3 w-3 shrink-0 text-primary" /> {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </AuthGuard>
  );
}
