import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./auth/AuthProvider";
import { SettingsProvider } from "./settings/SettingsProvider";
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

  return (
    <div>
      <p>User is: {isAuthenticated ? "authenticated" : "not authenticated"}</p>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
