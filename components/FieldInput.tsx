"use client";

import { FieldDef } from "@/lib/categories";
import { Field } from "./Field";
import { MicButton } from "./MicButton";

export function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string;
  onChange: (key: string, value: string) => void;
}) {
  const commonProps = {
    id: `f-${field.key}`,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      onChange(field.key, e.target.value),
  };

  return (
    <Field label={field.label} hint={field.hint}>
      {field.type === "textarea" ? (
        <div className="textarea-wrap">
          <textarea {...commonProps} placeholder={field.placeholder} />
          <MicButton
            onTranscript={(text) => onChange(field.key, value.trim() ? `${value.trim()} ${text}` : text)}
          />
        </div>
      ) : field.type === "select" ? (
        <select {...commonProps}>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...commonProps}
          type={field.type}
          placeholder={field.placeholder}
          min={field.type === "number" ? 0 : undefined}
        />
      )}
    </Field>
  );
}
