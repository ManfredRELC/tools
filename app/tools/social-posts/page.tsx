"use client";

import { useState } from "react";
import { PLATFORMS, SocialPlatform, SocialPost, SocialTone, TONES } from "@/lib/prompts/socialPosts";
import { FieldInput } from "@/components/FieldInput";
import { PanelLabel } from "@/components/PanelLabel";
import { CopyButton } from "@/components/CopyButton";

const TOPIC_FIELD = {
  key: "topic",
  label: "What's on your mind this week?",
  type: "textarea" as const,
  placeholder:
    "e.g. it's getting cold out, want to remind people about gutter cleaning and heating system checks before winter",
};

const AGENT_INFO_FIELD = {
  key: "agentInfo",
  label: "Your name / brokerage",
  hint: "optional",
  type: "text" as const,
  placeholder: "e.g. Sarah with Hudson Valley Home Inspections",
};

function postAsText(p: SocialPost): string {
  return `${p.day} — ${p.type}\n${p.caption}\n${p.hashtags || ""}\nPhoto idea: ${p.photo_idea}`;
}

export default function SocialPostsPage() {
  const [topic, setTopic] = useState("");
  const [agentInfo, setAgentInfo] = useState("");
  const [platform, setPlatform] = useState<SocialPlatform>("facebook");
  const [tone, setTone] = useState<SocialTone>("friendly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<SocialPost[] | null>(null);

  async function handleGenerate() {
    setError(null);

    if (!topic.trim()) {
      setError("Add a topic or a bit of context first.");
      return;
    }

    setLoading(true);
    setPosts(null);
    try {
      const res = await fetch("/api/social-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform, tone, agentInfo }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setPosts(data.posts);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const allPostsText = posts ? posts.map(postAsText).join("\n\n---\n\n") : "";

  return (
    <div className="wrap">
      <header>
        <div>
          <p className="brand-eyebrow">Home Inspector SMART Board · Tool</p>
          <h1>Social Media Post Generator</h1>
          <p className="sub">
            Turn one topic prompt into a full week of ready-to-post content — home-maintenance
            tips, seasonal reminders, and credibility posts agents will want to reshare.
          </p>
        </div>
      </header>

      <div className="fixed-tone-note" style={{ marginBottom: 22 }}>
        Never reference a specific client, address, or identifiable property without their
        written permission — keep all &ldquo;interesting find&rdquo; content generic and
        non-identifying.
      </div>

      <div className="panel form-panel" style={{ marginBottom: 22 }}>
        <FieldInput field={TOPIC_FIELD} value={topic} onChange={(_key, value) => setTopic(value)} />

        <div className="row2">
          <div className="field">
            <label>Platform</label>
            <div className="tone-select">
              {PLATFORMS.map((p) => (
                <div
                  key={p.key}
                  className={`tone-chip${p.key === platform ? " active" : ""}`}
                  onClick={() => setPlatform(p.key)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setPlatform(p.key);
                    }
                  }}
                >
                  {p.label}
                </div>
              ))}
            </div>
          </div>
          <div className="field">
            <label>Tone</label>
            <div className="tone-select">
              {TONES.map((t) => (
                <div
                  key={t.key}
                  className={`tone-chip${t.key === tone ? " active" : ""}`}
                  onClick={() => setTone(t.key)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setTone(t.key);
                    }
                  }}
                >
                  {t.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <FieldInput field={AGENT_INFO_FIELD} value={agentInfo} onChange={(_key, value) => setAgentInfo(value)} />

        <button className="generate-btn" onClick={handleGenerate} disabled={loading}>
          <span className="dot" /> {loading ? "Writing a week of posts…" : "Generate a week of posts"}
        </button>
        {error ? <div className="error-box">{error}</div> : null}
      </div>

      {loading ? (
        <p className="library-empty">Drafting 5 posts…</p>
      ) : posts && posts.length > 0 ? (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <CopyButton text={allPostsText} />
          </div>
          {posts.map((p, i) => (
            <div className="post-card" key={i}>
              <div className="post-head">
                <span className="post-day">{p.day}</span>
                <span className="post-type">{p.type}</span>
              </div>
              <p className="post-caption">{p.caption}</p>
              {p.hashtags ? <div className="post-hashtags">{p.hashtags}</div> : null}
              <div className="post-photo">📷 {p.photo_idea}</div>
              <div className="comment-card-actions">
                <CopyButton text={postAsText(p)} />
              </div>
            </div>
          ))}
        </>
      ) : null}
    </div>
  );
}
