"use client";

import { useState } from "react";
import { COMMON_OBJECTIONS, OBJECTION_TONES, ObjectionTone } from "@/lib/objectionFields";
import { FieldInput } from "@/components/FieldInput";
import { PanelLabel } from "@/components/PanelLabel";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import { CopyButton } from "@/components/CopyButton";

const OBJECTION_FIELD = {
  key: "objection",
  label: "What did the seller say?",
  type: "textarea" as const,
  placeholder:
    'e.g. "We don\'t want to pay a commission — we can sell it ourselves and keep the difference."',
};

const AGENT_NAME_FIELD = {
  key: "agentName",
  label: "Your name",
  hint: "optional",
  type: "text" as const,
  placeholder: "e.g. Sarah",
};

interface ObjectionResult {
  response: string;
  why_it_works: string;
}

export default function ObjectionResponsePage() {
  const [objection, setObjection] = useState("");
  const [agentName, setAgentName] = useState("");
  const [tone, setTone] = useState<ObjectionTone>(OBJECTION_TONES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ObjectionResult | null>(null);

  async function handleGenerate() {
    setError(null);

    if (!objection.trim()) {
      setError("Enter or select an objection first.");
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/objection-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tone, objection, agentName }),
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

  return (
    <div className="wrap">
      <header>
        <div>
          <p className="brand-eyebrow">Manfred Real Estate Learning Center — Membership Plus Tool</p>
          <h1>Objection Response Assistant</h1>
          <p className="sub">
            Type or pick the objection a FSBO seller gave you. Choose a tone. Get a natural,
            ready-to-say response — plus a quick note on why it works.
          </p>
        </div>
        <div className="rider">
          EMPATHETIC <b>·</b> DIRECT <b>·</b> DATA-DRIVEN
        </div>
      </header>

      <div className="panel form-panel" style={{ marginBottom: 20 }}>
        <PanelLabel>Common Objections</PanelLabel>
        <div className="tone-select" style={{ marginBottom: 20 }}>
          {COMMON_OBJECTIONS.map((text) => (
            <div
              key={text}
              className="tone-chip"
              onClick={() => setObjection(text)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setObjection(text);
                }
              }}
            >
              {text}
            </div>
          ))}
        </div>

        <FieldInput field={OBJECTION_FIELD} value={objection} onChange={(_key, value) => setObjection(value)} />

        <div className="row2">
          <div className="field">
            <label>Tone</label>
            <div className="tone-select">
              {OBJECTION_TONES.map((t) => (
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
          <FieldInput field={AGENT_NAME_FIELD} value={agentName} onChange={(_key, value) => setAgentName(value)} />
        </div>

        <button className="generate-btn" onClick={handleGenerate} disabled={loading}>
          <span className="dot" /> {loading ? "Generating…" : "Generate response"}
        </button>
        {error ? <div className="error-box">{error}</div> : null}
      </div>

      <div className="panel output-panel">
        {loading ? (
          <LoadingState text="THINKING THROUGH THE BEST RESPONSE…" />
        ) : error && !result ? (
          <EmptyState
            tone="error"
            title="Something went wrong"
            desc="Could not generate a response right now. Try again in a moment."
          />
        ) : result ? (
          <>
            <p className="objection-response">&ldquo;{result.response}&rdquo;</p>
            <div className="objection-why">
              <b>Why it works</b>
              <br />
              {result.why_it_works}
            </div>
            <div className="objection-actions">
              <CopyButton text={result.response} />
            </div>
          </>
        ) : (
          <EmptyState title="Your response will appear here" desc="Pick or type an objection, choose a tone, and generate." />
        )}
      </div>
    </div>
  );
}
