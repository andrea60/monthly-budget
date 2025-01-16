const formatter = new Intl.NumberFormat("en-GB", {
  currency: "GBP",
  maximumFractionDigits: 2,
});

type Props = {
  value: number;
};
export const Currency = ({ value }: Props) => {
  const formatted = formatter.format(value);

  const [integer, decimals] = formatted.split(".");
  return (
    <span>
      <span className="text-xs">£</span>
      <span className="font-bold">{integer}</span>
      {decimals ? (
        <span>
          .<span className="text-xs">{decimals}</span>
        </span>
      ) : undefined}
    </span>
  );
};
