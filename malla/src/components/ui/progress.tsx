import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}
export function Progress({ value = 0, className, ...props }: ProgressProps) {
  const v = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-rose-100", className)} {...props}>
      <div className="h-full bg-rose-500 transition-all" style={{ width: `${v}%` }} />
    </div>
  );
}
