import { ReactNode } from "react";
import cn from "classnames";
export type CardProps = {
  title?: string;
  compact?: boolean;
  children?: ReactNode | undefined;
};
export const Card = ({ title, children, compact }: CardProps) => {
  return (
    <div className={cn("card bg-base-200 shadow-md")}>
      <div className={cn("card-body", { "p-5": compact })}>
        {title && <h1 className="card-title">{title}</h1>}
        {children}
      </div>
    </div>
  );
};
