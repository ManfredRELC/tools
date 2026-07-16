"use client";

import { useState } from "react";
import { Field } from "@/components/Field";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import { ParcelSearchResult } from "@/lib/parcelSearch/types";

export default function ParcelSearchPage() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ParcelSearchResult | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  async function handleSearch() {
    setError(null);

    if (!address.trim()) {
      setError("Enter an address first.");
      return;
    }

    setLoading(true);
    setResult(null);
    setShowRaw(false);
    try {
      const res = await fetch("/api/parcel-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
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
          <p className="brand-eyebrow">Appraiser SMART Board · Tool</p>
          <h1>Parcel Search</h1>
          <p className="sub">
            Pulls lot and tax record data straight from the public source that actually covers the
            address: NYC&apos;s PLUTO dataset for the five boroughs, or New York State&apos;s
            public tax parcel service for counties that share data statewide.
          </p>
        </div>
      </header>

      <div className="fixed-tone-note" style={{ marginBottom: 22 }}>
        This is a convenience lookup, not a system of record. Not every county shares parcel data
        through the statewide public dataset, so a &ldquo;no record found&rdquo; result doesn&apos;t
        necessarily mean the parcel doesn&apos;t exist. Verify against your county assessor&apos;s
        office or the NYS Office of Real Property Tax Services before relying on any figure here.
      </div>

      <div className="panel form-panel" style={{ marginBottom: 22 }}>
        <Field label="Property address">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 123 Main St, Albany, NY 12207"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </Field>
        <button className="generate-btn" onClick={handleSearch} disabled={loading}>
          <span className="dot" /> {loading ? "Searching…" : "Search parcel data"}
        </button>
        {error ? <div className="error-box">{error}</div> : null}
      </div>

      <div className="panel output-panel">
        {loading ? (
          <LoadingState text="LOOKING UP PARCEL AND TAX DATA…" />
        ) : error && !result ? (
          <EmptyState tone="error" title="Something went wrong" desc="Could not complete the search right now. Try again in a moment." />
        ) : result ? (
          <>
            <p className="property-matched-address">Matched: {result.census.matchedAddress}</p>

            {result.parcelError ? (
              <EmptyState tone="error" title="Parcel data unavailable" desc={result.parcelError} />
            ) : result.parcel ? (
              <>
                <p className="rate-card-group-title" style={{ marginTop: 0 }}>
                  {result.parcel.sourceName}
                </p>
                {result.parcel.fields.map((f, i) => (
                  <div className="fee-line" key={i}>
                    <span className="label">{f.label}</span>
                    <span className="amount">{f.value}</span>
                  </div>
                ))}

                <button className="comment-add-btn" onClick={() => setShowRaw((v) => !v)} type="button" style={{ marginTop: 16 }}>
                  {showRaw ? "Hide" : "Show"} all raw fields returned
                </button>

                {showRaw ? (
                  <div className="fee-breakdown">
                    {Object.entries(result.parcel.rawAttributes).map(([key, value]) => (
                      <div className="fee-line" key={key}>
                        <span className="label">{key}</span>
                        <span className="amount">{value === null || value === undefined ? "—" : String(value)}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <EmptyState
                title="No parcel record found"
                desc="This can happen if the property's county hasn't opted in to share parcel data through the statewide public dataset, or the point didn't intersect a mapped parcel. Try your county assessor's or GIS office's own site."
              />
            )}
          </>
        ) : (
          <EmptyState title="Results will appear here" desc="Enter a property address above and search." />
        )}
      </div>
    </div>
  );
}
