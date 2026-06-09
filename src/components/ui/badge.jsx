import React from "react";
import { cn } from "../../lib/utils.js";

export function Badge({ className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700",
        className,
      )}
      {...props}
    />
  );
}
