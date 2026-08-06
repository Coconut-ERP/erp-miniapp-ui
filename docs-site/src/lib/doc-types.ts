import type { ReactNode } from "react";

export type DemoSpec = {
  title: string;
  description?: string;
  code: string;
  className?: string;
  render: () => ReactNode;
};

/** MUI-style props table row */
export type PropDef = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

export type DocSpec = {
  title: string;
  description: string;
  importLine: string;
  /** Live showcase sections (Basic, Variants, Color, Size, …) */
  demos: DemoSpec[];
  accessibility?: string[];
  /** Exported symbols */
  api?: string[];
  /** Props API table (like MUI Button API) */
  props?: PropDef[];
  /** Related demo links */
  related?: { label: string; href: string }[];
};
