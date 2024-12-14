import Image from "next/image";
import { UserStories } from "@/types/stories";

interface UserPreviewProps {
  user: UserStories;
  onClick: (userId: number) => void;
}

export default function UserPreview({ user, onClick }: UserPreviewProps) {
  const allViewed = user.stories.every((story) => story.viewed);
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
      <p className="text-[10px] font-normal leading-[12px] text-center pt-2 text-gray-900">
        {user.username}
      </p>
    </button>
  );
}
