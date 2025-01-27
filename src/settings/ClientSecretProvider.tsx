import { createContext, PropsWithChildren, useContext, useState } from "react";
import { LockScreen } from "./LockScreen";
import { useSettings } from "./SettingsProvider";

type Context = {
  clientSecret?: string;
  isLoading: boolean;
  obtainClientSecret: (passcode: string) => Promise<boolean>;
};
const Ctx = createContext<Context | undefined>(undefined);

export const ClientSecretProvider = ({ children }: PropsWithChildren) => {
  const [clientSecret, setClientSecret] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const { settings } = useSettings();

  const obtainClientSecret = async (passcode: string) => {
    setIsLoading(true);
    try {
      const secret = await fetchSecret(settings.secretsApi, passcode);
      setIsLoading(false);
      setClientSecret(secret);
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
    return true;
  };

  return (
    <Ctx.Provider value={{ isLoading, clientSecret, obtainClientSecret }}>
      {clientSecret ? children : <LockScreen />}
    </Ctx.Provider>
  );
};

export const useClientSecret = () => {
  const ctx = useContext(Ctx);

  if (!ctx)
    throw new Error(
      "Unable to read undefined ClientSecret context. Make sure to wrap your components in a ClientSecretProvider"
    );

  if (ctx.clientSecret)
    return { ...ctx, clientSecret: ctx.clientSecret, hasClientSecret: true };

  return {
    ...ctx,
    hasClientSecret: false,
    isLoading: ctx.isLoading,
    clientSecret: undefined,
  };
};

const fetchSecret = async (secretApiUrl: string, passcode: string) => {
  const response = await fetch(secretApiUrl + "/clientSecret", {
    headers: { Authorization: "Basic " + btoa("main:" + passcode) },
  });

  if (response.status !== 200)
    throw new Error(
      `Non successful status code returned from SecretsAPI: (${response.status}) ${response.statusText}`
    );

  const responseBody: { clientSecret: string } = await response.json();

  return responseBody.clientSecret;
};
