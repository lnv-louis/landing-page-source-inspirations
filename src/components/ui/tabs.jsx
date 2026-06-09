import React from "react";
import { cn } from "../../lib/utils.js";

export function SegmentedControl({ className, options, value, onChange }) {
  return (
    <div
      className={cn(
        "inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm",
        className,
      )}
      role="tablist"
    >
      {options.map((option) => (
        <button
          aria-selected={option.value === value}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-semibold text-slate-500 transition-colors",
            option.value === value && "bg-slate-950 text-white",
          )}
          key={option.value}
          onClick={() => onChange(option.value)}
          role="tab"
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
