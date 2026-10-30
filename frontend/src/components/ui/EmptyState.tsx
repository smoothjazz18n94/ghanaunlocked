import type { ReactNode } from "react";

interface Props {
  title: string;
  message: string;
  action?: ReactNode;
}

export function EmptyState({ title, message, action }: Props) {
  return (
    <div className="state">
      <h2 className="state__title">{title}</h2>
      <p className="state__text">{message}</p>
      {action}
    </div>
  );
}
