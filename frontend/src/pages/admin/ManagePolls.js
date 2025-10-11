import React, { useState, useEffect } from 'react';
import { database } from '../../firebase';
import { ref, push, onValue, set, remove } from 'firebase/database';
import { FaThumbsUp, FaThumbsDown, FaComment } from 'react-icons/fa';

const ManagePolls = () => {
  const [polls, setPolls] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentPoll, setCurrentPoll] = useState({ id: null, topic: '', description: '', status: 'Active' });
  const [selectedPollDetails, setSelectedPollDetails] = useState(null);

  const getMetricsCount = (data) => (data && typeof data === 'object' ? Object.keys(data).length : 0);

  useEffect(() => {
    const pollsRef = ref(database, 'polls');
    onValue(pollsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedPolls = data
        ? Object.entries(data).map(([id, value]) => ({
            id,
            ...value,
            commentsCount: getMetricsCount(value.comments),
            votesCount: getMetricsCount(value.votes),
            dislikesCount: getMetricsCount(value.dislikes),
          }))
        : [];

      loadedPolls.sort((a, b) => b.votesCount - a.votesCount);
      setPolls(loadedPolls);
    });
  }, []);

  const handleOpenModal = (poll = null) => {
    setCurrentPoll(poll || { id: null, topic: '', description: '', status: 'Active' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsViewModalOpen(false);
  };

  const handleViewPoll = (poll) => {
    setSelectedPollDetails(poll);
    setIsViewModalOpen(true);
  };

  const handleSavePoll = async (e) => {
    e.preventDefault();
    const { id, topic, description, status } = currentPoll;
    if (!topic || !description) return;

    const pollData = {
      topic,
      description,
      status,
      date: currentPoll.date || new Date().toLocaleDateString('en-US'),
      votes: currentPoll.votes || {},
      dislikes: currentPoll.dislikes || {},
      comments: currentPoll.comments || {},
    };

    try {
      if (id) {
        await set(ref(database, `polls/${id}`), pollData);
      } else {
        await push(ref(database, 'polls'), pollData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving poll:', error);
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (window.confirm('Are you sure you want to delete this poll?')) {
      await remove(ref(database, `polls/${pollId}`));
    }
  };

  const StatusBadge = ({ status }) => {
    const safeStatus = (status || '').toLowerCase();
    const baseClasses = 'px-3 py-1 text-xs font-bold rounded-full text-white';
    switch (safeStatus) {
      case 'active':
        return <span className={`${baseClasses} bg-purple-600`}>ACTIVE</span>;
      case 'completed':
        return <span className={`${baseClasses} bg-gray-500`}>COMPLETED</span>;
      default:
        return <span className={`${baseClasses} bg-yellow-500`}>UNKNOWN</span>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Polls</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
        >
          Add Poll
        </button>
      </div>

      <div className="bg-[#2D3748] rounded-lg p-1">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="p-4">ID</th>
              <th className="p-4">Topic</th>
              <th className="p-4">Likes</th>
              <th className="p-4">Dislikes</th>
              <th className="p-4">Comments</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {polls.map((poll) => (
              <tr key={poll.id} className="border-b border-gray-700 hover:bg-[#3a475a]">
                <td className="p-4">{poll.id.substring(0, 5)}...</td>
                <td className="p-4">{poll.topic}</td>
                <td className="p-4">{poll.votesCount}</td>
                <td className="p-4">{poll.dislikesCount}</td>
                <td className="p-4 flex items-center gap-2">
                  {poll.commentsCount}
                  {poll.commentsCount > 0 && (
                    <button
                      onClick={() => handleViewPoll(poll)}
                      className="text-purple-400 hover:text-purple-300 transition-colors ml-1"
                      title="View Comments"
                      aria-label={`View ${poll.commentsCount} comments`}
                    >
                      <FaComment size={16} />
                    </button>
                  )}
                </td>
                <td className="p-4">
                  <StatusBadge status={poll.status} />
                </td>
                <td className="p-4">{poll.date}</td>
                <td className="p-4 flex gap-4">
                  <button onClick={() => handleViewPoll(poll)} className="text-blue-400 hover:underline">
                    View
                  </button>
                  <button onClick={() => handleOpenModal(poll)} className="text-yellow-400 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDeletePoll(poll.id)} className="text-red-400 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Poll Modal */}
      {isViewModalOpen && selectedPollDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-[#1F2937] p-8 rounded-lg w-full max-w-xl text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Poll Details: {selectedPollDetails.topic}</h2>
              <button onClick={handleCloseModal} className="text-2xl">
                &times;
              </button>
            </div>

            <div className="flex items-center gap-6 text-lg mb-6 border-b border-gray-700 pb-4">
              <span className="flex items-center gap-2 text-green-400">
                <FaThumbsUp /> Likes: {selectedPollDetails.votesCount}
              </span>
              <span className="flex items-center gap-2 text-red-400">
                <FaThumbsDown /> Dislikes: {selectedPollDetails.dislikesCount}
              </span>
              <span className="flex items-center gap-2 text-purple-400">
                <FaComment /> Comments: {selectedPollDetails.commentsCount}
              </span>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-xl">
                User Comments ({selectedPollDetails.commentsCount}):
              </h4>
              <div className="bg-[#2D3748] p-4 rounded-lg max-h-80 overflow-y-auto space-y-4">
                {selectedPollDetails.commentsCount > 0 ? (
                  Object.values(selectedPollDetails.comments)
                    .sort((a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0))
                    .map((comment, index) => (
                      <div key={index} className="border-b border-gray-600 pb-3 last:border-b-0">
                        <p className="text-gray-300">
                          <span className="font-semibold text-purple-300">
                            {comment.userName || 'Unknown User'}
                          </span>
                          : {comment.text}
                        </p>
                        <p className="text-xs text-gray-500 text-right mt-1">
                          {comment.timestamp ? new Date(comment.timestamp).toLocaleString() : 'No Date'}
                        </p>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-400 italic">No comments have been posted for this poll yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Poll Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
          <div className="bg-[#1F2937] p-8 rounded-lg w-full max-w-lg text-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{currentPoll.id ? 'Edit Poll' : 'Add New Poll'}</h2>
              <button onClick={handleCloseModal} className="text-2xl">
                &times;
              </button>
            </div>
            <form onSubmit={handleSavePoll}>
              <div className="mb-4">
                <label className="block mb-1">Topic</label>
                <input
                  type="text"
                  value={currentPoll.topic}
                  onChange={(e) => setCurrentPoll({ ...currentPoll, topic: e.target.value })}
                  className="w-full bg-[#2D3748] p-2 rounded border border-gray-600"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Description</label>
                <textarea
                  value={currentPoll.description}
                  onChange={(e) => setCurrentPoll({ ...currentPoll, description: e.target.value })}
                  className="w-full bg-[#2D3748] p-2 rounded border border-gray-600 h-24"
                ></textarea>
              </div>
              <div className="mb-6">
                <label className="block mb-1">Status</label>
                <select
                  value={currentPoll.status}
                  onChange={(e) => setCurrentPoll({ ...currentPoll, status: e.target.value })}
                  className="w-full bg-[#2D3748] p-2 rounded border border-gray-600"
                >
                  <option>Active</option>
                  <option>Completed</option>
                </select>
              </div>
              <div className="flex justify-end gap-4">
                <button type="button" onClick={handleCloseModal} className="bg-gray-600 py-2 px-4 rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 py-2 px-4 rounded">
                  Save Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePolls;
