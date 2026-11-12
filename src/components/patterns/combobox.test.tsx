import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Combobox, type ComboboxOption } from "./combobox";

const many: ComboboxOption[] = Array.from({ length: 1000 }, (_, i) => ({
  value: String(i),
  label: `Person ${i}`,
}));

describe("Combobox with a long list", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    // jsdom has no layout: give the list a 240px window and every option a 32px box.
    vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockImplementation(function (this: HTMLElement) {
      return this.getAttribute("role") === "listbox" ? 240 : 0;
    });
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (this: HTMLElement) {
      return this.getAttribute("role") === "option" ? 32 : 0;
    });
    HTMLElement.prototype.scrollTo = vi.fn() as typeof HTMLElement.prototype.scrollTo;
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  async function open(options: ComboboxOption[], onValueChange = vi.fn()) {
    const user = userEvent.setup();
    render(<Combobox options={options} onValueChange={onValueChange} aria-label="Buyer" />);
    await user.click(screen.getByRole("combobox", { name: "Buyer" }));
    return { user, onValueChange };
  }

  it("mounts only the options near the top, not all of them", async () => {
    await open(many);
    const mounted = screen.getAllByRole("option");
    expect(mounted.length).toBeGreaterThan(0);
    expect(mounted.length).toBeLessThan(60);
    expect(screen.getByText("Person 0")).toBeInTheDocument();
    expect(screen.queryByText("Person 999")).toBeNull();
  });

  it("still finds and picks an option that was not mounted", async () => {
    const { user, onValueChange } = await open(many);
    await user.type(screen.getByRole("textbox"), "Person 999");
    await user.click(screen.getByRole("option", { name: "Person 999" }));
    expect(onValueChange).toHaveBeenCalledWith("999");
  });

  it("renders every option of a short list", async () => {
    await open(many.slice(0, 50));
    expect(screen.getAllByRole("option")).toHaveLength(50);
  });
});
