import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCurrentBalance } from "../../../data/useCurrentBalance";
import { DailyExpendible } from "./DailyExpendible";
import { render, screen } from "@testing-library/react";

vi.mock("../../../data/useCurrentBalance", () => ({
  useCurrentBalance: vi.fn(),
}));

describe("DailyExpendible", () => {
  const mockUseCurrentBalance = vi.mocked(useCurrentBalance);

  beforeEach(() => {
    vi.resetAllMocks();
    mockUseCurrentBalance.mockReturnValue({
      isPending: false,
      data: {
        expendibleBalance: 300,
        maxExpendible: 500,
        totalBalance: 300,
      },
    } as any);
  });
  it("should display the total expendible money left divided by the number of days left in the current month", () => {
    vi.setSystemTime(new Date(2025, 11, 1)); // 30 days left (incl. today)
    render(<DailyExpendible />);

    const value = screen.getByTestId("daily-expendible");
    expect(value).toHaveTextContent("£10");
  });

  it("it should include current day in calculation", () => {
    vi.setSystemTime(new Date(2025, 11, 30)); // last day of the month
    render(<DailyExpendible />);

    const value = screen.getByTestId("daily-expendible");
    expect(value).toHaveTextContent("£300");
  });
});
