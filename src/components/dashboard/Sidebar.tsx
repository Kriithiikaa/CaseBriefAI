import { useState } from "react";
import { Link, useLocation, useRouter } from "@tanstack/react-router";
import {
  Shield,
  LayoutGrid,
  Calendar,
  MessageSquare,
  StickyNote,
  LineChart,
  FolderOpen,
  Settings,
  LogOut,
  ChevronDown,
  PanelLeft,
  ArrowLeft,
  ArrowRight,
  RotateCw,
} from "lucide-react";
import { auth } from "@/lib/auth";

const items: {
  icon: typeof LayoutGrid;
  label: string;
  to: "/dashboard" | "/intake" | "/notes" | "/calendar" | "/cases";
  chevron?: boolean;
}[] = [
  { icon: LayoutGrid, label: "Home", to: "/dashboard" },
  { icon: FolderOpen, label: "Cases", to: "/cases" },
  { icon: MessageSquare, label: "summAIry", to: "/intake" },
  { icon: Calendar, label: "Calendar", to: "/calendar" },
  { icon: StickyNote, label: "Notes", to: "/notes" },
  { icon: LineChart, label: "Reports", to: "/dashboard", chevron: true },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const router = useRouter();

  const isActive = (label: string) => {
    if (label === "Home") return pathname === "/dashboard";
    if (label === "Cases") return pathname.startsWith("/cases");
    if (label === "Calendar") return pathname.startsWith("/calendar");
    if (label === "summAIry") return pathname.startsWith("/intake");
    if (label === "Notes") return pathname.startsWith("/notes");
    return false;
  };

  const handleLogout = () => {
    auth.logout();
    router.navigate({ to: "/login" });
  };

  return (
    <aside
      className={`flex flex-col border-r border-border bg-card py-4 transition-[width] duration-200 ${
        collapsed ? "w-16 px-2" : "w-64 px-4"
      }`}
    >
      {/* Top toolbar: collapse + nav arrows */}
      <div
        className={`mb-6 flex items-center gap-1 text-muted-foreground ${
          collapsed ? "flex-col" : ""
        }`}
      >
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-secondary hover:text-foreground"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
        {!collapsed && (
          <>
            <button
              onClick={() => router.history.back()}
              aria-label="Back"
              className="ml-2 flex h-7 w-7 items-center justify-center rounded-md hover:bg-secondary hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => router.history.forward()}
              aria-label="Forward"
              className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-secondary hover:text-foreground"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => router.invalidate()}
              aria-label="Reload"
              className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-secondary hover:text-foreground"
            >
              <RotateCw className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      <div className={`mb-8 flex items-center gap-2 ${collapsed ? "justify-center px-0" : "px-2"}`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground">
          <Shield className="h-5 w-5 text-background" fill="currentColor" />
        </div>
        {!collapsed && <span className="text-lg font-semibold text-foreground">CareSync</span>}
      </div>

      <nav className="flex-1 space-y-1">
        {items.map(({ icon: Icon, label, to, chevron }) => {
          const active = isActive(label);
          return (
            <Link
              key={label}
              to={to}
              title={collapsed ? label : undefined}
              className={`flex w-full items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                collapsed ? "justify-center px-0" : "px-3"
              } ${
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{label}</span>
                  {chevron && <ChevronDown className="h-4 w-4" />}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-border pt-4">
        <button
          title={collapsed ? "Settings" : undefined}
          className={`flex w-full items-center gap-3 rounded-lg py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground ${
            collapsed ? "justify-center px-0" : "px-3"
          }`}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!collapsed && "Settings"}
        </button>
        <button
          onClick={handleLogout}
          title={collapsed ? "Log Out" : undefined}
          className={`flex w-full items-center gap-3 rounded-lg py-2.5 text-sm font-medium text-destructive hover:bg-danger-soft ${
            collapsed ? "justify-center px-0" : "px-3"
          }`}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && "Log Out"}
        </button>
      </div>
    </aside>
  );
}
