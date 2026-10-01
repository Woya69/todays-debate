"use client";

import type { Stance } from "@/types/debate";

interface Option {
  value: Stance;
  label: string;
  hint: string;
  mark: string;
}

const options: Option[] = [
  { value: "pro", label: "For", hint: "The motion holds", mark: "I." },
  { value: "undecided", label: "Undecided", hint: "Still weighing", mark: "II." },
  { value: "con", label: "Against", hint: "The motion fails", mark: "III." },
];

function accent(value: Stance, selected: boolean): string {
  if (value === "pro")
    return selected
      ? "border-pro bg-pro/10 text-foreground"
      : "border-border hover:border-pro";
  if (value === "con")
    return selected
      ? "border-con bg-con/10 text-foreground"
      : "border-border hover:border-con";
  return selected
    ? "border-foreground bg-foreground/[0.06] text-foreground"
    : "border-border hover:border-foreground";
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
          className={`group flex min-h-14 flex-col items-start border px-4 py-4 text-left transition sm:px-5 sm:py-5 ${accent(
            option.value,
            selected === option.value,
          )} disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <span className="label text-muted">{option.mark}</span>
          <span className="mt-2 font-display text-xl font-semibold sm:text-2xl">
            {option.label}
          </span>
          <span className="mt-1 text-sm text-muted">{option.hint}</span>
        </button>
      ))}
    </div>
  );
}
