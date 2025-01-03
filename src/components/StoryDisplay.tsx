import { Story, UserStories } from "@/types/stories";
import {
  EllipsisHorizontalIcon,
  PaperAirplaneIcon,
  PlayIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRef, useState } from "react";

type StoryDisplayProps = {
  user: UserStories;
  currentStory: Story;
  loading: boolean;
};

export default function StoryDisplay(
  { user, currentStory, loading }: StoryDisplayProps,
) {
  const [replyText, setReplyText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyText(e.target.value);
  };

  const handleSendReply = () => {
    // TODO: Implement sending reply
    setReplyText("");
    if (textareaRef.current) {
      textareaRef.current.blur(); // Remove focus from the textarea
    }
  };

  return (
    <div
      className="relative flex-grow h-full bg-cover bg-center rounded-md text-white"
      style={{
        backgroundImage: `url(${currentStory.imageUrl})`,
        backgroundColor: "rgba(135, 135, 135, 1)",
        aspectRatio: "10 / 18",
      }}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="loader"></div>
        </div>
      )}
      <div className="absolute top-0 left-0 right-0 p-4">
        {/* Progress Bar */}
        <div className="flex space-x-1">
          {user.stories.map((_, index) => (
            <div
              key={index}
              className={`h-0.5 flex-1 rounded-full ${
                index < user.stories.indexOf(currentStory)
                  ? "bg-white"
                  : "bg-[#a5a5a5]"
              }`}
            >
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-2">
          {/* User Info */}
          <div className="flex items-center space-x-2">
            <div className="relative w-8 h-8">
              <Image
                src={user.profilePicture}
                alt={user.username}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <span>{user.username}</span>
            <span className="opacity-50">2h</span>
          </div>
          {/* Icons */}
          <div className="flex space-x-4">
            <button className="hover:text-gray-300 active:text-gray-500">
              <PlayIcon className="w-6 h-6" />
            </button>
            <button className="hover:text-gray-300 active:text-gray-500">
              <SpeakerWaveIcon className="w-6 h-6" />
            </button>
            <button className="hover:text-gray-300 active:text-gray-500">
              <EllipsisHorizontalIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      {/* Reply Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center space-x-2">
          <textarea
            ref={textareaRef}
            value={replyText}
            onChange={handleReplyChange}
            onFocus={() => setReplyText(replyText)} // Ensure active state on click
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendReply();
              }
            }}
            placeholder={replyText ? "" : `Reply to ${user.username}...`}
            className={`flex-grow bg-transparent outline-none resize-none transition-all duration-300 border border-white rounded-full text-white placeholder-white placeholder-xs text-xs ${
              replyText ? "h-16" : "h-8"
            }`}
            style={{
              padding: replyText ? "8px 8px 8px 20px" : "8px 8px 8px 16px",
              backgroundColor: "rgba(50, 50, 50, 0.3)",
            }}
          />
          <button className="hover:text-gray-300 active:text-gray-500">
            <HeartIcon className="w-6 h-6" />
          </button>
          <button
            onClick={handleSendReply}
            disabled={!replyText}
            className="hover:text-gray-300 active:text-gray-500"
          >
            <PaperAirplaneIcon
              className={`w-6 h-6 text-white`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
