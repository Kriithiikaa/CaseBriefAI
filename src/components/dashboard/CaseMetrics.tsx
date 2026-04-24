import { Folder, AlertTriangle, ChevronDown, ArrowRight } from "lucide-react";

const avatars = [
  "https://i.pravatar.cc/80?img=47",
  "https://i.pravatar.cc/80?img=15",
  "https://i.pravatar.cc/80?img=12",
  "https://i.pravatar.cc/80?img=32",
  "https://i.pravatar.cc/80?img=49",
];

function MetricCard({
  icon: Icon,
  label,
  value,
  delta,
  positive,
}: {
  icon: typeof Folder;
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-secondary/60 p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-4xl font-bold tracking-tight text-foreground">{value}</div>
          <div className="mt-1 text-xs text-muted-foreground">vs last month</div>
        </div>
        <span
          className={`rounded-md px-2 py-1 text-xs font-semibold ${
            positive ? "bg-success-soft text-success" : "bg-danger-soft text-destructive"
          }`}
        >
          {positive ? "↑" : "↓"} {delta}
        </span>
      </div>
    </div>
  );
}

export function CaseMetrics() {
  return (
    <div className="rounded-3xl bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Case Metrics</h2>
        <button className="flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground">
          Last 30 days <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MetricCard icon={Folder} label="Processed Cases" value="1,293" delta="12.5%" />
        <MetricCard icon={AlertTriangle} label="High-Risk Cases" value="48" delta="4.2%" positive />
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <div className="mb-1 text-sm font-semibold text-foreground">Team Activity</div>
        <div className="mb-3 text-xs text-muted-foreground">Social workers active today.</div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {avatars.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="h-9 w-9 rounded-full border-2 border-card object-cover"
              />
            ))}
          </div>
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-secondary">
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
