import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-full border border-line bg-card px-5 text-sm text-fg",
        "placeholder:text-muted focus:border-accent focus:outline-none",
        "transition-colors duration-300",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
