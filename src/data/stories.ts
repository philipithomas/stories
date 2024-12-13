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

const users: Omit<UserStories, "stories">[] = [
  {
    userId: 1,
    username: "john_doe",
    profilePicture: "/people/1.png",
  },
  {
    userId: 2,
    username: "jane_smith",
    profilePicture: "/people/2.png",
  },
  {
    userId: 3,
    username: "mike_johnson",
    profilePicture: "/people/3.png",
  },
  {
    userId: 4,
    username: "sarah_lee",
    profilePicture: "/people/4.png",
  },
  {
    userId: 5,
    username: "david_brown",
    profilePicture: "/people/5.png",
  },
];

function generateStories(): UserStories[] {
  const stories: UserStories[] = users.map((user) => {
    const numStories = Math.floor(Math.random() * 5) + 1; // Random number of stories (1-5)
    const userStories: Story[] = Array.from(
      { length: numStories },
      (_, index) => ({
        id: index + 1,
        imageUrl: `/api/generateStoryImage?userId=${user.userId}&storyId=${
          index + 1
        }`,
        viewed: false,
      }),
    );

    return {
      ...user,
      stories: userStories,
    };
  });

  return stories;
}

export const getInitialStories = (): Promise<UserStories[]> => {
  return Promise.resolve(generateStories());
};
