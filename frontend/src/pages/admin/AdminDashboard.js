import React, { useState, useEffect, useRef } from 'react';
import { FaUsers, FaPoll, FaPodcast } from 'react-icons/fa';
import { database } from '../../firebase';
import { ref, onValue, push, serverTimestamp, query, orderByChild, limitToLast } from 'firebase/database';

// Reusable Stat Card Component
const StatCard = ({ icon, value, title, color }) => (
  <div className={`bg-[#2D3748] p-6 rounded-lg flex items-center gap-4 border-l-4 ${color}`}>
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-gray-400">{title}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  // State for counts
  const [userCount, setUserCount] = useState(0);
  const [pollCount, setPollCount] = useState(0);
  const [podcastCount, setPodcastCount] = useState(0);

  // State for the activity log, which will be populated from Firebase
  const [activityLog, setActivityLog] = useState([]);

  // Use useRef to track previous counts to detect changes
  const prevUserCount = useRef(null);
  const prevPollCount = useRef(null);
  const prevPodcastCount = useRef(null);

  // This function now writes the activity to the Firebase database
  const addActivity = (action) => {
    const activityLogRef = ref(database, 'activity_log');
    const newActivity = {
      source: 'System',
      action,
      timestamp: serverTimestamp(), // Use the server's timestamp for accuracy
    };
    push(activityLogRef, newActivity);
  };

  useEffect(() => {
    const usersRef = ref(database, 'users');
    const pollsRef = ref(database, 'polls');
    const podcastsRef = ref(database, 'podcasts');
    
    // Listener for the activity log itself
    const activityLogRef = ref(database, 'activity_log');
    // Create a query to get the last 5 activities, ordered by timestamp
    const activityQuery = query(activityLogRef, orderByChild('timestamp'), limitToLast(5));
    
    const unsubscribeActivity = onValue(activityQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the object from Firebase into a sorted array
        const loadedActivities = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
        setActivityLog(loadedActivities);
      } else {
        setActivityLog([]);
      }
    });

    // Listener for Users
    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      const newCount = snapshot.size;
      if (prevUserCount.current !== null) {
        if (newCount > prevUserCount.current) {
          addActivity('user registered successfully');
        } else if (newCount < prevUserCount.current) {
          addActivity('user removed successfully');
        }
      }
      setUserCount(newCount);
      prevUserCount.current = newCount;
    });

    // Listener for Polls
    const unsubscribePolls = onValue(pollsRef, (snapshot) => {
      const newCount = snapshot.size;
      if (prevPollCount.current !== null) {
        if (newCount > prevPollCount.current) {
          addActivity('Active poll added successfully');
        } else if (newCount < prevPollCount.current) {
          addActivity('Active poll removed successfully');
        }
      }
      setPollCount(newCount);
      prevPollCount.current = newCount;
    });

    // Listener for Podcasts
    const unsubscribePodcasts = onValue(podcastsRef, (snapshot) => {
      const newCount = snapshot.size;
      if (prevPodcastCount.current !== null) {
        if (newCount > prevPodcastCount.current) {
          addActivity('New podcast published successfully');
        } else if (newCount < prevPodcastCount.current) {
          addActivity('Podcast removed successfully');
        }
      }
      setPodcastCount(newCount);
      prevPodcastCount.current = newCount;
    });

    // Cleanup function to detach all listeners
    return () => {
      unsubscribeActivity();
      unsubscribeUsers();
      unsubscribePolls();
      unsubscribePodcasts();
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<FaUsers />} value={userCount} title="Total Users" color="border-green-500" />
        <StatCard icon={<FaPoll />} value={pollCount} title="Total Polls" color="border-orange-500" />
        <StatCard icon={<FaPodcast />} value={podcastCount} title="Total Podcasts" color="border-blue-500" />
      </div>

      <div className="bg-[#2D3748] p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <table className="w-full text-left">
          <thead className="text-gray-400 border-b border-gray-600">
            <tr>
              <th className="py-2">Source</th>
              <th className="py-2">Action</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {activityLog.length > 0 ? (
              activityLog.map((activity, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="py-3">{activity.source}</td>
                  <td className="py-3">{activity.action}</td>
                  <td className="py-3">{new Date(activity.timestamp).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No recent activity to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;