import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./auth/AuthProvider";
import { SettingsProvider } from "./settings/SettingsProvider";
import { useMonzoClient } from "./data/useMonzoClient";
const queryClient = new QueryClient();

function App() {
  return (
    <main className="p-5">
      <QueryClientProvider client={queryClient}>
        <SettingsProvider>
          <AuthProvider>
            <AuthenticatedArea />
          </AuthProvider>
        </SettingsProvider>
      </QueryClientProvider>
    </main>
  );
}

export default App;

export const AuthenticatedArea = () => {
  const { isAuthenticated, login, logout } = useAuth();
  const client = useMonzoClient();

  const { data, isLoading } = useQuery({
    queryKey: ["balances"],
    queryFn: () => client.getAccounts(),
  });

  return (
    <div>
      <p>User is: {isAuthenticated ? "authenticated" : "not authenticated"}</p>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
      <hr />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
};
