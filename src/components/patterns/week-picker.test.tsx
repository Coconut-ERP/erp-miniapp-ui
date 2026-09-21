import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { WeekPicker } from "./date-picker";

type User = ReturnType<typeof userEvent.setup>;

function trigger() {
  return screen.getByRole("button", { name: /tuần/i });
}

/** react-day-picker tags each cell with `data-day="yyyy-MM-dd"` — a locale-stable handle. */
async function dayCell(date: string) {
  const cell = (await screen.findByRole("grid")).querySelector(`td[data-day="${date}"]`);
  if (!cell) throw new Error(`No day cell for ${date}`);
  return cell as HTMLElement;
}

async function openAndPick(user: User, date: string) {
  await user.click(trigger());
  await user.click((await dayCell(date)).querySelector("button")!);
}

describe("WeekPicker value formatting", () => {
  it("renders the ISO week label as `Tuần WW, dd/MM–dd/MM/yyyy`", () => {
    render(<WeekPicker value="2026-W12" />);
    expect(trigger()).toHaveTextContent("Tuần 12, 16/03–22/03/2026");
  });

  it("spans Monday → Sunday across a month boundary", () => {
    render(<WeekPicker value="2026-W05" />);
    expect(trigger()).toHaveTextContent("Tuần 05, 26/01–01/02/2026");
  });

  it("uses the ISO week-numbering year, not the calendar year", () => {
    // 2026-W01 starts on 29 Dec 2025, yet keeps the 2026 week-year.
    render(<WeekPicker value="2026-W01" />);
    expect(trigger()).toHaveTextContent("Tuần 01, 29/12–04/01/2026");
  });

  it("falls back to the placeholder for malformed or non-existent weeks", () => {
    // "2025-W53" does not exist — 2025 has 52 ISO weeks.
    for (const value of ["", "2026-12", "2026-W00", "2026-W54", "not-a-week", "2025-W53"]) {
      const { unmount } = render(<WeekPicker value={value} placeholder="Chọn tuần" />);
      expect(trigger()).toHaveTextContent("Chọn tuần");
      unmount();
    }
  });
});

describe("WeekPicker selection", () => {
  it("selects the whole week from a day in the middle of it", async () => {
    const onChange = vi.fn();
    render(<WeekPicker defaultValue="2026-W12" onChange={onChange} />);

    // Wednesday 18 Mar 2026 belongs to week 12.
    await openAndPick(userEvent.setup(), "2026-03-18");
    expect(onChange).toHaveBeenCalledWith("2026-W12");
  });

  it("maps both Monday and Sunday of a week to the same value", async () => {
    const onChange = vi.fn();

    for (const day of ["2026-03-16", "2026-03-22"]) {
      const { unmount } = render(<WeekPicker defaultValue="2026-W12" onChange={onChange} />);
      await openAndPick(userEvent.setup(), day);
      unmount();
    }

    expect(onChange).toHaveBeenNthCalledWith(1, "2026-W12");
    expect(onChange).toHaveBeenNthCalledWith(2, "2026-W12");
  });

  it("highlights exactly Monday → Sunday of the selected week", async () => {
    render(<WeekPicker value="2026-W12" />);
    await userEvent.setup().click(trigger());

    for (const day of [16, 17, 18, 19, 20, 21, 22]) {
      const cell = await dayCell(`2026-03-${day}`);
      expect(cell).toHaveAttribute("data-selected", "true");
    }
    // Range edges give the week a visible start/end.
    expect(await dayCell("2026-03-16")).toHaveClass("rdp-range_start");
    expect(await dayCell("2026-03-22")).toHaveClass("rdp-range_end");
    // Neighbouring days stay unselected.
    expect(await dayCell("2026-03-15")).not.toHaveAttribute("data-selected");
    expect(await dayCell("2026-03-23")).not.toHaveAttribute("data-selected");
  });

  it("closes the popover after picking a week", async () => {
    const user = userEvent.setup();
    render(<WeekPicker defaultValue="2026-W12" />);
    await openAndPick(user, "2026-03-18");
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });
});

describe("WeekPicker year boundaries", () => {
  it("rolls into the next week-year for a late-December day", async () => {
    const onChange = vi.fn();
    render(<WeekPicker defaultValue="2025-W52" onChange={onChange} />);

    // Wednesday 31 Dec 2025 falls in ISO week 2026-W01.
    await openAndPick(userEvent.setup(), "2025-12-31");
    expect(onChange).toHaveBeenCalledWith("2026-W01");
  });

  it("rolls back into the previous week-year for an early-January day", async () => {
    const onChange = vi.fn();
    render(<WeekPicker defaultValue="2021-W02" onChange={onChange} />);

    // Friday 1 Jan 2021 falls in ISO week 2020-W53.
    await openAndPick(userEvent.setup(), "2021-01-01");
    expect(onChange).toHaveBeenCalledWith("2020-W53");
  });

  it("limits the year dropdown to fromYear…toYear", async () => {
    render(<WeekPicker defaultValue="2026-W12" fromYear={2025} toYear={2027} />);
    await userEvent.setup().click(trigger());

    const years = screen.getByRole("combobox", { name: /year/i });
    expect([...years.querySelectorAll("option")].map((o) => o.textContent)).toEqual([
      "2025",
      "2026",
      "2027",
    ]);
  });

  it("navigates months, including across the December → January boundary", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    // Week 3 of 2026 opens on January 2026.
    render(<WeekPicker defaultValue="2026-W03" onChange={onChange} fromYear={2025} toYear={2027} />);

    await user.click(trigger());
    await user.click(screen.getByRole("button", { name: /previous/i }));
    await user.click((await dayCell("2025-12-15")).querySelector("button")!);
    expect(onChange).toHaveBeenCalledWith("2025-W51");
  });
});

describe("WeekPicker controlled/uncontrolled state", () => {
  it("keeps its own state when uncontrolled", async () => {
    render(<WeekPicker defaultValue="2026-W12" />);
    await openAndPick(userEvent.setup(), "2026-03-25");
    expect(trigger()).toHaveTextContent("Tuần 13, 23/03–29/03/2026");
  });

  it("does not move on its own when controlled", async () => {
    const onChange = vi.fn();
    render(<WeekPicker value="2026-W12" onChange={onChange} />);

    await openAndPick(userEvent.setup(), "2026-03-25");
    expect(onChange).toHaveBeenCalledWith("2026-W13");
    expect(trigger()).toHaveTextContent("Tuần 12, 16/03–22/03/2026");
  });

  it("follows the parent's value when controlled", async () => {
    function Controlled() {
      const [week, setWeek] = React.useState<string | undefined>("2026-W12");
      return <WeekPicker value={week} onChange={setWeek} />;
    }

    render(<Controlled />);
    await openAndPick(userEvent.setup(), "2026-03-25");
    expect(trigger()).toHaveTextContent("Tuần 13, 23/03–29/03/2026");
  });

  it("renders the placeholder when there is no value", () => {
    render(<WeekPicker placeholder="Chọn tuần báo cáo" />);
    expect(screen.getByRole("button")).toHaveTextContent("Chọn tuần báo cáo");
  });

  it("exposes an accessible trigger label and honours `disabled`", () => {
    render(<WeekPicker aria-label="Tuần báo cáo" disabled />);
    expect(screen.getByRole("button", { name: "Tuần báo cáo" })).toBeDisabled();
  });

  it("opens and picks a week by keyboard alone", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<WeekPicker defaultValue="2026-W12" onChange={onChange} />);

    trigger().focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("grid")).toBeInTheDocument();

    (await dayCell("2026-03-18")).querySelector("button")!.focus();
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith("2026-W12");
  });
});
