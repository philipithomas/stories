import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const storyId = searchParams.get("storyId");

  if (!userId || !storyId) {
    return NextResponse.json({ error: "Missing userId or storyId" }, {
      status: 400,
    });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const prompt = `An engaging image for user ${userId}, story ${storyId}`;
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "512x512",
      response_format: "url",
    });

    const imageUrl = response.data[0].url;

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
