import { useMemo } from "react";
import { MonzoClient } from "./bank-client";
import { LiveMonzoClient } from "./clients/live-monzo-client";
import { useAuth } from "../auth/AuthProvider";

export const useMonzoClient = () => {
  const { userManager } = useAuth();
  const client: MonzoClient = useMemo(() => {
    return new LiveMonzoClient(() =>
      userManager.getUser().then((usr) => usr?.access_token)
    );
  }, []);

  return client;
};
