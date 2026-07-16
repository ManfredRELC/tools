"use client";

import { useEffect, useMemo, useState } from "react";
import { Field } from "@/components/Field";
import { PanelLabel } from "@/components/PanelLabel";
import { CE_DISCIPLINES, CE_DISCIPLINE_ORDER } from "@/lib/ceTracker/disciplines";
import { CECategory, CECourse, CEState, DisciplineKey } from "@/lib/ceTracker/types";

const RING_R = 24;
const RING_CIRCUMFERENCE = 150.8;

function defaultState(discipline: DisciplineKey): CEState {
  const flag = CE_DISCIPLINES[discipline].flag;
  return {
    license: { number: "", expiration: "" },
    courses: [],
    ...(flag ? { [flag.key]: flag.default } : {}),
  };
}

function categoryMin(cat: CECategory, state: CEState): number {
  if (cat.conditional && state[cat.conditional.flagKey] === cat.conditional.whenFlag) {
    return cat.conditional.altMin;
  }
  return cat.min;
}

function loadDisciplineState(discipline: DisciplineKey): CEState {
  try {
    const raw = window.localStorage.getItem(CE_DISCIPLINES[discipline].storageKey);
    if (raw) return JSON.parse(raw) as CEState;
  } catch {
    // localStorage unavailable; fall through to default
  }
  return defaultState(discipline);
}

function saveDisciplineState(discipline: DisciplineKey, state: CEState) {
  try {
    window.localStorage.setItem(CE_DISCIPLINES[discipline].storageKey, JSON.stringify(state));
  } catch {
    // ignore
  }
}

interface CrossLogFormState {
  checked: boolean;
  code: string;
  category: string;
  hours: string;
}

function emptyCrossLogForm(discipline: DisciplineKey): CrossLogFormState {
  return {
    checked: false,
    code: "",
    category: CE_DISCIPLINES[discipline].categories[0]?.key ?? "",
    hours: "",
  };
}

export function CETracker({ current }: { current: DisciplineKey }) {
  const discipline = CE_DISCIPLINES[current];
  const others = useMemo(() => CE_DISCIPLINE_ORDER.filter((k) => k !== current), [current]);

  const [loaded, setLoaded] = useState(false);
  const [state, setState] = useState<CEState>(() => defaultState(current));

  const [name, setName] = useState("");
  const [provider, setProvider] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState(discipline.categories[0]?.key ?? "");
  const [hours, setHours] = useState("");
  const [date, setDate] = useState("");
  const [crossOpen, setCrossOpen] = useState(false);
  const [crossForms, setCrossForms] = useState<Record<string, CrossLogFormState>>(() =>
    Object.fromEntries(others.map((k) => [k, emptyCrossLogForm(k)]))
  );
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setState(loadDisciplineState(current));
    setLoaded(true);
    setCategory(CE_DISCIPLINES[current].categories[0]?.key ?? "");
    setCrossForms(Object.fromEntries(CE_DISCIPLINE_ORDER.filter((k) => k !== current).map((k) => [k, emptyCrossLogForm(k)])));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  function updateState(next: CEState) {
    setState(next);
    saveDisciplineState(current, next);
  }

  function updateLicenseNumber(value: string) {
    updateState({ ...state, license: { ...state.license, number: value } });
  }

  function updateLicenseExpiration(value: string) {
    updateState({ ...state, license: { ...state.license, expiration: value } });
  }

  function updateFlag(value: boolean) {
    if (!discipline.flag) return;
    updateState({ ...state, [discipline.flag.key]: value });
  }

  function addCourse() {
    if (!hours) return;

    const newCourse: CECourse = { name, provider, code, category, hours, date };
    updateState({ ...state, courses: [...state.courses, newCourse] });

    const crossLoggedTo: string[] = [];
    for (const key of others) {
      const form = crossForms[key];
      if (!form?.checked) continue;
      const otherDiscipline = CE_DISCIPLINES[key];
      const otherState = loadDisciplineState(key);
      const otherCourse: CECourse = {
        name,
        provider,
        code: form.code,
        category: form.category,
        hours: form.hours || hours,
        date,
        crossLoggedFrom: current,
      };
      const nextOtherState: CEState = { ...otherState, courses: [...otherState.courses, otherCourse] };
      saveDisciplineState(key, nextOtherState);
      crossLoggedTo.push(otherDiscipline.label);
    }

    setToast(crossLoggedTo.length ? `Also logged to: ${crossLoggedTo.join(", ")}` : null);

    setName("");
    setProvider("");
    setCode("");
    setCategory(discipline.categories[0]?.key ?? "");
    setHours("");
    setDate("");
    setCrossForms(Object.fromEntries(others.map((k) => [k, emptyCrossLogForm(k)])));
    setCrossOpen(false);
  }

  function removeCourse(index: number) {
    updateState({ ...state, courses: state.courses.filter((_, i) => i !== index) });
  }

  function updateCrossForm(key: string, patch: Partial<CrossLogFormState>) {
    setCrossForms((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }

  if (!loaded) {
    return <p className="loading-text">Loading your saved data…</p>;
  }

  const exp = state.license.expiration;
  let days: number | null = null;
  if (exp) {
    days = Math.ceil((new Date(exp).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  }
  const countdownCls = days === null ? "" : days < 0 ? "alert" : days < 60 ? "warn" : "";
  const countdownLabel = days !== null && days < 0 ? "days overdue" : "days until renewal";

  const totalLogged = state.courses.reduce((sum, c) => sum + (parseFloat(c.hours) || 0), 0);
  const pct = Math.min(100, Math.round((totalLogged / discipline.hoursRequired) * 100));
  const ringOffset = RING_CIRCUMFERENCE - (pct / 100) * RING_CIRCUMFERENCE;

  return (
    <>
      <div className="panel form-panel" style={{ marginBottom: 20 }}>
        <PanelLabel>License &amp; Renewal</PanelLabel>
        <div className="row2">
          <Field label="License number" hint="optional">
            <input
              type="text"
              value={state.license.number}
              onChange={(e) => updateLicenseNumber(e.target.value)}
              placeholder={discipline.licensePlaceholder}
            />
          </Field>
          <Field label="License expiration date">
            <input type="date" value={exp} onChange={(e) => updateLicenseExpiration(e.target.value)} />
          </Field>
        </div>

        {discipline.flag ? (
          <div className="ce-checkbox-row">
            <input
              type="checkbox"
              id="ce-flag"
              checked={!!state[discipline.flag.key]}
              onChange={(e) => updateFlag(e.target.checked)}
            />
            <label htmlFor="ce-flag">{discipline.flag.label}</label>
          </div>
        ) : null}

        {exp ? (
          <div className="ce-countdown">
            <div className={`ce-countdown-num ${countdownCls}`}>{Math.abs(days ?? 0)}</div>
            <div className="ce-countdown-label">
              {countdownLabel}
              <br />
              License expires {new Date(exp).toLocaleDateString()}
            </div>
          </div>
        ) : null}
      </div>

      <div className="panel form-panel" style={{ marginBottom: 20 }}>
        <PanelLabel>
          CE Progress <span className="comment-tag cite">{discipline.hoursRequired} hrs required per 2-year cycle</span>
        </PanelLabel>
        <div className="checklist-overall" style={{ marginBottom: discipline.showCategoryBreakdown ? 18 : 0 }}>
          <div className="checklist-ring">
            <svg width="56" height="56">
              <circle className="bg" cx="28" cy="28" r={RING_R} fill="none" strokeWidth="5" />
              <circle
                className="fg"
                cx="28"
                cy="28"
                r={RING_R}
                fill="none"
                strokeWidth="5"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={ringOffset}
              />
            </svg>
            <div className="pct">{pct}%</div>
          </div>
          <div className="checklist-overall-text">
            <div className="t1">
              {totalLogged.toFixed(1)} of {discipline.hoursRequired} hours logged
            </div>
            <div className="t2">{discipline.showCategoryBreakdown ? "Across all categories below" : discipline.progressSubtext}</div>
          </div>
        </div>

        {discipline.showCategoryBreakdown
          ? discipline.categories.map((cat) => {
              const min = categoryMin(cat, state);
              const logged = state.courses
                .filter((c) => c.category === cat.key)
                .reduce((sum, c) => sum + (parseFloat(c.hours) || 0), 0);
              const met = min === 0 ? true : logged >= min;
              const barPct = min === 0 ? Math.min(100, (logged / discipline.hoursRequired) * 100) : Math.min(100, (logged / min) * 100);
              return (
                <div className="ce-cat-row" key={cat.key}>
                  <div className="ce-cat-row-head">
                    <span className="name">
                      {cat.label}
                      {min > 0 ? <span className="ce-cat-min"> (min {min} hrs)</span> : null}
                    </span>
                    <span className={`hrs${met ? " met" : ""}`}>
                      {logged.toFixed(1)}
                      {min > 0 ? ` / ${min}` : ""} hrs
                    </span>
                  </div>
                  <div className="ce-bar">
                    <div className={`ce-bar-fill${met ? " met" : ""}`} style={{ width: `${barPct}%` }} />
                  </div>
                </div>
              );
            })
          : null}
      </div>

      <div className="panel form-panel">
        <PanelLabel>Log a Completed Course</PanelLabel>
        <div className="ce-add-form">
          <Field label="Course name">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Fair Housing Update 2026" />
          </Field>
          <Field label="Provider / school">
            <input
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="e.g. Manfred Real Estate Learning Center"
            />
          </Field>
          <Field label="Course approval code">
            <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder={`e.g. ${discipline.codeExample}`} />
          </Field>
          <Field label="Category">
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {discipline.categories.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Hours">
            <input type="number" min={0} step={0.5} value={hours} onChange={(e) => setHours(e.target.value)} placeholder="e.g. 3" />
          </Field>
          <Field label="Date completed">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>

          <div className="ce-cross-toggle" onClick={() => setCrossOpen((v) => !v)} role="button" tabIndex={0}>
            + Also log this course for another discipline
          </div>
          {crossOpen ? (
            <div className="ce-cross-section">
              {others.map((key) => {
                const otherDiscipline = CE_DISCIPLINES[key];
                const form = crossForms[key];
                return (
                  <div className="ce-cross-block" key={key}>
                    <div className="ce-cross-block-head">
                      <input
                        type="checkbox"
                        id={`cross-${key}`}
                        checked={form?.checked ?? false}
                        onChange={(e) => updateCrossForm(key, { checked: e.target.checked })}
                      />
                      <label htmlFor={`cross-${key}`}>Also counts for {otherDiscipline.label}</label>
                    </div>
                    <div className="ce-cross-fields">
                      <input
                        type="text"
                        placeholder={`Code, e.g. ${otherDiscipline.codeExample}`}
                        value={form?.code ?? ""}
                        onChange={(e) => updateCrossForm(key, { code: e.target.value })}
                        disabled={!form?.checked}
                      />
                      <select
                        value={form?.category ?? ""}
                        onChange={(e) => updateCrossForm(key, { category: e.target.value })}
                        disabled={!form?.checked}
                      >
                        {otherDiscipline.categories.map((cat) => (
                          <option key={cat.key} value={cat.key}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min={0}
                        step={0.5}
                        placeholder="Hours (same as above if blank)"
                        value={form?.hours ?? ""}
                        onChange={(e) => updateCrossForm(key, { hours: e.target.value })}
                        disabled={!form?.checked}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          <button className="ce-add-btn" onClick={addCourse} type="button">
            Add course
          </button>
        </div>

        {toast ? <div className="ce-toast">{toast}</div> : null}

        <div className="ce-course-list">
          {state.courses.length === 0 ? (
            <p className="ce-course-empty">No courses logged yet.</p>
          ) : (
            state.courses.map((c, i) => {
              const cat = discipline.categories.find((cc) => cc.key === c.category);
              return (
                <div className="ce-course-item" key={i}>
                  <div className="info">
                    <div className="name">{c.name || "(untitled course)"}</div>
                    <div className="meta">
                      {c.provider} {c.code ? `· ${c.code}` : ""} · {cat ? cat.label : c.category} · {c.hours} hrs
                      {c.date ? ` · ${new Date(c.date).toLocaleDateString()}` : ""}
                      {c.crossLoggedFrom ? (
                        <span className="cross-tag"> · cross-logged from {CE_DISCIPLINES[c.crossLoggedFrom].label}</span>
                      ) : null}
                    </div>
                  </div>
                  <button className="ce-rm-btn" onClick={() => removeCourse(i)} type="button">
                    ×
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
