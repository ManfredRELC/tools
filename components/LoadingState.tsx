export function LoadingState({ text }: { text: string }) {
  return (
    <div className="loading-state">
      <div className="spinner" />
      <p className="loading-text">{text}</p>
    </div>
  );
}
