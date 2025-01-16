import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../auth/AuthProvider";
import { BalanceGauge } from "../../lib/features/balance/BalanceGauge";
import { usePermissions } from "../../permissions/usePermissions";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { DailyExpendible } from "../../lib/features/balance/DailyExpendible";
import { ExpendibleProgressBar } from "../../lib/features/balance/ExpendibleProgressBar";
import { MonthlyExpendible } from "../../lib/features/balance/MonthlyExpendible";
import { useUserSavings } from "../../data/savings/useUserSavings";
import { TextInput } from "../../lib/components/TextInput";
import { LastMonthSavingInputCard } from "../../lib/features/savings/LastMonthSavingInputCard";
import { AnimatePresence } from "motion/react";
import { AnimatedCheckIcon } from "../../lib/components/AnimatedCheckIcon";

export const Route = createFileRoute("/balance/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isAuthenticated } = useAuth();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const { isMissingLastMonth } = useUserSavings();
  if (isAuthenticated === false) {
    navigate({ to: "/login-page" });
    return;
  }
  if (!hasPermission) {
    navigate({ to: "/permissions" });
    return;
  }
  return (
    <>
      <section className="flex w-full justify-between mb-6 items-center">
        <h1 className="font-bold text-2xl">Monthly Budget</h1>
        <Link to="/user-settings">
          <button className="btn btn-sm btn-ghost">
            <Cog6ToothIcon className="size-8" />
          </button>
        </Link>
      </section>
      <div className="flex flex-col gap-3">
        <section className="flex flex-col gap-3">
          <ExpendibleProgressBar />
          <div className="flex gap-3 [&>*]:flex-1">
            <MonthlyExpendible /> <DailyExpendible />
          </div>
          <BalanceGauge />
        </section>

        <AnimatePresence>
          {isMissingLastMonth && <LastMonthSavingInputCard />}
        </AnimatePresence>
      </div>
    </>
  );
}
