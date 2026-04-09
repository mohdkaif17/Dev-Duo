import { useState } from 'react';

const sampleSubmissions = [
  { _id: '1', user: 'Alex Johnson', challenge: 'AI Image Classifier', repo: 'github.com/alex/ai', demo: 'alex-ai.vercel.app', submittedAt: 'Jan 25, 2025', score: null, status: 'Pending' },
  { _id: '2', user: 'Sarah Chen', challenge: 'React Portfolio', repo: 'github.com/sarah/portfolio', demo: 'sarah.dev', submittedAt: 'Jan 26, 2025', score: 85, status: 'Graded' },
  { _id: '3', user: 'Mike Rodriguez', challenge: 'AI Image Classifier', repo: 'github.com/mike/ai', demo: 'mike-ai.vercel.app', submittedAt: 'Jan 27, 2025', score: null, status: 'Pending' },
  { _id: '4', user: 'Emily Davis', challenge: 'Python Automation', repo: 'github.com/emily/auto', demo: null, submittedAt: 'Jan 28, 2025', score: 92, status: 'Graded' },
];

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState(sampleSubmissions);
  const [challengeFilter, setChallengeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [gradingRow, setGradingRow] = useState(null);
  const [bulkScore, setBulkScore] = useState('');

  const filtered = submissions.filter(s => {
    const matchesChallenge = challengeFilter === 'All' || s.challenge === challengeFilter;
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesChallenge && matchesStatus;
  });

  const challenges = [...new Set(submissions.map(s => s.challenge))];

  const handleGrade = (id, score, feedback) => {
    setSubmissions(submissions.map(s => s._id === id ? { ...s, score, status: 'Graded' } : s));
    setGradingRow(null);
  };

  const handleBulkGrade = () => {
    if (!bulkScore || selectedSubmissions.length === 0) return;
    setSubmissions(submissions.map(s => 
      selectedSubmissions.includes(s._id) 
        ? { ...s, score: parseInt(bulkScore), status: 'Graded' } 
        : s
    ));
    setSelectedSubmissions([]);
    setBulkScore('');
  };

  const toggleSelect = (id) => {
    setSelectedSubmissions(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-8">Submissions</h1>

      {/* Filters & Bulk Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          <select 
            value={challengeFilter}
            onChange={(e) => setChallengeFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
          >
            <option className="bg-bg">All Challenges</option>
            {challenges.map(c => <option key={c} className="bg-bg">{c}</option>)}
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
          >
            <option className="bg-bg">All Status</option>
            <option className="bg-bg">Pending</option>
            <option className="bg-bg">Graded</option>
          </select>
        </div>

        {selectedSubmissions.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted">{selectedSubmissions.length} selected</span>
            <input 
              type="number" 
              min="0" 
              max="100" 
              placeholder="Score"
              value={bulkScore}
              onChange={(e) => setBulkScore(e.target.value)}
              className="w-20 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
            />
            <button 
              onClick={handleBulkGrade}
              className="px-4 py-2 bg-teal text-bg text-sm font-medium rounded hover:shadow-[0_0_10px_rgba(0,205,184,0.4)] transition-all"
            >
              Assign Score
            </button>
          </div>
        )}
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
              <th className="text-left py-3 px-5">
                <input 
                  type="checkbox" 
                  onChange={(e) => setSelectedSubmissions(e.target.checked ? filtered.map(f => f._id) : [])}
                  checked={selectedSubmissions.length === filtered.length && filtered.length > 0}
                  className="rounded border-white/30"
                />
              </th>
              {['User', 'Challenge', 'Repo', 'Demo', 'Submitted', 'Score', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left py-3 px-5 text-xs font-bold uppercase text-muted tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((sub) => (
              <tr key={sub._id} className="border-t border-white/5">
                <td className="py-3 px-5">
                  <input 
                    type="checkbox" 
                    checked={selectedSubmissions.includes(sub._id)}
                    onChange={() => toggleSelect(sub._id)}
                    className="rounded border-white/30"
                  />
                </td>
                <td className="py-3 px-5 text-white">{sub.user}</td>
                <td className="py-3 px-5 text-muted">{sub.challenge}</td>
                <td className="py-3 px-5">
                  <a href={`https://${sub.repo}`} target="_blank" rel="noopener noreferrer" className="text-teal text-sm hover:underline">Repo</a>
                </td>
                <td className="py-3 px-5">
                  {sub.demo ? (
                    <a href={`https://${sub.demo}`} target="_blank" rel="noopener noreferrer" className="text-teal text-sm hover:underline">Demo</a>
                  ) : (
                    <span className="text-muted text-sm">-</span>
                  )}
                </td>
                <td className="py-3 px-5 text-muted text-sm">{sub.submittedAt}</td>
                <td className="py-3 px-5">
                  {sub.score ? (
                    <span className="text-teal font-bold">{sub.score}</span>
                  ) : (
                    <span className="text-muted text-sm">-</span>
                  )}
                </td>
                <td className="py-3 px-5">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    sub.status === 'Graded' 
                      ? 'bg-teal/15 text-teal border border-teal/30' 
                      : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {sub.status}
                  </span>
                </td>
                <td className="py-3 px-5">
                  {gradingRow === sub._id ? (
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        min="0" 
                        max="100" 
                        placeholder="Score"
                        className="w-16 px-2 py-1 rounded bg-white/10 border border-white/20 text-white text-sm"
                        id={`score-${sub._id}`}
                      />
                      <input 
                        type="text" 
                        placeholder="Feedback"
                        className="w-32 px-2 py-1 rounded bg-white/10 border border-white/20 text-white text-sm"
                        id={`feedback-${sub._id}`}
                      />
                      <button 
                        onClick={() => {
                          const score = document.getElementById(`score-${sub._id}`).value;
                          const feedback = document.getElementById(`feedback-${sub._id}`).value;
                          handleGrade(sub._id, parseInt(score), feedback);
                        }}
                        className="px-3 py-1 bg-teal text-bg text-xs font-medium rounded"
                      >
                        Submit
                      </button>
                      <button 
                        onClick={() => setGradingRow(null)}
                        className="px-3 py-1 bg-white/10 text-white text-xs rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setGradingRow(sub._id)}
                      className="px-3 py-1.5 text-xs bg-teal/20 text-teal rounded hover:bg-teal/30 transition-colors"
                    >
                      Grade
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSubmissions;
