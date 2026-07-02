import type { ElementType, ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../../lib/cn";

type CardProps<T extends ElementType = "div"> = {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  accentTop?: boolean;
  active?: boolean;
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function Card<T extends ElementType = "div">({
  children,
  className,
  interactive = false,
  accentTop = true,
  active = false,
  as,
  ...props
}: CardProps<T>) {
  const Tag = as || "div";

  return (
    <Tag
      className={cn(
        "ui-card",
        interactive && "ui-card-interactive",
        accentTop && "ui-card-top-accent",
        active && "is-active",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function CardMedia({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("ui-card-media", className)}>{children}</div>;
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("ui-card-body", className)}>{children}</div>;
}
