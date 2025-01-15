type Props = {
  value?: string;
  id: string;
  onChange: (val: string) => void;
  className?: string;
  label: string;
};
export const TextInput = ({ id, label, value, onChange, className }: Props) => {
  return (
    <div className={className}>
      <label className="text-sm" htmlFor={id}>
        {label}
      </label>
      <div className="input input-bordered flex items-center">
        <input
          type="text"
          className="grow"
          placeholder={label}
          id={id}
          value={value}
          onChange={(evt) => onChange(evt.currentTarget.value)}
        />
      </div>
    </div>
  );
};
