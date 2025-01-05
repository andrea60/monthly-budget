import { useQuery } from "@tanstack/react-query";
import { useMonzoClient } from "./useMonzoClient";
import { useCallback } from "react";
import { MonzoAccount } from "./bank-client";

export const useCurrentBalance = () => {
  const client = useMonzoClient();

  const computeBalance = useCallback((accounts: MonzoAccount[]) => {
    const totalBalance = accounts.reduce(
      (acc, account) => acc + account.balance,
      0
    );
    return { totalBalance: totalBalance * 0.01 };
  }, []);
  return useQuery({
    queryKey: ["balance"],
    queryFn: () => client.getAccounts(),
    select: computeBalance,
  });
};
