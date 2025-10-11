import React, { useState, useEffect } from "react";
import { database } from "../firebase";
import { ref, push, onValue } from "firebase/database";

export default function AdminPanel() {
  const [pollTitle, setPollTitle] = useState("");
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const pollRef = ref(database, "polls");
    onValue(pollRef, (snapshot) => {
      const data = snapshot.val();
      setPolls(data ? Object.values(data) : []);
    });
  }, []);

  const createPoll = () => {
    if (!pollTitle) return alert("Enter poll title");
    const pollRef = ref(database, "polls");
    push(pollRef, { title: pollTitle });
    setPollTitle("");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <input
        type="text"
        placeholder="New Poll Title"
        value={pollTitle}
        onChange={(e) => setPollTitle(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <button onClick={createPoll} className="bg-indigo-500 text-white px-4 py-2 rounded mb-4">
        Create Poll
      </button>

      <h3 className="text-xl font-semibold mb-2">Existing Polls</h3>
      <ul>
        {polls.map((poll, idx) => (
          <li key={idx} className="mb-2 p-2 bg-gray-100 rounded">
            {poll.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
