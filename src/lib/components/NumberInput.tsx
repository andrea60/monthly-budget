import { useCallback, useEffect, useState } from "react";
import cn from "classnames";

const integerFormat = new Intl.NumberFormat(navigator.language, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const decimalFormat = new Intl.NumberFormat(navigator.language, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});
const allowedKeys = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  ".",
  "Backspace",
  "Control",
  "Shift",
  "Alt",
  "Tab",
  "Enter",
  "Delete",
];

export type NumberInputProps = {
  value?: number;
  id: string;
  onChange: (val: number) => void;
  className?: string;
  label?: string;
  max: number;
  type: "integer" | "decimal";
  icon?: JSX.Element | string;
  placeholder: string;
};
export const NumberInput = ({
  value,
  onChange,
  label,
  id,
  max,
  className,
  placeholder,
  icon,
  type,
}: NumberInputProps) => {
  const formatter = useCallback(
    (v: number | undefined) => {
      if (!v) return undefined;
      return type === "integer"
        ? integerFormat.format(v)
        : decimalFormat.format(v);
    },
    [type]
  );

  const [currentVal, setCurrentVal] = useState(formatter(value));

  useEffect(() => {
    setCurrentVal(formatter(value));
  }, [value]);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = evt.target.value;
    setCurrentVal(inputVal);
    if (!inputVal) {
      setCurrentVal("0");
      onChange(0);
      return;
    }

    const numberValue = Number(inputVal);
    if (isNaN(numberValue)) return;

    if (numberValue > max) {
      onChange(max);
      setCurrentVal(max.toString());
      return;
    }

    onChange(numberValue);
  };

  const handleKeyDown = (evt: React.KeyboardEvent) => {
    if (evt.key === "." && type !== "decimal") evt.preventDefault();
    if (!allowedKeys.includes(evt.key)) evt.preventDefault();
  };

  return (
    <div className={className}>
      {label && (
        <label className="text-sm" htmlFor={id}>
          {label}
        </label>
      )}
      <div className={cn("input input-bordered flex items-center gap-2")}>
        <input
          type="text"
          className="grow w-0"
          placeholder={placeholder}
          id={id}
          value={currentVal}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          pattern="[0-9.]*"
          inputMode={type === "integer" ? "numeric" : "decimal"}
        />
        {icon && <span>{icon}</span>}
      </div>
    </div>
  );
};
