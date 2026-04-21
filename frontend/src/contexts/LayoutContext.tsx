"use client";

import { createContext, useContext, type ReactNode } from "react";

interface LayoutContextValue {
  platformUrl: string;
  metrikaId: string;
  locale: string;
  activeSections: string[];
}

const LayoutContext = createContext<LayoutContextValue>({
  platformUrl: "https://app.promto.ai",
  metrikaId: "",
  locale: "ru",
  activeSections: [],
});

export function LayoutContextProvider({
  platformUrl,
  metrikaId,
  locale,
  activeSections,
  children,
}: LayoutContextValue & { children: ReactNode }) {
  return (
    <LayoutContext.Provider value={{ platformUrl, metrikaId, locale, activeSections }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayoutContext() {
  return useContext(LayoutContext);
}
