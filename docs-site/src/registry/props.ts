import type { PropDef } from "@/lib/doc-types";

const nativeButton: PropDef[] = [
  {
    name: "…button props",
    type: "React.ComponentProps<'button'>",
    description: "All native button attributes (onClick, disabled, type, …) are supported.",
  },
];

/** Props API tables for each component page (MUI-style). */
export const componentProps: Record<string, PropDef[]> = {
  button: [
    {
      name: "variant",
      type: '"default" | "outline" | "secondary" | "ghost" | "destructive" | "link"',
      default: '"default"',
      description: "Visual style of the button (maps to emphasis / intent).",
    },
    {
      name: "size",
      type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"',
      default: '"default"',
      description: "Control height and padding. Use icon* sizes for icon-only buttons.",
    },
    {
      name: "asChild",
      type: "boolean",
      default: "false",
      description: "Merge props onto the child element (Radix Slot) instead of rendering a <button>.",
    },
    {
      name: "children",
      type: "ReactNode",
      description: "Button label and optional leading/trailing icons.",
    },
    ...nativeButton,
  ],
  badge: [
    {
      name: "variant",
      type: '"default" | "secondary" | "destructive" | "outline" | "ghost" | "link"',
      default: '"default"',
      description: "Badge visual style.",
    },
    {
      name: "asChild",
      type: "boolean",
      default: "false",
      description: "Render as child via Slot.",
    },
  ],
  checkbox: [
    {
      name: "checked",
      type: "boolean | 'indeterminate'",
      description: "Controlled checked state.",
    },
    {
      name: "defaultChecked",
      type: "boolean",
      description: "Uncontrolled initial checked state.",
    },
    {
      name: "onCheckedChange",
      type: "(checked: boolean | 'indeterminate') => void",
      description: "Called when the checked state changes.",
    },
    {
      name: "disabled",
      type: "boolean",
      default: "false",
      description: "Disables interaction.",
    },
  ],
  switch: [
    {
      name: "checked",
      type: "boolean",
      description: "Controlled on/off state.",
    },
    {
      name: "onCheckedChange",
      type: "(checked: boolean) => void",
      description: "Called when the switch is toggled.",
    },
    {
      name: "disabled",
      type: "boolean",
      default: "false",
      description: "Disables interaction.",
    },
  ],
  input: [
    {
      name: "type",
      type: "string",
      default: '"text"',
      description: "Native input type (email, password, search, …).",
    },
    {
      name: "disabled",
      type: "boolean",
      description: "Disables the field.",
    },
    {
      name: "aria-invalid",
      type: "boolean",
      description: "Marks the field invalid (destructive ring).",
    },
  ],
  textarea: [
    {
      name: "rows",
      type: "number",
      description: "Visible text rows.",
    },
    {
      name: "disabled",
      type: "boolean",
      description: "Disables the field.",
    },
  ],
  alert: [
    {
      name: "variant",
      type: '"default" | "destructive"',
      default: '"default"',
      description: "Alert intent / color treatment.",
    },
  ],
  card: [
    {
      name: "size",
      type: '"default" | "sm"',
      default: '"default"',
      description: "Card padding density.",
    },
  ],
  tabs: [
    {
      name: "defaultValue",
      type: "string",
      description: "Initially selected tab (uncontrolled).",
    },
    {
      name: "value",
      type: "string",
      description: "Controlled selected tab.",
    },
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      default: '"horizontal"',
      description: "Layout orientation.",
    },
  ],
  select: [
    {
      name: "defaultValue",
      type: "string",
      description: "Uncontrolled initial value.",
    },
    {
      name: "value",
      type: "string",
      description: "Controlled value.",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      description: "Called when selection changes.",
    },
    {
      name: "disabled",
      type: "boolean",
      description: "Disables the select.",
    },
  ],
  dialog: [
    {
      name: "open",
      type: "boolean",
      description: "Controlled open state.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      description: "Called when open state changes.",
    },
  ],
  "alert-dialog": [
    {
      name: "open",
      type: "boolean",
      description: "Controlled open state.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      description: "Called when open state changes.",
    },
  ],
  drawer: [
    {
      name: "open",
      type: "boolean",
      description: "Controlled open state.",
    },
    {
      name: "side",
      type: '"right" | "left" | "top" | "bottom"',
      default: '"right"',
      description: "Edge the drawer slides from (on DrawerContent).",
    },
  ],
  accordion: [
    {
      name: "type",
      type: '"single" | "multiple"',
      description: "Allow one or many open items.",
    },
    {
      name: "collapsible",
      type: "boolean",
      description: "When type=single, allow closing the open item.",
    },
  ],
  "radio-group": [
    {
      name: "defaultValue",
      type: "string",
      description: "Uncontrolled selected value.",
    },
    {
      name: "value",
      type: "string",
      description: "Controlled selected value.",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      description: "Selection change handler.",
    },
  ],
  label: [
    {
      name: "htmlFor",
      type: "string",
      description: "Id of the labeled control.",
    },
  ],
  separator: [
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      default: '"horizontal"',
      description: "Divider orientation.",
    },
  ],
  skeleton: [
    {
      name: "className",
      type: "string",
      description: "Size the placeholder with width/height utilities.",
    },
  ],
  spinner: [
    {
      name: "className",
      type: "string",
      description: "Override size (e.g. size-6).",
    },
  ],
  avatar: [
    {
      name: "AvatarImage.src",
      type: "string",
      description: "Image URL.",
    },
    {
      name: "AvatarFallback",
      type: "ReactNode",
      description: "Shown while loading or on error.",
    },
  ],
  tooltip: [
    {
      name: "delayDuration",
      type: "number",
      default: "200",
      description: "Open delay on TooltipProvider (ms).",
    },
  ],
  popover: [
    {
      name: "open",
      type: "boolean",
      description: "Controlled open state.",
    },
    {
      name: "align",
      type: '"start" | "center" | "end"',
      default: '"center"',
      description: "Alignment of PopoverContent.",
    },
  ],
  "dropdown-menu": [
    {
      name: "open",
      type: "boolean",
      description: "Controlled open state.",
    },
  ],
  pagination: [
    {
      name: "isActive",
      type: "boolean",
      description: "Marks PaginationLink as the current page.",
    },
  ],
  table: [
    {
      name: "…",
      type: "HTML table props",
      description: "Compositional primitives: Table, TableHeader, TableBody, TableRow, TableHead, TableCell.",
    },
  ],
  field: [
    {
      name: "orientation",
      type: "VariantProps",
      description: "Field layout orientation (see Field CVA).",
    },
  ],
  empty: [
    {
      name: "…",
      type: "div props",
      description: "Compose EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia, EmptyContent.",
    },
  ],
  "scroll-area": [
    {
      name: "className",
      type: "string",
      description: "Set a fixed height to enable scrolling.",
    },
  ],
  toast: [
    {
      name: "Toaster props",
      type: "ToasterProps (sonner)",
      description: "Theme, position, and toastOptions. Call toast() from sonner at the call site.",
    },
  ],
};
