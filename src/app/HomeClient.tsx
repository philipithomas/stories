"use client";

import { useEffect } from "react";
import { useStoriesStore } from "@/providers/StoriesStoreProvider";
import StoryList from "@/components/StoryList";
import { UserStories } from "@/store/useStoriesStore";

export default function HomeClient() {
  const setStories = useStoriesStore((state) => state.setStories);
  const users = useStoriesStore((state) => state.users);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch(`/api/stories`, { cache: "no-store" });

        if (!res.ok) {
          throw new Error(`Failed to fetch stories: ${res.statusText}`);
        }

        const initialStories: UserStories[] = await res.json();
        setStories(initialStories);
      } catch (error) {
        console.error("Error fetching stories:", error);
        // Optionally, you can set an error state here and render ErrorComponent
      }
    };

    if (users.length === 0) {
      fetchStories();
    }
  }, [setStories, users.length]);

  return <StoryList />;
}
