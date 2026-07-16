"use client";

import { useMemo, useState } from "react";
import {
  CommentType,
  INSPECTION_COMMENTS,
  INSPECTION_SYSTEMS,
  REQUIRED_CLAUSES,
  TYPE_FILTERS,
  TYPE_LABELS,
} from "@/lib/inspectionComments";
import { PanelLabel } from "@/components/PanelLabel";
import { CopyButton } from "@/components/CopyButton";

export default function InspectionCommentsPage() {
  const [search, setSearch] = useState("");
  const [activeSystem, setActiveSystem] = useState("All systems");
  const [activeType, setActiveType] = useState<CommentType | "all">("all");
  const [draft, setDraft] = useState<number[]>([]);

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    return INSPECTION_COMMENTS.map((item, index) => ({ item, index })).filter(({ item }) => {
      if (activeSystem !== "All systems" && item.system !== activeSystem) return false;
      if (activeType !== "all" && item.type !== activeType) return false;
      if (q && !item.text.toLowerCase().includes(q) && !item.system.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, activeSystem, activeType]);

  function toggleDraft(index: number) {
    setDraft((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  }

  function removeFromDraft(position: number) {
    setDraft((prev) => prev.filter((_, i) => i !== position));
  }

  const clausesText = REQUIRED_CLAUSES.map((c) => c.text).join("\n\n");
  const draftText = draft.map((i) => INSPECTION_COMMENTS[i].text).join("\n\n");

  return (
    <div className="wrap">
      <header>
        <div>
          <p className="brand-eyebrow">Home Inspector SMART Board · Tool · New York State Edition</p>
          <h1>Inspection Report Comment Library</h1>
          <p className="sub">
            Built around New York&apos;s own Standards of Practice — Real Property Law Article 12-B
            and 19 NYCRR Subparts 197-4 &amp; 197-5 — not generic national guidance. Search or
            filter by system, add comments to a draft, and copy the set into your report.
          </p>
        </div>
      </header>

      <div className="fixed-tone-note" style={{ marginBottom: 22 }}>
        Comments describe what was observed and, where applicable, the home inspector&apos;s
        professional opinion on whether it is deficient, not functioning, or unsafe — as New
        York&apos;s Standards of Practice require (§197-5.3(b)) — without determining the{" "}
        <em>cause</em> of a condition or the <em>cost/method</em> of correction, which New York
        explicitly excludes from scope (§197-5.16(k)). Review against your own license number,
        pre-inspection agreement, and current NYCRR text before use.
      </div>

      <div className="script-panel" style={{ marginBottom: 22 }}>
        <div className="script-panel-head">
          <span className="script-eyebrow">Required Pre-Inspection Agreement Clauses</span>
          <span className="statute-cite">19 NYCRR §197-4.2(a)</span>
        </div>
        <p style={{ fontSize: 12.5, color: "rgba(254,254,253,0.65)", margin: "0 0 16px", lineHeight: 1.5 }}>
          New York law requires every pre-inspection agreement to include the following two
          clauses verbatim, printed in a type size of not less than six points. These belong in
          your <strong>contract</strong>, not the inspection report itself.
        </p>
        {REQUIRED_CLAUSES.map((clause) => (
          <div className="clause-block" key={clause.label}>
            <span className="clause-label">{clause.label}</span>
            {clause.text}
          </div>
        ))}
        <div className="objection-actions" style={{ display: "flex", justifyContent: "flex-end" }}>
          <CopyButton text={clausesText} variant="dark" />
        </div>
      </div>

      <div className="panel form-panel" style={{ marginBottom: 22 }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search comments… e.g. 'GFCI', 'attic', 'grade'"
          style={{ marginBottom: 16 }}
        />

        <PanelLabel>System (per 19 NYCRR Subpart 197-5)</PanelLabel>
        <div className="tone-select" style={{ marginBottom: 20 }}>
          {INSPECTION_SYSTEMS.map((sys) => (
            <div
              key={sys}
              className={`tone-chip${sys === activeSystem ? " active" : ""}`}
              onClick={() => setActiveSystem(sys)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveSystem(sys);
                }
              }}
            >
              {sys}
            </div>
          ))}
        </div>

        <PanelLabel>Comment Type</PanelLabel>
        <div className="tone-select">
          {TYPE_FILTERS.map((t) => (
            <div
              key={t.key}
              className={`tone-chip type-chip-${t.key}${t.key === activeType ? " active" : ""}`}
              onClick={() => setActiveType(t.key)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveType(t.key);
                }
              }}
            >
              {t.label}
            </div>
          ))}
        </div>
      </div>

      <div className="library-layout">
        <div>
          <p className="count-label">
            {results.length} comment{results.length === 1 ? "" : "s"}
          </p>
          {results.length === 0 ? (
            <p className="library-empty">No comments match. Try a broader search or clear a filter.</p>
          ) : (
            results.map(({ item, index }) => {
              const inDraft = draft.includes(index);
              return (
                <div className="comment-card" key={index}>
                  <div className="comment-tags">
                    <span className="comment-tag system">{item.system}</span>
                    <span className="comment-tag cite">{item.cite}</span>
                    <span className={`comment-tag type-${item.type}`}>{TYPE_LABELS[item.type]}</span>
                  </div>
                  <p>{item.text}</p>
                  <div className="comment-card-actions">
                    <button
                      className={`comment-add-btn${inDraft ? " added" : ""}`}
                      onClick={() => toggleDraft(index)}
                      type="button"
                    >
                      {inDraft ? "Added ✓" : "Add to report"}
                    </button>
                    <CopyButton text={item.text} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="draft-tray">
          <div className="draft-tray-head">
            <h3>Report draft</h3>
            <span className="draft-tray-count">{draft.length}</span>
          </div>
          <p className="draft-tray-sub">Comments you&apos;ve added, in order.</p>
          <div className="draft-list">
            {draft.length === 0 ? (
              <p className="draft-empty">Nothing added yet — click &ldquo;Add&rdquo; on any comment.</p>
            ) : (
              draft.map((index, position) => (
                <div className="draft-item" key={`${index}-${position}`}>
                  <button className="draft-item-remove" onClick={() => removeFromDraft(position)} type="button">
                    ×
                  </button>
                  <span className="comment-tag system" style={{ marginBottom: 6, display: "inline-block" }}>
                    {INSPECTION_COMMENTS[index].system}
                  </span>
                  <div>{INSPECTION_COMMENTS[index].text}</div>
                </div>
              ))
            )}
          </div>
          <div className="draft-actions">
            <CopyButton text={draftText} />
            <button className="comment-add-btn" onClick={() => setDraft([])} type="button" disabled={draft.length === 0}>
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
