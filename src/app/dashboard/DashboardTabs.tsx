"use client";

import { useState } from "react";

export default function DashboardTabs({
  transactionsContent,
  statsContent,
}: {
  transactionsContent: React.ReactNode;
  statsContent: React.ReactNode;
}) {
  const [tab, setTab] = useState<"transactions" | "stats">("transactions");

  return (
    <div>
      <div
        className="mb-4 flex gap-1 border-b"
        style={{ borderColor: "var(--color-paper-line)" }}
      >
        <button
          onClick={() => setTab("transactions")}
          className="px-3 py-2 text-sm font-medium"
          style={{
            borderBottom:
              tab === "transactions"
                ? "2px solid var(--color-brand)"
                : "2px solid transparent",
            color: tab === "transactions" ? "var(--color-ink)" : "#8A8367",
          }}
        >
          Giao dịch
        </button>
        <button
          onClick={() => setTab("stats")}
          className="px-3 py-2 text-sm font-medium"
          style={{
            borderBottom:
              tab === "stats"
                ? "2px solid var(--color-brand)"
                : "2px solid transparent",
            color: tab === "stats" ? "var(--color-ink)" : "#8A8367",
          }}
        >
          Thống kê
        </button>
      </div>

      {tab === "transactions" ? transactionsContent : statsContent}
    </div>
  );
}
