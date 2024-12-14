"use client";

import UserPreview from "./UserPreview";
import StoryViewer from "./StoryViewer";
import { useStoriesStore } from "@/providers/stories-store-provider";
import { UserStories } from "@/types/stories";

export default function StoryList() {
  const users = useStoriesStore((state) => state.users);
  const handleStorySelect = useStoriesStore((state) => state.setSelectedUser);
  const selectedUser = useStoriesStore((state) => state.selectedUser);
  const handleCloseViewer = useStoriesStore((state) => state.closeViewer);

  return (
    <div className="flex space-x-4 overflow-x-scroll p-4">
      {users.map((user: UserStories) => (
        <UserPreview
          key={user.userId}
          user={user}
          onClick={handleStorySelect}
        />
      ))}
      {selectedUser && (
        <StoryViewer userId={selectedUser} onClose={handleCloseViewer} />
      )}
    </div>
  );
}
