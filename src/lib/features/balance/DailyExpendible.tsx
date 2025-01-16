import { useCurrentBalance } from "../../../data/useCurrentBalance";
import { Currency } from "../../components/Currency";
import { QueryCard } from "../../components/QueryCard";

export const DailyExpendible = () => {
  const query = useCurrentBalance();
  return (
    <QueryCard query={query} compact>
      {({ expendibleBalance }) => {
        const remainigDays = getRemainingDays();
        const expendiblePerDay = expendibleBalance / remainigDays;

        return (
          <div className="flex flex-row items-center">
            <p>Per day</p>
            <Currency value={expendiblePerDay} />
          </div>
        );
      }}
    </QueryCard>
  );
};

const getRemainingDays = () => {
  const now = new Date();
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate();
  return daysInMonth - now.getDate();
};
