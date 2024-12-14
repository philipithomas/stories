"use client";

import { createContext, ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";
import {
  createStoriesStore,
  initStoriesStore,
  type StoriesStore,
} from "@/store/useStoriesStore";
import { UserStories } from "@/types/stories";

export type StoriesStoreApi = ReturnType<typeof createStoriesStore>;

export const StoriesStoreContext = createContext<StoriesStoreApi | undefined>(
  undefined,
);

export interface StoriesStoreProviderProps {
  children: ReactNode;
  initialStories: UserStories[];
}

export const StoriesStoreProvider = ({
  children,
  initialStories,
}: StoriesStoreProviderProps) => {
  const storeRef = useRef<StoriesStoreApi | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = createStoriesStore({
      ...initStoriesStore(),
      users: initialStories,
    });
  }

  return (
    <StoriesStoreContext.Provider value={storeRef.current}>
      {children}
    </StoriesStoreContext.Provider>
  );
};

export const useStoriesStore = <T,>(
  selector: (store: StoriesStore) => T,
): T => {
  const storiesStoreContext = useContext(StoriesStoreContext);

  if (!storiesStoreContext) {
    throw new Error(`useStoriesStore must be used within StoriesStoreProvider`);
  }

  return useStore(storiesStoreContext, selector);
};
