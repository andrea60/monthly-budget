import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../auth/AuthProvider";

export const Route = createFileRoute("/login-page")({
  component: () => {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    if (isAuthenticated === true) {
      navigate({ to: "/balance" });
      return;
    }
    return (
      <div className="card bg-base-200 shadow-md">
        <div className="card-body w-full">
          <div className="card-title">Login Required</div>
          <p className="my-3">
            👋 Hi! You need to authenticate with Monzo first
          </p>
          <button className="btn btn-primary" onClick={login}>
            Authenticate with Monzo
          </button>
        </div>
      </div>
    );
  },
});
