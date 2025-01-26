import { User, UserManager, WebStorageStateStore } from "oidc-client-ts";
import { useSettings } from "../settings/SettingsProvider";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useClientSecret } from "../settings/ClientSecretProvider";

type AuthContext = {
  userManager: UserManager;
  user?: User;
  loading: boolean;
  login: () => void;
  logout: () => void;
};

const Context = createContext<AuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  const { settings } = useSettings();
  const { clientSecret } = useClientSecret();
  if (!clientSecret)
    throw new Error(
      "Unable to initialize AuthProvider is clientSecret is still undefined"
    );

  const userManager = useMemo(
    () =>
      new UserManager({
        ...settings.oauth,
        client_secret: clientSecret,
        metadata: {
          issuer: settings.oauth.authority,
          authorization_endpoint: settings.oauth.authority,
          token_endpoint: settings.oauth.token_endpoint,
        },
        userStore: new WebStorageStateStore({ store: window.localStorage }),
      }),
    []
  );

  useEffect(() => {
    userManager.getUser().then((user) => {
      setLoading(false);
      if (user) {
        setUser(user);
      }
    });

    userManager.events.addUserLoaded((user) => {
      setUser(user);
    });

    userManager.events.addUserUnloaded(() => {
      setUser(undefined);
    });

    // catch the oauth redirect callback
    if (window.location.pathname === "/sign_in_callback") {
      userManager.signinCallback().then(() => {
        window.history.replaceState({}, document.title, "/");
      });
    }
  }, [userManager]);

  const login = () => {
    userManager.signinRedirect();
  };

  const logout = () => {
    setUser(undefined);
    userManager.signoutRedirect();
  };

  return (
    <Context.Provider
      value={{
        user,
        login,
        logout,
        userManager,
        loading,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(Context);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  const isAuthenticated = !!context.user && !isAccessTokenExpired(context.user);
  return {
    ...context,
    tokenExpiresAt: context.user?.expires_at,
    isAuthenticated: context.loading ? undefined : isAuthenticated,
  };
};

const isAccessTokenExpired = (user: User) => {
  const nowInSeconds = Date.now().valueOf() / 1000;
  return user.expires_at && user.expires_at < nowInSeconds;
};
