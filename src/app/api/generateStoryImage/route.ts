import { NextResponse } from "next/server";
import OpenAI from "openai";
import "dotenv/config";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const storyId = searchParams.get("storyId");

  if (!userId || !storyId) {
    return NextResponse.json({ error: "Missing userId or storyId" }, {
      status: 400,
    });
  }

  console.log(
    `Creating an image for userId: ${userId} and storyId: ${storyId}`,
  );

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const prompt =
      "a scenic nature picture that might be shown on social media, with no people visible.";
    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt,
      n: 1,
      size: "256x256",
    });

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      throw new Error("Image URL is undefined");
    }

    // Redirect to the generated image URL
    const res = NextResponse.redirect(imageUrl);

    // Set browser cache headers (e.g., cache for 1 hour)
    res.headers.set("Cache-Control", "public, max-age=3600");

    return res;
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json({ error: "Error generating image" }, {
      status: 500,
    });
  }
}
