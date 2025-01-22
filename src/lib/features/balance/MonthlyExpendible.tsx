import { useCurrentBalance } from "../../../data/useCurrentBalance";
import { Currency } from "../../components/Currency";
import { ModalTooltip } from "../../components/ModalTooltip";
import { QueryCard } from "../../components/QueryCard";

export const MonthlyExpendible = () => {
  const query = useCurrentBalance();
  const tooltip = (
    <>
      How much you can still spend until the end of the month while still
      reaching your saving target
    </>
  );
  return (
    <ModalTooltip tooltipHeader="Monthly allowance" tooltip={tooltip}>
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
    </ModalTooltip>
  );
};
