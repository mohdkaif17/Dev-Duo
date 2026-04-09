import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { getChallenges, getSubmissions, saveSubmissions } from './utils/storage';
import { useAuth } from './context/AuthContext';

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'problem');
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAdmin, isLoggedIn } = useAuth();
  
  // Submission form state
  const [repoUrl, setRepoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [repoError, setRepoError] = useState('');
  const [demoError, setDemoError] = useState('');
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(0);
  const [highlightedRows, setHighlightedRows] = useState(new Set());

  // Admin grading state
  const tabRefs = useRef({});
  const [underlineStyle, setUnderlineStyle] = useState({});

  // Load challenge from localStorage
  useEffect(() => {
    const challenges = getChallenges();
    const foundChallenge = challenges.find(c => c.id === id);
    
    if (foundChallenge) {
      setChallenge({
        ...foundChallenge,
        category: foundChallenge.category || 'UI/UX',
        status: foundChallenge.status || 'Active',
        deadline: foundChallenge.deadline || new Date().toISOString(),
        xp: foundChallenge.xp || 300,
        submissions: foundChallenge.submissions || 0,
        maxSubmissions: foundChallenge.maxSubmissions || 100,
        participants: 156,
        problemStatement: foundChallenge.description || `# ${foundChallenge.title}\n\n## Overview\n${foundChallenge.description}\n\n## Requirements\n- Build a responsive interface\n- Implement all CRUD operations\n- Add proper error handling\n\n## Evaluation Criteria\n- Code quality (40%)\n- Functionality (30%)\n- UI/UX design (20%)\n- Documentation (10%)`,
        resources: [
          { name: 'Figma Design System', url: '#' },
          { name: 'API Documentation', url: '#' },
          { name: 'Starter Template', url: '#' }
        ]
      });
      
      // Check for existing submission
      checkExistingSubmission();
    } else {
      setError('Challenge not found');
    }
    
    setLoading(false);
  }, [id]);

  // Auto-refresh leaderboard every 30s
  useEffect(() => {
    if (activeTab === 'leaderboard') {
      const interval = setInterval(() => {
        fetchLeaderboard(true);
        setLastUpdated(0);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [activeTab, id]);

  // Count up last updated
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update tab underline position
  useEffect(() => {
    const activeTabEl = tabRefs.current[activeTab];
    if (activeTabEl) {
      setUnderlineStyle({
        left: activeTabEl.offsetLeft,
        width: activeTabEl.offsetWidth
      });
    }
  }, [activeTab]);

  const fetchChallenge = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/challenges/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      // Enrich with sample data
      setChallenge({
        ...response.data,
        category: response.data.category || 'UI/UX',
        status: response.data.status || 'Active',
        deadline: response.data.deadline || '2025-04-20',
        xp: response.data.xp || 300,
        submissions: response.data.submissions || 42,
        maxSubmissions: 100,
        participants: 156,
        problemStatement: response.data.problemStatement || `# ${response.data.title}\n\n## Overview\n${response.data.description}\n\n## Requirements\n- Build a responsive interface\n- Implement all CRUD operations\n- Add proper error handling\n\n## Evaluation Criteria\n- Code quality (40%)\n- Functionality (30%)\n- UI/UX design (20%)\n- Documentation (10%)`,
        resources: [
          { name: 'Figma Design System', url: '#' },
          { name: 'API Documentation', url: '#' },
          { name: 'Starter Template', url: '#' }
        ]
      });
      
      // Check for existing submission
      checkExistingSubmission();
      fetchLeaderboard();
    } catch (err) {
      setError('Failed to fetch challenge');
    } finally {
      setLoading(false);
    }
  };

  const checkExistingSubmission = () => {
    if (!isLoggedIn() || !user?.email) return;
    
    const submissions = getSubmissions();
    const existing = submissions.find(s => s.challengeId === id && s.userId === user.email);
    
    if (existing) {
      setExistingSubmission(existing);
      setTitle(existing.title || '');
      setDescription(existing.description || '');
      setRepoUrl(existing.githubUrl || '');
      setDemoUrl(existing.demoUrl || '');
    }
  };

  const fetchLeaderboard = async (isRefresh = false) => {
    // Simulate fetching leaderboard
    const newLeaderboard = [
      { rank: 1, name: 'Alex Chen', avatar: 'AC', score: 95, timeBonus: 50, totalXP: 350, isCurrentUser: false },
      { rank: 2, name: 'Sarah Johnson', avatar: 'SJ', score: 92, timeBonus: 45, totalXP: 345, isCurrentUser: false },
      { rank: 3, name: 'Mike Park', avatar: 'MP', score: 88, timeBonus: 40, totalXP: 340, isCurrentUser: false },
      { rank: 4, name: 'You', avatar: 'YO', score: 85, timeBonus: 35, totalXP: 335, isCurrentUser: true },
      { rank: 5, name: 'Emma Davis', avatar: 'ED', score: 82, timeBonus: 30, totalXP: 330, isCurrentUser: false },
    ];
    
    if (isRefresh) {
      // Highlight changed rows
      const changed = new Set();
      newLeaderboard.forEach((entry, i) => {
        const old = leaderboard[i];
        if (old && (old.score !== entry.score || old.totalXP !== entry.totalXP)) {
          changed.add(i);
        }
      });
      setHighlightedRows(changed);
      setTimeout(() => setHighlightedRows(new Set()), 2000);
    }
    
    setLeaderboard(newLeaderboard);
  };

  const validateUrl = (url, type) => {
    const regex = type === 'github' 
      ? /^https:\/\/github\.com\/[\w-]+\/[\w-]+\/?$/
      : /^https:\/\/.+\..+/;
    return regex.test(url);
  };

  const handleRepoBlur = () => {
    if (!repoUrl) {
      setRepoError('');
      return;
    }
    if (!validateUrl(repoUrl, 'github')) {
      setRepoError('Invalid URL format');
    } else {
      setRepoError('');
    }
  };

  const handleDemoBlur = () => {
    if (!demoUrl) {
      setDemoError('');
      return;
    }
    if (!validateUrl(demoUrl, 'demo')) {
      setDemoError('Invalid URL format');
    } else {
      setDemoError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (repoError || demoError) return;
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    
    const submissions = getSubmissions();
    
    if (existingSubmission) {
      // Update existing
      const updatedSubmissions = submissions.map(s => 
        s.id === existingSubmission.id 
          ? { ...s, title, description, githubUrl: repoUrl, demoUrl, submittedAt: new Date().toISOString() }
          : s
      );
      saveSubmissions(updatedSubmissions);
    } else {
      // Create new
      const newSubmission = {
        id: crypto.randomUUID(),
        challengeId: id,
        challengeTitle: challenge?.title || 'Unknown',
        userId: user.email,
        userName: user.name || user.email,
        title,
        description,
        githubUrl: repoUrl,
        demoUrl,
        submittedAt: new Date().toISOString(),
        score: null,
        status: 'Pending'
      };
      saveSubmissions([...submissions, newSubmission]);
      
      // Update challenge submission count
      const challenges = getChallenges();
      const updatedChallenges = challenges.map(c => 
        c.id === id 
          ? { ...c, submissions: (c.submissions || 0) + 1 }
          : c
      );
      // Update localStorage
      localStorage.setItem('cv_challenges', JSON.stringify(updatedChallenges));
    }
    
    setSubmitSuccess(true);
    setExistingSubmission({ ...existingSubmission, title, description, githubUrl: repoUrl, demoUrl });
    setTimeout(() => setSubmitSuccess(false), 3000);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-teal text-lg animate-pulse">Loading challenge...</div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-red-500 text-lg">{error || 'Challenge not found'}</div>
      </div>
    );
  }

  const difficultyColors = {
    Easy: 'text-[#22C55E] border-[#22C55E]',
    Medium: 'text-[#F59E0B] border-[#F59E0B]',
    Hard: 'text-[#EF4444] border-[#EF4444]'
  };

  const colors = difficultyColors[challenge.difficulty] || difficultyColors.Medium;

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  return (
    <div className="page-content min-h-screen bg-bg">
      {/* Hero Strip */}
      <section className="relative py-12 border-b border-white/[0.05]">
        <div className="section-container">
          <Link to="/challenges" className="text-muted text-sm hover:text-teal transition-colors mb-4 inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Challenges
          </Link>
          
          <h1 className="text-[36px] font-bold text-white mb-4">{challenge.title}</h1>
          
          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold border bg-opacity-15 ${colors}`}>
              {challenge.difficulty}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium border bg-white/5 text-muted border-white/10">
              {challenge.category}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium border bg-teal/20 text-teal border-teal/30">
              {challenge.status}
            </span>
          </div>

          {/* XP + Deadline */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2" style={{ color: '#FFD700' }}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-bold text-lg">{challenge.xp} XP</span>
            </div>
            <div className="flex items-center gap-2 text-[#F59E0B]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Deadline: {challenge.deadline}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Two Column Layout */}
      <div className="section-container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Content - 65% */}
          <div className="flex-1 lg:w-[65%]">
            {/* Glass Tab Bar */}
            <div className="relative border-b border-white/10 mb-6">
              <div className="flex">
                {['problem', 'submissions', 'leaderboard'].map((tab) => (
                  <button
                    key={tab}
                    ref={el => tabRefs.current[tab] = el}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-sm font-medium transition-colors capitalize ${
                      activeTab === tab ? 'text-teal' : 'text-muted hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {/* Animated Underline */}
              <div 
                className="absolute bottom-0 h-0.5 bg-teal transition-all duration-300"
                style={underlineStyle}
              />
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'problem' && (
                <div className="space-y-6">
                  {/* Problem Statement */}
                  <div 
                    className="prose prose-invert max-w-none text-white/90"
                    dangerouslySetInnerHTML={{ 
                      __html: challenge.problemStatement
                        .replace(/# (.*)/, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
                        .replace(/## (.*)/g, '<h2 class="text-xl font-semibold mt-6 mb-3 text-teal">$1</h2>')
                        .replace(/- (.*)/g, '<li class="ml-4 mb-1">$1</li>')
                        .replace(/\n/g, '<br/>')
                    }}
                  />

                  {/* Evaluation Criteria */}
                  <div className="glass-card rounded-xl p-5 mt-8">
                    <h3 className="text-teal font-semibold mb-3">Evaluation Criteria</h3>
                    <ul className="space-y-2 text-muted text-sm">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-teal rounded-full"></span>
                        Code quality (40%)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-teal rounded-full"></span>
                        Functionality (30%)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-teal rounded-full"></span>
                        UI/UX design (20%)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-teal rounded-full"></span>
                        Documentation (10%)
                      </li>
                    </ul>
                  </div>

                  {/* Resources */}
                  <div className="mt-8">
                    <h3 className="text-white font-semibold mb-3">Resources</h3>
                    <div className="flex flex-wrap gap-3">
                      {challenge.resources.map((resource, i) => (
                        <a
                          key={i}
                          href={resource.url}
                          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-muted hover:text-teal hover:border-teal/30 transition-all"
                        >
                          {resource.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'submissions' && (
                <div className="space-y-6">
                  {/* Submission Form */}
                  <div className="glass-card rounded-xl p-6 border-teal/20">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      {existingSubmission ? 'Update Submission' : 'Submit Solution'}
                    </h3>
                    
                    {submitSuccess && (
                      <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
                        Solution submitted successfully!
                      </div>
                    )}

                    {existingSubmission && !submitSuccess && (
                      <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm">
                        You have already submitted to this challenge. Submitting again will update your entry.
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm text-muted mb-1.5">Title</label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Submission title"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-teal transition-colors"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-muted mb-1.5">Description</label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Brief explanation of your approach"
                          rows={3}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-teal transition-colors resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-muted mb-1.5">GitHub Repo URL</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            onBlur={handleRepoBlur}
                            placeholder="https://github.com/username/repo"
                            className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder:text-white/30 focus:outline-none transition-colors ${
                              repoError ? 'border-red-500' : repoUrl && !repoError ? 'border-green-500' : 'border-white/10 focus:border-teal'
                            }`}
                            required
                          />
                          {repoUrl && !repoError && (
                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        {repoError && (
                          <p className="mt-1 text-xs text-red-500">{repoError}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm text-muted mb-1.5">Live Demo URL (optional)</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={demoUrl}
                            onChange={(e) => setDemoUrl(e.target.value)}
                            onBlur={handleDemoBlur}
                            placeholder="https://your-demo.vercel.app"
                            className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder:text-white/30 focus:outline-none transition-colors ${
                              demoError ? 'border-red-500' : demoUrl && !demoError ? 'border-green-500' : 'border-white/10 focus:border-teal'
                            }`}
                          />
                          {demoUrl && !demoError && (
                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        {demoError && (
                          <p className="mt-1 text-xs text-red-500">{demoError}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={!!repoError || !!demoError || !title.trim()}
                        className="w-full py-3 bg-teal text-bg font-bold rounded-lg hover:shadow-[0_0_20px_rgba(0,205,184,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {existingSubmission ? 'Update Submission' : 'Submit Solution'}
                      </button>
                    </form>
                  </div>

                  {/* Submission History */}
                  <div className="glass-card rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">My Submission History</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs text-muted border-b border-white/10">
                            <th className="pb-3 font-medium">#</th>
                            <th className="pb-3 font-medium">Submitted At</th>
                            <th className="pb-3 font-medium">Repo Link</th>
                            <th className="pb-3 font-medium">Demo Link</th>
                            <th className="pb-3 font-medium">Status</th>
                            <th className="pb-3 font-medium">Score</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          <tr className="border-b border-white/5 last:border-0">
                            <td className="py-4 text-white">1</td>
                            <td className="py-4 text-muted">2025-04-10</td>
                            <td className="py-4">
                              <a href="#" className="text-teal hover:underline">View Repo</a>
                            </td>
                            <td className="py-4">
                              <a href="#" className="text-teal hover:underline">View Demo</a>
                            </td>
                            <td className="py-4">
                              <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-500 border border-yellow-500/30">
                                Pending
                              </span>
                            </td>
                            <td className="py-4 text-muted">-</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'leaderboard' && (
                <div>
                  {/* Live Indicator */}
                  <div className="flex items-center gap-2 mb-6 text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-green-400">Live</span>
                    <span className="text-muted">· Updated {lastUpdated}s ago</span>
                  </div>

                  {/* Leaderboard Table */}
                  <div className="glass-card rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs text-muted border-b border-white/10 bg-white/5">
                          <th className="p-4 font-medium">Rank</th>
                          <th className="p-4 font-medium">Participant</th>
                          <th className="p-4 font-medium text-right">Score</th>
                          <th className="p-4 font-medium text-right">Time Bonus</th>
                          <th className="p-4 font-medium text-right">Total XP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboard.map((entry, index) => (
                          <tr 
                            key={index}
                            className={`border-b border-white/5 last:border-0 transition-all duration-500 ${
                              entry.isCurrentUser 
                                ? 'bg-teal/[0.06] border-l-2 border-l-teal' 
                                : ''
                            } ${
                              highlightedRows.has(index) 
                                ? 'bg-yellow-500/10' 
                                : ''
                            }`}
                          >
                            <td className="p-4">
                              <span className="text-lg">{getRankIcon(entry.rank)}</span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center text-teal text-xs font-bold">
                                  {entry.avatar}
                                </div>
                                <span className={`font-medium ${entry.isCurrentUser ? 'text-teal' : 'text-white'}`}>
                                  {entry.name}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 text-right font-semibold text-white">{entry.score}</td>
                            <td className="p-4 text-right text-muted">+{entry.timeBonus}</td>
                            <td className="p-4 text-right font-bold text-teal">{entry.totalXP}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - 35% */}
          <div className="lg:w-[35%] space-y-6">
            {/* Info Card */}
            <div className="glass-card rounded-xl p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-6">Challenge Info</h3>
              
              {/* Countdown */}
              <div className="mb-6">
                <p className="text-muted text-sm mb-2">Time Remaining</p>
                <div className="font-mono text-3xl font-bold text-teal tracking-wider">
                  72:45:30
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Difficulty</span>
                  <span className={`font-medium ${colors.split(' ')[0]}`}>{challenge.difficulty}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Category</span>
                  <span className="text-white font-medium">{challenge.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">XP Reward</span>
                  <span className="font-bold" style={{ color: '#FFD700' }}>{challenge.xp} XP</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Participants</span>
                  <span className="text-white font-medium">{challenge.participants}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                onClick={() => setActiveTab('submissions')}
                className="w-full py-3 bg-teal text-bg font-bold rounded-lg hover:shadow-[0_0_20px_rgba(0,205,184,0.4)] transition-all"
              >
                Submit Solution
              </button>
            </div>

            {/* Admin Panel */}
            {isAdmin() && (
              <div className="glass-card rounded-xl p-6 border-red-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-white">Admin Panel</h3>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full py-2.5 px-4 rounded-lg border border-white/10 text-sm text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Challenge
                  </button>
                  
                  <button className="w-full py-2.5 px-4 rounded-lg border border-red-500/30 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Challenge
                  </button>

                  <div className="pt-3 border-t border-white/10">
                    <p className="text-xs text-muted mb-3">Grading Panel</p>
                    <button 
                      onClick={() => setActiveTab('submissions')}
                      className="w-full py-2.5 px-4 rounded-lg bg-teal/10 text-teal text-sm font-medium hover:bg-teal/20 transition-colors"
                    >
                      View Submissions to Grade
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;
