import { useState } from 'react';

const sampleChallenges = [
  { _id: '1', title: 'AI Image Classifier', difficulty: 'Hard', deadline: 'Jan 31, 2025', status: 'Open', submissions: 45 },
  { _id: '2', title: 'React Portfolio', difficulty: 'Medium', deadline: 'Feb 15, 2025', status: 'Open', submissions: 32 },
  { _id: '3', title: 'Python Automation', difficulty: 'Easy', deadline: 'Mar 1, 2025', status: 'Open', submissions: 18 },
];

const sampleSubmissions = [
  { _id: 's1', user: 'Alex Johnson', github: 'github.com/alex/ai-classifier', demo: 'demo.alex.dev', submittedAt: 'Jan 25, 2025', score: null },
  { _id: 's2', user: 'Sarah Chen', github: 'github.com/sarah/ai-classifier', demo: 'demo.sarah.dev', submittedAt: 'Jan 26, 2025', score: null },
];

const AdminChallenges = () => {
  const [challenges, setChallenges] = useState(sampleChallenges);
  const [expandedChallenge, setExpandedChallenge] = useState(null);
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

  const handleGrade = (submissionId, score, feedback) => {
    console.log('Grading', submissionId, score, feedback);
    setGradingSubmission(null);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Challenges</h1>
        <button 
          onClick={() => setShowDrawer(true)}
          className="px-5 py-2 bg-teal text-bg font-medium rounded-lg hover:shadow-[0_0_20px_rgba(0,205,184,0.4)] transition-all"
        >
          + Create Challenge
        </button>
      </div>

      <div 
        className="rounded-xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(0,205,184,0.1)'
        }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(0,205,184,0.05)' }}>
              {['Title', 'Difficulty', 'Deadline', 'Status', 'Submissions', 'Actions'].map(h => (
                <th key={h} className="text-left py-3 px-5 text-xs font-bold uppercase text-muted tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {challenges.map((challenge) => (
              <>
                <tr key={challenge._id} className="border-t border-white/5">
                  <td className="py-3 px-5 text-white">{challenge.title}</td>
                  <td className="py-3 px-5">
                    <span className={`text-xs ${
                      challenge.difficulty === 'Hard' ? 'text-red-400' : 
                      challenge.difficulty === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {challenge.difficulty}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-muted">{challenge.deadline}</td>
                  <td className="py-3 px-5">
                    <span className="px-2 py-1 rounded-full text-xs bg-teal/15 text-teal border border-teal/30">
                      {challenge.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-white">{challenge.submissions}</td>
                  <td className="py-3 px-5">
                    <div className="flex gap-2">
                      <button className="p-1.5 text-teal hover:bg-teal/10 rounded transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => setExpandedChallenge(expandedChallenge === challenge._id ? null : challenge._id)}
                        className="px-3 py-1 text-xs bg-teal/20 text-teal rounded hover:bg-teal/30 transition-colors"
                      >
                        Review Submissions
                      </button>
                      <button className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                
                {/* Expanded Submissions Panel */}
                {expandedChallenge === challenge._id && (
                  <tr>
                    <td colSpan={6} className="p-5 bg-black/20">
                      <h4 className="text-white font-semibold mb-4">Submissions ({challenge.submissions})</h4>
                      <div className="space-y-3">
                        {sampleSubmissions.map((sub) => (
                          <div key={sub._id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                            {gradingSubmission === sub._id ? (
                              <div className="flex gap-4 items-end">
                                <div className="flex-1">
                                  <label className="text-xs text-muted block mb-1">Score (0-100)</label>
                                  <input 
                                    type="number" 
                                    min="0" 
                                    max="100" 
                                    className="w-24 px-3 py-2 rounded bg-white/10 border border-white/20 text-white text-sm"
                                    placeholder="Score"
                                  />
                                </div>
                                <div className="flex-[2]">
                                  <label className="text-xs text-muted block mb-1">Feedback</label>
                                  <input 
                                    type="text" 
                                    className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white text-sm"
                                    placeholder="Enter feedback..."
                                  />
                                </div>
                                <button 
                                  onClick={() => handleGrade(sub._id, 85, 'Good work!')}
                                  className="px-4 py-2 bg-teal text-bg text-sm font-medium rounded hover:shadow-[0_0_10px_rgba(0,205,184,0.4)] transition-all"
                                >
                                  Submit Grade
                                </button>
                                <button 
                                  onClick={() => setGradingSubmission(null)}
                                  className="px-4 py-2 bg-white/10 text-white text-sm rounded hover:bg-white/20 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-white font-medium">{sub.user}</p>
                                  <div className="flex gap-4 mt-1 text-xs text-muted">
                                    <a href={`https://${sub.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-teal">GitHub</a>
                                    <a href={`https://${sub.demo}`} target="_blank" rel="noopener noreferrer" className="hover:text-teal">Demo</a>
                                    <span>{sub.submittedAt}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  {sub.score ? (
                                    <span className="text-teal font-bold">{sub.score}/100</span>
                                  ) : (
                                    <span className="text-muted text-sm">Not graded</span>
                                  )}
                                  <button 
                                    onClick={() => setGradingSubmission(sub._id)}
                                    className="px-3 py-1.5 text-xs bg-teal/20 text-teal rounded hover:bg-teal/30 transition-colors"
                                  >
                                    Grade
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminChallenges;
