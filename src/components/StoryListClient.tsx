"use client";

import Image from "next/image";
import { useStoriesStore } from "@/providers/StoriesStoreProvider";
import StoryViewer from "./StoryViewer";
import { UserStories } from "@/store/useStoriesStore";

interface StoryListClientProps {
  users: UserStories[];
}

export default function StoryListClient({ users }: StoryListClientProps) {
  const setSelectedUser = useStoriesStore((state) => state.setSelectedUser);
  const selectedUser = useStoriesStore((state) => state.selectedUser);

  const handleStorySelect = (userId: number) => {
    setSelectedUser(userId);
  };

  const handleCloseViewer = () => {
    setSelectedUser(null);
  };

  return (
    <>
      <div className="flex space-x-4 overflow-x-scroll p-4">
        {users.map((user) => {
          const allViewed = user.stories.every((story) => story.viewed);
          return (
            <button
              key={user.userId}
              onClick={() => handleStorySelect(user.userId)}
              className="flex-shrink-0"
            >
              <div className="relative w-16 h-16">
                <div className={`story-ring ${allViewed ? "viewed" : ""}`}>
                  <div className="story-image-container">
                    <Image
                      src={user.profilePicture}
                      alt={user.username}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              <p className="story-username">{user.username}</p>
            </button>
          );
        })}
      </div>
      {selectedUser && (
        <StoryViewer userId={selectedUser} onClose={handleCloseViewer} />
      )}
    </>
  );
}
