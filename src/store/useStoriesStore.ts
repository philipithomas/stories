import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import { UserStories } from "@/types/stories";

export interface StoriesState {
  users: UserStories[];
  selectedUser: number | null;
  currentUserId: number | null;
  currentStoryIndex: number;
}

export interface StoriesActions {
  setSelectedUser: (userId: number) => void;
  markStoryAsViewed: (userId: number, storyId: number) => void;
  markUserStoriesAsViewed: (userId: number) => void;
  getPreviousUser: (userId: number) => UserStories | null;
  getNextUser: (userId: number) => UserStories | null;
  getPreviousUserId: (userId: number) => number | null;
  getNextUserId: (userId: number) => number | null;
  getNextStory: (
    userId: number,
    currentIndex: number,
  ) => { index: number } | null;
  getPreviousStory: (
    userId: number,
    currentIndex: number,
  ) => { index: number } | null;
  hasNextStory: (userId: number, currentIndex: number) => boolean;
  hasPreviousStory: (userId: number, currentIndex: number) => boolean;
  hasPreviousUser: (userId: number) => boolean;
  hasNextUser: (userId: number) => boolean;
  setCurrentUserAndStory: (userId: number, storyIndex: number) => void;
  closeViewer: () => void;
  initializeStories: (initialStories: UserStories[]) => void;
}

export type StoriesStore = StoriesState & StoriesActions;

export const initStoriesStore = (): StoriesState => ({
  users: [],
  selectedUser: null,
  currentUserId: null,
  currentStoryIndex: 0,
});

export const defaultInitState: StoriesState = initStoriesStore();

export const createStoriesStore = (
  initState: StoriesState = defaultInitState,
) => {
  return createStore<StoriesStore>()(
    persist(
      (set, get) => ({
        ...initState,
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
        markUserStoriesAsViewed: (userId) => {
          set((state) => {
            const updatedUsers = state.users.map((user) => {
              if (user.userId === userId) {
                const updatedStories = user.stories.map((story) => ({
                  ...story,
                  viewed: true,
                }));
                return { ...user, stories: updatedStories };
              }
              return user;
            });
            return { users: updatedUsers };
          });
        },
        getPreviousUser: (userId) => {
          const users = get().users;
          const currentIndex = users.findIndex((user) =>
            user.userId === userId
          );
          return currentIndex > 0 ? users[currentIndex - 1] : null;
        },
        getNextUser: (userId) => {
          const users = get().users;
          const currentIndex = users.findIndex((user) =>
            user.userId === userId
          );
          return currentIndex < users.length - 1
            ? users[currentIndex + 1]
            : null;
        },
        getPreviousUserId: (userId) => {
          const users = get().users;
          const currentIndex = users.findIndex((user) =>
            user.userId === userId
          );
          return currentIndex > 0 ? users[currentIndex - 1].userId : null;
        },
        getNextUserId: (userId) => {
          const users = get().users;
          const currentIndex = users.findIndex((user) =>
            user.userId === userId
          );
          return currentIndex < users.length - 1
            ? users[currentIndex + 1].userId
            : null;
        },
        hasPreviousUser: (userId) => {
          return get().getPreviousUserId(userId) !== null;
        },
        hasNextUser: (userId) => {
          return get().getNextUserId(userId) !== null;
        },
        getNextStory: (userId, currentIndex) => {
          const user = get().users.find((user) => user.userId === userId);
          if (!user) return null;
          if (currentIndex < user.stories.length - 1) {
            return { index: currentIndex + 1 };
          }
          const nextUser = get().getNextUser(userId);
          return nextUser ? { index: 0 } : null;
        },
        getPreviousStory: (userId, currentIndex) => {
          const user = get().users.find((user) => user.userId === userId);
          if (!user) return null;
          if (currentIndex > 0) {
            return { index: currentIndex - 1 };
          }
          const previousUser = get().getPreviousUser(userId);
          return previousUser
            ? { index: previousUser.stories.length - 1 }
            : null;
        },
        hasNextStory: (userId, currentIndex) => {
          const user = get().users.find((user) => user.userId === userId);
          if (!user) return false;
          if (currentIndex < user.stories.length - 1) {
            return true;
          }
          return get().getNextUser(userId) !== null;
        },
        hasPreviousStory: (userId, currentIndex) => {
          const user = get().users.find((user) => user.userId === userId);
          if (!user) return false;
          return currentIndex > 0;
        },
        setCurrentUserAndStory: (userId, storyIndex) => {
          set({ currentUserId: userId, currentStoryIndex: storyIndex });
        },
        closeViewer: () => set({ selectedUser: null }),
        initializeStories: (stories: UserStories[]) => {
          set({ users: stories });
        },
      }),
      {
        name: "stories-storage",
      },
    ),
  );
};
