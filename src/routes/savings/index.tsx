import { createFileRoute } from "@tanstack/react-router";
import { protectedRoute } from "../../auth/protectedRoute";

export const Route = createFileRoute("/savings/")({
  component: protectedRoute(RouteComponent),
});

function RouteComponent() {
  return <div>Hello "/savings/"!</div>;
}
