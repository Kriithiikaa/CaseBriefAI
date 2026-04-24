import { Users, Phone, Home, Video } from "lucide-react";

const appointments = [
  { icon: Users, title: "Family Eval - Smith", sub: "In person · Room 302", time: "10:00 AM", status: "Confirmed", tone: "success", bg: "bg-accent text-accent-foreground" },
  { icon: Phone, title: "Intake Call - J. Doe", sub: "Phone Call", time: "1:30 PM", status: "Pending", tone: "warn", bg: "bg-secondary text-foreground" },
  { icon: Home, title: "Home Visit - Miller", sub: "Offsite", time: "3:15 PM", status: "Confirmed", tone: "success", bg: "bg-orange-100 text-orange-700" },
  { icon: Video, title: "Review - Johnson", sub: "Video Call", time: "4:30 PM", status: "Confirmed", tone: "success", bg: "bg-accent text-accent-foreground" },
];

export function Appointments() {
  return (
    <div className="rounded-3xl bg-card p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-foreground">Upcoming Appointments</h2>

      <div className="space-y-4">
        {appointments.map((a) => (
          <div key={a.title} className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${a.bg}`}>
              <a.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="truncate text-sm font-semibold text-foreground">{a.title}</div>
              <div className="truncate text-xs text-muted-foreground">{a.sub}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-foreground">{a.time}</div>
              <div
                className={`mt-0.5 text-xs font-medium ${
                  a.tone === "success" ? "text-success" : "text-orange-600"
                }`}
              >
                {a.status}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-6 w-full rounded-xl border border-border py-2.5 text-sm font-medium text-foreground hover:bg-secondary">
        View Full Calendar
      </button>
    </div>
  );
}
