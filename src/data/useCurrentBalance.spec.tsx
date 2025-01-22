import { beforeEach, describe, expect, it, vi } from "vitest";
import { useMonzoClient } from "./useMonzoClient";
import { useUserSettings } from "./user-data/useUserSettings";
import { FakeMonzoClient } from "../test/FakeMonzoClient";
import { renderHook, waitFor } from "@testing-library/react";
import { useCurrentBalance } from "./useCurrentBalance";
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("./useMonzoClient", () => ({
  useMonzoClient: vi.fn(),
}));

vi.mock("./user-data/useUserSettings", () => ({
  useUserSettings: vi.fn(),
}));

describe("useCurrentBalance", () => {
  const fakeMonzoClient = new FakeMonzoClient();
  const mockUseMonzoClient = vi.mocked(useMonzoClient);
  const mockUseUserSettings = vi.mocked(useUserSettings);

  const userSettings = {
    extraSavings: 100,
    savingTarget: 1000,
    scheduledExpenses: [],
    totalSalary: 2000,
    updateUserSettings: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
    mockUseMonzoClient.mockReturnValue(fakeMonzoClient);

    mockUseUserSettings.mockReturnValue(userSettings);
  });

  const wrapper = ({ children }: PropsWithChildren) => {
    const queryClient = new QueryClient();

    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  describe("totalBalance", () => {
    it("should be the total sum of all accounts balance", async () => {
      fakeMonzoClient.accounts = [
        { balanceGbp: 100, id: "1" },
        { balanceGbp: 50, id: "3" },
        { balanceGbp: 25, id: "2" },
      ];

      const { result } = renderHook(() => useCurrentBalance(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.totalBalance).toBe(175);
    });

    it("should be 0 if there are no accounts available", async () => {
      fakeMonzoClient.accounts = [];

      const { result } = renderHook(() => useCurrentBalance(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.totalBalance).toBe(0);
    });
  });

  describe("expendibleBalance", () => {
    it("should be the account balance, without the saving target and the sum of future scheduled expenses", async () => {
      fakeMonzoClient.accounts = [{ balanceGbp: 500, id: "1" }];
      vi.setSystemTime(new Date("2025-01-01"));
      // 150 of future expenses
      mockUseUserSettings.mockReturnValue({
        ...userSettings,
        savingTarget: 100,
        scheduledExpenses: [
          {
            dayOfMonth: 10,
            name: "test1",
            value: 50,
          },
          {
            dayOfMonth: 15,
            name: "test1",
            value: 100,
          },
        ],
      });

      const { result } = renderHook(() => useCurrentBalance(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.expendibleBalance).toBe(500 - 150 - 100);
    });

    it("it should consider all scheduled expenses which happen on days of the month greater than today's day of the month", async () => {
      fakeMonzoClient.accounts = [{ balanceGbp: 500, id: "1" }];
      vi.setSystemTime(new Date("2025-01-10"));
      mockUseUserSettings.mockReturnValue({
        ...userSettings,
        savingTarget: 100,
        scheduledExpenses: [
          {
            // not considered
            dayOfMonth: 10,
            name: "test1",
            value: 100,
          },
          {
            dayOfMonth: 15,
            name: "test1",
            value: 100,
          },
        ],
      });

      const { result } = renderHook(() => useCurrentBalance(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.expendibleBalance).toBe(500 - 100 - 100);
    });
  });

  describe("maxExpendible", () => {
    it("should be the total salary minus the sum of all scheduled expenses", async () => {
      vi.setSystemTime(new Date("2025-01-15"));
      // 350 of scheduled expenses
      mockUseUserSettings.mockReturnValue({
        ...userSettings,
        totalSalary: 500,
        savingTarget: 100,
        scheduledExpenses: [
          {
            dayOfMonth: 1,
            name: "test1",
            value: 50,
          },
          {
            dayOfMonth: 15,
            name: "test1",
            value: 100,
          },
          {
            dayOfMonth: 30,
            name: "test1",
            value: 200,
          },
        ],
      });

      const { result } = renderHook(() => useCurrentBalance(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.maxExpendible).toBe(500 - 350);
    });
  });
});
