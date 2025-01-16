import dayjs from "dayjs";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useMemo } from "react";

export type UserSaving = {
  year: number;
  month: number;
  saved: number;
};

const userSavingsAtom = atomWithStorage<Record<string, UserSaving>>(
  "user.savings",
  {},
  undefined,
  { getOnInit: true }
);

export const useUserSavings = () => {
  const [userSavings, setUserSavings] = useAtom(userSavingsAtom);

  const replaceUserSaving = (userSaving: UserSaving) => {
    setUserSavings((current) => ({
      ...current,
      [getKey(userSaving)]: userSaving,
    }));
  };

  const removeUserSaving = (userSaving: UserSaving) => {
    const key = getKey(userSaving);
    setUserSavings((current) => {
      const updated = { ...current };
      delete updated[key];
      return updated;
    });
  };

  const userSavingsArr = useMemo(
    () => Object.values(userSavings),
    [userSavings]
  );

  const isMissingLastMonth = useMemo(() => {
    const lastMonth = dayjs().startOf("month").subtract(1, "month");
    const lastMonthKey = getKey({
      year: lastMonth.year(),
      month: lastMonth.month(),
    });

    return !(lastMonthKey in userSavings);
  }, [userSavings]);

  return {
    userSavings: userSavingsArr,
    isMissingLastMonth,
    replaceUserSaving,
    removeUserSaving,
  };
};

const getKey = (saving: { year: number; month: number }) =>
  `${saving.year}/${saving.month}`;
