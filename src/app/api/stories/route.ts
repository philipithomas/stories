import { NextResponse } from "next/server";
import { UserStories } from "@/types/stories";

export async function GET() {
  // Replace this with your actual data fetching logic
  const stories: UserStories[] = [
    {
      userId: 1,
      username: "Max",
      profilePicture: "/people/1.png",
      stories: [
        {
          id: 1,
          imageUrl: `/api/generateStoryImage?userId=1&storyId=1`,
          viewed: false,
        },
        {
          id: 2,
          imageUrl: `/api/generateStoryImage?userId=1&storyId=2`,
          viewed: false,
        },
        {
          id: 3,
          imageUrl: `/api/generateStoryImage?userId=1&storyId=3`,
          viewed: false,
        },
        {
          id: 4,
          imageUrl: `/api/generateStoryImage?userId=1&storyId=4`,
          viewed: false,
        },
        {
          id: 5,
          imageUrl: `/api/generateStoryImage?userId=1&storyId=5`,
          viewed: false,
        },
      ],
    },
    {
      userId: 2,
      username: "Griffin",
      profilePicture: "/people/2.png",
      stories: [
        {
          id: 6,
          imageUrl: `/api/generateStoryImage?userId=2&storyId=6`,
          viewed: false,
        },
      ],
    },
    {
      userId: 3,
      username: "Sarah",
      profilePicture: "/people/3.png",
      stories: [
        {
          id: 7,
          imageUrl: `/api/generateStoryImage?userId=3&storyId=7`,
          viewed: true,
        },
        {
          id: 8,
          imageUrl: `/api/generateStoryImage?userId=3&storyId=8`,
          viewed: false,
        },
        {
          id: 9,
          imageUrl: `/api/generateStoryImage?userId=3&storyId=9`,
          viewed: false,
        },
      ],
    },
    {
      userId: 4,
      username: "Shawn",
      profilePicture: "/people/4.png",
      stories: [
        {
          id: 10,
          imageUrl: `/api/generateStoryImage?userId=4&storyId=10`,
          viewed: true,
        },
        {
          id: 11,
          imageUrl: `/api/generateStoryImage?userId=4&storyId=11`,
          viewed: true,
        },
        {
          id: 12,
          imageUrl: `/api/generateStoryImage?userId=4&storyId=12`,
          viewed: true,
        },
        {
          id: 13,
          imageUrl: `/api/generateStoryImage?userId=4&storyId=13`,
          viewed: true,
        },
      ],
    },
    {
      userId: 5,
      username: "Isolde",
      profilePicture: "/people/5.png",
      stories: [
        {
          id: 14,
          imageUrl: `/api/generateStoryImage?userId=5&storyId=14`,
          viewed: true,
        },
      ],
    },
  ];

  return NextResponse.json(stories);
}
