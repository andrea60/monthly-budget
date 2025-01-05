import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../auth/AuthProvider";
import { BalanceCard } from "../../balance/BalanceCard";

export const Route = createFileRoute("/balance/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  if (isAuthenticated === false) {
    navigate({ to: "/login-page" });
    return;
  }
  return (
    <div>
      <BalanceCard />
    </div>
  );
}
