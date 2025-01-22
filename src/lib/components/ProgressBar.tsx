type Props = {
  perc: number;
};
export const ProgressBar = ({ perc }: Props) => {
  return (
    <div
      className="w-full rounded-3xl bg-base-200 flex-grow flex justify-center relative p-1 text-sm"
      role="progressbar"
    >
      <div
        className="h-full bg-primary rounded-3xl absolute left-0 bottom-0"
        style={{ width: perc + "%" }}
      />
      <span className="relative contrast-200 text-xs">{perc.toFixed(0)}%</span>
    </div>
  );
};
