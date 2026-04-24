import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Plus, Search, SlidersHorizontal } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { CaseMetrics } from "@/components/dashboard/CaseMetrics";
import { CaseVolumeChart } from "@/components/dashboard/CaseVolumeChart";
import { Appointments } from "@/components/dashboard/Appointments";
import { AuthGuard } from "@/components/AuthGuard";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "CareSync — Overview" },
      { name: "description", content: "CareSync social work case management dashboard." },
    ],
  }),
});

const tabs = ["All Cases", "Housing", "Health", "Child Care", "Violence", "Support", "Disability", "Behavioural"];

function DashboardPage() {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-background">
        <Sidebar />

        <main className="flex-1 px-8 py-6">
          <header className="mb-6 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Overview</h1>
                <p className="mt-1 text-sm text-muted-foreground">Friday, April 24, 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-secondary">
                <Bell className="h-4 w-4" />
              </button>
              <img
                src="https://i.pravatar.cc/80?img=47"
                alt="Profile"
                className="h-10 w-10 rounded-full border-2 border-primary object-cover"
              />
            </div>
          </header>

          <div className="mb-5 flex items-center gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-full bg-card px-4 py-3 shadow-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search cases, clients..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>
            <Link
              to="/intake"
              className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90"
            >
              <Plus className="h-4 w-4" /> New Case
            </Link>
          </div>

          <div className="mb-6 flex items-center gap-2">
            {tabs.map((t, i) => (
              <button
                key={t}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  i === 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground hover:bg-secondary"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <CaseMetrics />
              <CaseVolumeChart />
            </div>
            <Appointments />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
