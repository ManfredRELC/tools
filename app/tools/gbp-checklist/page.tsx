"use client";

import { ChecklistTool } from "@/components/ChecklistTool";
import { GBP_CHECKLIST_SECTIONS } from "@/lib/checklists/gbpOptimization";

export default function GbpChecklistPage() {
  return (
    <div className="wrap">
      <header>
        <div>
          <p className="brand-eyebrow">Home Inspector SMART Board · Tool</p>
          <h1>Google Business Profile Checklist</h1>
          <p className="sub">
            For a local service business, this is usually the single highest-return thing you can
            spend an afternoon on. Work through it once, then keep the &ldquo;Ongoing
            Activity&rdquo; section as a recurring habit.
          </p>
        </div>
      </header>

      <div className="fixed-tone-note" style={{ marginBottom: 22 }}>
        Never offer money, discounts, or incentives in exchange for a review — it violates
        Google&apos;s policies and can get a profile suspended. A steady trickle of honest reviews
        over time reads as far more credible than a sudden burst.
      </div>

      <ChecklistTool sections={GBP_CHECKLIST_SECTIONS} storageKey="gbp-checklist-state" />
    </div>
  );
}
