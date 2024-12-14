"use client";

import { useStoriesStore } from "@/providers/StoriesStoreProvider";
import StoryListClient from "./StoryListClient";

export default function StoryList() {
  const users = useStoriesStore((state) => state.users);

  if (users.length === 0) {
    return <p>Loading stories...</p>;
  }

  return <StoryListClient users={users} />;
}
