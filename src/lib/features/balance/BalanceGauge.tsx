import { useCurrentBalance } from "../../../data/useCurrentBalance";
import GaugeChart from "react-gauge-component";
import { useUserSettings } from "../../../data/user-data/useUserSettings";
import { QueryCard } from "../../components/QueryCard";
import { ModalTooltip } from "../../components/ModalTooltip";

const numberFormat = new Intl.NumberFormat(navigator.language, {
  style: "currency",
  maximumFractionDigits: 0,
  currency: "GBP",
});

const margins = { top: 0.08, bottom: 0.0, left: 0.1, right: 0.1 };

export const BalanceGauge = () => {
  const query = useCurrentBalance();
  const { savingTarget } = useUserSettings();

  const tooltip = (
    <>
      <p className="border-b border-neutral-800 mb-2 pb-2">
        Here you can see how much of your expendible income you have spent so
        far and how close you are to start spending your target saving amount.
      </p>
      <p>
        The big number in the middle indicates how much money you can spend this
        month before going negative
      </p>
    </>
  );

  return (
    <ModalTooltip tooltipHeader="An overview of your balance" tooltip={tooltip}>
      <QueryCard query={query} title="Balance Overview">
        {(data) => (
          <GaugeChart
            value={data.totalBalance}
            minValue={0}
            maxValue={data.maxExpendible}
            marginInPercent={margins}
            arc={{
              padding: 0.02,
              subArcs: [
                {
                  color: "#DD4E2E",
                  tooltip: { text: "Saving" },
                  limit: savingTarget,
                },
                {
                  color: "#6EF849",
                  limit: data.maxExpendible,
                },
              ],
            }}
            pointer={{ type: "blob", color: "red" }}
            type="semicircle"
            labels={{
              valueLabel: {
                formatTextValue: numberFormat.format,
              },
              tickLabels: {
                ticks: [{ value: savingTarget }],
                defaultTickValueConfig: {
                  formatTextValue: numberFormat.format,
                },
              },
            }}
          />
        )}
      </QueryCard>
    </ModalTooltip>
  );
};
