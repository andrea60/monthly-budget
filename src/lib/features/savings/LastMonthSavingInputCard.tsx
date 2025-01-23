import { ArchiveBoxIcon } from "@heroicons/react/24/outline";
import { CurrencyInput } from "../../components/CurrencyInput";
import { forwardRef, useState } from "react";
import { useUserSavings } from "../../../data/savings/useUserSavings";
import dayjs from "dayjs";
import { motion } from "motion/react";
import cn from "classnames";
import { AnimatedCheckIcon } from "../../components/AnimatedCheckIcon";

export const LastMonthSavingInputCard = forwardRef<HTMLDivElement>(
  (props, ref) => {
    const { replaceUserSaving, isMissingLastMonth } = useUserSavings();
    const [value, setValue] = useState<number>();
    const handleSave = () => {
      if (value === undefined) return;

      const lastMonth = dayjs().endOf("month").subtract(1, "month");

      replaceUserSaving({
        month: lastMonth.month() + 1,
        year: lastMonth.year(),
        saved: value,
      });
    };

    return (
      <motion.div
        exit={{
          opacity: [1, 0.3, 0],
          scale: [1, 1.1, 0.25],
        }}
        transition={{
          delay: 2,
          ease: "easeIn",
          duration: 0.2,
          times: [0, 0.4, 1],
        }}
        ref={ref}
        {...props}
      >
        <div
          className={cn("card shadow-md", {
            "bg-primary": isMissingLastMonth,
            "bg-success": !isMissingLastMonth,
          })}
        >
          <div className="card-body p-6 h-52 flex-col justify-center">
            {isMissingLastMonth ? (
              <motion.div exit={{ opacity: 0 }} className="flex flex-col gap-2">
                <h1 className="card-title text-primary-content">
                  Hey 👋 How much did you save last month?
                </h1>
                <p className="text-primary-content">
                  Enter here how much to saved last month from your account (not
                  including extra income)
                </p>
                <div className="flex items-end gap-2">
                  <CurrencyInput
                    id="last-month-saved"
                    className="flex-grow"
                    onChange={setValue}
                    value={value}
                    max={999999}
                  />
                  <button
                    className="btn btn-neutral"
                    disabled={value === undefined}
                    onClick={handleSave}
                  >
                    <ArchiveBoxIcon className="size-6" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex justify-center">
                <AnimatedCheckIcon className="size-20" />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }
);
