"use client";

import { useMemo, useState } from "react";
import { Field } from "@/components/Field";
import { PanelLabel } from "@/components/PanelLabel";
import { CopyButton } from "@/components/CopyButton";
import { FOLLOW_UP_EMAIL_TEMPLATES } from "@/lib/openHouseKit/emailTemplates";

const SIGNIN_ROWS = 14;

export default function OpenHouseKitPage() {
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [agentName, setAgentName] = useState("");
  const [agentPhone, setAgentPhone] = useState("");

  const [search, setSearch] = useState("");

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return FOLLOW_UP_EMAIL_TEMPLATES;
    return FOLLOW_UP_EMAIL_TEMPLATES.filter(
      (t) => t.stage.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.body.toLowerCase().includes(q)
    );
  }, [search]);

  function handlePrint() {
    window.print();
  }

  const formattedDate = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : "";

  return (
    <div className="wrap">
      <header>
        <div>
          <p className="brand-eyebrow">Manfred Real Estate Learning Center — Membership Plus Tool</p>
          <h1>Open House Kit</h1>
          <p className="sub">
            A printable sign-in sheet for the door, plus a staged follow-up email sequence for
            every lead you collect.
          </p>
        </div>
      </header>

      <div className="panel form-panel" style={{ marginBottom: 22 }}>
        <PanelLabel>Sign-In Sheet</PanelLabel>
        <div className="row2">
          <Field label="Property address">
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. 123 Main St, Albany, NY" />
          </Field>
          <Field label="Open house date">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
        </div>
        <div className="row2">
          <Field label="Your name">
            <input type="text" value={agentName} onChange={(e) => setAgentName(e.target.value)} placeholder="e.g. Sarah Jones" />
          </Field>
          <Field label="Your phone" hint="optional">
            <input type="text" value={agentPhone} onChange={(e) => setAgentPhone(e.target.value)} placeholder="e.g. (518) 555-0134" />
          </Field>
        </div>

        <button className="generate-btn" onClick={handlePrint} type="button" style={{ marginTop: 6 }}>
          <span className="dot" /> Print sign-in sheet
        </button>

        <div className="print-area" style={{ marginTop: 20 }}>
          <div className="signin-sheet">
            <div className="signin-sheet-header">
              <p className="title">Open House Sign-In</p>
              <p className="property">{address || "[Property Address]"}</p>
              <p className="meta">
                {formattedDate || "[Date]"} · Hosted by {agentName || "[Your Name]"}
                {agentPhone ? ` · ${agentPhone}` : ""}
              </p>
            </div>
            <table className="signin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Working with an agent?</th>
                  <th>Interested in similar listings?</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: SIGNIN_ROWS }).map((_, i) => (
                  <tr key={i}>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="signin-sheet-consent">
              By signing in, you agree to be contacted by {agentName || "[Your Name]"} regarding this
              property and other listings that may interest you.
            </p>
          </div>
        </div>
      </div>

      <div className="panel form-panel" style={{ marginBottom: 22 }}>
        <PanelLabel>Follow-Up Email Templates</PanelLabel>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search follow-up templates…"
        />
      </div>

      <p className="count-label">
        {results.length} template{results.length === 1 ? "" : "s"}
      </p>
      {results.length === 0 ? (
        <p className="library-empty">No templates match. Try a broader search.</p>
      ) : (
        results.map((t) => (
          <div className="comment-card" key={t.key}>
            <div className="comment-tags">
              <span className="comment-tag cite">{t.stage}</span>
              <span className="comment-tag system">{t.timing}</span>
            </div>
            <p className="comment-card-title">{t.subject}</p>
            <p>{t.body}</p>
            <div className="comment-card-actions">
              <CopyButton text={`Subject: ${t.subject}\n\n${t.body}`} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
