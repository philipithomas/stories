import { createStore } from "zustand/vanilla";
import { UserStories } from "@/types/stories";

export interface StoriesState {
  users: UserStories[];
  currentUserId: number | null;
  currentStoryId: number | null;
}

export interface StoriesActions {
  setCurrentUser: (userId: number | null) => void;
  markStoryAsViewed: (userId: number, storyId: number) => void;
  markUserStoriesAsViewed: (userId: number) => void;
  getPreviousUser: (userId: number) => UserStories | null;
  getNextUser: (userId: number) => UserStories | null;
  getPreviousUserId: (userId: number) => number | null;
  getNextUserId: (userId: number) => number | null;
  getNextStory: (
    userId: number,
    currentStoryId: number,
  ) => { userId: number; storyId: number } | null;
  getPreviousStory: (
    userId: number,
    currentStoryId: number,
  ) => { userId: number; storyId: number } | null;
  hasNextStory: (userId: number, currentStoryId: number) => boolean;
  hasPreviousStory: (userId: number, currentStoryId: number) => boolean;
  hasPreviousUser: (userId: number) => boolean;
  hasNextUser: (userId: number) => boolean;
  setCurrentUserAndStory: (userId: number, storyId: number) => void;
  closeViewer: () => void;
  initializeStories: (initialStories: UserStories[]) => void;
}

export type StoriesStore = StoriesState & StoriesActions;

export const initStoriesStore = (): StoriesState => ({
  users: [],
  currentUserId: null,
  currentStoryId: null,
});

export const defaultInitState: StoriesState = initStoriesStore();

export const createStoriesStore = (
  initState: StoriesState = defaultInitState,
) => {
  return createStore<StoriesStore>()(
    (set, get) => ({
      ...initState,
      setCurrentUser: (userId) => {
        if (userId === null) {
          set({ currentUserId: null, currentStoryId: null });
        } else {
          const user = get().users.find((user) => user.userId === userId);
          if (user) {
            const firstUnviewedStory = user.stories.find((story) =>
              !story.viewed
            );
            const currentStoryId = firstUnviewedStory
              ? firstUnviewedStory.id
              : user.stories[0].id;
            set({ currentUserId: userId, currentStoryId });
          }
        }
      },
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
        const currentIndex = users.findIndex((user) => user.userId === userId);
        return currentIndex > 0 ? users[currentIndex - 1] : null;
      },
      getNextUser: (userId) => {
        const users = get().users;
        const currentIndex = users.findIndex((user) => user.userId === userId);
        return currentIndex < users.length - 1 ? users[currentIndex + 1] : null;
      },
      getPreviousUserId: (userId) => {
        const users = get().users;
        const currentIndex = users.findIndex((user) => user.userId === userId);
        return currentIndex > 0 ? users[currentIndex - 1].userId : null;
      },
      getNextUserId: (userId) => {
        const users = get().users;
        const currentIndex = users.findIndex((user) => user.userId === userId);
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
      getNextStory: (userId, currentStoryId) => {
        const user = get().users.find((user) => user.userId === userId);
        if (!user) return null;
        const currentIndex = user.stories.findIndex((story) =>
          story.id === currentStoryId
        );
        if (currentIndex === -1) return null;
        if (currentIndex < user.stories.length - 1) {
          const nextStory = user.stories[currentIndex + 1];
          return { userId: user.userId, storyId: nextStory.id };
        }
        const nextUser = get().getNextUser(userId);
        return nextUser
          ? { userId: nextUser.userId, storyId: nextUser.stories[0].id }
          : null;
      },
      getPreviousStory: (userId, currentStoryId) => {
        const user = get().users.find((user) => user.userId === userId);
        if (!user) return null;
        const currentIndex = user.stories.findIndex((story) =>
          story.id === currentStoryId
        );
        if (currentIndex === -1) return null;
        if (currentIndex > 0) {
          const previousStory = user.stories[currentIndex - 1];
          return { userId: user.userId, storyId: previousStory.id };
        }
        const previousUser = get().getPreviousUser(userId);
        return previousUser
          ? {
            userId: previousUser.userId,
            storyId: previousUser.stories[previousUser.stories.length - 1].id,
          }
          : null;
      },
      hasNextStory: (userId, currentStoryId) => {
        const user = get().users.find((user) => user.userId === userId);
        if (!user) return false;
        const currentIndex = user.stories.findIndex((story) =>
          story.id === currentStoryId
        );
        return currentIndex < user.stories.length - 1 ||
          get().getNextUser(userId) !== null;
      },
      hasPreviousStory: (userId, currentStoryId) => {
        const user = get().users.find((user) => user.userId === userId);
        if (!user) return false;
        const currentIndex = user.stories.findIndex((story) =>
          story.id === currentStoryId
        );
        return currentIndex > 0 || get().getPreviousUser(userId) !== null;
      },
      setCurrentUserAndStory: (userId, storyId) => {
        set({ currentUserId: userId, currentStoryId: storyId });
      },
      closeViewer: () =>
        set({
          currentUserId: null,
          currentStoryId: null,
        }),
      initializeStories: (stories: UserStories[]) => {
        set({ users: stories });
      },
    }),
    {
      name: "stories-storage",
    },
  );
};
