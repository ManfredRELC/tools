"use client";

export function ToneChips({
  options,
  selected,
  onChange,
  max,
}: {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  max: number;
}) {
  function toggle(option: string) {
    if (selected.includes(option)) {
      onChange(selected.filter((t) => t !== option));
      return;
    }
    if (selected.length >= max) return;
    onChange([...selected, option]);
  }

  return (
    <div className="tone-select">
      {options.map((option) => {
        const active = selected.includes(option);
        const disabled = !active && selected.length >= max;
        return (
          <div
            key={option}
            className={`tone-chip${active ? " active" : ""}${disabled ? " disabled" : ""}`}
            onClick={() => toggle(option)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle(option);
              }
            }}
          >
            {option}
          </div>
        );
      })}
    </div>
  );
}
