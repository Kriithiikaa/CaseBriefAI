import { createFileRoute } from "@tanstack/react-router";
import { AuthGuard } from "@/components/AuthGuard";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, HelpCircle, Settings, Plus, Menu } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
  head: () => ({
    meta: [
      { title: "CareBrief AI — Calendar" },
      { name: "description", content: "Caseworker calendar and appointments." },
    ],
  }),
});

type CalEvent = {
  day: number; // 0-6 (Sun-Sat) within visible week
  startHour: number; // 0-23 with .5 for half-hour
  endHour: number;
  title: string;
  location?: string;
  color: "blue" | "green" | "purple" | "amber" | "rose" | "teal";
};

const colorMap: Record<CalEvent["color"], string> = {
  blue: "bg-[oklch(0.92_0.06_265)] border-l-[oklch(0.55_0.22_265)] text-[oklch(0.35_0.18_265)]",
  green: "bg-[oklch(0.92_0.07_150)] border-l-[oklch(0.55_0.18_150)] text-[oklch(0.32_0.15_150)]",
  purple: "bg-[oklch(0.93_0.06_300)] border-l-[oklch(0.55_0.2_300)] text-[oklch(0.35_0.18_300)]",
  amber: "bg-[oklch(0.94_0.08_75)] border-l-[oklch(0.65_0.18_60)] text-[oklch(0.4_0.15_60)]",
  rose: "bg-[oklch(0.93_0.07_15)] border-l-[oklch(0.6_0.2_15)] text-[oklch(0.4_0.18_15)]",
  teal: "bg-[oklch(0.92_0.06_200)] border-l-[oklch(0.55_0.15_200)] text-[oklch(0.35_0.13_200)]",
};

const events: CalEvent[] = [
  {
    day: 1,
    startHour: 9,
    endHour: 10,
    title: "Intake — Maria L.",
    location: "Office 2B",
    color: "blue",
  },
  { day: 1, startHour: 11, endHour: 12, title: "Team Standup", color: "purple" },
  {
    day: 1,
    startHour: 14,
    endHour: 15.5,
    title: "Home Visit — Johnson Family",
    location: "412 Oak St",
    color: "green",
  },
  { day: 2, startHour: 10, endHour: 11, title: "Court Hearing Prep", color: "rose" },
  { day: 2, startHour: 13, endHour: 14, title: "Lunch with Supervisor", color: "amber" },
  { day: 3, startHour: 9.5, endHour: 11, title: "Case Review — D. Patel", color: "blue" },
  { day: 3, startHour: 15, endHour: 16, title: "Phone Intake — A. Chen", color: "teal" },
  { day: 4, startHour: 8, endHour: 9, title: "Morning Briefing", color: "purple" },
  { day: 4, startHour: 12, endHour: 13, title: "Resource Coordinator Sync", color: "amber" },
  { day: 4, startHour: 14, endHour: 16, title: "Shelter Placement Calls", color: "green" },
  {
    day: 5,
    startHour: 10,
    endHour: 11.5,
    title: "Family Mediation",
    location: "Room 4",
    color: "rose",
  },
  { day: 5, startHour: 13, endHour: 14, title: "Documentation Block", color: "teal" },
  { day: 0, startHour: 11, endHour: 12, title: "On-Call Check-in", color: "blue" },
  { day: 6, startHour: 10, endHour: 12, title: "Community Outreach", color: "green" },
];

const HOURS = Array.from({ length: 13 }, (_, i) => i + 7); // 7am – 7pm
const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfWeek(d: Date) {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  r.setDate(r.getDate() - r.getDay());
  return r;
}

function CalendarPage() {
  const [cursor, setCursor] = useState(new Date());
  const weekStart = useMemo(() => startOfWeek(cursor), [cursor]);
  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        return d;
      }),
    [weekStart],
  );
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthLabel = cursor.toLocaleString("en-US", { month: "long", year: "numeric" });

  // mini-month
  const miniMonthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const miniGridStart = startOfWeek(miniMonthStart);
  const miniDays = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(miniGridStart);
    d.setDate(miniGridStart.getDate() + i);
    return d;
  });

  const HOUR_PX = 56;

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-background">
        <Sidebar />

        <main className="flex flex-1 flex-col">
          {/* Header */}
          <header className="flex items-center gap-4 border-b border-border bg-card px-6 py-3">
            <button className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary">
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[oklch(0.55_0.22_265)] text-sm font-bold text-white">
                31
              </div>
              <h1 className="text-xl text-foreground">Calendar</h1>
            </div>

            <button
              onClick={() => setCursor(new Date())}
              className="ml-4 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary"
            >
              Today
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  const d = new Date(cursor);
                  d.setDate(d.getDate() - 7);
                  setCursor(d);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  const d = new Date(cursor);
                  d.setDate(d.getDate() + 7);
                  setCursor(d);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <h2 className="text-xl font-normal text-foreground">{monthLabel}</h2>

            <div className="ml-auto flex items-center gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary">
                <Search className="h-5 w-5" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary">
                <HelpCircle className="h-5 w-5" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary">
                <Settings className="h-5 w-5" />
              </button>
              <span className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground">
                Week
              </span>
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
            {/* Left rail */}
            <aside className="w-64 shrink-0 border-r border-border bg-card p-4">
              <button className="mb-5 flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-sm hover:shadow">
                <Plus className="h-5 w-5 text-primary" /> Create
              </button>

              {/* Mini month */}
              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{monthLabel}</p>
                  <div className="flex">
                    <button
                      onClick={() => {
                        const d = new Date(cursor);
                        d.setMonth(d.getMonth() - 1);
                        setCursor(d);
                      }}
                      className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        const d = new Date(cursor);
                        d.setMonth(d.getMonth() + 1);
                        setCursor(d);
                      }}
                      className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] text-muted-foreground">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <div key={i} className="py-1">
                      {d}
                    </div>
                  ))}
                  {miniDays.map((d) => {
                    const isToday = d.getTime() === today.getTime();
                    const inMonth = d.getMonth() === cursor.getMonth();
                    const inWeek = d >= weekDays[0] && d <= weekDays[6];
                    return (
                      <button
                        key={d.toISOString()}
                        onClick={() => setCursor(new Date(d))}
                        className={`aspect-square rounded-full text-[11px] transition-colors ${
                          isToday
                            ? "bg-[oklch(0.55_0.22_265)] font-bold text-white"
                            : inWeek
                              ? "bg-secondary text-foreground"
                              : inMonth
                                ? "text-foreground hover:bg-secondary"
                                : "text-muted-foreground/60 hover:bg-secondary"
                        }`}
                      >
                        {d.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Calendars list */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  My calendars
                </p>
                <ul className="space-y-2 text-sm">
                  {[
                    { c: "bg-[oklch(0.55_0.22_265)]", l: "Caseload" },
                    { c: "bg-[oklch(0.55_0.18_150)]", l: "Home Visits" },
                    { c: "bg-[oklch(0.55_0.2_300)]", l: "Internal Meetings" },
                    { c: "bg-[oklch(0.65_0.18_60)]", l: "Personal" },
                    { c: "bg-[oklch(0.6_0.2_15)]", l: "Court / Legal" },
                  ].map((i) => (
                    <li key={i.l} className="flex items-center gap-3">
                      <span className={`h-3.5 w-3.5 rounded-sm ${i.c}`} />
                      <span className="text-foreground">{i.l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Week grid */}
            <div className="flex-1 overflow-auto">
              {/* Day headers */}
              <div className="sticky top-0 z-10 grid grid-cols-[64px_repeat(7,minmax(0,1fr))] border-b border-border bg-card">
                <div />
                {weekDays.map((d, i) => {
                  const isToday = d.getTime() === today.getTime();
                  return (
                    <div key={i} className="flex flex-col items-center justify-center py-2">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        {DAYS_SHORT[d.getDay()]}
                      </span>
                      <span
                        className={`mt-1 flex h-10 w-10 items-center justify-center rounded-full text-xl ${
                          isToday
                            ? "bg-[oklch(0.55_0.22_265)] font-semibold text-white"
                            : "text-foreground"
                        }`}
                      >
                        {d.getDate()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* All-day row */}
              <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))] border-b border-border bg-background">
                <div className="px-2 py-1 text-right text-[10px] uppercase tracking-wider text-muted-foreground">
                  All-day
                </div>
                {weekDays.map((_, i) => (
                  <div key={i} className="min-h-[28px] border-l border-border/60" />
                ))}
              </div>

              {/* Hour grid */}
              <div className="relative grid grid-cols-[64px_repeat(7,minmax(0,1fr))]">
                {/* Hour labels column */}
                <div>
                  {HOURS.map((h) => (
                    <div key={h} style={{ height: HOUR_PX }} className="relative pr-2 text-right">
                      <span className="absolute -top-2 right-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                        {h === 12 ? "12 PM" : h > 12 ? `${h - 12} PM` : `${h} AM`}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Day columns */}
                {weekDays.map((_, di) => (
                  <div key={di} className="relative border-l border-border/60">
                    {HOURS.map((h) => (
                      <div
                        key={h}
                        style={{ height: HOUR_PX }}
                        className="border-b border-border/60"
                      />
                    ))}

                    {events
                      .filter((e) => e.day === di)
                      .map((e, idx) => {
                        const top = (e.startHour - HOURS[0]) * HOUR_PX;
                        const height = (e.endHour - e.startHour) * HOUR_PX - 4;
                        if (top < 0) return null;
                        return (
                          <div
                            key={idx}
                            style={{ top, height }}
                            className={`absolute left-1 right-1 overflow-hidden rounded-md border-l-4 px-2 py-1.5 text-xs shadow-sm ${colorMap[e.color]}`}
                          >
                            <p className="truncate font-semibold">{e.title}</p>
                            {e.location && (
                              <p className="truncate text-[10px] opacity-80">{e.location}</p>
                            )}
                            <p className="text-[10px] opacity-80">
                              {formatHour(e.startHour)} – {formatHour(e.endHour)}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

function formatHour(h: number) {
  const hr = Math.floor(h);
  const min = h % 1 === 0 ? "00" : "30";
  const period = hr >= 12 ? "PM" : "AM";
  const display = hr === 0 ? 12 : hr > 12 ? hr - 12 : hr;
  return `${display}:${min} ${period}`;
}
