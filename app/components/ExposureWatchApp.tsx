"use client";

import { useState } from "react";
import ToolTabs, { TabId } from "./ToolTabs";
import EmailBreachPanel from "./EmailBreachPanel";
import PasswordCheckPanel from "./PasswordCheckPanel";
import IPReputationPanel from "./IPReputationPanel";
import CrossPromoFooter from "./CrossPromoFooter";

export default function ExposureWatchApp() {
  const [activeTab, setActiveTab] = useState<TabId>("email");

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-8 sm:py-12">
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <span className="icon-3d">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </span>
          <h1 className="text-xl font-bold text-foreground">Exposure Watch</h1>
        </div>
        <p className="mt-2 text-sm text-muted">
          Find out what the internet already knows about you - free, instant,
          no signup.
        </p>
      </header>

      <ToolTabs active={activeTab} onChange={setActiveTab} />

      <div className="mt-4">
        {activeTab === "email" && <EmailBreachPanel />}
        {activeTab === "password" && <PasswordCheckPanel />}
        {activeTab === "ip" && <IPReputationPanel />}
      </div>

      <CrossPromoFooter />
    </main>
  );
}
