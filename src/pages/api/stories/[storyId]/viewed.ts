import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { storyId } = req.query;

  if (req.method === "POST") {
    // Handle updating the story's viewed status in your database or backend
    // For this example, we'll just return a success response
    res.status(200).json({ success: true, message: "Story marked as viewed." });
    console.log(`Story ${storyId} marked as viewed.`);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
