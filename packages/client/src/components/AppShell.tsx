import React from "react";
import { BookOpen, Globe, Mail, FunctionSquare, LayoutDashboard, KeyRound } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import MadeBySupertype from "./commons/MadeBySupertype";

type Tab = "functions" | "dashboards" | "keys";

interface AppShellProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  children: React.ReactNode;
}

const tabs: { id: Tab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: "functions", label: "Functions", icon: FunctionSquare },
  { id: "dashboards", label: "Dashboards", icon: LayoutDashboard },
  { id: "keys", label: "API Key", icon: KeyRound },
];

export default function AppShell({ activeTab, onTabChange, children }: AppShellProps) {
  return (
    <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
      {/* ── Tab Navigation ── */}
      <nav className="w-full">
        <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as Tab)}>
          <TabsList className="w-full gap-0 border-none">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="cursor-pointer">
                {/*<tab.icon className="w-3.5 h-3.5" />*/}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </nav>

      {/* ── Content + Footer ── */}
      <main className="flex-1 overflow-y-auto no-visible-scrollbar">
        <div className="flex flex-col min-h-full">
          <div className="flex-1">{children}</div>
        <footer className="px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <MadeBySupertype />
            <div className="flex items-center gap-4">
              <a
                href="https://docs.sectors.app"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="API Documentation"
              >
                <BookOpen className="w-4 h-4" />
              </a>
              <a
                href="https://sectors.app"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Sectors Website"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="mailto:help@sectors.app"
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Email Support"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </footer>
        </div>
      </main>
    </div>
  );
}
