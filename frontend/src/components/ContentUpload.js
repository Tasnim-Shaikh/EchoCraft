import React, { useState } from "react";
import { database } from "../firebase";
import { ref, push } from "firebase/database";

export default function ContentUpload() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = () => {
    const contentRef = ref(database, "uploads");
    push(contentRef, { text, image: image ? URL.createObjectURL(image) : null });
    setText("");
    setImage(null);
    alert("Content uploaded!");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Upload Podcast Content</h2>
      <textarea
        placeholder="Write your content here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} className="mb-4" />
      <button onClick={handleSubmit} className="bg-indigo-500 text-white px-4 py-2 rounded">
        Submit
      </button>
    </div>
  );
}
