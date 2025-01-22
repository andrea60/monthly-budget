import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCurrentBalance } from "../../../data/useCurrentBalance";
import { render, screen } from "@testing-library/react";
import { ExpendibleProgressBar } from "./ExpendibleProgressBar";
vi.mock("../../../data/useCurrentBalance", () => ({
  useCurrentBalance: vi.fn(),
}));
describe("ExpendibleProgressBar", () => {
  const mockUseCurrentBalance = vi.mocked(useCurrentBalance);
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it.each`
    expendibleLeft | maxExpendible | expected
    ${100}         | ${100}        | ${"100"}
    ${0}           | ${100}        | ${"0"}
    ${50}          | ${100}        | ${"50"}
    ${0}           | ${0}          | ${"0"}
    ${17.484}      | ${100}        | ${"17"}
  `(
    `when there are $expendibleLeft expendible money left out of $maxExpendible it shows $expected %`,
    ({ expendibleLeft, maxExpendible, expected }) => {
      mockUseCurrentBalance.mockReturnValue({
        isSuccess: true,
        data: {
          expendibleBalance: expendibleLeft,
          maxExpendible: maxExpendible,
          totalBalance: 300,
        },
      } as any);

      render(<ExpendibleProgressBar />);

      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveTextContent(`${expected}%`);
    }
  );
});
