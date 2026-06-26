"use client";

import { ChevronDown } from "lucide-react";

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface UiSelectProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: readonly SelectOption<T>[];
  label?: string;
  id?: string;
  className?: string;
}

export default function UiSelect<T extends string = string>({
  value,
  onChange,
  options,
  label,
  id,
  className = "",
}: UiSelectProps<T>) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`relative min-w-0 ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-[0.625rem] font-semibold tracking-wide text-muted uppercase"
        >
          {label}
        </label>
      )}
      <div className="ui-control relative h-10">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="ui-select h-full w-full cursor-pointer appearance-none pl-3 pr-11 text-sm font-medium text-foreground outline-none"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute top-1/2 right-1.5 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-neutral-100 text-muted"
          aria-hidden
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}
