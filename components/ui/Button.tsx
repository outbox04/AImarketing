"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition hover:-translate-y-0.5 focus-visible:focus-ring disabled:pointer-events-none disabled:opacity-50",
          size === "sm" ? "h-9 px-3 text-sm" : "h-11 px-4 text-sm",
          variant === "primary" &&
            "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-lg shadow-indigo-200",
          variant === "secondary" && "border border-border bg-white text-gray-700 shadow-sm hover:bg-surface-soft",
          variant === "danger" && "bg-danger-soft text-red-700 hover:bg-red-100",
          variant === "ghost" && "text-text-muted hover:bg-surface-soft hover:text-text-main",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
