
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { auth, database } from '../../firebase';
// import { ref, onValue, update, push } from 'firebase/database';
// import { FaHeart, FaComment, FaClock, FaSignOutAlt, FaArrowRight, FaThumbsDown } from 'react-icons/fa';

// const UserDashboard = () => {
//   const [polls, setPolls] = useState([]);
//   const [podcasts, setPodcasts] = useState([]);
//   const [commentText, setCommentText] = useState({});
//   const [activeCommentPoll, setActiveCommentPoll] = useState(null);
//   const [selectedPodcast, setSelectedPodcast] = useState(null); // <-- For modal
//   const navigate = useNavigate();
//   const userId = auth.currentUser?.uid;

//   useEffect(() => {
//     const pollsRef = ref(database, 'polls');
//     const unsubscribePolls = onValue(pollsRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const loadedPolls = Object.keys(data).map(key => {
//           const pollData = data[key];
//           const votesObject = pollData.votes || {};
//           const dislikesObject = pollData.dislikes || {};
//           const commentsObject = pollData.comments || {};

//           return {
//             id: key,
//             ...pollData,
//             votesCount: typeof votesObject === 'object' ? Object.keys(votesObject).length : (pollData.votes || 0),
//             dislikesCount: typeof dislikesObject === 'object' ? Object.keys(dislikesObject).length : (pollData.dislikes || 0),
//             hasVoted: userId ? !!votesObject[userId] : false,
//             hasDisliked: userId ? !!dislikesObject[userId] : false,
//             commentsCount: typeof commentsObject === 'object' ? Object.keys(commentsObject).length : (pollData.comments || 0),
//             comments: commentsObject
//           };
//         });
//         setPolls(loadedPolls);
//       } else {
//         setPolls([]);
//       }
//     });

//     const podcastsRef = ref(database, 'podcasts');
//     const unsubscribePodcasts = onValue(podcastsRef, (snapshot) => {
//         const data = snapshot.val();
//         if (data) {
//           const loadedPodcasts = Object.keys(data).map(key => ({
//             id: key,
//             ...data[key]
//           }));
//           setPodcasts(loadedPodcasts);
//         } else {
//           setPodcasts([]);
//         }
//     });
    
//     return () => {
//       unsubscribePolls();
//       unsubscribePodcasts();
//     };
//   }, [userId]);

//   const handleVote = async (pollId, hasVoted) => {
//     if (!userId) { alert("You must be logged in to vote."); return; }

//     const votePath = `polls/${pollId}/votes/${userId}`;
//     const dislikePath = `polls/${pollId}/dislikes/${userId}`;

//     const updates = {};
//     if (hasVoted) {
//       updates[votePath] = null;
//     } else {
//       updates[votePath] = true;
//       updates[dislikePath] = null;
//     }

//     try { await update(ref(database), updates); } 
//     catch (error) { console.error("Error updating vote:", error); alert("Failed to update vote."); }
//   };

//   const handleDislike = async (pollId, hasDisliked) => {
//     if (!userId) { alert("You must be logged in to dislike."); return; }

//     const dislikePath = `polls/${pollId}/dislikes/${userId}`;
//     const votePath = `polls/${pollId}/votes/${userId}`;

//     const updates = {};
//     if (hasDisliked) {
//       updates[dislikePath] = null;
//     } else {
//       updates[dislikePath] = true;
//       updates[votePath] = null;
//     }

//     try { await update(ref(database), updates); } 
//     catch (error) { console.error("Error updating dislike:", error); alert("Failed to update dislike."); }
//   };

//   const handleAddComment = async (pollId) => {
//     if (!userId) { alert("You must be logged in to comment."); return; }
//     const comment = commentText[pollId]?.trim();
//     if (!comment) { alert("Comment cannot be empty."); return; }

//     const commentsRef = ref(database, `polls/${pollId}/comments`);
//     try {
//       await push(commentsRef, {
//         userId,
//         userName: auth.currentUser?.email.split('@')[0] || 'Anonymous',
//         text: comment,
//         timestamp: new Date().toISOString()
//       });
//       setCommentText(prev => ({ ...prev, [pollId]: '' }));
//     } catch (error) { console.error("Error adding comment:", error); alert("Failed to add comment."); }
//   };

//   const handleLogout = async () => { await auth.signOut(); navigate('/login'); };

//   const renderPollItem = (poll) => (
//     <div key={poll.id} className="bg-[#1E1E1E] p-4 rounded-lg border border-gray-700">
//       <div className="flex justify-between items-start mb-2">
//         <h3 className="font-bold text-lg">{poll.topic}</h3>
//         {(poll.topic === 'CN' || poll.topic === 'Gen AI') && <span className="bg-[#6D28D9] text-xs font-bold px-2 py-1 rounded-full">TRENDING</span>}
//       </div>
//       <p className="text-gray-400 text-sm mb-4">{poll.description}</p>

//       <div className="flex items-center text-gray-400 text-sm gap-4">
//         <button 
//           onClick={() => handleVote(poll.id, poll.hasVoted)}
//           className={`flex items-center gap-1 transition-colors ${poll.hasVoted ? 'text-red-500' : 'hover:text-red-400'}`}
//           aria-label={poll.hasVoted ? "Unlike" : "Like"}
//         >
//           <FaHeart className={poll.hasVoted ? 'animate-pulse' : ''} /> {poll.votesCount}
//         </button>

//         <button 
//           onClick={() => handleDislike(poll.id, poll.hasDisliked)}
//           className={`flex items-center gap-1 transition-colors ${poll.hasDisliked ? 'text-blue-500' : 'hover:text-blue-400'}`}
//           aria-label={poll.hasDisliked ? "Remove Dislike" : "Dislike"}
//         >
//           <FaThumbsDown className={poll.hasDisliked ? 'animate-pulse' : ''} /> {poll.dislikesCount}
//         </button>

//         <button 
//           onClick={() => setActiveCommentPoll(activeCommentPoll === poll.id ? null : poll.id)}
//           className="flex items-center gap-1 hover:text-purple-400 transition-colors"
//           aria-expanded={activeCommentPoll === poll.id}
//         >
//           <FaComment /> {poll.commentsCount}
//         </button>

//         <span className="flex items-center gap-1 ml-auto"><FaClock /> 2h left</span>
//       </div>

//       {activeCommentPoll === poll.id && (
//         <div className="mt-4 pt-4 border-t border-gray-700">
//           <h4 className="font-semibold mb-2">Comments ({poll.commentsCount})</h4>
//           <div className="flex gap-2 mb-4">
//             <input
//               type="text"
//               placeholder="Add a comment..."
//               className="flex-grow bg-[#2A2A2A] text-white p-2 rounded-lg text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
//               value={commentText[poll.id] || ''}
//               onChange={(e) => setCommentText(prev => ({ ...prev, [poll.id]: e.target.value }))}
//               onKeyPress={(e) => { if (e.key === 'Enter') handleAddComment(poll.id); }}
//             />
//             <button 
//               onClick={() => handleAddComment(poll.id)}
//               className="bg-[#6D28D9] p-2 rounded-lg hover:bg-[#5b21b6] transition-colors"
//               aria-label="Submit Comment"
//             >
//               <FaArrowRight />
//             </button>
//           </div>

//           <div className="max-h-40 overflow-y-auto pr-2">
//             {poll.commentsCount > 0 ? (
//               Object.entries(poll.comments)
//                 .sort(([, a], [, b]) => new Date(a.timestamp) - new Date(b.timestamp))
//                 .map(([commentKey, comment]) => (
//                   <div key={commentKey} className="text-xs mb-2 p-1 border-b border-gray-800 last:border-b-0">
//                     <span className="font-bold text-[#6D28D9] mr-2">{comment.userName || 'User'}:</span>
//                     <span className="text-gray-300">{comment.text}</span>
//                   </div>
//                 ))
//             ) : (
//               <p className="text-gray-500 text-sm italic">No comments yet. Be the first!</p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="bg-[#121212] text-white min-h-screen font-sans">
//       <header className="flex justify-between items-center p-4 border-b border-gray-800">
//         <h1 className="text-2xl font-bold">AI Podcast Generator</h1>
//         <div className="flex items-center gap-4">
//           <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center font-bold">
//             {auth.currentUser?.email[0].toUpperCase() || 'G'}
//           </div>
//           <button onClick={handleLogout} className="text-gray-400 hover:text-white">
//             <FaSignOutAlt size={20} />
//           </button>
//         </div>
//       </header>
      
//       <main className="flex">
//         <aside className="w-1/3 p-6 border-r border-gray-800 overflow-y-auto" style={{height: 'calc(100vh - 65px)'}}>
//           <h2 className="text-xl font-semibold mb-4">Topic Polls</h2>
//           <div className="space-y-4">
//             {polls.map(renderPollItem)}
//           </div>
//         </aside>

//         <section className="w-2/3 p-6 overflow-y-auto" style={{height: 'calc(100vh - 65px)'}}>
//           <h2 className="text-xl font-semibold mb-4">Trending Topics</h2>
//           <div className="flex flex-wrap gap-2 mb-8">
//             {['AI & Machine Learning', 'Technology', 'Healthcare', 'Environment', 'Business'].map(topic => (
//               <button key={topic} className="bg-[#2A2A2A] text-gray-300 px-4 py-2 text-sm rounded-full hover:bg-gray-700">{topic}</button>
//             ))}
//           </div>
          
//           <h2 className="text-xl font-semibold mb-4">Your Podcasts</h2>
//           <div className="bg-[#1E1E1E] rounded-lg border border-gray-700">
//             {podcasts.map((podcast) => (
//               <div key={podcast.id} className="flex justify-between items-center p-4 border-b border-gray-700 last:border-b-0 hover:bg-[#2A2A2A] cursor-pointer">
//                 <p>{podcast.title}</p>
//                 <div className="flex items-center gap-4">
//                   <span className="text-gray-400">{podcast.duration}</span>
//                   <button
//                     className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm"
//                     onClick={() => setSelectedPodcast(podcast)}
//                   >
//                     View
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       </main>

//       {/* Podcast Modal */}
//       {selectedPodcast && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
//           <div className="bg-[#1E1E1E] p-6 rounded-lg w-2/3 max-h-[80vh] overflow-y-auto relative">
//             <button
//               className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl font-bold"
//               onClick={() => setSelectedPodcast(null)}
//             >
//               &times;
//             </button>

//             <h2 className="text-2xl font-bold mb-4">{selectedPodcast.title}</h2>
//             <p className="text-gray-300 mb-4">{selectedPodcast.content}</p>

//             {selectedPodcast.audioUrl && (
//               <audio controls className="w-full mb-4">
//                 <source src={selectedPodcast.audioUrl} type="audio/mpeg" />
//                 Your browser does not support the audio element.
//               </audio>
//             )}

//             <h3 className="font-semibold mb-2">Podcast Script</h3>
//             <textarea
//               readOnly
//               value={selectedPodcast.script || ''}
//               className="w-full bg-[#2A2A2A] text-white p-2 rounded-lg border border-gray-600 resize-none"
//               rows={10}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../../firebase';
import { ref, onValue, update, push } from 'firebase/database';
import { FaHeart, FaComment, FaClock, FaSignOutAlt, FaArrowRight, FaThumbsDown } from 'react-icons/fa';

const UserDashboard = () => {
  const [polls, setPolls] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [activeCommentPoll, setActiveCommentPoll] = useState(null);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const navigate = useNavigate();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const pollsRef = ref(database, 'polls');
    const unsubscribePolls = onValue(pollsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedPolls = Object.keys(data).map(key => {
          const pollData = data[key];
          const votesObject = pollData.votes || {};
          const dislikesObject = pollData.dislikes || {};
          const commentsObject = pollData.comments || {};

          return {
            id: key,
            ...pollData,
            votesCount: typeof votesObject === 'object' ? Object.keys(votesObject).length : (pollData.votes || 0),
            dislikesCount: typeof dislikesObject === 'object' ? Object.keys(dislikesObject).length : (pollData.dislikes || 0),
            hasVoted: userId ? !!votesObject[userId] : false,
            hasDisliked: userId ? !!dislikesObject[userId] : false,
            commentsCount: typeof commentsObject === 'object' ? Object.keys(commentsObject).length : (pollData.comments || 0),
            comments: commentsObject
          };
        });
        setPolls(loadedPolls);
      } else {
        setPolls([]);
      }
    });

    const podcastsRef = ref(database, 'podcasts');
    const unsubscribePodcasts = onValue(podcastsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const loadedPodcasts = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setPodcasts(loadedPodcasts);
        } else {
          setPodcasts([]);
        }
    });
    
    return () => {
      unsubscribePolls();
      unsubscribePodcasts();
    };
  }, [userId]);

  const handleVote = async (pollId, hasVoted) => {
    if (!userId) { alert("You must be logged in to vote."); return; }

    const votePath = `polls/${pollId}/votes/${userId}`;
    const dislikePath = `polls/${pollId}/dislikes/${userId}`;

    const updates = {};
    if (hasVoted) {
      updates[votePath] = null;
    } else {
      updates[votePath] = true;
      updates[dislikePath] = null;
    }

    try { await update(ref(database), updates); } 
    catch (error) { console.error("Error updating vote:", error); alert("Failed to update vote."); }
  };

  const handleDislike = async (pollId, hasDisliked) => {
    if (!userId) { alert("You must be logged in to dislike."); return; }

    const dislikePath = `polls/${pollId}/dislikes/${userId}`;
    const votePath = `polls/${pollId}/votes/${userId}`;

    const updates = {};
    if (hasDisliked) {
      updates[dislikePath] = null;
    } else {
      updates[dislikePath] = true;
      updates[votePath] = null;
    }

    try { await update(ref(database), updates); } 
    catch (error) { console.error("Error updating dislike:", error); alert("Failed to update dislike."); }
  };

  const handleAddComment = async (pollId) => {
    if (!userId) { alert("You must be logged in to comment."); return; }
    const comment = commentText[pollId]?.trim();
    if (!comment) { alert("Comment cannot be empty."); return; }

    const commentsRef = ref(database, `polls/${pollId}/comments`);
    try {
      await push(commentsRef, {
        userId,
        userName: auth.currentUser?.email.split('@')[0] || 'Anonymous',
        text: comment,
        timestamp: new Date().toISOString()
      });
      setCommentText(prev => ({ ...prev, [pollId]: '' }));
    } catch (error) { console.error("Error adding comment:", error); alert("Failed to add comment."); }
  };

  const handleLogout = async () => { await auth.signOut(); navigate('/login'); };

  const renderPollItem = (poll) => (
    <div key={poll.id} className="bg-[#1E1E1E] p-4 rounded-lg border border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg">{poll.topic}</h3>
        {(poll.topic === 'CN' || poll.topic === 'Gen AI') && <span className="bg-[#6D28D9] text-xs font-bold px-2 py-1 rounded-full">TRENDING</span>}
      </div>
      <p className="text-gray-400 text-sm mb-4">{poll.description}</p>

      <div className="flex items-center text-gray-400 text-sm gap-4">
        <button 
          onClick={() => handleVote(poll.id, poll.hasVoted)}
          className={`flex items-center gap-1 transition-colors ${poll.hasVoted ? 'text-red-500' : 'hover:text-red-400'}`}
          aria-label={poll.hasVoted ? "Unlike" : "Like"}
        >
          <FaHeart className={poll.hasVoted ? 'animate-pulse' : ''} /> {poll.votesCount}
        </button>

        <button 
          onClick={() => handleDislike(poll.id, poll.hasDisliked)}
          className={`flex items-center gap-1 transition-colors ${poll.hasDisliked ? 'text-blue-500' : 'hover:text-blue-400'}`}
          aria-label={poll.hasDisliked ? "Remove Dislike" : "Dislike"}
        >
          <FaThumbsDown className={poll.hasDisliked ? 'animate-pulse' : ''} /> {poll.dislikesCount}
        </button>

        <button 
          onClick={() => setActiveCommentPoll(activeCommentPoll === poll.id ? null : poll.id)}
          className="flex items-center gap-1 hover:text-purple-400 transition-colors"
          aria-expanded={activeCommentPoll === poll.id}
        >
          <FaComment /> {poll.commentsCount}
        </button>

        <span className="flex items-center gap-1 ml-auto"><FaClock /> 2h left</span>
      </div>

      {activeCommentPoll === poll.id && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h4 className="font-semibold mb-2">Comments ({poll.commentsCount})</h4>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-grow bg-[#2A2A2A] text-white p-2 rounded-lg text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
              value={commentText[poll.id] || ''}
              onChange={(e) => setCommentText(prev => ({ ...prev, [poll.id]: e.target.value }))}
              onKeyPress={(e) => { if (e.key === 'Enter') handleAddComment(poll.id); }}
            />
            <button 
              onClick={() => handleAddComment(poll.id)}
              className="bg-[#6D28D9] p-2 rounded-lg hover:bg-[#5b21b6] transition-colors"
              aria-label="Submit Comment"
            >
              <FaArrowRight />
            </button>
          </div>

          <div className="max-h-40 overflow-y-auto pr-2">
            {poll.commentsCount > 0 ? (
              Object.entries(poll.comments)
                .sort(([, a], [, b]) => new Date(a.timestamp) - new Date(b.timestamp))
                .map(([commentKey, comment]) => (
                  <div key={commentKey} className="text-xs mb-2 p-1 border-b border-gray-800 last:border-b-0">
                    <span className="font-bold text-[#6D28D9] mr-2">{comment.userName || 'User'}:</span>
                    <span className="text-gray-300">{comment.text}</span>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 text-sm italic">No comments yet. Be the first!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-[#121212] text-white min-h-screen font-sans">
      <header className="flex justify-between items-center p-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold">AI Podcast Generator</h1>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center font-bold">
            {auth.currentUser?.email[0].toUpperCase() || 'G'}
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-white">
            <FaSignOutAlt size={20} />
          </button>
        </div>
      </header>
      
      <main className="flex">
        <aside className="w-1/3 p-6 border-r border-gray-800 overflow-y-auto" style={{height: 'calc(100vh - 65px)'}}>
          <h2 className="text-xl font-semibold mb-4">Topic Polls</h2>
          <div className="space-y-4">
            {polls.map(renderPollItem)}
          </div>
        </aside>

        <section className="w-2/3 p-6 overflow-y-auto" style={{height: 'calc(100vh - 65px)'}}>
          <h2 className="text-xl font-semibold mb-4">Your Podcasts</h2>
          <div className="bg-[#1E1E1E] rounded-lg border border-gray-700">
            {podcasts.map((podcast) => (
              <div key={podcast.id} className="flex justify-between items-center p-4 border-b border-gray-700 last:border-b-0 hover:bg-[#2A2A2A] cursor-pointer">
                <p>{podcast.title}</p>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400">{podcast.duration}</span>
                  <button
                    className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm"
                    onClick={() => setSelectedPodcast(podcast)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Podcast Modal */}
      {selectedPodcast && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1E1E1E] p-6 rounded-lg w-2/3 max-h-[80vh] overflow-y-auto relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl font-bold"
              onClick={() => setSelectedPodcast(null)}
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-4">{selectedPodcast.title}</h2>
            <p className="text-gray-300 mb-4">{selectedPodcast.content}</p>

            {selectedPodcast.audioUrl && (
              <audio controls className="w-full mb-4">
                <source src={selectedPodcast.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}

            <h3 className="font-semibold mb-2">Podcast Script</h3>
            <textarea
              readOnly
              value={selectedPodcast.script || ''}
              className="w-full bg-[#2A2A2A] text-white p-2 rounded-lg border border-gray-600 resize-none"
              rows={10}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

