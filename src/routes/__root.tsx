import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ModalRenderer } from "../lib/components/modal/ModalProvider";
import { useAuth } from "../auth/AuthProvider";
import dayjs from "dayjs";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ModalRenderer />
      <TanStackRouterDevtools />
      <TemporaryAuthTokenInfo />
    </>
  ),
});

const TemporaryAuthTokenInfo = () => {
  const { tokenExpiresAt } = useAuth();
  if (!tokenExpiresAt) return null;

  const date = dayjs(tokenExpiresAt * 1000);
  return (
    <div className="bg-base-200 px-3 py-1 fixed right-2 bottom-2">
      {date.format("DD/MM/YYYY HH:mm:ss")}
    </div>
  );
};
