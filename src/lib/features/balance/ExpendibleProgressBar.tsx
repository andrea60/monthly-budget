import { match } from "ts-pattern";
import { useCurrentBalance } from "../../../data/useCurrentBalance";
import { ProgressBar } from "../../components/ProgressBar";

export const ExpendibleProgressBar = () => {
  const query = useCurrentBalance();

  return (
    <div>
      <label>Expendible Balance</label>
      {match(query)
        .with({ isSuccess: true }, ({ data }) => {
          const { expendibleBalance, maxExpendible } = data;
          const perc = (expendibleBalance / maxExpendible) * 100;
          return <ProgressBar perc={perc} />;
        })
        .otherwise(() => (
          <ProgressBar perc={0} />
        ))}
    </div>
  );
};
