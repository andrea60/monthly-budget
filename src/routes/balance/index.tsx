import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../auth/AuthProvider";
import { BalanceCard } from "../../balance/BalanceCard";
import { usePermissions } from "../../permissions/usePermissions";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

export const Route = createFileRoute("/balance/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isAuthenticated } = useAuth();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  if (isAuthenticated === false) {
    navigate({ to: "/login-page" });
    return;
  }
  if (!hasPermission) {
    navigate({ to: "/permissions" });
    return;
  }
  return (
    <div>
      <section className="flex w-full justify-between mb-4 items-center">
        <h1 className="font-bold">Monthly Budget</h1>
        <Link to="/user-settings">
          <button className="btn btn-sm btn-ghost">
            <Cog6ToothIcon className="size-8" />
          </button>
        </Link>
      </section>
      <BalanceCard />
    </div>
  );
}
