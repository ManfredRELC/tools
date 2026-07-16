"use client";

import { useMemo, useState } from "react";
import {
  RELATIONSHIP_TEMPLATES,
  RelationshipTemplateType,
  TYPE_FILTERS,
  TYPE_LABELS,
} from "@/lib/relationshipTemplates";
import { FieldInput } from "@/components/FieldInput";
import { PanelLabel } from "@/components/PanelLabel";
import { CopyButton } from "@/components/CopyButton";

const NOTES_FIELD = {
  key: "notes",
  label: "Tell us about yourself",
  type: "textarea" as const,
  placeholder:
    "e.g. 5 years experience, licensed NY home inspector, background in construction, based in the Hudson Valley, known for being thorough and easy to reach on weekends",
};

const LENGTH_FIELD = {
  key: "length",
  label: "Length",
  type: "text" as const,
  placeholder: "e.g. 2 sentences, or 1 paragraph",
};

const USE_FIELD = {
  key: "useCase",
  label: "Use case",
  type: "text" as const,
  placeholder: "e.g. website, GBP, agent flyer",
};

export default function AgentBrokerKitPage() {
  const [notes, setNotes] = useState("");
  const [length, setLength] = useState("2-3 sentences");
  const [useCase, setUseCase] = useState("website / agent flyer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<RelationshipTemplateType | "all">("all");

  async function handleGenerate() {
    setError(null);

    if (!notes.trim()) {
      setError("Add a few details about yourself first.");
      return;
    }

    setLoading(true);
    setBio(null);
    try {
      const res = await fetch("/api/inspector-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, length, useCase }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setBio(data.bio);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    return RELATIONSHIP_TEMPLATES.filter((item) => {
      if (activeType !== "all" && item.type !== activeType) return false;
      if (q && !item.text.toLowerCase().includes(q) && !item.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, activeType]);

  return (
    <div className="wrap">
      <header>
        <div>
          <p className="brand-eyebrow">Home Inspector SMART Board · Tool</p>
          <h1>Agent &amp; Broker Relationship Kit</h1>
          <p className="sub">
            A bio generator plus ready-to-use templates for building the referral relationships
            that keep a book of business full.
          </p>
        </div>
      </header>

      <div className="panel form-panel" style={{ marginBottom: 22 }}>
        <PanelLabel>Bio &amp; Value-Prop Generator</PanelLabel>
        <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 14px" }}>
          Describe yourself in a sentence or two — the assistant will turn it into a polished bio
          for your website, Google Business Profile, or a one-pager for agents.
        </p>

        <FieldInput field={NOTES_FIELD} value={notes} onChange={(_key, value) => setNotes(value)} />

        <div className="row2">
          <FieldInput field={LENGTH_FIELD} value={length} onChange={(_key, value) => setLength(value)} />
          <FieldInput field={USE_FIELD} value={useCase} onChange={(_key, value) => setUseCase(value)} />
        </div>

        <button className="generate-btn" onClick={handleGenerate} disabled={loading}>
          <span className="dot" /> {loading ? "Writing…" : "Generate bio"}
        </button>
        {error ? <div className="error-box">{error}</div> : null}

        {bio ? (
          <div className="bio-output">
            <p>{bio}</p>
            <CopyButton text={bio} />
          </div>
        ) : null}
      </div>

      <div className="panel form-panel" style={{ marginBottom: 22 }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates… e.g. 'thank you', 'lunch and learn'"
          style={{ marginBottom: 16 }}
        />

        <PanelLabel>Category</PanelLabel>
        <div className="tone-select">
          {TYPE_FILTERS.map((t) => (
            <div
              key={t.key}
              className={`tone-chip${t.key === activeType ? " active" : ""}`}
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

      <p className="count-label">
        {results.length} template{results.length === 1 ? "" : "s"}
      </p>
      {results.length === 0 ? (
        <p className="library-empty">No templates match. Try a broader search or clear a filter.</p>
      ) : (
        results.map((item, index) => (
          <div className="comment-card" key={index}>
            <div className="comment-tags">
              <span className="comment-tag cite">{TYPE_LABELS[item.type]}</span>
            </div>
            <p className="comment-card-title">{item.title}</p>
            <p>{item.text}</p>
            <div className="comment-card-actions">
              <CopyButton text={item.text} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
