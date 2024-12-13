import StoryList from "@/components/StoryList";
import Image from "next/image";
import { UserStories } from "@/types/stories";

export default async function Home() {
  // Fetch the initial stories data from the local API
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stories`);
  const initialStories: UserStories[] = await res.json();

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center p-4 border-b">
        <Image
          src="/instagram_icon.svg"
          alt="Instagram logo"
          width={32}
          height={32}
          className="mr-2"
        />
        <Image
          src="/instagram_wordmark.svg"
          alt="Instagram"
          width={100}
          height={32}
        />
      </header>
      <main className="p-4">
        <StoryList initialStories={initialStories} />
      </main>
    </div>
  );
}
