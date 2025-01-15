import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { usePermissions } from "../../permissions/usePermissions";
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { useMonzoClient } from "../../data/useMonzoClient";
import { UnpermissionedError } from "../../data/errors/UnpermissionedError";
import cn from "classnames";

export const Route = createFileRoute("/permissions/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { hasPermission } = usePermissions();
  const [hasInteracted, setHasInteracted] = useState(false);
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const client = useMonzoClient();
  const { isLoading, refetch } = useQuery({
    queryKey: ["permissions"],
    retry: false,
    staleTime: 0,
    queryFn: async () => {
      const permission = await client.checkPermissions();
      if (!permission) throw new UnpermissionedError();
      return true;
    },
  });

  useEffect(() => {
    if (hasPermission) setTimeout(() => navigate({ to: "/balance" }), 1000);
  }, [hasPermission]);

  if (!isAuthenticated) {
    navigate({ to: "/login-page" });
    return;
  }

  const hasActiveFailure = hasInteracted && !hasPermission;
  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <h5 className="card-title">Permissions are required</h5>
        <div className="py-2">
          <p className="mb-2 pb-2 border-b border-neutral-700">
            You need to authorize the app to read your data from Monzo first.
          </p>

          <p>
            You should have received a notification from Monzo, follow it to
            authorize access to your data
          </p>
          {hasActiveFailure ? (
            <p className="text-error mt-2 pt-2 border-t border-neutral-700">
              Sorry, app is still not permission
            </p>
          ) : null}
        </div>

        <div className="flex gap-2">
          <button
            className={cn("btn flex-grow", {
              "btn-primary": !hasPermission,
              "btn-success": hasPermission,
            })}
            disabled={isLoading}
            onClick={() => {
              setHasInteracted(true);
              refetch();
            }}
          >
            {isLoading ? "Checking..." : "Check Permission"}
          </button>
          {hasActiveFailure && (
            <button className="btn btn-ghost" onClick={logout}>
              Login again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
