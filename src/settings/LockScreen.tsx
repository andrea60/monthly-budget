import { useMemo, useRef, useState } from "react";
import cn from "classnames";
import { useClientSecret } from "./ClientSecretProvider";
import { useAnimate } from "motion/react";
import { LockClosedIcon } from "@heroicons/react/24/outline";
const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

const PASSCODE_LENGTH = 6;
export const LockScreen = () => {
  const [passCode, setPassCode] = useState("");
  const { isLoading, obtainClientSecret } = useClientSecret();
  const [scope, animate] = useAnimate();

  const onKeyClicked = async (num: number) => {
    if (passCode.length === 6) return;
    const newPasscode = passCode + num;
    setPassCode(newPasscode);
    if (newPasscode.length === 6) {
      const success = await obtainClientSecret(newPasscode);
      if (!success) {
        animate(
          scope.current,
          { x: [0, -10, 10, -10, 10, -10, 10, 0] },
          { duration: 0.5 }
        );
        setPassCode("");
        navigator.vibrate([200]);
      }
    }
  };
  const code = useMemo(
    () =>
      new Array(PASSCODE_LENGTH).fill(0).map((_, i) => (
        <div
          className={cn("h-4 w-4 border-neutral border rounded-full", {
            "bg-primary": i < passCode.length,
          })}
        />
      )),
    [passCode]
  );
  return (
    <div className="flex flex-col items-center gap-6">
      <LockClosedIcon className="size-20" />
      {!isLoading ? <p>Enter your PIN to use this app</p> : <p>Unlocking...</p>}
      <div className="flex justify-center gap-2" ref={scope}>
        {code}
      </div>
      <div className="flex flex-wrap justify-center">
        {keys.map((k) => (
          <KeyButton
            key={k}
            value={k}
            onClick={() => onKeyClicked(k)}
            disabled={isLoading}
          />
        ))}
      </div>
    </div>
  );
};

type Props = {
  value: number;
  onClick: () => void;
  disabled: boolean;
};
const KeyButton = ({ value, onClick, disabled }: Props) => {
  const timer = useRef<number | null>(null);
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    onClick();
    setClicked(true);

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setClicked(false), 400);
  };
  return (
    <div className="w-1/3 p-2 text-center">
      <button
        className={cn("text-center btn btn-ghost btn-lg text-3xl w-full", {
          "border-primary": clicked,
          "text-primary": clicked,
        })}
        disabled={disabled}
        onClick={handleClick}
      >
        {value}
      </button>
    </div>
  );
};
