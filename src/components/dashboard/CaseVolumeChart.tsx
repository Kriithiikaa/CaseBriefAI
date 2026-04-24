import { ChevronDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = Array.from({ length: 18 }, (_, i) => ({
  day: `Apr ${i + 1}`,
  housing: 20 + Math.round(Math.random() * 20),
  health: 18 + Math.round(Math.random() * 22),
  childcare: 15 + Math.round(Math.random() * 18),
  support: 18 + Math.round(Math.random() * 15),
}));

const legend = [
  { key: "housing", label: "Housing Assistance", color: "var(--chart-housing)" },
  { key: "health", label: "Health", color: "var(--chart-health)" },
  { key: "childcare", label: "Child Care", color: "var(--chart-childcare)" },
  { key: "support", label: "Support", color: "var(--chart-support)" },
];

export function CaseVolumeChart() {
  return (
    <div className="rounded-3xl bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Case Volume Trends</h2>
        <button className="flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground">
          Apr 2026 <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="20%" barGap={2}>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
              ticks={[0, 20, 40, 60, 80]}
              domain={[0, 80]}
            />
            {legend.map((l) => (
              <Bar key={l.key} dataKey={l.key} fill={l.color} radius={[2, 2, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-6">
        {legend.map((l) => (
          <div key={l.key} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}
