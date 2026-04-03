import { createContext, useContext, type PropsWithChildren } from "react";

import { API_BASE_URL } from "../services/api";

interface AppConfigValue {
  apiBaseUrl: string;
  appName: string;
}

const AppConfigContext = createContext<AppConfigValue | undefined>(undefined);

export const AppConfigProvider = ({ children }: PropsWithChildren) => {
  return (
    <AppConfigContext.Provider
      value={{
        apiBaseUrl: API_BASE_URL,
        appName: "Finance-Project",
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfig = (): AppConfigValue => {
  const context = useContext(AppConfigContext);

  if (!context) {
    throw new Error("useAppConfig must be used inside AppConfigProvider");
  }

  return context;
};
