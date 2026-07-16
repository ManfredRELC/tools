"use client";

import { useState } from "react";
import {
  NOTES_FIELD,
  REPORT_SEVERITY_OPTIONS,
  REPORT_SYSTEM_OPTIONS,
  REPORT_TYPE_LABEL,
  ReportNarrativeResult,
} from "@/lib/reportAssistantFields";
import { FieldInput } from "@/components/FieldInput";
import { PanelLabel } from "@/components/PanelLabel";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import { CopyButton } from "@/components/CopyButton";

export default function ReportAssistantPage() {
  const [notes, setNotes] = useState("");
  const [systemHint, setSystemHint] = useState("auto");
  const [severityHint, setSeverityHint] = useState("auto");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReportNarrativeResult | null>(null);
  const [draft, setDraft] = useState<ReportNarrativeResult[]>([]);
  const [added, setAdded] = useState(false);

  async function handleGenerate() {
    setError(null);

    if (!notes.trim()) {
      setError("Enter some field notes first.");
      return;
    }

    setLoading(true);
    setResult(null);
    setAdded(false);
    try {
      const res = await fetch("/api/report-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, systemHint, severityHint }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setResult(data);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleAddToReport() {
    if (!result) return;
    setDraft((prev) => [...prev, result]);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function removeFromDraft(position: number) {
    setDraft((prev) => prev.filter((_, i) => i !== position));
  }

  const draftText = draft.map((item) => item.narrative).join("\n\n");

  return (
    <div className="wrap">
      <header>
        <div>
          <p className="brand-eyebrow">Home Inspector SMART Board · Tool · New York State Edition</p>
          <h1>AI Report Assistant</h1>
          <p className="sub">
            Turn rough field notes into a clean, report-ready narrative — automatically checked
            against New York&apos;s Standards of Practice (19 NYCRR Subparts 197-4 &amp; 197-5) as
            it writes.
          </p>
        </div>
      </header>

      <div className="fixed-tone-note" style={{ marginBottom: 22 }}>
        This assistant will not state the cause of a condition, estimate repair cost or method,
        predict remaining life expectancy, or judge code compliance or market value — all excluded
        from a New York home inspector&apos;s scope under §197-5.16(k) and §197-4.4. If your notes
        include any of that, it will leave it out of the narrative and explain what it adjusted and
        why. Always review the output yourself before it goes in a report.
      </div>

      <div className="panel form-panel" style={{ marginBottom: 20 }}>
        <PanelLabel>Your Field Notes</PanelLabel>
        <FieldInput field={NOTES_FIELD} value={notes} onChange={(_key, value) => setNotes(value)} />

        <div className="row2">
          <div className="field">
            <label>System</label>
            <select value={systemHint} onChange={(e) => setSystemHint(e.target.value)}>
              {REPORT_SYSTEM_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>
              Severity <span className="hint">optional hint</span>
            </label>
            <select value={severityHint} onChange={(e) => setSeverityHint(e.target.value)}>
              {REPORT_SEVERITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="generate-btn" onClick={handleGenerate} disabled={loading}>
          <span className="dot" /> {loading ? "Writing…" : "Generate narrative"}
        </button>
        {error ? <div className="error-box">{error}</div> : null}
      </div>

      <div className="panel output-panel" style={{ marginBottom: 20 }}>
        {loading ? (
          <LoadingState text="DRAFTING A COMPLIANT NARRATIVE…" />
        ) : error && !result ? (
          <EmptyState
            tone="error"
            title="Something went wrong"
            desc="Could not generate the narrative right now. Try again in a moment."
          />
        ) : result ? (
          <>
            <div className="comment-tags">
              <span className="comment-tag system">{result.system}</span>
              <span className="comment-tag cite">{result.citation}</span>
              <span className={`comment-tag type-${result.severity}`}>
                {REPORT_TYPE_LABEL[result.severity]}
              </span>
            </div>
            <p className="objection-response">{result.narrative}</p>
            {result.adjustments.length > 0 ? (
              <div className="adjustments-block">
                <span className="adjustments-label">⚑ Compliance adjustments</span>
                <ul>
                  {result.adjustments.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="no-adjustments">
                No compliance adjustments needed — nothing in your notes fell outside NY&apos;s
                Standards of Practice.
              </p>
            )}
            <div className="objection-actions" style={{ display: "flex", gap: 8 }}>
              <CopyButton text={result.narrative} />
              <button className={`comment-add-btn${added ? " added" : ""}`} onClick={handleAddToReport} type="button">
                {added ? "Added ✓" : "Add to report"}
              </button>
            </div>
          </>
        ) : (
          <EmptyState
            title="Your report-ready narrative will appear here"
            desc="Enter field notes, optionally hint the system or severity, and generate."
          />
        )}
      </div>

      <div className="draft-tray" style={{ position: "static" }}>
        <div className="draft-tray-head">
          <h3>Report draft</h3>
          <span className="draft-tray-count">{draft.length}</span>
        </div>
        <p className="draft-tray-sub">Narratives you&apos;ve added, in order.</p>
        <div className="draft-list">
          {draft.length === 0 ? (
            <p className="draft-empty">
              Nothing added yet — generate a narrative, then click &ldquo;Add to report.&rdquo;
            </p>
          ) : (
            draft.map((item, position) => (
              <div className="draft-item" key={position}>
                <button className="draft-item-remove" onClick={() => removeFromDraft(position)} type="button">
                  ×
                </button>
                <div className="comment-tags" style={{ marginBottom: 8 }}>
                  <span className="comment-tag system">{item.system}</span>
                  <span className={`comment-tag type-${item.severity}`}>{REPORT_TYPE_LABEL[item.severity]}</span>
                </div>
                {item.narrative}
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
  );
}
