"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, Check, ChevronDown } from "lucide-react";
import type { SelectOption } from "@/components/ui/UiSelect";

interface SortDropdownProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: readonly SelectOption<T>[];
  className?: string;
}

export default function SortDropdown<T extends string = string>({
  value,
  onChange,
  options,
  className = "",
}: SortDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative min-w-0 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`ui-control flex h-10 w-full items-center gap-2 px-3 text-left transition-colors hover:border-accent/30 ${
          open ? "border-accent/40 ring-2 ring-accent/10" : ""
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <ArrowUpDown className="h-4 w-4 shrink-0 text-accent" />
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
          {selected?.label ?? "Sort"}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[calc(100%+0.375rem)] right-0 z-50 w-full min-w-[13rem] overflow-hidden rounded-xl border border-border bg-white shadow-lg"
            role="listbox"
          >
            <p className="border-b border-border px-3 py-2 text-[0.625rem] font-semibold tracking-wide text-muted uppercase">
              Sort by
            </p>
            <ul className="max-h-64 overflow-y-auto py-1">
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onChange(opt.value);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm transition-colors ${
                        isSelected
                          ? "bg-accent-light font-semibold text-accent"
                          : "text-foreground hover:bg-neutral-50"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check className="h-4 w-4 shrink-0" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
