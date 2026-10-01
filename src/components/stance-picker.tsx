"use client";

import type { Stance } from "@/types/debate";

interface Option {
  value: Stance;
  label: string;
  hint: string;
}

const options: Option[] = [
  { value: "pro", label: "YES", hint: "Take this corner" },
  { value: "undecided", label: "WATCH", hint: "Spectate for now" },
  { value: "con", label: "NO", hint: "Take this corner" },
];

function accent(value: Stance, selected: boolean): string {
  if (value === "pro")
    return selected
      ? "corner-pro animate-corner-pro bg-pro/10 text-foreground"
      : "border-border hover:border-pro";
  if (value === "con")
    return selected
      ? "corner-con animate-corner-con bg-con/10 text-foreground"
      : "border-border hover:border-con";
  return selected
    ? "border-foreground/50 bg-foreground/[0.06] text-foreground"
    : "border-border hover:border-foreground/40";
}

interface StancePickerProps {
  selected: Stance | null;
  onSelect: (stance: Stance) => void;
  disabled?: boolean;
}

export function StancePicker({ selected, onSelect, disabled }: StancePickerProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(option.value)}
          className={`group flex min-h-14 flex-col items-start rounded-2xl border px-4 py-5 text-left transition ${accent(
            option.value,
            selected === option.value,
          )} disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <span
            className={`label ${
              option.value === "pro"
                ? "text-pro"
                : option.value === "con"
                  ? "text-con"
                  : "text-muted"
            }`}
          >
            Corner
          </span>
          <span className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
            {option.label}
          </span>
          <span className="mt-1 text-sm text-muted">{option.hint}</span>
        </button>
      ))}
    </div>
  );
}
