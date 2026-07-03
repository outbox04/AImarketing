"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

type ModalProps = {
  title: string;
  open: boolean;
  children: ReactNode;
  onClose?: () => void;
};

export function Modal({ title, open, children, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/20 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-card border border-border bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-main">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Đóng modal">
            <X size={18} />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
