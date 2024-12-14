"use client";

import { createContext, ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";

import { createStoriesStore, StoriesState } from "@/store/useStoriesStore";

export type StoriesStoreApi = ReturnType<typeof createStoriesStore>;

// Create a context for the store
const StoriesStoreContext = createContext<StoriesStoreApi | undefined>(
  undefined,
);

interface StoriesStoreProviderProps {
  children: ReactNode;
}

export const StoriesStoreProvider = ({
  children,
}: StoriesStoreProviderProps) => {
  const storeRef = useRef<StoriesStoreApi | null>(null);

  if (!storeRef.current) {
    storeRef.current = createStoriesStore();
  }

  return (
    <StoriesStoreContext.Provider value={storeRef.current}>
      {children}
    </StoriesStoreContext.Provider>
  );
};

// Custom hook to use the store
export const useStoriesStore = <T,>(
  selector: (state: StoriesState) => T,
): T => {
  const store = useContext(StoriesStoreContext);

  if (!store) {
    throw new Error("useStoriesStore must be used within StoriesStoreProvider");
  }

  return useStore(store, selector);
};
