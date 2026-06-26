"use client";

import { LayoutGrid, List } from "lucide-react";

interface ViewToggleProps {
  view: "grid" | "list";
  onChange: (view: "grid" | "list") => void;
  className?: string;
}

export default function ViewToggle({ view, onChange, className = "" }: ViewToggleProps) {
  return (
    <div
      className={`ui-control flex h-10 shrink-0 items-center gap-0.5 p-1 ${className}`}
      role="group"
      aria-label="Product view"
    >
      <button
        type="button"
        onClick={() => onChange("grid")}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
          view === "grid"
            ? "bg-accent text-white shadow-sm"
            : "text-muted hover:bg-neutral-50 hover:text-foreground"
        }`}
        aria-label="Grid view"
        aria-pressed={view === "grid"}
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onChange("list")}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
          view === "list"
            ? "bg-accent text-white shadow-sm"
            : "text-muted hover:bg-neutral-50 hover:text-foreground"
        }`}
        aria-label="List view"
        aria-pressed={view === "list"}
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
}
