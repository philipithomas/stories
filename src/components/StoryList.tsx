"use client";

import Image from "next/image";
import { useStoriesStore } from "@/store/useStoriesStore";
import { useEffect } from "react";
import StoryViewer from "./StoryViewer";
import { UserStories } from "@/types/stories";

interface StoryListProps {
  initialStories: UserStories[];
}

export default function StoryList({ initialStories }: StoryListProps) {
  const users = useStoriesStore((state) => state.users);
  const setInitialStories = useStoriesStore((state) => state.setInitialStories);
  const selectedUser = useStoriesStore((state) => state.selectedUser);
  const setSelectedUser = useStoriesStore((state) => state.setSelectedUser);

  useEffect(() => {
    setInitialStories(initialStories);
  }, [initialStories, setInitialStories]);

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
              <p className="text-[10px] font-normal leading-[12.1px] text-center mt-1">
                {user.username}
              </p>
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
