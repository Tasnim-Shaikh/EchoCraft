import React, { useState } from "react";
import { database } from "../firebase";
import { ref, push } from "firebase/database";

export default function PollCreation() {
  const [title, setTitle] = useState("");

  const handleCreate = () => {
    if (!title) return alert("Enter poll title");
    const pollRef = ref(database, "polls");
    push(pollRef, { title });
    setTitle("");
    alert("Poll created!");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Poll</h2>
      <input
        type="text"
        placeholder="Poll Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <button onClick={handleCreate} className="bg-indigo-500 text-white px-4 py-2 rounded">
        Create
      </button>
    </div>
  );
}
