"use client";

import { useEffect, useState } from "react";
import { Field } from "@/components/Field";
import { PanelLabel } from "@/components/PanelLabel";
import { CopyButton } from "@/components/CopyButton";
import { EXPENSE_CATEGORIES } from "@/lib/mileageExpense/categories";
import { DEFAULT_STATE } from "@/lib/mileageExpense/defaults";
import { MileageExpenseState } from "@/lib/mileageExpense/types";

const STORAGE_KEY = "mileage-expense-tracker-state";

function loadState(): MileageExpenseState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as MileageExpenseState;
  } catch {
    // localStorage unavailable; fall back to defaults
  }
  return DEFAULT_STATE;
}

function saveState(state: MileageExpenseState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function formatMoney(n: number): string {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function MileageExpenseTrackerPage() {
  const [loaded, setLoaded] = useState(false);
  const [state, setState] = useState<MileageExpenseState>(DEFAULT_STATE);

  const [mDate, setMDate] = useState("");
  const [mPurpose, setMPurpose] = useState("");
  const [mMiles, setMMiles] = useState("");

  const [eDate, setEDate] = useState("");
  const [eCategory, setECategory] = useState(EXPENSE_CATEGORIES[0]);
  const [eDescription, setEDescription] = useState("");
  const [eAmount, setEAmount] = useState("");

  useEffect(() => {
    setState(loadState());
    setLoaded(true);
  }, []);

  function updateState(next: MileageExpenseState) {
    setState(next);
    saveState(next);
  }

  function updateRate(value: string) {
    updateState({ ...state, mileageRate: parseFloat(value) || 0 });
  }

  function addMileage() {
    if (!mMiles) return;
    updateState({ ...state, mileageEntries: [...state.mileageEntries, { date: mDate, purpose: mPurpose, miles: mMiles }] });
    setMDate("");
    setMPurpose("");
    setMMiles("");
  }

  function removeMileage(index: number) {
    updateState({ ...state, mileageEntries: state.mileageEntries.filter((_, i) => i !== index) });
  }

  function addExpense() {
    if (!eAmount) return;
    updateState({
      ...state,
      expenseEntries: [...state.expenseEntries, { date: eDate, category: eCategory, description: eDescription, amount: eAmount }],
    });
    setEDate("");
    setECategory(EXPENSE_CATEGORIES[0]);
    setEDescription("");
    setEAmount("");
  }

  function removeExpense(index: number) {
    updateState({ ...state, expenseEntries: state.expenseEntries.filter((_, i) => i !== index) });
  }

  if (!loaded) {
    return (
      <div className="wrap">
        <p className="loading-text">Loading your saved data…</p>
      </div>
    );
  }

  const totalMiles = state.mileageEntries.reduce((sum, e) => sum + (parseFloat(e.miles) || 0), 0);
  const mileageDeduction = totalMiles * state.mileageRate;
  const totalExpenses = state.expenseEntries.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const grandTotal = mileageDeduction + totalExpenses;

  const ledgerText = [
    "MILEAGE LOG",
    ...(state.mileageEntries.length
      ? state.mileageEntries.map(
          (e) => `${e.date || "(no date)"} - ${e.purpose || "(no description)"} - ${e.miles} mi (${formatMoney((parseFloat(e.miles) || 0) * state.mileageRate)})`
        )
      : ["(none logged)"]),
    "",
    "EXPENSES",
    ...(state.expenseEntries.length
      ? state.expenseEntries.map(
          (e) => `${e.date || "(no date)"} - ${e.category}${e.description ? ` - ${e.description}` : ""} - ${formatMoney(parseFloat(e.amount) || 0)}`
        )
      : ["(none logged)"]),
    "",
    `Total mileage deduction (${totalMiles.toLocaleString()} mi @ $${state.mileageRate.toFixed(3)}/mi): ${formatMoney(mileageDeduction)}`,
    `Total expenses: ${formatMoney(totalExpenses)}`,
    `Grand total: ${formatMoney(grandTotal)}`,
  ].join("\n");

  return (
    <div className="wrap">
      <header>
        <div>
          <p className="brand-eyebrow">Appraiser SMART Board · Tool</p>
          <h1>Mileage &amp; Expense Tracker</h1>
          <p className="sub">
            Log business mileage and other job-related expenses as you go, with a running deduction
            total ready to hand to your accountant at tax time.
          </p>
        </div>
      </header>

      <div className="fixed-tone-note" style={{ marginBottom: 22 }}>
        This isn&apos;t tax advice. The IRS standard mileage rate changes periodically (and even
        mid-year) — verify the current figure at irs.gov and consult your accountant before filing.
      </div>

      <div className="panel form-panel" style={{ marginBottom: 22 }}>
        <PanelLabel>Mileage Rate</PanelLabel>
        <div className="rate-card-row">
          <label>IRS standard mileage rate ($ per mile)</label>
          <input type="number" min={0} step={0.001} value={state.mileageRate} onChange={(e) => updateRate(e.target.value)} />
        </div>
        <p className="rate-card-note" style={{ marginTop: 10, marginBottom: 0 }}>
          Starting value reflects the IRS rate for the second half of 2026 ($0.76/mi, Jul 1–Dec
          31). Edit it here whenever the rate changes.
        </p>
      </div>

      <div className="panel form-panel" style={{ marginBottom: 22 }}>
        <PanelLabel>Log Mileage</PanelLabel>
        <div className="ce-add-form">
          <Field label="Date">
            <input type="date" value={mDate} onChange={(e) => setMDate(e.target.value)} />
          </Field>
          <Field label="Purpose" hint="optional">
            <input type="text" value={mPurpose} onChange={(e) => setMPurpose(e.target.value)} placeholder="e.g. Site visit - 123 Main St" />
          </Field>
          <Field label="Miles driven">
            <input type="number" min={0} step={0.1} value={mMiles} onChange={(e) => setMMiles(e.target.value)} placeholder="e.g. 24" />
          </Field>
          <button className="ce-add-btn" onClick={addMileage} type="button">
            Add mileage entry
          </button>
        </div>
        <div className="ce-course-list">
          {state.mileageEntries.length === 0 ? (
            <p className="ce-course-empty">No mileage logged yet.</p>
          ) : (
            state.mileageEntries.map((e, i) => (
              <div className="ce-course-item" key={i}>
                <div className="info">
                  <div className="name">{e.purpose || "(no description)"}</div>
                  <div className="meta">
                    {e.date || "no date"} · {e.miles} mi · {formatMoney((parseFloat(e.miles) || 0) * state.mileageRate)}
                  </div>
                </div>
                <button className="ce-rm-btn" onClick={() => removeMileage(i)} type="button">
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="panel form-panel" style={{ marginBottom: 22 }}>
        <PanelLabel>Log an Expense</PanelLabel>
        <div className="ce-add-form">
          <Field label="Date">
            <input type="date" value={eDate} onChange={(e) => setEDate(e.target.value)} />
          </Field>
          <Field label="Category">
            <select value={eCategory} onChange={(e) => setECategory(e.target.value)}>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Description" hint="optional">
            <input type="text" value={eDescription} onChange={(e) => setEDescription(e.target.value)} placeholder="e.g. Oil change" />
          </Field>
          <Field label="Amount">
            <input type="number" min={0} step={0.01} value={eAmount} onChange={(e) => setEAmount(e.target.value)} placeholder="e.g. 65.00" />
          </Field>
          <button className="ce-add-btn" onClick={addExpense} type="button">
            Add expense
          </button>
        </div>
        <div className="ce-course-list">
          {state.expenseEntries.length === 0 ? (
            <p className="ce-course-empty">No expenses logged yet.</p>
          ) : (
            state.expenseEntries.map((e, i) => (
              <div className="ce-course-item" key={i}>
                <div className="info">
                  <div className="name">{e.category}</div>
                  <div className="meta">
                    {e.date || "no date"} {e.description ? `· ${e.description}` : ""} · {formatMoney(parseFloat(e.amount) || 0)}
                  </div>
                </div>
                <button className="ce-rm-btn" onClick={() => removeExpense(i)} type="button">
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="panel form-panel">
        <PanelLabel>Summary</PanelLabel>
        <div className="fee-breakdown">
          <div className="fee-line">
            <span className="label">Total miles logged</span>
            <span className="amount">{totalMiles.toLocaleString()} mi</span>
          </div>
          <div className="fee-line">
            <span className="label">Mileage deduction</span>
            <span className="amount">{formatMoney(mileageDeduction)}</span>
          </div>
          <div className="fee-line">
            <span className="label">Total expenses</span>
            <span className="amount">{formatMoney(totalExpenses)}</span>
          </div>
          <div className="fee-total-line">
            <span>Grand Total</span>
            <span>{formatMoney(grandTotal)}</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
          <CopyButton text={ledgerText} />
        </div>
      </div>
    </div>
  );
}
