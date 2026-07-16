"use client";

import { useEffect, useState } from "react";
import { ChecklistSection } from "@/lib/checklists/types";

export function ChecklistTool({
  sections,
  storageKey,
}: {
  sections: ChecklistSection[];
  storageKey: string;
}) {
  const [state, setState] = useState<Record<string, boolean>>({});
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setState(JSON.parse(raw));
    } catch {
      // localStorage unavailable; checklist still works for this session
    }
    setLoaded(true);
  }, [storageKey]);

  function toggle(key: string) {
    setState((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  function toggleSection(id: string) {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  let totalItems = 0;
  let totalDone = 0;
  sections.forEach((section) => {
    totalItems += section.items.length;
    totalDone += section.items.filter((_, i) => state[`${section.id}-${i}`]).length;
  });
  const pct = totalItems ? Math.round((totalDone / totalItems) * 100) : 0;
  const circumference = 150.8;
  const offset = circumference - (pct / 100) * circumference;

  if (!loaded) {
    return <p className="loading-text">Loading your saved progress…</p>;
  }

  return (
    <>
      <div className="checklist-overall">
        <div className="checklist-ring">
          <svg width="56" height="56">
            <circle className="bg" cx="28" cy="28" r="24" fill="none" strokeWidth="5" />
            <circle
              className="fg"
              cx="28"
              cy="28"
              r="24"
              fill="none"
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="pct">{pct}%</div>
        </div>
        <div className="checklist-overall-text">
          <div className="t1">
            {totalDone} of {totalItems} complete
          </div>
          <div className="t2">Across all {sections.length} sections below</div>
        </div>
      </div>

      {sections.map((section) => {
        const doneCount = section.items.filter((_, i) => state[`${section.id}-${i}`]).length;
        const isCollapsed = !!collapsed[section.id];
        return (
          <div className="checklist-section" key={section.id}>
            <div className="checklist-section-head" onClick={() => toggleSection(section.id)}>
              <div>
                <h2>{section.title}</h2>
                <div className="checklist-section-sub">{section.sub}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="checklist-section-progress">
                  {doneCount}/{section.items.length}
                </span>
                <span className={`checklist-chevron${isCollapsed ? " collapsed" : ""}`}>▾</span>
              </div>
            </div>
            {!isCollapsed && (
              <div className="checklist-section-body">
                {section.items.map((text, i) => {
                  const key = `${section.id}-${i}`;
                  const checked = !!state[key];
                  return (
                    <div
                      className={`checklist-item${checked ? " checked" : ""}`}
                      key={key}
                      onClick={() => toggle(key)}
                      role="checkbox"
                      aria-checked={checked}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggle(key);
                        }
                      }}
                    >
                      <div className="checklist-checkbox">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path
                            d="M5 13l4 4L19 7"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="checklist-item-text">{text}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
