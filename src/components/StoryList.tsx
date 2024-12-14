"use client";

import UserPreview from "./UserPreview";
import StoryViewer from "./StoryViewer";
import { useStoriesStore } from "@/providers/stories-store-provider";
import { UserStories } from "@/types/stories";

export default function StoryList() {
  const users = useStoriesStore((state) => state.users);
  const currentUserId = useStoriesStore((state) => state.currentUserId);
  const setCurrentUser = useStoriesStore((state) => state.setCurrentUser);

  return (
    <div>
      <div className="flex space-x-4 overflow-x-scroll p-4">
        {users.map((user: UserStories) => (
          <UserPreview
            key={user.userId}
            user={user}
            onClick={() => setCurrentUser(user.userId)}
          />
        ))}
      </div>
      {currentUserId && <StoryViewer />}
    </div>
  );
}
