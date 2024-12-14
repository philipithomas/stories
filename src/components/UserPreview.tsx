import Image from "next/image";
import { UserStories } from "@/types/stories";

interface UserPreviewProps {
  user: UserStories;
  onClick: (userId: number) => void;
  textColor?: "light" | "dark";
  showTime?: boolean;
}

export default function UserPreview(
  { user, onClick, textColor = "dark", showTime = false }: UserPreviewProps,
) {
  const allViewed = user.stories.every((story) => story.viewed);

  const textColorClass = textColor === "light" ? "text-white" : "text-gray-900";

  return (
    <button onClick={() => onClick(user.userId)} className="flex-shrink-0">
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
      <p
        className={`text-[10px] font-normal leading-[12px] text-center pt-2 ${textColorClass}`}
      >
        {user.username}
      </p>
      {showTime && (
        <p
          className={`text-[10px] font-normal leading-[12px] text-center opacity-50 ${textColorClass}`}
        >
          2h
        </p>
      )}
    </button>
  );
}
