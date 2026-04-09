import { useState, useEffect } from 'react';
import axios from 'axios';
import LeaderboardStats from './components/LeaderboardStats';
import Podium from './components/Podium';
import LeaderboardTable from './components/LeaderboardTable';
import PersonalAnalytics from './components/PersonalAnalytics';
import ActivityHeatmap from './components/ActivityHeatmap';
import Certificates from './components/Certificates';

// Sample leaderboard data
const sampleUsers = [
  { _id: '1', name: 'Alex Johnson', initials: 'AJ', xp: 15200, badge: 'Legend', challenges: 45, events: 28, winRate: '78%' },
  { _id: '2', name: 'Sarah Chen', initials: 'SC', xp: 14800, badge: 'Legend', challenges: 42, events: 30, winRate: '75%' },
  { _id: '3', name: 'Mike Rodriguez', initials: 'MR', xp: 13500, badge: 'Expert', challenges: 38, events: 25, winRate: '72%' },
  { _id: '4', name: 'Emily Davis', initials: 'ED', xp: 11200, badge: 'Expert', challenges: 32, events: 22, winRate: '68%' },
  { _id: '5', name: 'James Wilson', initials: 'JW', xp: 9800, badge: 'Contributor', challenges: 28, events: 20, winRate: '65%' },
  { _id: '6', name: 'Lisa Park', initials: 'LP', xp: 8900, badge: 'Contributor', challenges: 25, events: 18, winRate: '62%' },
  { _id: '7', name: 'David Kim', initials: 'DK', xp: 8200, badge: 'Contributor', challenges: 22, events: 16, winRate: '60%' },
  { _id: '8', name: 'Tom Brown', initials: 'TB', xp: 7500, badge: 'Newbie', challenges: 20, events: 15, winRate: '58%' },
  { _id: '9', name: 'Amy Lee', initials: 'AL', xp: 6800, badge: 'Newbie', challenges: 18, events: 14, winRate: '55%' },
  { _id: '10', name: 'Chris Davis', initials: 'CD', xp: 6200, badge: 'Newbie', challenges: 16, events: 12, winRate: '52%' },
  { _id: '11', name: 'Ryan Garcia', initials: 'RG', xp: 5800, badge: 'Newbie', challenges: 15, events: 11, winRate: '50%' },
  { _id: '12', name: 'Nina Patel', initials: 'NP', xp: 5200, badge: 'Newbie', challenges: 14, events: 10, winRate: '48%' },
];

const Leaderboard = () => {
  const [users, setUsers] = useState(sampleUsers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('global');
  const [timeFilter, setTimeFilter] = useState('all-time');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);

    // Try to fetch real data
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/users/leaderboard', {
        timeout: 5000
      });
      
      if (response.data && response.data.length > 0) {
        // Enrich with sample data if needed
        const enrichedUsers = response.data.map((user, index) => ({
          ...user,
          initials: user.name?.split(' ').map(n => n[0]).join('').toUpperCase(),
          badge: sampleUsers[index]?.badge || 'Newbie',
          challenges: Math.floor(Math.random() * 40) + 10,
          events: Math.floor(Math.random() * 30) + 5,
          winRate: `${Math.floor(Math.random() * 30) + 45}%`
        }));
        setUsers(enrichedUsers);
      }
    } catch (err) {
      console.log('Using sample leaderboard data');
      // Keep sample data on error
    } finally {
      setLoading(false);
    }
  };

  // Get top 3 for podium
  const topUsers = users.slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-3 border-teal/30 border-t-teal rounded-full animate-spin mb-4"></div>
          <p className="text-muted animate-pulse">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content min-h-screen bg-bg">
      {/* Hero Stats with Tabs and Filters */}
      <section className="page-hero relative overflow-hidden border-b border-white/[0.05]">
        <LeaderboardStats
          activeTab={activeTab}
          onTabChange={setActiveTab}
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
        />
      </section>

      {/* Top 3 Podium */}
      <Podium topUsers={topUsers} />

      {/* Leaderboard Table */}
      <LeaderboardTable 
        users={users} 
        currentUserId={currentUser?._id || currentUser?.id}
      />

      {/* Personal Analytics (only if logged in) */}
      {currentUser && (
        <PersonalAnalytics 
          userStats={{
            xp: currentUser.xp || 5200,
            rank: 42,
            challenges: 12,
            events: 8
          }}
        />
      )}

      {/* Activity Heatmap */}
      <ActivityHeatmap />

      {/* Certificates */}
      <Certificates userName={currentUser?.name || 'Alex Johnson'} />
    </div>
  );
};

export default Leaderboard;
