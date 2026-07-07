import { Lock } from "lucide-react";
import { Card, CardTitle } from "./ui/card";
import sectorsLogo from "./assets/sectors_logo.svg";
import bbca_sample from "./assets/bbca_sample.svg";

export default function DashboardSection() {
  return (
    <div className="space-y-4 pb-2">
      {/* Company Dashboard — coming soon */}
      <Card className="flex flex-col overflow-hidden p-2 bg-card border-none shadow-sm opacity-60">
        <div className="flex h-50 items-center justify-center bg-stone-50 border-x border-t border-stone-200 rounded-t-lg relative">
          <img src={bbca_sample} alt="Company Dashboard preview" className="w-auto h-auto px-2 opacity-30" />
          <span className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-medium text-stone-400 bg-stone-100 border border-stone-200 rounded px-1.5 py-0.5">
            <Lock className="h-2.5 w-2.5" /> Coming Soon
          </span>
        </div>
        <div className="flex flex-col bg-white rounded-b-lg justify-center gap-1.5 px-3 py-2 border border-stone-200">
          <CardTitle className="text-xs text-left text-stone-400">Company Dashboard</CardTitle>
        </div>
      </Card>

      {/* 1% Ownership — coming soon */}
      <Card className="flex flex-col h-65 overflow-hidden p-2 bg-card border-none shadow-sm opacity-60">
        <div className="flex items-center justify-center bg-stone-50 border border-stone-200 rounded-t-lg relative" style={{ height: "80%" }}>
          <img src={sectorsLogo} alt="Sectors Logo" className="h-20 w-20 opacity-30" />
          <span className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-medium text-stone-400 bg-stone-100 border border-stone-200 rounded px-1.5 py-0.5">
            <Lock className="h-2.5 w-2.5" /> Coming Soon
          </span>
        </div>
        <div className="flex flex-col bg-white rounded-b-lg justify-center gap-1.5 px-3 py-2" style={{ height: "20%" }}>
          <CardTitle className="text-xs text-left text-stone-400">1% Ownership</CardTitle>
        </div>
      </Card>
    </div>
  );
}
