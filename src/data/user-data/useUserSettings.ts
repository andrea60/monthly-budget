import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type UserSettings = {
  savingTarget: number;
  totalSalary: number;
  scheduledExpenses: ScheduledExpense[];
  extraSavings: number;
};

export type ScheduledExpense = {
  name: string;
  dayOfMonth: number;
  value: number;
};

const savingTargetAtom = atomWithStorage<UserSettings>("user.saving", {
  savingTarget: 100,
  totalSalary: 1000,
  extraSavings: 0,
  scheduledExpenses: [
    {
      name: "Rent",
      dayOfMonth: 8,
      value: 500,
    },
    {
      name: "Gym",
      dayOfMonth: 1,
      value: 50,
    },
  ],
});

export const useUserSettings = () => {
  const [userSettings, setUserSettings] = useAtom(savingTargetAtom);

  const updateUserSettings = <TKey extends keyof UserSettings>(
    key: TKey,
    value: UserSettings[TKey]
  ) => {
    console.log(`Updating ${key} to`, value);
    setUserSettings((current) => ({ ...current, [key]: value }));
  };

  return { ...userSettings, updateUserSettings };
};
