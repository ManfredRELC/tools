"use client";

import { useState } from "react";
import { CONTACT_METHODS, ContactMethod, OUTREACH_TONES, OutreachTone, getOutreachFields } from "@/lib/outreachFields";
import { LEAD_TYPES, LeadType } from "@/lib/leadTypes";
import { FieldInput } from "@/components/FieldInput";
import { PanelLabel } from "@/components/PanelLabel";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import { CopyButton } from "@/components/CopyButton";

export default function OutreachScriptPage() {
  const [leadType, setLeadType] = useState<LeadType>(LEAD_TYPES[0]);
  const [method, setMethod] = useState<ContactMethod>(CONTACT_METHODS[0]);
  const [tone, setTone] = useState<OutreachTone>(OUTREACH_TONES[0]);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [script, setScript] = useState<string | null>(null);

  const outreachFields = getOutreachFields(leadType);

  function handleFieldChange(key: string, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  async function handleGenerate() {
    setError(null);

    const hasAnyDetail = Object.values(fields).some((v) => v && v.trim().length > 0);
    if (!hasAnyDetail) {
      setError("Add at least a few details so the script has something to work with.");
      return;
    }

    setLoading(true);
    setScript(null);
    try {
      const res = await fetch("/api/outreach-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, tone, leadType, fields }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setScript(data.script);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="wrap">
      <header>
        <div>
          <p className="brand-eyebrow">Manfred Real Estate Learning Center — Membership Plus Tool</p>
          <h1>FSBO &amp; Expired Listing Outreach Script Generator</h1>
          <p className="sub">
            Build a natural-sounding call, text, door-knock, or email script for a specific FSBO or
            expired-listing lead.
          </p>
        </div>
        <div className="rider">
          CALL <b>·</b> TEXT <b>·</b> DOOR KNOCK <b>·</b> EMAIL
        </div>
      </header>

      <div className="grid">
        <div className="panel form-panel">
          <PanelLabel>Lead Type</PanelLabel>
          <div className="tone-select" style={{ marginBottom: 20 }}>
            {LEAD_TYPES.map((lt) => (
              <div
                key={lt}
                className={`tone-chip${lt === leadType ? " active" : ""}`}
                onClick={() => setLeadType(lt)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setLeadType(lt);
                  }
                }}
              >
                {lt}
              </div>
            ))}
          </div>

          <PanelLabel>Contact Method</PanelLabel>
          <div className="tone-select" style={{ marginBottom: 20 }}>
            {CONTACT_METHODS.map((m) => (
              <div
                key={m}
                className={`tone-chip${m === method ? " active" : ""}`}
                onClick={() => setMethod(m)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setMethod(m);
                  }
                }}
              >
                {m}
              </div>
            ))}
          </div>

          <PanelLabel>Lead Details</PanelLabel>

          <div className="row2">
            <FieldInput
              field={outreachFields[0]}
              value={fields[outreachFields[0].key] ?? ""}
              onChange={handleFieldChange}
            />
            <FieldInput
              field={outreachFields[1]}
              value={fields[outreachFields[1].key] ?? ""}
              onChange={handleFieldChange}
            />
          </div>
          <div className="row2">
            <FieldInput
              field={outreachFields[2]}
              value={fields[outreachFields[2].key] ?? ""}
              onChange={handleFieldChange}
            />
            <FieldInput
              field={outreachFields[3]}
              value={fields[outreachFields[3].key] ?? ""}
              onChange={handleFieldChange}
            />
          </div>
          <FieldInput
            field={outreachFields[4]}
            value={fields[outreachFields[4].key] ?? ""}
            onChange={handleFieldChange}
          />

          <div className="field">
            <label>Tone</label>
            <div className="tone-select">
              {OUTREACH_TONES.map((t) => (
                <div
                  key={t}
                  className={`tone-chip${t === tone ? " active" : ""}`}
                  onClick={() => setTone(t)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setTone(t);
                    }
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          <button className="generate-btn" onClick={handleGenerate} disabled={loading}>
            <span className="dot" /> {loading ? "Generating…" : "Generate script"}
          </button>
          {error ? <div className="error-box">{error}</div> : null}
        </div>

        <div className="panel output-panel">
          {loading ? (
            <LoadingState text="DRAFTING SCRIPT…" />
          ) : error && !script ? (
            <EmptyState
              tone="error"
              title="Something went wrong"
              desc="Could not generate a script right now. Try again in a moment."
            />
          ) : script ? (
            <div className="script-panel">
              <div className="script-panel-head">
                <span className="script-eyebrow">{method} Script</span>
                <CopyButton text={script} variant="dark" />
              </div>
              <p className="script-body">{script}</p>
            </div>
          ) : (
            <EmptyState
              title="Your script will appear here"
              desc="Fill in what you know about the lead, pick a contact method and tone, and generate — then copy straight into your outreach."
            />
          )}
        </div>
      </div>
    </div>
  );
}
