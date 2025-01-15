import { match } from "ts-pattern";
import { useCurrentBalance } from "../data/useCurrentBalance";
import GaugeChart from "react-gauge-component";
import { useUserSettings } from "../data/user-data/useUserSettings";

const numberFormat = new Intl.NumberFormat(navigator.language, {
  style: "currency",
  maximumFractionDigits: 0,
  currency: "GBP",
});

const margins = { top: 0.08, bottom: 0.0, left: 0.1, right: 0.1 };

export const BalanceCard = () => {
  const query = useCurrentBalance();
  const { savingTarget } = useUserSettings();

  return (
    <div className="card bg-base-200 shadow-md">
      <div className="card-body">
        <h1 className="card-title">Current Balance</h1>
        {match(query)
          .with({ isSuccess: true }, ({ data }) => {
            return (
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
            );
          })
          .with({ isError: true }, ({ error }) => (
            <div className="alert alert-error">{error.message}</div>
          ))
          .otherwise((_) => (
            <p>Loading...</p>
          ))}
      </div>
    </div>
  );
};
