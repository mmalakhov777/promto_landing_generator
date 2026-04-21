"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const ActiveSectionsContext = createContext<string[]>([]);

export function ActiveSectionsProvider({
  sections,
  children,
}: {
  sections: string[];
  children: ReactNode;
}) {
  return (
    <ActiveSectionsContext.Provider value={sections}>
      {children}
    </ActiveSectionsContext.Provider>
  );
}

export function useActiveSections(): string[] {
  return useContext(ActiveSectionsContext);
}