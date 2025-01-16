import { useCurrentBalance } from "../../../data/useCurrentBalance";
import { Currency } from "../../components/Currency";
import { QueryCard } from "../../components/QueryCard";

export const MonthlyExpendible = () => {
  const query = useCurrentBalance();
  return (
    <QueryCard query={query} compact>
      {({ expendibleBalance }) => {
        return (
          <div className="flex flex-row items-center">
            <p>Monthly </p>
            <Currency value={expendibleBalance} />
          </div>
        );
      }}
    </QueryCard>
  );
};
