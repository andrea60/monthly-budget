import { useQuery } from "@tanstack/react-query";
import { useMonzoClient } from "./useMonzoClient";
import { useCallback } from "react";
import { MonzoAccount } from "./bank-client";
import { useUserSettings } from "./user-data/useUserSettings";

export const useCurrentBalance = () => {
  const client = useMonzoClient();
  const { savingTarget, scheduledExpenses, totalSalary } = useUserSettings();

  const computeBalance = useCallback(
    (accounts: MonzoAccount[]) => {
      const today = new Date();
      const totalBalance =
        0.01 * accounts.reduce((acc, account) => acc + account.balance, 0);

      const futureExpenses = scheduledExpenses
        .filter((exp) => exp.dayOfMonth > today.getDate())
        .reduce((value, exp) => value + exp.value, 0);

      const totalExpenses = scheduledExpenses.reduce(
        (value, exp) => value + exp.value,
        0
      );

      const expendibleBalance = Math.max(
        totalBalance - savingTarget - futureExpenses,
        0
      );

      const maxExpendible = totalSalary - totalExpenses;
      return {
        totalBalance,
        expendibleBalance,
        maxExpendible,
      };
    },
    [savingTarget, scheduledExpenses]
  );
  return useQuery({
    queryKey: ["balance"],
    queryFn: () => client.getAccounts(),
    select: computeBalance,
  });
};
