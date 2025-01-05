import { match } from "ts-pattern";
import { useCurrentBalance } from "../data/useCurrentBalance";
import GaugeChart from "react-gauge-component";

export const BalanceCard = () => {
  const query = useCurrentBalance();
  if (query.isSuccess) query.data;

  return (
    <div className="card">
      <div className="card-title">Current Balance</div>
      <div className="card-body">
        {match(query)
          .with({ isSuccess: true }, ({ data }) => (
            <GaugeChart value={50} minValue={0} maxValue={100} />
          ))
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
