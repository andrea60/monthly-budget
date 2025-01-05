import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./auth/AuthProvider";
import { SettingsProvider } from "./settings/SettingsProvider";
import { BalanceCard } from "./balance/BalanceCard";
import { TokenExpiredError } from "./data/errors/TokenExpiredError";
import { PropsWithChildren, useMemo } from "react";
import { routeTree } from "./routeTree.gen";
import {
  createRouter,
  RouterProvider,
  useNavigate,
} from "@tanstack/react-router";

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => {
    const navigate = useNavigate();
    navigate({ to: "/balance" });
  },
});
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <main className="p-5">
      <SettingsProvider>
        <AuthProvider>
          <QueryProvider>
            <RouterProvider router={router} />
          </QueryProvider>
        </AuthProvider>
      </SettingsProvider>
    </main>
  );
}

export default App;

export const QueryProvider = ({ children }: PropsWithChildren) => {
  const { logout } = useAuth();
  const queryClient = useMemo(() => {
    return new QueryClient({
      queryCache: new QueryCache({
        onError(error) {
          if (error instanceof TokenExpiredError) {
            console.log("Token has expired, user should log in again");
            logout();
          }
        },
      }),
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export const AuthenticatedArea = () => {
  return <BalanceCard />;
};
