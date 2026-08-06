"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  Field,
  FieldDescription,
  FieldLabel,
  Input,
  Label,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Skeleton,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@erp/miniapp-ui";
import type { DocSpec } from "@/lib/doc-types";

function ControlledCheckbox() {
  const [checked, setChecked] = useState(true);
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id="controlled"
        checked={checked}
        onCheckedChange={(v) => setChecked(v === true)}
      />
      <Label htmlFor="controlled">{checked ? "Checked" : "Unchecked"}</Label>
    </div>
  );
}

function ControlledSwitch() {
  const [on, setOn] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <Switch checked={on} onCheckedChange={setOn} id="sw" />
      <Label htmlFor="sw">{on ? "On" : "Off"}</Label>
    </div>
  );
}

export const componentDocs: Record<string, DocSpec> = {
  accordion: {
    title: "Accordion",
    description: "Expand and collapse sections of related content.",
    importLine: `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<Accordion type="single" collapsible className="w-full max-w-md">
  <AccordionItem value="a">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>Yes. It follows WAI-ARIA patterns.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="b">
    <AccordionTrigger>Can I use multiple?</AccordionTrigger>
    <AccordionContent>Use type="multiple" for that.</AccordionContent>
  </AccordionItem>
</Accordion>`,
        className: "items-stretch justify-start",
        render: () => (
          <Accordion type="single" collapsible className="w-full max-w-md">
            <AccordionItem value="a">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>Yes. It follows WAI-ARIA patterns.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger>Can I use multiple?</AccordionTrigger>
              <AccordionContent>Use type=&quot;multiple&quot; for that.</AccordionContent>
            </AccordionItem>
          </Accordion>
        ),
      },
    ],
    accessibility: ["Triggers are buttons; content is revealed for assistive tech."],
    api: ["Accordion", "AccordionItem", "AccordionTrigger", "AccordionContent"],
  },

  alert: {
    title: "Alert",
    description: "Inline status messages for page-level feedback — variants map to semantic color.",
    importLine: `import { Alert, AlertTitle, AlertDescription } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<Alert>
  <AlertTitle>Heads up</AlertTitle>
  <AlertDescription>You can add components to your app using the library.</AlertDescription>
</Alert>`,
        className: "items-stretch",
        render: () => (
          <Alert className="max-w-lg">
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>
              You can add components to your app using the library.
            </AlertDescription>
          </Alert>
        ),
      },
      {
        title: "Variants / color",
        description: "default for neutral info; destructive for errors.",
        code: `<Alert variant="default">…</Alert>
<Alert variant="destructive">…</Alert>`,
        className: "flex-col items-stretch gap-4 w-full max-w-lg",
        render: () => (
          <div className="flex w-full max-w-lg flex-col gap-4">
            <Alert>
              <AlertTitle>Info</AlertTitle>
              <AlertDescription>Neutral status message.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Your session has expired. Please sign in again.</AlertDescription>
            </Alert>
          </div>
        ),
      },
      {
        title: "Semantic success / warning",
        code: `<Alert className="border-success/30 text-success">
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>Profile saved.</AlertDescription>
</Alert>`,
        className: "flex-col items-stretch gap-4 w-full max-w-lg",
        render: () => (
          <div className="flex w-full max-w-lg flex-col gap-4">
            <Alert className="border-success/40 text-foreground">
              <AlertTitle className="text-success">Success</AlertTitle>
              <AlertDescription>Profile saved.</AlertDescription>
            </Alert>
            <Alert className="border-warning/50 text-foreground">
              <AlertTitle className="text-warning-foreground">Warning</AlertTitle>
              <AlertDescription>Quota is almost full.</AlertDescription>
            </Alert>
          </div>
        ),
      },
    ],
    api: ["Alert", "AlertTitle", "AlertDescription", "AlertAction"],
  },

  "alert-dialog": {
    title: "Alert Dialog",
    description: "Modal confirmation that interrupts the user for a decision.",
    importLine: `import { AlertDialog, AlertDialogTrigger, AlertDialogContent, … } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<AlertDialog>
  <AlertDialogTrigger asChild><Button variant="destructive">Delete</Button></AlertDialogTrigger>
  <AlertDialogContent>…</AlertDialogContent>
</AlertDialog>`,
        render: () => (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ),
      },
    ],
    accessibility: ["Focus is trapped; Esc cancels; title is announced."],
    api: [
      "AlertDialog",
      "AlertDialogTrigger",
      "AlertDialogContent",
      "AlertDialogHeader",
      "AlertDialogTitle",
      "AlertDialogDescription",
      "AlertDialogFooter",
      "AlertDialogAction",
      "AlertDialogCancel",
    ],
  },

  avatar: {
    title: "Avatar",
    description: "User or entity image with fallback initials.",
    importLine: `import { Avatar, AvatarImage, AvatarFallback } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<Avatar>
  <AvatarImage src="…" alt="Ada" />
  <AvatarFallback>AL</AvatarFallback>
</Avatar>`,
        render: () => (
          <>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
          </>
        ),
      },
    ],
    api: ["Avatar", "AvatarImage", "AvatarFallback", "AvatarBadge", "AvatarGroup"],
  },

  badge: {
    title: "Badge",
    description: "Compact status or category label. Showcase every variant like a MUI Chip/Badge page.",
    importLine: `import { Badge } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<Badge>Default</Badge>`,
        render: () => <Badge>Default</Badge>,
      },
      {
        title: "Variants",
        description: "All badge variants from the design system.",
        code: `<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="ghost">Ghost</Badge>
<Badge variant="link">Link</Badge>`,
        render: () => (
          <>
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="ghost">Ghost</Badge>
            <Badge variant="link">Link</Badge>
          </>
        ),
      },
      {
        title: "Semantic colors",
        code: `<Badge className="bg-success text-success-foreground">Success</Badge>
<Badge className="bg-warning text-warning-foreground">Warning</Badge>
<Badge variant="destructive">Error</Badge>`,
        render: () => (
          <>
            <Badge className="bg-success text-success-foreground">Success</Badge>
            <Badge className="bg-warning text-warning-foreground">Warning</Badge>
            <Badge variant="destructive">Error</Badge>
          </>
        ),
      },
    ],
    api: ["Badge", "badgeVariants"],
  },

  button: {
    title: "Button",
    description:
      "Buttons allow users to take actions and make choices with a single tap. Showcase covers variants, sizes, disabled state, icons, and click handling — same structure as Material UI docs.",
    importLine: `import { Button } from "@erp/miniapp-ui";`,
    related: [
      { label: "Badge", href: "/components/badge" },
      { label: "Dialog", href: "/components/dialog" },
    ],
    demos: [
      {
        title: "Basic button",
        description: "The three most common emphasis levels for ERP mini apps.",
        code: `<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>`,
        render: () => (
          <>
            <Button>Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </>
        ),
      },
      {
        title: "Variants",
        description:
          "Use variant to map intent: primary action, secondary, quiet, destructive, or text link.",
        code: `<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>`,
        render: () => (
          <>
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </>
        ),
      },
      {
        title: "Semantic colors",
        description:
          "This library encodes color via variant (not a separate color prop). Map MUI-style intents like this.",
        code: `<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Error / Destructive</Button>
<Button className="bg-success text-success-foreground hover:bg-success/90">Success</Button>
<Button className="bg-warning text-warning-foreground hover:bg-warning/90">Warning</Button>`,
        render: () => (
          <>
            <Button variant="default">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Error</Button>
            <Button className="bg-success text-success-foreground hover:bg-success/90">
              Success
            </Button>
            <Button className="bg-warning text-warning-foreground hover:bg-warning/90">
              Warning
            </Button>
          </>
        ),
      },
      {
        title: "Sizes",
        code: `<Button size="xs">XS</Button>
<Button size="sm">SM</Button>
<Button size="default">Default</Button>
<Button size="lg">LG</Button>`,
        render: () => (
          <>
            <Button size="xs">XS</Button>
            <Button size="sm">SM</Button>
            <Button size="default">Default</Button>
            <Button size="lg">LG</Button>
          </>
        ),
      },
      {
        title: "Icon buttons",
        description: "Icon-only sizes require an accessible name.",
        code: `<Button size="icon" aria-label="Add">+</Button>
<Button size="icon-sm" variant="outline" aria-label="More">…</Button>
<Button size="icon-lg" variant="secondary" aria-label="Star">★</Button>`,
        render: () => (
          <>
            <Button size="icon" aria-label="Add">
              +
            </Button>
            <Button size="icon-sm" variant="outline" aria-label="More">
              …
            </Button>
            <Button size="icon-lg" variant="secondary" aria-label="Star">
              ★
            </Button>
          </>
        ),
      },
      {
        title: "Disabled",
        code: `<Button disabled>Default</Button>
<Button variant="outline" disabled>Outline</Button>
<Button variant="destructive" disabled>Destructive</Button>`,
        render: () => (
          <>
            <Button disabled>Default</Button>
            <Button variant="outline" disabled>
              Outline
            </Button>
            <Button variant="destructive" disabled>
              Destructive
            </Button>
          </>
        ),
      },
      {
        title: "Handling clicks",
        description: "Use the native onClick handler (ButtonBase-equivalent props are forwarded).",
        code: `<Button
  onClick={() => {
    alert("clicked");
  }}
>
  Click me
</Button>`,
        render: () => (
          <Button
            onClick={() => {
              alert("clicked");
            }}
          >
            Click me
          </Button>
        ),
      },
      {
        title: "As child (link)",
        description: "Render as an anchor while keeping button styles via asChild.",
        code: `<Button asChild variant="outline">
  <a href="#api">Jump to API</a>
</Button>`,
        render: () => (
          <Button asChild variant="outline">
            <a href="#api">Jump to API</a>
          </Button>
        ),
      },
    ],
    accessibility: [
      "Icon-only buttons need aria-label.",
      "Prefer Button for actions; use variant=link or asChild+anchor for navigation.",
      "Disabled buttons are not focusable (pointer-events-none + opacity).",
    ],
    api: ["Button", "buttonVariants"],
  },

  card: {
    title: "Card",
    description: "Surface container for grouped content.",
    importLine: `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<Card className="w-full max-w-sm">
  <CardHeader>
    <CardTitle>Team</CardTitle>
    <CardDescription>Invite members</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter><Button>Invite</Button></CardFooter>
</Card>`,
        className: "items-stretch justify-center",
        render: () => (
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Team</CardTitle>
              <CardDescription>Invite members to collaborate.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              You have 3 open invites.
            </CardContent>
            <CardFooter>
              <Button>Invite</Button>
            </CardFooter>
          </Card>
        ),
      },
    ],
    api: ["Card", "CardHeader", "CardTitle", "CardDescription", "CardContent", "CardFooter", "CardAction"],
  },

  checkbox: {
    title: "Checkbox",
    description:
      "Checkboxes allow the user to select one or more items from a set, or turn an option on or off.",
    importLine: `import { Checkbox, Label } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic checkboxes",
        code: `<Checkbox defaultChecked />
<Checkbox />
<Checkbox disabled />
<Checkbox disabled checked />`,
        render: () => (
          <>
            <Checkbox defaultChecked aria-label="Checked" />
            <Checkbox aria-label="Unchecked" />
            <Checkbox disabled aria-label="Disabled" />
            <Checkbox disabled checked aria-label="Disabled checked" />
          </>
        ),
      },
      {
        title: "Label",
        description: "Pair with Label for accessible click targets.",
        code: `<div className="flex items-center gap-2">
  <Checkbox id="terms" defaultChecked />
  <Label htmlFor="terms">Accept terms</Label>
</div>`,
        render: () => (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Checkbox id="terms" defaultChecked />
              <Label htmlFor="terms">Accept terms</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="req" />
              <Label htmlFor="req">Required *</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="dis" disabled />
              <Label htmlFor="dis">Disabled</Label>
            </div>
          </div>
        ),
      },
      {
        title: "Controlled",
        code: `const [checked, setChecked] = useState(true);
<Checkbox checked={checked} onCheckedChange={(v) => setChecked(v === true)} />`,
        render: () => <ControlledCheckbox />,
      },
    ],
    accessibility: [
      "Always provide a Label or aria-label.",
      "Prefer Switch for a single immediate on/off setting.",
    ],
    api: ["Checkbox"],
  },

  dialog: {
    title: "Dialog",
    description: "Modal overlay for focused tasks without leaving the page.",
    importLine: `import { Dialog, DialogTrigger, DialogContent, … } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<Dialog>
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  <DialogContent>…</DialogContent>
</Dialog>`,
        render: () => (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Edit profile</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>Make changes to your profile here.</DialogDescription>
              </DialogHeader>
              <Input placeholder="Display name" />
              <DialogFooter>
                <Button>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ),
      },
    ],
    api: [
      "Dialog",
      "DialogTrigger",
      "DialogContent",
      "DialogHeader",
      "DialogTitle",
      "DialogDescription",
      "DialogFooter",
      "DialogClose",
    ],
  },

  drawer: {
    title: "Drawer",
    description: "Side or edge panel for filters and secondary flows.",
    importLine: `import { Drawer, DrawerTrigger, DrawerContent, … } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Right",
        code: `<Drawer>
  <DrawerTrigger asChild><Button variant="outline">Filters</Button></DrawerTrigger>
  <DrawerContent side="right">…</DrawerContent>
</Drawer>`,
        render: () => (
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Open filters</Button>
            </DrawerTrigger>
            <DrawerContent side="right">
              <DrawerHeader>
                <DrawerTitle>Filters</DrawerTitle>
                <DrawerDescription>Narrow the result set.</DrawerDescription>
              </DrawerHeader>
              <div className="space-y-3 py-2">
                <Input placeholder="Keyword" />
              </div>
              <DrawerFooter>
                <Button>Apply</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ),
      },
    ],
    api: [
      "Drawer",
      "DrawerTrigger",
      "DrawerContent",
      "DrawerHeader",
      "DrawerTitle",
      "DrawerDescription",
      "DrawerFooter",
      "DrawerClose",
    ],
  },

  "dropdown-menu": {
    title: "Dropdown Menu",
    description: "Contextual action menu anchored to a trigger.",
    importLine: `import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<DropdownMenu>
  <DropdownMenuTrigger asChild><Button variant="outline">Open</Button></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
        render: () => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    api: ["DropdownMenu", "DropdownMenuTrigger", "DropdownMenuContent", "DropdownMenuItem", "…"],
  },

  empty: {
    title: "Empty",
    description: "Empty-state layout for lists and panels.",
    importLine: `import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<Empty className="border border-dashed">
  <EmptyHeader>
    <EmptyTitle>No results</EmptyTitle>
    <EmptyDescription>Try adjusting filters.</EmptyDescription>
  </EmptyHeader>
</Empty>`,
        className: "items-stretch",
        render: () => (
          <Empty className="w-full max-w-md border border-dashed">
            <EmptyHeader>
              <EmptyTitle>No results</EmptyTitle>
              <EmptyDescription>Try adjusting your filters.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ),
      },
    ],
    api: ["Empty", "EmptyHeader", "EmptyTitle", "EmptyDescription", "EmptyMedia", "EmptyContent"],
  },

  field: {
    title: "Field",
    description: "Compose label, control, description, and error for forms.",
    importLine: `import { Field, FieldLabel, FieldDescription, Input } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<Field className="max-w-sm">
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" type="email" placeholder="you@company.com" />
  <FieldDescription>We never share your email.</FieldDescription>
</Field>`,
        className: "items-stretch justify-center",
        render: () => (
          <Field className="w-full max-w-sm">
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" placeholder="you@company.com" />
            <FieldDescription>We never share your email.</FieldDescription>
          </Field>
        ),
      },
    ],
    api: ["Field", "FieldLabel", "FieldDescription", "FieldError", "FieldGroup", "…"],
  },

  input: {
    title: "Input",
    description: "Single-line text field for forms. Showcase types, disabled, and invalid states.",
    importLine: `import { Input, Label } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<Input placeholder="Email" type="email" className="max-w-xs" />`,
        render: () => <Input placeholder="Email" type="email" className="max-w-xs" />,
      },
      {
        title: "With label",
        code: `<div className="grid w-full max-w-xs gap-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@company.com" />
</div>`,
        render: () => (
          <div className="grid w-full max-w-xs gap-2">
            <Label htmlFor="demo-email">Email</Label>
            <Input id="demo-email" type="email" placeholder="you@company.com" />
          </div>
        ),
      },
      {
        title: "Types",
        code: `<Input type="text" placeholder="Text" />
<Input type="password" placeholder="Password" />
<Input type="number" placeholder="Number" />
<Input type="search" placeholder="Search" />`,
        render: () => (
          <div className="grid w-full max-w-sm gap-3">
            <Input type="text" placeholder="Text" />
            <Input type="password" placeholder="Password" />
            <Input type="number" placeholder="Number" />
            <Input type="search" placeholder="Search" />
          </div>
        ),
      },
      {
        title: "Disabled / invalid",
        code: `<Input disabled placeholder="Disabled" />
<Input aria-invalid placeholder="Invalid" />`,
        render: () => (
          <>
            <Input disabled placeholder="Disabled" className="max-w-xs" />
            <Input aria-invalid placeholder="Invalid" className="max-w-xs" />
          </>
        ),
      },
    ],
    related: [
      { label: "Field", href: "/components/field" },
      { label: "Textarea", href: "/components/textarea" },
      { label: "Label", href: "/components/label" },
    ],
    api: ["Input"],
  },

  label: {
    title: "Label",
    description: "Accessible label for form controls.",
    importLine: `import { Label } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<Label htmlFor="name">Name</Label>
<Input id="name" className="max-w-xs" />`,
        render: () => (
          <div className="flex w-full max-w-xs flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" />
          </div>
        ),
      },
    ],
    api: ["Label"],
  },

  pagination: {
    title: "Pagination",
    description: "Navigate multi-page result sets.",
    importLine: `import { Pagination, PaginationContent, PaginationItem, PaginationLink, … } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<Pagination>
  <PaginationContent>
    <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
    <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
    <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
    <PaginationItem><PaginationNext href="#" /></PaginationItem>
  </PaginationContent>
</Pagination>`,
        render: () => (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ),
      },
    ],
    api: [
      "Pagination",
      "PaginationContent",
      "PaginationItem",
      "PaginationLink",
      "PaginationPrevious",
      "PaginationNext",
      "PaginationEllipsis",
    ],
  },

  popover: {
    title: "Popover",
    description: "Non-modal floating panel for rich content.",
    importLine: `import { Popover, PopoverTrigger, PopoverContent } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<Popover>
  <PopoverTrigger asChild><Button variant="outline">Open</Button></PopoverTrigger>
  <PopoverContent>Place content here.</PopoverContent>
</Popover>`,
        render: () => (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent>Place content for the popover here.</PopoverContent>
          </Popover>
        ),
      },
    ],
    api: ["Popover", "PopoverTrigger", "PopoverContent", "PopoverAnchor"],
  },

  "radio-group": {
    title: "Radio Group",
    description: "Choose exactly one option from a set.",
    importLine: `import { RadioGroup, RadioGroupItem, Label } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<RadioGroup defaultValue="comfortable">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="default" id="r1" />
    <Label htmlFor="r1">Default</Label>
  </div>
  …
</RadioGroup>`,
        render: () => (
          <RadioGroup defaultValue="comfortable" className="gap-3">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="default" id="r1" />
              <Label htmlFor="r1">Default</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="comfortable" id="r2" />
              <Label htmlFor="r2">Comfortable</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="compact" id="r3" />
              <Label htmlFor="r3">Compact</Label>
            </div>
          </RadioGroup>
        ),
      },
    ],
    api: ["RadioGroup", "RadioGroupItem"],
  },

  "scroll-area": {
    title: "Scroll Area",
    description: "Styled scrollable region.",
    importLine: `import { ScrollArea } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<ScrollArea className="h-40 w-64 rounded-md border p-3">…</ScrollArea>`,
        render: () => (
          <ScrollArea className="h-40 w-64 rounded-md border border-border p-3 text-sm">
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i} className="py-1">
                Item {i + 1}
              </p>
            ))}
          </ScrollArea>
        ),
      },
    ],
    api: ["ScrollArea", "ScrollBar"],
  },

  select: {
    title: "Select",
    description: "Choose one option from a list.",
    importLine: `import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<Select>
  <SelectTrigger className="w-48"><SelectValue placeholder="Theme" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
  </SelectContent>
</Select>`,
        render: () => (
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        ),
      },
    ],
    api: ["Select", "SelectTrigger", "SelectValue", "SelectContent", "SelectItem", "…"],
  },

  separator: {
    title: "Separator",
    description: "Visual divider between sections.",
    importLine: `import { Separator } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<div className="w-64 space-y-3">
  <p>Above</p>
  <Separator />
  <p>Below</p>
</div>`,
        render: () => (
          <div className="w-64 space-y-3 text-sm">
            <p>Above</p>
            <Separator />
            <p>Below</p>
          </div>
        ),
      },
    ],
    api: ["Separator"],
  },

  skeleton: {
    title: "Skeleton",
    description: "Placeholder pulse while content loads.",
    importLine: `import { Skeleton } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<Skeleton className="h-4 w-40" />
<Skeleton className="h-20 w-full max-w-sm rounded-xl" />`,
        className: "flex-col items-stretch max-w-sm w-full",
        render: () => (
          <div className="flex w-full max-w-sm flex-col gap-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        ),
      },
    ],
    api: ["Skeleton"],
  },

  spinner: {
    title: "Spinner",
    description: "Indeterminate loading indicator.",
    importLine: `import { Spinner } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<Spinner />
<Spinner className="size-6" />`,
        render: () => (
          <>
            <Spinner />
            <Spinner className="size-6" />
          </>
        ),
      },
    ],
    api: ["Spinner"],
  },

  switch: {
    title: "Switch",
    description: "Immediate on/off toggle.",
    importLine: `import { Switch, Label } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<Switch aria-label="Airplane mode" />
<Switch defaultChecked aria-label="On" />
<Switch disabled aria-label="Disabled" />`,
        render: () => (
          <>
            <Switch aria-label="Airplane mode" />
            <Switch defaultChecked aria-label="On" />
            <Switch disabled aria-label="Disabled" />
          </>
        ),
      },
      {
        title: "Controlled",
        code: `const [on, setOn] = useState(false);
<Switch checked={on} onCheckedChange={setOn} />`,
        render: () => <ControlledSwitch />,
      },
    ],
    api: ["Switch"],
  },

  table: {
    title: "Table",
    description: "Semantic HTML table primitives for data display.",
    importLine: `import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<Table>…</Table>`,
        className: "items-stretch w-full",
        render: () => (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Ada Lovelace</TableCell>
                <TableCell>Engineer</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Grace Hopper</TableCell>
                <TableCell>Admiral</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ),
      },
    ],
    api: ["Table", "TableHeader", "TableBody", "TableRow", "TableHead", "TableCell", "…"],
  },

  tabs: {
    title: "Tabs",
    description: "Switch between related views in-place.",
    importLine: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<Tabs defaultValue="account" className="w-full max-w-md">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account panel</TabsContent>
  <TabsContent value="password">Password panel</TabsContent>
</Tabs>`,
        className: "items-stretch justify-center",
        render: () => (
          <Tabs defaultValue="account" className="w-full max-w-md">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="pt-3 text-sm">
              Make changes to your account.
            </TabsContent>
            <TabsContent value="password" className="pt-3 text-sm">
              Change your password here.
            </TabsContent>
          </Tabs>
        ),
      },
    ],
    api: ["Tabs", "TabsList", "TabsTrigger", "TabsContent", "tabsListVariants"],
  },

  textarea: {
    title: "Textarea",
    description: "Multi-line text field.",
    importLine: `import { Textarea } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<Textarea placeholder="Type your message…" className="max-w-md" />`,
        className: "items-stretch justify-center",
        render: () => <Textarea placeholder="Type your message…" className="max-w-md" />,
      },
    ],
    api: ["Textarea"],
  },

  toast: {
    title: "Toast",
    description: "Transient notifications via Sonner. Mount Toaster once in the app layout.",
    importLine: `import { Toaster } from "@erp/miniapp-ui";
import { toast } from "sonner";`,
    demos: [
      {
        title: "Triggers",
        code: `toast.success("Saved");
toast.error("Failed");
toast("Event created");`,
        render: () => (
          <>
            <Button onClick={() => toast.success("Saved")}>Success</Button>
            <Button variant="outline" onClick={() => toast("Event created")}>
              Default
            </Button>
            <Button variant="destructive" onClick={() => toast.error("Failed")}>
              Error
            </Button>
          </>
        ),
      },
    ],
    api: ["Toaster", "toast (from sonner)"],
  },

  tooltip: {
    title: "Tooltip",
    description: "Short hint on hover or focus.",
    importLine: `import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">Hover</Button>
    </TooltipTrigger>
    <TooltipContent>Add to library</TooltipContent>
  </Tooltip>
</TooltipProvider>`,
        render: () => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>Add to library</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
      },
    ],
    api: ["TooltipProvider", "Tooltip", "TooltipTrigger", "TooltipContent"],
  },
};
