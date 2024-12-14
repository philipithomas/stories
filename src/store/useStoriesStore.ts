import { create } from "zustand";

export interface Story {
  id: number;
  imageUrl: string;
  viewed: boolean;
}

export interface UserStories {
  userId: number;
  username: string;
  profilePicture: string;
  stories: Story[];
}

export interface StoriesState {
  users: UserStories[];
  selectedUser: number | null;
  setSelectedUser: (userId: number | null) => void;
  markStoryAsViewed: (userId: number, storyId: number) => void;
  setStories: (users: UserStories[]) => void;
}

export const createStoriesStore = () => {
  return create<StoriesState>((set) => ({
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
    },
    setStories: (users) => set({ users }),
  }));
};
