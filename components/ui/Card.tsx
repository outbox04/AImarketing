import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn("rounded-card border border-border bg-white p-5 shadow-card md:p-6", className)}
      {...props}
    />
  );
}
