import React from "react";
import { Slot } from "./slot.jsx";
import { cn } from "../../lib/utils.js";

const variants = {
  default:
    "bg-slate-950 text-white shadow-sm hover:bg-slate-800 focus-visible:ring-slate-400",
  secondary:
    "border border-slate-200 bg-white text-slate-950 shadow-sm hover:bg-slate-50 focus-visible:ring-slate-300",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-300",
  accent:
    "bg-teal-700 text-white shadow-sm hover:bg-teal-800 focus-visible:ring-teal-300",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
  icon: "h-10 w-10 p-0",
};

export function Button({
  asChild = false,
  className,
  size = "md",
  variant = "default",
  ...props
}) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-semibold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
