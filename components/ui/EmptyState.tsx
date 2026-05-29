import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { Card } from "./Card";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center text-center">
      <div className="mb-4 rounded-2xl bg-primary-soft p-3 text-primary">
        <Inbox size={22} />
      </div>
      <h3 className="text-base font-bold text-text-main">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-text-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  );
}
