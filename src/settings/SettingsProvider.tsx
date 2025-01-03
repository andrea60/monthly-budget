import { useQuery } from "@tanstack/react-query";
import { AppSettings } from "./settings";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { ClientSecretConfiguration } from "./ClientSecretConfiguration";

const fetchSettings = () =>
  fetch("/public/settings.json").then(
    (res) => res.json() as Promise<AppSettings>
  );

type AppSettingsContext = {
  /** Remote-fetched non-sensitive settings */
  settings: AppSettings;
  /** Client Secret is stored locally as it's sensitive information. Users are asked to store it when using the app for the first time on a particular device */
  clientSecret?: string;
  saveClientSecret: (clientSecret: string) => void;
};
const Context = createContext<AppSettingsContext | undefined>(undefined);
export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [clientSecret, setClientSecret] = useState(readClientSecret());
  const { isSuccess, data } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
    refetchInterval: undefined,
    staleTime: undefined,
    retry: false,
  });

  const saveClientSecret = useCallback((secret: string) => {
    storeClientSecret(secret);
    setClientSecret(secret);
  }, []);

  if (!isSuccess) return <div>Loading...</div>;
  return (
    <Context.Provider
      value={{
        settings: data,
        saveClientSecret,
        clientSecret: clientSecret,
      }}
    >
      {clientSecret ? children : <ClientSecretConfiguration />}
    </Context.Provider>
  );
};

export const useSettings = () => {
  const settings = useContext(Context);
  if (!settings)
    throw new Error("useSettings must be used within a SettingsProvider");

  return settings;
};

const readClientSecret = () => {
  return localStorage.getItem("monzo.client_secret") ?? undefined;
};

const storeClientSecret = (clientSecret: string) => {
  localStorage.setItem("monzo.client_secret", clientSecret);
};
