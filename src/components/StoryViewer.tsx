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
  const currentStoryId = useStoriesStore((state) => state.currentStoryId);
  const setCurrentUserAndStory = useStoriesStore((state) =>
    state.setCurrentUserAndStory
  );

  const currentStory = user?.stories.find((story) =>
    story.id === currentStoryId
  );

  useEffect(() => {
    if (user && user.stories.length > 0) {
      setCurrentUserAndStory(userId, user.stories[0].id);
    }
  }, [userId, setCurrentUserAndStory, user]);

  useEffect(() => {
    if (currentStory) {
      const img = new window.Image();
      img.src = currentStory.imageUrl;
      img.onload = () => {
        setLoading(false);
        if (!currentStory.viewed && currentUserId !== null) {
          markStoryAsViewed(currentUserId, currentStory.id);
        }
      };
    }
  }, [currentStory, currentUserId, markStoryAsViewed]);

  const handleNextStory = () => {
    const nextStory = getNextStory(currentUserId!, currentStoryId!);
    if (nextStory) {
      setCurrentUserAndStory(currentUserId!, nextStory.id);
      setLoading(true);
    } else {
      onClose();
    }
  };

  const handlePreviousStory = () => {
    const previousStory = getPreviousStory(currentUserId!, currentStoryId!);
    if (previousStory) {
      setCurrentUserAndStory(currentUserId!, previousStory.id);
      setLoading(true);
    }
  };

  const handlePreviousUser = () => {
    const previousUser = getPreviousUser(currentUserId!);
    if (previousUser) {
      setCurrentUserAndStory(previousUser.userId, previousUser.stories[0].id);
      setLoading(true);
    }
  };

  const handleNextUser = () => {
    const nextUser = getNextUser(currentUserId!);
    if (nextUser) {
      setCurrentUserAndStory(nextUser.userId, nextUser.stories[0].id);
      setLoading(true);
    } else {
      onClose();
    }
  };

  if (!user || !currentStory) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-[#1a1a1a] flex flex-col">
      <div className="flex justify-between items-center p-4 h-18">
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
      <div className="grid grid-cols-3 w-full flex-grow">
        <div className="flex items-center justify-center">
          {hasPreviousUser(currentUserId!) && (
            <div
              className="flex-shrink-0 w-2/5 h-2/5 bg-gray-500 flex items-center justify-center rounded-md"
              style={{ backgroundColor: "rgba(135, 135, 135, 1)" }}
            >
              <UserPreview
                user={getPreviousUser(currentUserId!)!}
                onClick={handlePreviousUser}
              />
            </div>
          )}
        </div>
        <div className="relative px-4">
          {loading && currentStoryId !== null && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="loader"></div>
            </div>
          )}
          <div className="flex items-center w-full h-full">
            <div className="flex-none w-8 h-8 mr-4">
              {hasPreviousStory(currentUserId!, currentStoryId!) && (
                <button
                  onClick={handlePreviousStory}
                  className="bg-white rounded-full w-full h-full flex items-center justify-center"
                  aria-label="Previous Story"
                >
                  <NextImage
                    src="/left_chevron.svg"
                    alt="Previous"
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                </button>
              )}
            </div>
            <div
              className="flex-grow h-full bg-cover bg-center rounded-md"
              style={{
                backgroundImage: `url(${currentStory.imageUrl})`,
                backgroundColor: "rgba(135, 135, 135, 1)",
                aspectRatio: "10 / 18",
              }}
            >
            </div>
            <div className="flex-none w-8 h-8 ml-4">
              {hasNextStory(currentUserId!, currentStoryId!) && (
                <button
                  onClick={handleNextStory}
                  className="bg-white rounded-full w-full h-full flex items-center justify-center"
                  aria-label="Next Story"
                >
                  <NextImage
                    src="/right_chevron.svg"
                    alt="Next"
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          {hasNextUser(currentUserId!) && (
            <div
              onClick={() => handleNextUser()}
              className="flex-shrink-0 w-2/5 h-2/5 bg-gray-500 flex items-center justify-center rounded-md"
              style={{ backgroundColor: "rgba(135, 135, 135, 1)" }}
            >
              <UserPreview
                user={getNextUser(currentUserId!)!}
                onClick={handleNextUser}
              />
            </div>
          )}
        </div>
      </div>
      <div className="h-16"></div>
    </div>
  );
}
