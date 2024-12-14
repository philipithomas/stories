export const dynamic = "force-dynamic";

import StoryList from "@/components/StoryList";
import Image from "next/image";
import Link from "next/link";
import { UserStories } from "@/types/stories";
import "dotenv/config";
import ErrorComponent from "@/components/ErrorComponent";

export default async function Home() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/api/stories`, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Failed to fetch stories: ${res.statusText}`);
    }

    const initialStories: UserStories[] = await res.json();

    return (
      <div className="min-h-screen bg-white flex">
        <aside className="flex flex-col items-center p-4 border-r border-gray-300">
          <Link href="/">
            <Image
              src="/instagram_icon.svg"
              alt="Instagram logo"
              width={32}
              height={32}
              className="mt-[39px] mx-[25px] mb-4"
            />
          </Link>
        </aside>
        <main className="p-4 flex-1">
          <StoryList initialStories={initialStories} />
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error fetching stories:", error);
    return <ErrorComponent message="Error loading stories" />;
  }
}
