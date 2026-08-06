/** Shared helpers safe for client + server. */

export type ColorToken = {
  /** CSS variable name without `--` (e.g. `primary-foreground`) */
  name: string;
  /** Raw value from globals.css `:root` */
  value: string;
};

export function textOnToken(name: string, all: Set<string>): string {
  if (name.endsWith("-foreground")) return "var(--background)";
  const fg = `${name}-foreground`;
  if (all.has(fg)) return `var(--${fg})`;
  if (name === "background" || name === "surface" || name === "card" || name === "popover") {
    return "var(--foreground)";
  }
  if (
    name === "foreground" ||
    name === "muted-foreground" ||
    name === "card-foreground" ||
    name === "popover-foreground" ||
    name === "secondary-foreground" ||
    name === "accent-foreground" ||
    name === "primary-foreground" ||
    name === "success-foreground" ||
    name === "warning-foreground"
  ) {
    return "var(--background)";
  }
  if (name === "border" || name === "input") return "var(--foreground)";
  if (name === "destructive" || name === "primary" || name === "ring") return "var(--primary-foreground)";
  if (name === "success") return "var(--success-foreground)";
  if (name === "warning") return "var(--warning-foreground)";
  return "var(--foreground)";
}
