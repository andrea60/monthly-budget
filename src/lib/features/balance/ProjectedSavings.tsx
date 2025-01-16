import { useUserSettings } from "../../../data/user-data/useUserSettings";
import { Card } from "../../components/Card";
import { Currency } from "../../components/Currency";

export const ProjectedSavings = () => {
  const { extraSavings, savingTarget } = useUserSettings();

  const yearlyProjection = (extraSavings + savingTarget) * 12;
  return (
    <Card compact>
      <div className="flex flex-row items-center    ">
        <p>Estimated Yearly Saving</p>
        <Currency value={yearlyProjection} />
      </div>
    </Card>
  );
};
