"use client";

import { ChecklistTool } from "@/components/ChecklistTool";
import { BUSINESS_BUILDER_SECTIONS } from "@/lib/checklists/businessBuilder";

export default function BusinessBuilderChecklistPage() {
  return (
    <div className="wrap">
      <header>
        <div>
          <p className="brand-eyebrow">Home Inspector SMART Board · Tool · New York State Edition</p>
          <h1>Business Builder Checklist</h1>
          <p className="sub">
            The part school doesn&apos;t teach: setting up and running the business side of home
            inspection. Check items off as you go — your progress is saved automatically.
          </p>
        </div>
      </header>

      <ChecklistTool sections={BUSINESS_BUILDER_SECTIONS} storageKey="business-builder-checklist-state" />
    </div>
  );
}
