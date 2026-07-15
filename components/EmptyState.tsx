export function EmptyState({
  title,
  desc,
  tone = "neutral",
}: {
  title: string;
  desc: string;
  tone?: "neutral" | "error";
}) {
  const stroke = tone === "error" ? "#A8483C" : "#4B5563";
  return (
    <div className="empty-state">
      {tone === "error" ? (
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.4">
          <path d="M12 8v5m0 3h.01M10.3 3.9 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        </svg>
      ) : (
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.4">
          <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5Z" />
        </svg>
      )}
      <p className="title" style={tone === "error" ? { color: "var(--rust)" } : undefined}>
        {title}
      </p>
      <p className="desc">{desc}</p>
    </div>
  );
}
