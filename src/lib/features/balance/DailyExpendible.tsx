import { useCurrentBalance } from "../../../data/useCurrentBalance";
import { Currency } from "../../components/Currency";
import { ModalTooltip } from "../../components/ModalTooltip";
import { QueryCard } from "../../components/QueryCard";
import cn from "classnames";
export const DailyExpendible = () => {
  const query = useCurrentBalance();
  return (
    <ModalTooltip
      tooltipHeader={"Daily maximum expenditure"}
      tooltip={
        "This is the maximum amount of money you can spend each day to still meet your saving target at the end of the month."
      }
    >
      <QueryCard
        query={query}
        compact
        className={cn({ "border border-primary": false })}
      >
        {({ expendibleBalance }) => {
          const remainigDays = getRemainingDays();
          const expendiblePerDay = expendibleBalance / remainigDays;

          return (
            <div className="flex flex-row items-center select-none">
              <p>Daily Max</p>
              <Currency
                value={expendiblePerDay}
                data-testid="daily-expendible"
              />
            </div>
          );
        }}
      </QueryCard>
    </ModalTooltip>
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
