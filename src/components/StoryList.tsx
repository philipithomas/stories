"use client";

import UserPreview from "./UserPreview";
import StoryViewer from "./StoryViewer";
import { useStoriesStore } from "@/providers/stories-store-provider";
import { useState } from "react";
import { UserStories } from "@/types/stories";

export default function StoryList() {
  const users = useStoriesStore((state) => state.users);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const handleStorySelect = (userId: number) => {
    setSelectedUser(userId);
  };

  const handleClose = () => {
    setSelectedUser(null);
  };

  return (
    <div>
      <div className="flex space-x-4 overflow-x-scroll p-4">
        {users.map((user: UserStories) => (
          <UserPreview
            key={user.userId}
            user={user}
            onClick={handleStorySelect}
          />
        ))}
      </div>
      {selectedUser && (
        <StoryViewer userId={selectedUser} onClose={handleClose} />
      )}
    </div>
  );
}
