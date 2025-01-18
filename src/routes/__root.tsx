import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ModalRenderer } from "../lib/components/modal/ModalProvider";
export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ModalRenderer />
      <TanStackRouterDevtools />
    </>
  ),
});
