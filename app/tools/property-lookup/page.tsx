"use client";

import { useState } from "react";
import { Field } from "@/components/Field";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import { PropertyLookupResult } from "@/lib/propertyLookup/types";

export default function PropertyLookupPage() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PropertyLookupResult | null>(null);

  async function handleLookup() {
    setError(null);

    if (!address.trim()) {
      setError("Enter an address first.");
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/property-lookup", {
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

  const femaSearchUrl = result
    ? `https://msc.fema.gov/portal/search?AddressQuery=${encodeURIComponent(result.census.matchedAddress)}`
    : null;

  return (
    <div className="wrap">
      <header>
        <div>
          <p className="brand-eyebrow">Appraiser SMART Board · Tool</p>
          <h1>Property Lookup</h1>
          <p className="sub">
            Enter an address to pull its Census tract (via the U.S. Census Bureau geocoder), plus
            a direct link to FEMA&apos;s official Flood Map Service Center pre-filled with that
            address.
          </p>
        </div>
      </header>

      <div className="fixed-tone-note" style={{ marginBottom: 22 }}>
        This is a convenience lookup, not a system of record. For lending, insurance, or any
        regulatory purpose, confirm the tract against the Census Bureau&apos;s own geocoder and
        get the flood zone determination directly from FEMA&apos;s Flood Map Service Center.
      </div>

      <div className="panel form-panel" style={{ marginBottom: 22 }}>
        <Field label="Property address">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 123 Main St, Albany, NY 12207"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLookup();
            }}
          />
        </Field>
        <button className="generate-btn" onClick={handleLookup} disabled={loading}>
          <span className="dot" /> {loading ? "Looking up…" : "Look up property"}
        </button>
        {error ? <div className="error-box">{error}</div> : null}
      </div>

      <div className="panel output-panel">
        {loading ? (
          <LoadingState text="LOOKING UP CENSUS TRACT…" />
        ) : error && !result ? (
          <EmptyState tone="error" title="Something went wrong" desc="Could not complete the lookup right now. Try again in a moment." />
        ) : result ? (
          <>
            <p className="property-matched-address">Matched: {result.census.matchedAddress}</p>
            <div className="property-result-grid">
              <div className="property-result-card">
                <div className="property-result-label">Census Tract</div>
                {result.census.tractGeoid ? (
                  <>
                    <div className="property-result-value">{result.census.tractName || result.census.tractGeoid}</div>
                    <div className="property-result-sub">GEOID {result.census.tractGeoid}</div>
                    <div className="property-result-desc">
                      {[result.census.county, result.census.state].filter(Boolean).join(", ")}
                    </div>
                  </>
                ) : (
                  <div className="property-result-desc">No census tract was returned for this address.</div>
                )}
              </div>

              <div className="property-result-card">
                <div className="property-result-label">FEMA Flood Zone</div>
                <p className="property-result-desc" style={{ marginBottom: 14 }}>
                  Flood zone determinations come directly from FEMA&apos;s own Flood Map Service
                  Center, pre-filled with the matched address below.
                </p>
                <a
                  className="generate-btn"
                  href={femaSearchUrl ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  Check FEMA&apos;s Flood Map ↗
                </a>
              </div>
            </div>
          </>
        ) : (
          <EmptyState title="Results will appear here" desc="Enter a property address above and look it up." />
        )}
      </div>
    </div>
  );
}
