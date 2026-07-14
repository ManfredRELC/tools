export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="field">
      <label>
        {label}
        {hint ? <span className="hint">({hint})</span> : null}
      </label>
      {children}
    </div>
  );
}
