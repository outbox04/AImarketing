import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-text-main outline-none transition placeholder:text-text-soft focus:border-primary focus:ring-4 focus:ring-primary/10",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
