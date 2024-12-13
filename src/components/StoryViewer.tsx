"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useStoriesStore } from "@/store/useStoriesStore";

interface StoryViewerProps {
  userId: number;
  onClose: () => void;
}

export default function StoryViewer({ userId, onClose }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const user = useStoriesStore((state) =>
    state.users.find((user) => user.userId === userId)
  );
  const markStoryAsViewed = useStoriesStore((state) => state.markStoryAsViewed);

  useEffect(() => {
    if (user) {
      const currentStory = user.stories[currentIndex];
      if (!currentStory.viewed) {
        markStoryAsViewed(userId, currentStory.id);
      }
    }
  }, [currentIndex, userId, user, markStoryAsViewed]);

  const handleNext = () => {
    if (user && currentIndex < user.stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center">
      <button
        className="absolute top-4 right-4 text-white text-2xl"
        onClick={onClose}
      >
        &times;
      </button>
      <div className="relative w-full max-w-md">
        <Image
          src={user.stories[currentIndex].imageUrl}
          alt={`Story ${currentIndex + 1}`}
          width={400}
          height={600}
          className="object-contain"
        />
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-500">
          <div
            className="bg-white h-full"
            style={{
              width: `${((currentIndex + 1) / user.stories.length) * 100}%`,
            }}
          >
          </div>
        </div>
        {currentIndex > 0 && (
          <button
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-3xl"
          >
            &#8249;
          </button>
        )}
        {currentIndex < user.stories.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-3xl"
          >
            &#8250;
          </button>
        )}
      </div>
    </div>
  );
}
