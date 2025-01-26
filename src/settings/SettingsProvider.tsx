import { AppSettings } from "./settings";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

const fetchSettings = () =>
  fetch("/public/settings.json").then(
    (res) => res.json() as Promise<AppSettings>
  );

type AppSettingsContext = {
  /** Remote-fetched non-sensitive settings */
  settings: AppSettings;
};
const Context = createContext<AppSettingsContext | undefined>(undefined);
export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [settings, setSettings] = useState<AppSettings>();

  useEffect(() => {
    fetchSettings().then(setSettings);
  }, []);

  if (!settings) return <div>Loading...</div>;
  return <Context.Provider value={{ settings }}>{children}</Context.Provider>;
};

export const useSettings = () => {
  const settings = useContext(Context);
  if (!settings)
    throw new Error("useSettings must be used within a SettingsProvider");

  return settings;
};
