import * as React from "react";
import { GlassSurface, GlassSurfaceProps } from "../surface";

export type GlassCardProps = Omit<GlassSurfaceProps, "as"> & {
  header?: React.ReactNode;
  footer?: React.ReactNode;
};

export function GlassCard({ header, footer, children, ...rest }: GlassCardProps) {
  return (
    <GlassSurface role="region" aria-label={typeof header === "string" ? header : undefined} {...rest}>
      {header && <div style={{ padding: 16, paddingBottom: 8 }}>{header}</div>}
      <div style={{ padding: 16 }}>{children}</div>
      {footer && <div style={{ padding: 16, paddingTop: 8 }}>{footer}</div>}
    </GlassSurface>
  );
}