"use client";

import { useEffect, useState } from "react";
import { useStoriesStore } from "@/providers/stories-store-provider";
import NextImage from "next/image";
import UserPreview from "./UserPreview";
import { UserStories } from "@/types/stories";

interface StoryViewerProps {
  userId: number;
  onClose: () => void;
}

export default function StoryViewer({ userId, onClose }: StoryViewerProps) {
  const [loading, setLoading] = useState(true);
  const user = useStoriesStore((state) =>
    state.users.find((user: UserStories) => user.userId === userId)
  );
  const markStoryAsViewed = useStoriesStore((state) => state.markStoryAsViewed);
  const getNextStory = useStoriesStore((state) => state.getNextStory);
  const getPreviousStory = useStoriesStore((state) => state.getPreviousStory);
  const hasNextStory = useStoriesStore((state) => state.hasNextStory);
  const hasPreviousStory = useStoriesStore((state) => state.hasPreviousStory);
  const hasPreviousUser = useStoriesStore((state) => state.hasPreviousUser);
  const hasNextUser = useStoriesStore((state) => state.hasNextUser);
  const getPreviousUser = useStoriesStore((state) => state.getPreviousUser);
  const getNextUser = useStoriesStore((state) => state.getNextUser);

  const currentUserId = useStoriesStore((state) => state.currentUserId);
  const currentStoryIndex = useStoriesStore((state) => state.currentStoryIndex);
  const setCurrentUserAndStory = useStoriesStore((state) =>
    state.setCurrentUserAndStory
  );
  useEffect(() => {
    if (user) {
      setCurrentUserAndStory(userId, 0);
    }
  }, [userId, setCurrentUserAndStory, user]);

  useEffect(() => {
    if (user) {
      const currentStory = user.stories[currentStoryIndex];

      const img = new window.Image();
      img.src = currentStory.imageUrl;
      img.onload = () => {
        setLoading(false);
        if (!currentStory.viewed && currentUserId !== null) {
          markStoryAsViewed(currentUserId, currentStory.id);
        }
      };
    }
  }, [currentStoryIndex, currentUserId, user, markStoryAsViewed]);

  const handleNext = () => {
    const nextStory = getNextStory(currentUserId!, currentStoryIndex);
    if (nextStory) {
      setCurrentUserAndStory(currentUserId!, nextStory.index);
      setLoading(true);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    const previousStory = getPreviousStory(currentUserId!, currentStoryIndex);
    if (previousStory) {
      setCurrentUserAndStory(currentUserId!, previousStory.index);
      setLoading(true);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <div className="flex justify-between items-center p-4">
        <NextImage
          src="/instagram_wordmark.svg"
          alt="Instagram logo"
          width={100}
          height={40}
        />
        <button
          onClick={onClose}
          className="text-white text-xl"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
      <div className="grid grid-cols-3 w-full h-full">
        <div className="flex items-center justify-end">
          {hasPreviousUser(currentUserId!) && (
            <UserPreview
              user={getPreviousUser(currentUserId!)!}
              onClick={handlePrevious}
            />
          )}
          {hasPreviousStory(currentUserId!, currentStoryIndex) && (
            <button onClick={handlePrevious} className="text-white text-xl">
              &larr;
            </button>
          )}
        </div>
        <div className="relative flex items-center justify-center">
          {loading && currentStoryIndex !== null && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="loader"></div>
            </div>
          )}
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${
                user.stories[currentStoryIndex]?.imageUrl
              })`,
              backgroundColor: "rgba(135, 135, 135, 1)",
            }}
          >
          </div>
        </div>
        <div className="flex items-center justify-start">
          {hasNextStory(currentUserId!, currentStoryIndex) && (
            <button onClick={handleNext} className="text-white text-xl">
              &rarr;
            </button>
          )}
          {hasNextUser(currentUserId!) && (
            <UserPreview
              user={getNextUser(currentUserId!)!}
              onClick={handleNext}
            />
          )}
        </div>
      </div>
    </div>
  );
}
