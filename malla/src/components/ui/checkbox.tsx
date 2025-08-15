import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  // opcional, compatible con la API de shadcn/Radix
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, onChange, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border-rose-300 text-rose-600 focus:ring-rose-400",
        className
      )}
      // disparamos ambos: el nativo y el "compat"
      onChange={(e) => {
        onChange?.(e);
        onCheckedChange?.(e.currentTarget.checked);
      }}
      {...props}
    />
  )
);
Checkbox.displayName = "Checkbox";
