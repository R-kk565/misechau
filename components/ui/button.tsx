import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "ghost" | "outline";
type Size = "sm" | "md";

const variantClass: Record<Variant, string> = {
  solid: "bg-fg text-bg hover:bg-accent hover:text-bg",
  ghost: "bg-transparent text-fg hover:text-accent",
  outline: "border border-line bg-transparent text-fg hover:border-accent hover:text-accent",
};

const sizeClass: Record<Size, string> = {
  sm: "h-9 px-4 text-[11px]",
  md: "h-11 px-6 text-xs",
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "solid", size = "md", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-full tracking-[0.18em] uppercase",
        "transition-colors duration-300 disabled:pointer-events-none disabled:opacity-40",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
