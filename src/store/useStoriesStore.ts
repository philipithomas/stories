import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Story {
  id: number;
  imageUrl: string;
  viewed: boolean;
}

interface UserStories {
  userId: number;
  username: string;
  profilePicture: string;
  stories: Story[];
}

interface StoriesState {
  users: UserStories[];
  selectedUser: number | null;
  setSelectedUser: (userId: number | null) => void;
  markStoryAsViewed: (userId: number, storyId: number) => void;
  setInitialStories: (initialStories: UserStories[]) => void;
}

export const useStoriesStore = create<StoriesState>()(
  persist(
    (set) => ({
      users: [],
      selectedUser: null,
      setSelectedUser: (userId) => set({ selectedUser: userId }),
      markStoryAsViewed: (userId, storyId) => {
        set((state) => {
          const updatedUsers = state.users.map((user) => {
            if (user.userId === userId) {
              const updatedStories = user.stories.map((story) => {
                if (story.id === storyId) {
                  return { ...story, viewed: true };
                }
                return story;
              });
              return { ...user, stories: updatedStories };
            }
            return user;
          });
          return { users: updatedUsers };
        });

        fetch(`/api/stories/${storyId}/viewed`, {
          method: "POST",
        }).catch((error) => {
          console.error("Failed to sync viewed status:", error);
        });
      },
      setInitialStories: (initialStories) => set({ users: initialStories }),
    }),
    {
      name: "stories-storage",
    },
  ),
);
