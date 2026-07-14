"use client";

import { useState } from "react";
import { CATEGORY_LIST, CATEGORIES, CategoryId, MAX_TONES, TONE_OPTIONS } from "@/lib/categories";
import { FieldInput } from "@/components/FieldInput";
import { PanelLabel } from "@/components/PanelLabel";
import { ToneChips } from "@/components/ToneChips";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import { ResultCard } from "@/components/ResultCard";

const DEFAULT_TONES = ["Luxury", "Investor-focused", "Cozy & charming"];

interface Listing {
  tone: string;
  headline: string;
  body: string;
}

export default function ListingDescriptionPage() {
  const [categoryId, setCategoryId] = useState<CategoryId>("residential");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [tones, setTones] = useState<string[]>(DEFAULT_TONES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[] | null>(null);

  const category = CATEGORIES[categoryId];

  function handleCategoryChange(next: CategoryId) {
    setCategoryId(next);
    setFields({});
    setTones(DEFAULT_TONES);
    setError(null);
    setListings(null);
  }

  function handleFieldChange(key: string, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  async function handleGenerate() {
    setError(null);

    if (category.usesTonePicker && tones.length === 0) {
      setError("Pick at least one tone.");
      return;
    }

    const hasAnyDetail = Object.values(fields).some((v) => v && v.trim().length > 0);
    if (!hasAnyDetail) {
      setError("Add at least a few specs or features so the description has something to work with.");
      return;
    }

    setLoading(true);
    setListings(null);
    try {
      const res = await fetch("/api/listing-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId, fields, tones }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setListings(data.listings);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const specSummary = category.summaryKeys
    .map((key) => fields[key])
    .filter((v) => v && v.trim().length > 0)
    .join(" · ");

  return (
    <div className="wrap">
      <header>
        <div>
          <p className="brand-eyebrow">Manfred Real Estate Learning Center — Membership Plus Tool</p>
          <h1>Listing Description Generator</h1>
          <p className="sub">
            Enter the property specs once. Get MLS-ready copy in the tones your buyers respond to.
          </p>
        </div>
        <div className="rider">
          MLS-READY <b>·</b> UP TO {MAX_TONES} VARIANTS <b>·</b> COPY &amp; PASTE
        </div>
      </header>

      <div className="grid">
        <div className="panel form-panel">
          <PanelLabel>Property Category</PanelLabel>
          <div className="tone-select" style={{ marginBottom: 20 }}>
            {CATEGORY_LIST.map((c) => (
              <div
                key={c.id}
                className={`tone-chip${c.id === categoryId ? " active" : ""}`}
                onClick={() => handleCategoryChange(c.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCategoryChange(c.id);
                  }
                }}
              >
                {c.label}
              </div>
            ))}
          </div>

          <PanelLabel>Listing Specs</PanelLabel>

          {category.rows.map((row, i) =>
            row.length > 1 ? (
              <div key={i} className={row.length === 3 ? "row3" : "row2"}>
                {row.map((field) => (
                  <FieldInput
                    key={field.key}
                    field={field}
                    value={fields[field.key] ?? ""}
                    onChange={handleFieldChange}
                  />
                ))}
              </div>
            ) : (
              <FieldInput
                key={row[0].key}
                field={row[0]}
                value={fields[row[0].key] ?? ""}
                onChange={handleFieldChange}
              />
            )
          )}

          {category.usesTonePicker ? (
            <div className="field">
              <label>
                Tone <span className="hint">(pick up to {MAX_TONES} — each becomes a variant)</span>
              </label>
              <ToneChips options={[...TONE_OPTIONS]} selected={tones} onChange={setTones} max={MAX_TONES} />
            </div>
          ) : (
            <div className="field">
              <label>Tone</label>
              <p className="fixed-tone-note">
                {category.label} listings use a fixed, compliance-conscious tone rather than the tone
                picker.
              </p>
            </div>
          )}

          <button className="generate-btn" onClick={handleGenerate} disabled={loading}>
            <span className="dot" /> {loading ? "Generating…" : "Generate descriptions"}
          </button>
          {error ? <div className="error-box">{error}</div> : null}
        </div>

        <div className="panel output-panel">
          {loading ? (
            <LoadingState text="DRAFTING DESCRIPTIONS…" />
          ) : error && !listings ? (
            <EmptyState
              tone="error"
              title="Something went wrong"
              desc="Couldn't generate descriptions right now. Try again in a moment."
            />
          ) : listings ? (
            <>
              <div className="results-header">
                <PanelLabel>Generated Descriptions</PanelLabel>
                {specSummary ? (
                  <span className="spec">
                    <b>{specSummary}</b>
                  </span>
                ) : null}
              </div>
              {listings.map((listing, i) => (
                <ResultCard
                  key={i}
                  eyebrow={listing.tone || `Variant ${i + 1}`}
                  headline={listing.headline}
                  body={listing.body}
                />
              ))}
            </>
          ) : (
            <EmptyState
              title="Your descriptions will appear here"
              desc="Fill in the specs on the left, choose a tone or two, and generate — then copy straight into your MLS listing or flyer."
            />
          )}
        </div>
      </div>
    </div>
  );
}
