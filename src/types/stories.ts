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
