"use client";

import { useMemo, useState } from "react";
import {
  CHANNELS,
  REVIEW_TEMPLATES,
  ReviewTemplateType,
  TYPE_FILTERS,
  TYPE_LABELS,
} from "@/lib/reviewTemplates";
import { PanelLabel } from "@/components/PanelLabel";
import { CopyButton } from "@/components/CopyButton";

const TAG_CLASS: Record<ReviewTemplateType, string> = {
  request: "type-info",
  positive: "type-positive",
  mixed: "type-repair",
  negative: "type-safety",
};

const CHIP_CLASS: Record<ReviewTemplateType, string> = {
  request: "type-chip-info",
  positive: "type-chip-positive",
  mixed: "type-chip-repair",
  negative: "type-chip-safety",
};

export default function ReviewTemplatesPage() {
  const [search, setSearch] = useState("");
  const [activeChannel, setActiveChannel] = useState("All channels");
  const [activeType, setActiveType] = useState<ReviewTemplateType | "all">("all");
  const [draft, setDraft] = useState<number[]>([]);

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    return REVIEW_TEMPLATES.map((item, index) => ({ item, index })).filter(({ item }) => {
      if (activeChannel !== "All channels" && item.channel !== activeChannel) return false;
      if (activeType !== "all" && item.type !== activeType) return false;
      if (q && !item.text.toLowerCase().includes(q) && !item.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, activeChannel, activeType]);

  function toggleDraft(index: number) {
    setDraft((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  }

  function removeFromDraft(position: number) {
    setDraft((prev) => prev.filter((_, i) => i !== position));
  }

  const draftText = draft
    .map((i) => `${REVIEW_TEMPLATES[i].title}\n${REVIEW_TEMPLATES[i].text}`)
    .join("\n\n---\n\n");

  return (
    <div className="wrap">
      <header>
        <div>
          <p className="brand-eyebrow">Home Inspector SMART Board · Tool</p>
          <h1>Review Generation Templates</h1>
          <p className="sub">
            Ready-to-send templates for asking for reviews at the moment satisfaction is highest,
            and for responding to whatever comes back — good, mixed, or difficult.
          </p>
        </div>
      </header>

      <div className="fixed-tone-note" style={{ marginBottom: 22 }}>
        Never offer a discount, refund, or anything of value in exchange for a review — this
        violates Google&apos;s policies. Fill in bracketed placeholders like [link] or [name]
        before sending.
      </div>

      <div className="panel form-panel" style={{ marginBottom: 22 }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates… e.g. 'text', 'negative', 'follow up'"
          style={{ marginBottom: 16 }}
        />

        <PanelLabel>Channel</PanelLabel>
        <div className="tone-select" style={{ marginBottom: 20 }}>
          {CHANNELS.map((ch) => (
            <div
              key={ch}
              className={`tone-chip${ch === activeChannel ? " active" : ""}`}
              onClick={() => setActiveChannel(ch)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveChannel(ch);
                }
              }}
            >
              {ch}
            </div>
          ))}
        </div>

        <PanelLabel>Template type</PanelLabel>
        <div className="tone-select">
          {TYPE_FILTERS.map((t) => (
            <div
              key={t.key}
              className={`tone-chip${t.key === "all" ? "" : ` ${CHIP_CLASS[t.key]}`}${
                t.key === activeType ? " active" : ""
              }`}
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
            {results.length} template{results.length === 1 ? "" : "s"}
          </p>
          {results.length === 0 ? (
            <p className="library-empty">No templates match. Try a broader search or clear a filter.</p>
          ) : (
            results.map(({ item, index }) => {
              const inDraft = draft.includes(index);
              return (
                <div className="comment-card" key={index}>
                  <div className="comment-tags">
                    <span className="comment-tag system">{item.channel}</span>
                    <span className={`comment-tag ${TAG_CLASS[item.type]}`}>{TYPE_LABELS[item.type]}</span>
                  </div>
                  <p className="comment-card-title">{item.title}</p>
                  <p>{item.text}</p>
                  <div className="comment-card-actions">
                    <button
                      className={`comment-add-btn${inDraft ? " added" : ""}`}
                      onClick={() => toggleDraft(index)}
                      type="button"
                    >
                      {inDraft ? "Added ✓" : "Add"}
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
            <h3>Selected</h3>
            <span className="draft-tray-count">{draft.length}</span>
          </div>
          <p className="draft-tray-sub">Templates you&apos;ve picked, in order.</p>
          <div className="draft-list">
            {draft.length === 0 ? (
              <p className="draft-empty">Nothing added yet — click &ldquo;Add&rdquo; on any template.</p>
            ) : (
              draft.map((index, position) => (
                <div className="draft-item" key={`${index}-${position}`}>
                  <button className="draft-item-remove" onClick={() => removeFromDraft(position)} type="button">
                    ×
                  </button>
                  <strong>{REVIEW_TEMPLATES[index].title}</strong>
                  <div>{REVIEW_TEMPLATES[index].text}</div>
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
