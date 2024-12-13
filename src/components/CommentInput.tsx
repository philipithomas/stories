import { useState } from "react";

export default function CommentInput() {
  const [comment, setComment] = useState("");

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Handle the comment submission
      console.log("Comment submitted:", comment);
      setComment("");
    }
  };

  return (
    <input
      type="text"
      placeholder="Send message"
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      onKeyPress={handleKeyPress}
      className="w-full p-2 border rounded"
    />
  );
}
