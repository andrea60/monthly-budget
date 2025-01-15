import { NumberInput, NumberInputProps } from "./NumberInput";

type Props = Omit<NumberInputProps, "placeholder" | "type" | "icon">;
export const CurrencyInput = (props: Props) => {
  return <NumberInput {...props} icon="£" placeholder="GBP" type="decimal" />;
};
