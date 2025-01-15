import { TrashIcon } from "@heroicons/react/24/outline";
import { ScheduledExpense } from "../../data/user-data/useUserSettings";
import { CurrencyInput } from "../components/CurrencyInput";
import { NumberInput } from "../components/NumberInput";
import { TextInput } from "../components/TextInput";

type Props = {
  values: ScheduledExpense[];
  onChange: (value: ScheduledExpense[]) => void;
};
export const ScheduledExpensesEditor = ({ values, onChange }: Props) => {
  const updateExpense = <TKey extends keyof ScheduledExpense>(
    idx: number,
    key: TKey,
    value: ScheduledExpense[TKey]
  ) => {
    const newValue = [...values];
    newValue[idx] = { ...values[idx], [key]: value };
    onChange(newValue);
  };

  const createNew = () => {
    onChange([...values, { dayOfMonth: 1, name: "", value: 0 }]);
  };

  const deleteExp = (idx: number) => {
    const newValue = values.filter((_, i) => idx !== i);
    onChange(newValue);
  };
  return (
    <div className="">
      {values.map((exp, i) => (
        <div key={i} className="border-b border-base-300 pb-3 mb-3">
          <div className="flex items-end">
            <TextInput
              className="grow"
              id="name"
              value={exp.name}
              label="Name"
              onChange={(name) => updateExpense(i, "name", name)}
            />
            <button className="btn btn-ghost" onClick={() => deleteExp(i)}>
              <TrashIcon className="size-6" />
            </button>
          </div>
          <div className="flex gap-2">
            <CurrencyInput
              id="value"
              label="Amount"
              className={"flex-1"}
              max={999999}
              value={exp.value}
              onChange={(value) => updateExpense(i, "value", value)}
            />
            <NumberInput
              id="dom"
              label="Day of the Month"
              className={"flex-1"}
              max={31}
              value={exp.dayOfMonth}
              onChange={(dom) => updateExpense(i, "dayOfMonth", dom)}
              placeholder="1-31"
              type="integer"
            />
          </div>
        </div>
      ))}

      <button className="btn btn-primary w-full" onClick={createNew}>
        Add New
      </button>
    </div>
  );
};
