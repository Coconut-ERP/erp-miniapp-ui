import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "src/components/ui");
const out = path.join(root, "docs/components");

const meta = {
  button: {
    title: "Button",
    purpose: "Primary interactive control for actions and navigation.",
    import: "Button, buttonVariants",
    example: `<Button variant="default">Save</Button>\n<Button variant="outline" size="sm">Cancel</Button>`,
  },
  input: {
    title: "Input",
    purpose: "Single-line text field for forms.",
    import: "Input",
    example: `<Input type="email" placeholder="Email" />`,
  },
  textarea: {
    title: "Textarea",
    purpose: "Multi-line text field.",
    import: "Textarea",
    example: `<Textarea placeholder="Notes" rows={4} />`,
  },
  select: {
    title: "Select",
    purpose: "Choose one option from a list.",
    import: "Select, SelectTrigger, SelectValue, SelectContent, SelectItem",
    example: `<Select>\n  <SelectTrigger><SelectValue placeholder="Pick" /></SelectTrigger>\n  <SelectContent>\n    <SelectItem value="a">A</SelectItem>\n  </SelectContent>\n</Select>`,
  },
  badge: {
    title: "Badge",
    purpose: "Compact status or category label.",
    import: "Badge, badgeVariants",
    example: `<Badge variant="secondary">Active</Badge>`,
  },
  card: {
    title: "Card",
    purpose: "Surface container for grouped content.",
    import: "Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction",
    example: `<Card>\n  <CardHeader><CardTitle>Title</CardTitle></CardHeader>\n  <CardContent>Body</CardContent>\n</Card>`,
  },
  dialog: {
    title: "Dialog",
    purpose: "Modal overlay for focused tasks.",
    import:
      "Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose",
    example: `<Dialog>\n  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>\n  <DialogContent>\n    <DialogHeader><DialogTitle>Edit</DialogTitle></DialogHeader>\n  </DialogContent>\n</Dialog>`,
  },
  "alert-dialog": {
    title: "Alert Dialog",
    purpose: "Modal confirmation that interrupts for a decision.",
    import:
      "AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel",
    example: `<AlertDialog>\n  <AlertDialogTrigger asChild><Button variant="destructive">Delete</Button></AlertDialogTrigger>\n  <AlertDialogContent>\n    <AlertDialogHeader><AlertDialogTitle>Sure?</AlertDialogTitle></AlertDialogHeader>\n    <AlertDialogFooter>\n      <AlertDialogCancel>Cancel</AlertDialogCancel>\n      <AlertDialogAction>Confirm</AlertDialogAction>\n    </AlertDialogFooter>\n  </AlertDialogContent>\n</AlertDialog>`,
  },
  drawer: {
    title: "Drawer",
    purpose: "Side or edge panel for filters and secondary flows (Dialog-based; see ADR 001).",
    import:
      "Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose",
    example: `<Drawer>\n  <DrawerTrigger asChild><Button>Filters</Button></DrawerTrigger>\n  <DrawerContent side="right">\n    <DrawerHeader><DrawerTitle>Filters</DrawerTitle></DrawerHeader>\n  </DrawerContent>\n</Drawer>`,
  },
  "dropdown-menu": {
    title: "Dropdown Menu",
    purpose: "Contextual action menu anchored to a trigger.",
    import:
      "DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator",
    example: `<DropdownMenu>\n  <DropdownMenuTrigger asChild><Button variant="outline">Menu</Button></DropdownMenuTrigger>\n  <DropdownMenuContent>\n    <DropdownMenuItem>Edit</DropdownMenuItem>\n  </DropdownMenuContent>\n</DropdownMenu>`,
  },
  popover: {
    title: "Popover",
    purpose: "Non-modal floating panel for rich content.",
    import: "Popover, PopoverTrigger, PopoverContent",
    example: `<Popover>\n  <PopoverTrigger asChild><Button variant="outline">Info</Button></PopoverTrigger>\n  <PopoverContent>Details</PopoverContent>\n</Popover>`,
  },
  tooltip: {
    title: "Tooltip",
    purpose: "Short hint on hover/focus.",
    import: "TooltipProvider, Tooltip, TooltipTrigger, TooltipContent",
    example: `<TooltipProvider>\n  <Tooltip>\n    <TooltipTrigger asChild><Button size="icon" aria-label="Help">?</Button></TooltipTrigger>\n    <TooltipContent>Help text</TooltipContent>\n  </Tooltip>\n</TooltipProvider>`,
  },
  tabs: {
    title: "Tabs",
    purpose: "Switch between related views in-place.",
    import: "Tabs, TabsList, TabsTrigger, TabsContent",
    example: `<Tabs defaultValue="one">\n  <TabsList><TabsTrigger value="one">One</TabsTrigger></TabsList>\n  <TabsContent value="one">Panel</TabsContent>\n</Tabs>`,
  },
  accordion: {
    title: "Accordion",
    purpose: "Expand/collapse sections of content.",
    import: "Accordion, AccordionItem, AccordionTrigger, AccordionContent",
    example: `<Accordion type="single" collapsible>\n  <AccordionItem value="a">\n    <AccordionTrigger>Section</AccordionTrigger>\n    <AccordionContent>Body</AccordionContent>\n  </AccordionItem>\n</Accordion>`,
  },
  checkbox: {
    title: "Checkbox",
    purpose: "Boolean or multi-select control.",
    import: "Checkbox",
    example: `<Checkbox id="tos" />\n<Label htmlFor="tos">Accept</Label>`,
  },
  "radio-group": {
    title: "Radio Group",
    purpose: "Choose exactly one option from a set.",
    import: "RadioGroup, RadioGroupItem",
    example: `<RadioGroup defaultValue="a">\n  <div className="flex items-center gap-2">\n    <RadioGroupItem value="a" id="a" />\n    <Label htmlFor="a">A</Label>\n  </div>\n</RadioGroup>`,
  },
  switch: {
    title: "Switch",
    purpose: "Immediate on/off toggle.",
    import: "Switch",
    example: `<Switch aria-label="Notifications" />`,
  },
  avatar: {
    title: "Avatar",
    purpose: "User or entity image with fallback.",
    import: "Avatar, AvatarImage, AvatarFallback",
    example: `<Avatar><AvatarFallback>LA</AvatarFallback></Avatar>`,
  },
  alert: {
    title: "Alert",
    purpose: "Inline status message on a page.",
    import: "Alert, AlertTitle, AlertDescription, AlertAction",
    example: `<Alert>\n  <AlertTitle>Saved</AlertTitle>\n  <AlertDescription>Profile updated.</AlertDescription>\n</Alert>`,
  },
  skeleton: {
    title: "Skeleton",
    purpose: "Placeholder pulse while content loads.",
    import: "Skeleton",
    example: `<Skeleton className="h-4 w-40" />`,
  },
  table: {
    title: "Table",
    purpose: "Semantic HTML table primitives for data display.",
    import:
      "Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption, TableFooter",
    example: `<Table>\n  <TableHeader><TableRow><TableHead>Name</TableHead></TableRow></TableHeader>\n  <TableBody><TableRow><TableCell>Ada</TableCell></TableRow></TableBody>\n</Table>`,
  },
  pagination: {
    title: "Pagination",
    purpose: "Navigate multi-page result sets.",
    import:
      "Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis",
    example: `<Pagination>\n  <PaginationContent>\n    <PaginationItem><PaginationPrevious href="#" /></PaginationItem>\n    <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>\n    <PaginationItem><PaginationNext href="#" /></PaginationItem>\n  </PaginationContent>\n</Pagination>`,
  },
  label: {
    title: "Label",
    purpose: "Accessible label for form controls.",
    import: "Label",
    example: `<Label htmlFor="name">Name</Label>`,
  },
  field: {
    title: "Field",
    purpose: "Compose label, control, description, and error for forms.",
    import:
      "Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldContent, FieldSet, FieldLegend, FieldTitle, FieldSeparator",
    example: `<Field>\n  <FieldLabel htmlFor="email">Email</FieldLabel>\n  <Input id="email" />\n  <FieldDescription>Work email</FieldDescription>\n</Field>`,
  },
  separator: {
    title: "Separator",
    purpose: "Visual divider between sections.",
    import: "Separator",
    example: `<Separator />`,
  },
  "scroll-area": {
    title: "Scroll Area",
    purpose: "Styled scrollable region.",
    import: "ScrollArea, ScrollBar",
    example: `<ScrollArea className="h-48"><div>Long content</div></ScrollArea>`,
  },
  empty: {
    title: "Empty",
    purpose: "Empty-state layout for lists and panels.",
    import: "Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent",
    example: `<Empty>\n  <EmptyHeader>\n    <EmptyTitle>No records</EmptyTitle>\n    <EmptyDescription>Create the first one.</EmptyDescription>\n  </EmptyHeader>\n</Empty>`,
  },
  spinner: {
    title: "Spinner",
    purpose: "Indeterminate loading indicator.",
    import: "Spinner",
    example: `<Spinner className="size-4" />`,
  },
  sonner: {
    title: "Toast (Sonner)",
    purpose: "App-level toast host; call toast() from sonner.",
    import: "Toaster",
    example: `// layout\n<Toaster />\n\n// call site\nimport { toast } from "sonner";\ntoast.success("Saved");`,
  },
};

fs.mkdirSync(out, { recursive: true });
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".tsx"));
const indexRows = [];

for (const file of files) {
  const id = file.replace(/\.tsx$/, "");
  const m = meta[id] ?? {
    title: id,
    purpose: `${id} primitive.`,
    import: id,
    example: "/* see source */",
  };
  const source = `src/components/ui/${file}`;
  const doc = `# ${m.title}

## Purpose

${m.purpose}

## Import

\`\`\`ts
import { ${m.import} } from "@erp/miniapp-ui";
\`\`\`

## Props

Follows the underlying Radix / native element props unless noted. Prefer composition over prop sprawl.

## Variants

See source CVA / \`data-variant\` where applicable. Prefer documented variants only — do not invent ad-hoc color classes.

## Sizes

Use library size props (\`size\` on Button and similar controls) instead of one-off height classes.

## Accessibility

- Keyboard reachable; visible \`focus-visible\` ring.
- Icon-only triggers need \`aria-label\`.
- Pair form controls with \`Label\` / \`Field\`.
- See [foundations/accessibility.md](../foundations/accessibility.md).

## Do

- Use design tokens (\`bg-primary\`, \`text-muted-foreground\`, …).
- Compose with other library primitives.

## Don't

- Don't fork styling with hard-coded colors.
- Don't bypass Radix for custom focus traps on overlays.

## Example

\`\`\`tsx
import { ${m.import} } from "@erp/miniapp-ui";

${m.example}
\`\`\`

## API

Public exports: \`${m.import}\`.

## Source

\`${source}\`
`;
  fs.writeFileSync(path.join(out, `${id}.md`), doc);
  indexRows.push(`| [${m.title}](./${id}.md) | \`${id}\` |`);
}

const readme = `# Components

Catalog of \`@erp/miniapp-ui\` primitives. Each page follows: Purpose, Import, Props, Variants, Sizes, Accessibility, Do/Don't, Example, API, Source.

| Component | Id |
| --- | --- |
${indexRows.sort().join("\n")}
`;
fs.writeFileSync(path.join(out, "README.md"), readme);
console.log("wrote", files.length, "component docs");
