"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: "sm" | "md";
}

export default function QuantitySelector({
  value,
  onChange,
  max = 99,
  size = "md",
}: QuantitySelectorProps) {
  const btnClass =
    size === "sm"
      ? "h-8 w-8"
      : "h-10 w-10";

  return (
    <div className="inline-flex items-center border border-border">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className={`${btnClass} flex items-center justify-center text-muted transition-colors hover:text-foreground`}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className={`min-w-[2.5rem] text-center text-sm font-medium ${size === "sm" ? "px-2" : "px-4"}`}>
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={`${btnClass} flex items-center justify-center text-muted transition-colors hover:text-foreground disabled:opacity-30`}
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
