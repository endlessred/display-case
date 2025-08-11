import * as React from "react";
import clsx from "clsx";

export type GlassButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export function GlassButton({ variant = "primary", size = "md", className, children, ...rest }: GlassButtonProps) {
  return (
    <button
      className={clsx(
        "ui-glass interactive",
        variant === "primary" && "btn-primary",
        variant === "ghost" && "btn-ghost",
        variant === "danger" && "btn-danger",
        size === "sm" && "btn-sm",
        size === "md" && "btn-md",
        size === "lg" && "btn-lg",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}