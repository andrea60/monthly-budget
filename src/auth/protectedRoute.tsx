import { useNavigate } from "@tanstack/react-router";
import { usePermissions } from "../permissions/usePermissions";
import { useAuth } from "./AuthProvider";

export const protectedRoute = (Component: React.FunctionComponent) => () => {
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

  return <Component />;
};
