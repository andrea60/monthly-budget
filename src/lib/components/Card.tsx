import { forwardRef, HTMLAttributes, ReactNode } from "react";
import cn from "classnames";
export type CardProps = {
  title?: string;
  compact?: boolean;
  children?: ReactNode | undefined;
} & HTMLAttributes<HTMLDivElement>;
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ title, children, compact, className, ...props }, ref) => {
    return (
      <div
        className={cn("card bg-base-200 shadow-md", className)}
        {...props}
        ref={ref}
      >
        <div className={cn("card-body", { "p-5": compact })}>
          {title && <h1 className="card-title">{title}</h1>}
          {children}
        </div>
      </div>
    );
  }
);

Card.displayName = "Card";
