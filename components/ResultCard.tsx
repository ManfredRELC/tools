import { CopyButton } from "./CopyButton";

export function ResultCard({
  eyebrow,
  headline,
  body,
}: {
  eyebrow: string;
  headline?: string;
  body: string;
}) {
  const copyText = headline ? `${headline}\n\n${body}` : body;

  return (
    <div className="result-card">
      <div className="result-card-head">
        <span className="result-eyebrow">
          <span className="pin" />
          {eyebrow}
        </span>
        <CopyButton text={copyText} />
      </div>
      <div className="result-body">
        {headline ? <p className="result-headline">{headline}</p> : null}
        <p>{body}</p>
      </div>
    </div>
  );
}
