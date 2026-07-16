"use client";

import { useEffect, useState } from "react";
import { Field } from "@/components/Field";
import { PanelLabel } from "@/components/PanelLabel";
import { CopyButton } from "@/components/CopyButton";
import { DEFAULT_RATE_CARD } from "@/lib/feeCalculator/defaults";
import { FeeRateCard } from "@/lib/feeCalculator/types";

const STORAGE_KEY = "fee-calculator-rate-card";

function loadRateCard(): FeeRateCard {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as FeeRateCard;
  } catch {
    // localStorage unavailable; fall back to defaults
  }
  return DEFAULT_RATE_CARD;
}

function saveRateCard(rateCard: FeeRateCard) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rateCard));
  } catch {
    // ignore
  }
}

function formatMoney(n: number): string {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default function FeeCalculatorPage() {
  const [loaded, setLoaded] = useState(false);
  const [rateCard, setRateCard] = useState<FeeRateCard>(DEFAULT_RATE_CARD);

  const [propertyType, setPropertyType] = useState(DEFAULT_RATE_CARD.propertyTypes[0].key);
  const [sqft, setSqft] = useState("");
  const [selectedComplexity, setSelectedComplexity] = useState<string[]>([]);
  const [rush, setRush] = useState(DEFAULT_RATE_CARD.rushOptions[0].key);

  useEffect(() => {
    const loadedCard = loadRateCard();
    setRateCard(loadedCard);
    setPropertyType(loadedCard.propertyTypes[0]?.key ?? "");
    setRush(loadedCard.rushOptions[0]?.key ?? "");
    setLoaded(true);
  }, []);

  function updateRateCard(next: FeeRateCard) {
    setRateCard(next);
    saveRateCard(next);
  }

  function updatePropertyTypeFee(key: string, value: string) {
    const amount = parseFloat(value) || 0;
    updateRateCard({
      ...rateCard,
      propertyTypes: rateCard.propertyTypes.map((p) => (p.key === key ? { ...p, baseFee: amount } : p)),
    });
  }

  function updateComplexityAmount(key: string, value: string) {
    const amount = parseFloat(value) || 0;
    updateRateCard({
      ...rateCard,
      complexityFactors: rateCard.complexityFactors.map((c) => (c.key === key ? { ...c, amount } : c)),
    });
  }

  function updateRushPercent(key: string, value: string) {
    const percent = parseFloat(value) || 0;
    updateRateCard({
      ...rateCard,
      rushOptions: rateCard.rushOptions.map((r) => (r.key === key ? { ...r, percent } : r)),
    });
  }

  function updateSqftRule(field: "perSqftThreshold" | "perSqftIncrement" | "perSqftFee", value: string) {
    const num = parseFloat(value) || 0;
    updateRateCard({ ...rateCard, [field]: num });
  }

  function resetToDefaults() {
    updateRateCard(DEFAULT_RATE_CARD);
  }

  function toggleComplexity(key: string) {
    setSelectedComplexity((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  if (!loaded) {
    return (
      <div className="wrap">
        <p className="loading-text">Loading your saved rate card…</p>
      </div>
    );
  }

  const propertyRate = rateCard.propertyTypes.find((p) => p.key === propertyType);
  const baseFee = propertyRate?.baseFee ?? 0;

  const sqftNum = parseFloat(sqft) || 0;
  const overage = Math.max(0, sqftNum - rateCard.perSqftThreshold);
  const increments = rateCard.perSqftIncrement > 0 ? Math.ceil(overage / rateCard.perSqftIncrement) : 0;
  const sqftFee = increments * rateCard.perSqftFee;

  const complexityLines = rateCard.complexityFactors.filter((c) => selectedComplexity.includes(c.key));
  const complexityTotal = complexityLines.reduce((sum, c) => sum + c.amount, 0);

  const subtotal = baseFee + sqftFee + complexityTotal;

  const rushOption = rateCard.rushOptions.find((r) => r.key === rush);
  const rushPercent = rushOption?.percent ?? 0;
  const rushFee = Math.round(subtotal * (rushPercent / 100));

  const total = subtotal + rushFee;

  const quoteText = [
    `Property Type: ${propertyRate?.label ?? "—"}`,
    sqftNum ? `Square Footage: ${sqftNum.toLocaleString()} sq ft` : null,
    complexityLines.length ? `Complexity: ${complexityLines.map((c) => c.label).join(", ")}` : null,
    `Turnaround: ${rushOption?.label ?? "—"}`,
    "",
    `Base fee: ${formatMoney(baseFee)}`,
    sqftFee ? `Additional square footage: ${formatMoney(sqftFee)}` : null,
    complexityTotal ? `Complexity add-ons: ${formatMoney(complexityTotal)}` : null,
    rushFee ? `Rush surcharge (${rushPercent}%): ${formatMoney(rushFee)}` : null,
    "",
    `Total: ${formatMoney(total)}`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return (
    <div className="wrap">
      <header>
        <div>
          <p className="brand-eyebrow">Appraiser SMART Board · Tool</p>
          <h1>Fee Calculator</h1>
          <p className="sub">
            Set up your own rate card once, then get a live, itemized quote for each job based on
            property type, size, complexity, and turnaround time.
          </p>
        </div>
      </header>

      <div className="panel form-panel" style={{ marginBottom: 22 }}>
        <PanelLabel>Your Rate Card</PanelLabel>
        <p className="rate-card-note">
          These are starter numbers, not real market rates — edit every field below to match your
          own pricing. Saved automatically on this device.
        </p>

        <p className="rate-card-group-title">Base fee by property type</p>
        {rateCard.propertyTypes.map((p) => (
          <div className="rate-card-row" key={p.key}>
            <label>{p.label}</label>
            <input type="number" min={0} value={p.baseFee} onChange={(e) => updatePropertyTypeFee(p.key, e.target.value)} />
          </div>
        ))}

        <p className="rate-card-group-title">Square footage adjustment</p>
        <div className="rate-card-row">
          <label>Extra fee starts above this size (sq ft)</label>
          <input
            type="number"
            min={0}
            value={rateCard.perSqftThreshold}
            onChange={(e) => updateSqftRule("perSqftThreshold", e.target.value)}
          />
        </div>
        <div className="rate-card-row">
          <label>...charging extra for each additional (sq ft)</label>
          <input
            type="number"
            min={0}
            value={rateCard.perSqftIncrement}
            onChange={(e) => updateSqftRule("perSqftIncrement", e.target.value)}
          />
        </div>
        <div className="rate-card-row">
          <label>...of this amount per increment ($)</label>
          <input type="number" min={0} value={rateCard.perSqftFee} onChange={(e) => updateSqftRule("perSqftFee", e.target.value)} />
        </div>

        <p className="rate-card-group-title">Complexity add-ons</p>
        {rateCard.complexityFactors.map((c) => (
          <div className="rate-card-row" key={c.key}>
            <label>{c.label}</label>
            <input type="number" min={0} value={c.amount} onChange={(e) => updateComplexityAmount(c.key, e.target.value)} />
          </div>
        ))}

        <p className="rate-card-group-title">Rush turnaround surcharge (% of subtotal)</p>
        {rateCard.rushOptions.map((r) => (
          <div className="rate-card-row" key={r.key}>
            <label>{r.label}</label>
            <input type="number" min={0} value={r.percent} onChange={(e) => updateRushPercent(r.key, e.target.value)} />
          </div>
        ))}

        <button className="comment-add-btn" onClick={resetToDefaults} type="button" style={{ marginTop: 16 }}>
          Reset to starter defaults
        </button>
      </div>

      <div className="panel form-panel">
        <PanelLabel>Get a Quote</PanelLabel>

        <PanelLabel>Property type</PanelLabel>
        <div className="tone-select" style={{ marginBottom: 20 }}>
          {rateCard.propertyTypes.map((p) => (
            <div
              key={p.key}
              className={`tone-chip${p.key === propertyType ? " active" : ""}`}
              onClick={() => setPropertyType(p.key)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setPropertyType(p.key);
                }
              }}
            >
              {p.label}
            </div>
          ))}
        </div>

        <Field label="Square footage" hint="optional">
          <input type="number" min={0} value={sqft} onChange={(e) => setSqft(e.target.value)} placeholder="e.g. 3200" />
        </Field>

        <PanelLabel>Complexity factors</PanelLabel>
        <div style={{ marginBottom: 8 }}>
          {rateCard.complexityFactors.map((c) => (
            <div className="checkbox-row" key={c.key}>
              <input
                type="checkbox"
                id={`complexity-${c.key}`}
                checked={selectedComplexity.includes(c.key)}
                onChange={() => toggleComplexity(c.key)}
              />
              <label htmlFor={`complexity-${c.key}`}>
                {c.label} <span style={{ color: "var(--muted)" }}>(+{formatMoney(c.amount)})</span>
              </label>
            </div>
          ))}
        </div>

        <PanelLabel>Turnaround</PanelLabel>
        <div className="tone-select">
          {rateCard.rushOptions.map((r) => (
            <div
              key={r.key}
              className={`tone-chip${r.key === rush ? " active" : ""}`}
              onClick={() => setRush(r.key)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setRush(r.key);
                }
              }}
            >
              {r.label}
              {r.percent > 0 ? ` (+${r.percent}%)` : ""}
            </div>
          ))}
        </div>

        <div className="fee-breakdown">
          <div className="fee-line">
            <span className="label">Base fee ({propertyRate?.label ?? "—"})</span>
            <span className="amount">{formatMoney(baseFee)}</span>
          </div>
          {sqftFee > 0 ? (
            <div className="fee-line">
              <span className="label">Additional square footage</span>
              <span className="amount">{formatMoney(sqftFee)}</span>
            </div>
          ) : null}
          {complexityLines.map((c) => (
            <div className="fee-line" key={c.key}>
              <span className="label">{c.label}</span>
              <span className="amount">{formatMoney(c.amount)}</span>
            </div>
          ))}
          {rushFee > 0 ? (
            <div className="fee-line">
              <span className="label">Rush surcharge ({rushPercent}%)</span>
              <span className="amount">{formatMoney(rushFee)}</span>
            </div>
          ) : null}
          <div className="fee-total-line">
            <span>Total</span>
            <span>{formatMoney(total)}</span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
          <CopyButton text={quoteText} />
        </div>
      </div>
    </div>
  );
}
