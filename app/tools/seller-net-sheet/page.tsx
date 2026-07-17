"use client";

import { useEffect, useState } from "react";
import { Field } from "@/components/Field";
import { PanelLabel } from "@/components/PanelLabel";
import { CopyButton } from "@/components/CopyButton";
import { DEFAULT_ASSUMPTIONS } from "@/lib/netSheet/defaults";
import { NetSheetAssumptions } from "@/lib/netSheet/types";

const STORAGE_KEY = "seller-net-sheet-assumptions";

function loadAssumptions(): NetSheetAssumptions {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as NetSheetAssumptions;
  } catch {
    // localStorage unavailable; fall back to defaults
  }
  return DEFAULT_ASSUMPTIONS;
}

function saveAssumptions(assumptions: NetSheetAssumptions) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(assumptions));
  } catch {
    // ignore
  }
}

function formatMoney(n: number): string {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default function SellerNetSheetPage() {
  const [loaded, setLoaded] = useState(false);
  const [assumptions, setAssumptions] = useState<NetSheetAssumptions>(DEFAULT_ASSUMPTIONS);

  const [salePrice, setSalePrice] = useState("");
  const [mortgagePayoff, setMortgagePayoff] = useState("");
  const [otherLiens, setOtherLiens] = useState("");
  const [buyerConcessions, setBuyerConcessions] = useState("");
  const [prorations, setProrations] = useState("");

  useEffect(() => {
    setAssumptions(loadAssumptions());
    setLoaded(true);
  }, []);

  function updateAssumptions(next: NetSheetAssumptions) {
    setAssumptions(next);
    saveAssumptions(next);
  }

  function updateField(field: keyof NetSheetAssumptions, value: string) {
    const num = parseFloat(value) || 0;
    updateAssumptions({ ...assumptions, [field]: num });
  }

  function resetToDefaults() {
    updateAssumptions(DEFAULT_ASSUMPTIONS);
  }

  if (!loaded) {
    return (
      <div className="wrap">
        <p className="loading-text">Loading your saved assumptions…</p>
      </div>
    );
  }

  const price = parseFloat(salePrice) || 0;
  const commission = price * (assumptions.commissionPercent / 100);
  const transferTax = price * (assumptions.transferTaxPercent / 100);
  const payoff = parseFloat(mortgagePayoff) || 0;
  const liens = parseFloat(otherLiens) || 0;
  const concessions = parseFloat(buyerConcessions) || 0;
  const prorationAmount = parseFloat(prorations) || 0;

  const totalDeductions =
    commission +
    transferTax +
    assumptions.attorneyFee +
    assumptions.titleClosingFee +
    assumptions.otherClosingCosts +
    payoff +
    liens +
    concessions +
    prorationAmount;

  const netProceeds = price - totalDeductions;

  const summaryText = [
    `Estimated sale price: ${formatMoney(price)}`,
    "",
    `Commission (${assumptions.commissionPercent}%): -${formatMoney(commission)}`,
    `NY State transfer tax (${assumptions.transferTaxPercent}%): -${formatMoney(transferTax)}`,
    `Attorney fee: -${formatMoney(assumptions.attorneyFee)}`,
    `Title & closing costs: -${formatMoney(assumptions.titleClosingFee)}`,
    `Other closing costs: -${formatMoney(assumptions.otherClosingCosts)}`,
    payoff ? `Mortgage payoff: -${formatMoney(payoff)}` : null,
    liens ? `Other liens/judgments: -${formatMoney(liens)}` : null,
    concessions ? `Buyer concessions/credits: -${formatMoney(concessions)}` : null,
    prorationAmount ? `HOA/proration credits: -${formatMoney(prorationAmount)}` : null,
    "",
    `Estimated net proceeds: ${formatMoney(netProceeds)}`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return (
    <div className="wrap">
      <header>
        <div>
          <p className="brand-eyebrow">Manfred Real Estate Learning Center — Membership Plus Tool</p>
          <h1>Seller Net Sheet Calculator</h1>
          <p className="sub">
            Give a seller lead a realistic estimate of what they&apos;d walk away with — a strong,
            concrete reason to talk to you instead of going FSBO or sitting on an expired listing.
          </p>
        </div>
      </header>

      <div className="panel form-panel" style={{ marginBottom: 22 }}>
        <PanelLabel>Your Default Assumptions</PanelLabel>
        <p className="rate-card-note">
          These are starter numbers, not real market rates or tax figures — edit every field below
          to match your area. Saved automatically on this device. This tool is not a substitute for
          a title company or attorney&apos;s closing statement; NYC and some other localities charge
          an additional transfer tax on top of New York State&apos;s base rate shown here.
        </p>

        <p className="rate-card-group-title">Commission &amp; taxes</p>
        <div className="rate-card-row">
          <label>Total commission (% of sale price)</label>
          <input
            type="number"
            min={0}
            step={0.1}
            value={assumptions.commissionPercent}
            onChange={(e) => updateField("commissionPercent", e.target.value)}
          />
        </div>
        <div className="rate-card-row">
          <label>NY State transfer tax (% of sale price)</label>
          <input
            type="number"
            min={0}
            step={0.1}
            value={assumptions.transferTaxPercent}
            onChange={(e) => updateField("transferTaxPercent", e.target.value)}
          />
        </div>

        <p className="rate-card-group-title">Closing costs</p>
        <div className="rate-card-row">
          <label>Attorney fee ($)</label>
          <input
            type="number"
            min={0}
            value={assumptions.attorneyFee}
            onChange={(e) => updateField("attorneyFee", e.target.value)}
          />
        </div>
        <div className="rate-card-row">
          <label>Title &amp; closing costs ($)</label>
          <input
            type="number"
            min={0}
            value={assumptions.titleClosingFee}
            onChange={(e) => updateField("titleClosingFee", e.target.value)}
          />
        </div>
        <div className="rate-card-row">
          <label>Other closing costs ($)</label>
          <input
            type="number"
            min={0}
            value={assumptions.otherClosingCosts}
            onChange={(e) => updateField("otherClosingCosts", e.target.value)}
          />
        </div>

        <button className="comment-add-btn" onClick={resetToDefaults} type="button" style={{ marginTop: 16 }}>
          Reset to starter defaults
        </button>
      </div>

      <div className="panel form-panel">
        <PanelLabel>Deal Details</PanelLabel>

        <Field label="Estimated sale price">
          <input type="number" min={0} value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder="e.g. 425000" />
        </Field>

        <div className="row2">
          <Field label="Mortgage payoff" hint="optional">
            <input type="number" min={0} value={mortgagePayoff} onChange={(e) => setMortgagePayoff(e.target.value)} placeholder="e.g. 210000" />
          </Field>
          <Field label="Other liens or judgments" hint="optional">
            <input type="number" min={0} value={otherLiens} onChange={(e) => setOtherLiens(e.target.value)} placeholder="e.g. 0" />
          </Field>
        </div>
        <div className="row2">
          <Field label="Buyer concessions / seller credits" hint="optional">
            <input type="number" min={0} value={buyerConcessions} onChange={(e) => setBuyerConcessions(e.target.value)} placeholder="e.g. 5000" />
          </Field>
          <Field label="HOA/condo dues or other prorations owed" hint="optional">
            <input type="number" min={0} value={prorations} onChange={(e) => setProrations(e.target.value)} placeholder="e.g. 0" />
          </Field>
        </div>

        <div className="fee-breakdown">
          <div className="fee-line">
            <span className="label">Estimated sale price</span>
            <span className="amount">{formatMoney(price)}</span>
          </div>
          <div className="fee-line">
            <span className="label">Commission ({assumptions.commissionPercent}%)</span>
            <span className="amount">-{formatMoney(commission)}</span>
          </div>
          <div className="fee-line">
            <span className="label">NY State transfer tax ({assumptions.transferTaxPercent}%)</span>
            <span className="amount">-{formatMoney(transferTax)}</span>
          </div>
          <div className="fee-line">
            <span className="label">Attorney fee</span>
            <span className="amount">-{formatMoney(assumptions.attorneyFee)}</span>
          </div>
          <div className="fee-line">
            <span className="label">Title &amp; closing costs</span>
            <span className="amount">-{formatMoney(assumptions.titleClosingFee)}</span>
          </div>
          <div className="fee-line">
            <span className="label">Other closing costs</span>
            <span className="amount">-{formatMoney(assumptions.otherClosingCosts)}</span>
          </div>
          {payoff > 0 ? (
            <div className="fee-line">
              <span className="label">Mortgage payoff</span>
              <span className="amount">-{formatMoney(payoff)}</span>
            </div>
          ) : null}
          {liens > 0 ? (
            <div className="fee-line">
              <span className="label">Other liens/judgments</span>
              <span className="amount">-{formatMoney(liens)}</span>
            </div>
          ) : null}
          {concessions > 0 ? (
            <div className="fee-line">
              <span className="label">Buyer concessions/credits</span>
              <span className="amount">-{formatMoney(concessions)}</span>
            </div>
          ) : null}
          {prorationAmount > 0 ? (
            <div className="fee-line">
              <span className="label">HOA/proration credits</span>
              <span className="amount">-{formatMoney(prorationAmount)}</span>
            </div>
          ) : null}
          <div className="fee-total-line">
            <span>Estimated net proceeds</span>
            <span>{formatMoney(netProceeds)}</span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
          <CopyButton text={summaryText} />
        </div>
      </div>
    </div>
  );
}
