import { createFileRoute, Link } from "@tanstack/react-router";
import { useUserSettings } from "../../data/user-data/useUserSettings";
import { CurrencyInput } from "../../lib/components/CurrencyInput";
import { ScheduledExpensesEditor } from "../../lib/features/ScheduledExpensesEditor";
import { ArrowLeftIcon, BackwardIcon } from "@heroicons/react/24/outline";

export const Route = createFileRoute("/user-settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    totalSalary,
    savingTarget,
    extraSavings,
    scheduledExpenses,
    updateUserSettings,
  } = useUserSettings();
  return (
    <div>
      <section className="flex w-full justify-between mb-4 items-center">
        <Link to="..">
          <button className="btn btn-sm btn-ghost">
            <ArrowLeftIcon className="size-8" />
          </button>
        </Link>
        <h1 className="font-bold">Configure User Settings</h1>
      </section>
      <div className="card bg-base-200 shadow-md mb-5">
        <div className="card-body">
          <h1 className="card-title">Basic information</h1>
          <CurrencyInput
            id="totalSalary"
            label="Total Monthly Salary"
            max={999999}
            onChange={(v) => updateUserSettings("totalSalary", v)}
            value={totalSalary}
          />

          <CurrencyInput
            id="savingTarget"
            label="Monthly Saving Target"
            max={999999}
            value={savingTarget}
            onChange={(v) => updateUserSettings("savingTarget", v)}
          />

          <CurrencyInput
            id="extraSavings"
            label="Extra Monthly Savings"
            max={999999}
            value={extraSavings}
            onChange={(v) => updateUserSettings("extraSavings", v)}
          />

          <section className="mb-4"></section>
        </div>
      </div>

      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h1 className="card-title">
            Recurring expenses ({scheduledExpenses.length})
          </h1>
          <ScheduledExpensesEditor
            values={scheduledExpenses}
            onChange={(expenses) =>
              updateUserSettings("scheduledExpenses", expenses)
            }
          />
        </div>
      </div>
    </div>
  );
}
