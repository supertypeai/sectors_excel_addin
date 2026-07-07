import { useState } from "react";
import AppShell from "./components/AppShell";
import FunctionsSection from "./components/FunctionsSection";
import DashboardSection from "./components/DashboardSection";
import ApiKeySection from "./components/ApiKeySection";

type Tab = "functions" | "dashboards" | "keys";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("functions");

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "functions" && <FunctionsSection />}
      {activeTab === "dashboards" && <DashboardSection />}
      {activeTab === "keys" && <ApiKeySection />}
    </AppShell>
  );
}
