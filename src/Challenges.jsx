import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChallenges, saveChallenges, getSubmissions, saveSubmissions } from './utils/storage';
import { logAdminAction, AuditActions } from './utils/auditLog';
import { useAuth } from './context/AuthContext';
import ChallengeStats from './components/ChallengeStats';
import ChallengeFilters from './components/ChallengeFilters';
import ChallengeCard from './components/ChallengeCard';
import AdminModeChip from './components/AdminModeChip';

// Toast Component
const Toast = ({ message, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => onClose(), 2500);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div 
      className="fixed bottom-6 right-6 z-[200] px-6 py-3 rounded-lg font-medium shadow-lg animate-fade-up"
      style={{ background: 'rgba(0, 205, 184, 0.95)', color: '#080810' }}
    >
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {message}
      </div>
    </div>
  );
};

// Challenge Drawer Component
const ChallengeDrawer = ({ isOpen, onClose, challenge, onSave, user }) => {
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Easy',
    category: 'UI/UX',
    xp: 300,
    deadline: '',
    description: '',
    status: 'Active',
    maxSubmissions: 100
  });

  useEffect(() => {
    if (challenge) {
      const deadlineValue = challenge.deadline ? new Date(challenge.deadline).toISOString().slice(0, 16) : '';
      setFormData({
        title: challenge.title || '',
        difficulty: challenge.difficulty || 'Easy',
        category: challenge.category || 'UI/UX',
        xp: challenge.xp || 300,
        deadline: deadlineValue,
        description: challenge.description || '',
        status: challenge.status || 'Active',
        maxSubmissions: challenge.maxSubmissions || 100
      });
    } else {
      setFormData({
        title: '',
        difficulty: 'Easy',
        category: 'UI/UX',
        xp: 300,
        deadline: '',
        description: '',
        status: 'Active',
        maxSubmissions: 100
      });
    }
  }, [challenge, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[150] backdrop-blur-sm" onClick={onClose} />
      <div 
        className="fixed top-0 right-0 h-full w-full max-w-md z-[160] flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #0E0E1A 0%, #080810 100%)',
          borderLeft: '1px solid rgba(0,205,184,0.2)'
        }}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {challenge ? 'Edit Challenge' : 'Create Challenge'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-teal focus:outline-none transition-colors"
              placeholder="Challenge title"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-teal focus:outline-none transition-colors"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-2">XP</label>
              <input
                type="number"
                value={formData.xp}
                onChange={(e) => setFormData({ ...formData, xp: parseInt(e.target.value) || 300 })}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-teal focus:outline-none transition-colors"
                min="100"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-teal focus:outline-none transition-colors"
            >
              <option value="UI/UX">UI/UX</option>
              <option value="Full-Stack">Full-Stack</option>
              <option value="API Design">API Design</option>
              <option value="Open Innovation">Open Innovation</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Mobile">Mobile</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-2">Deadline</label>
            <input
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-teal focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-teal focus:outline-none transition-colors resize-none"
              placeholder="Challenge description..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-teal focus:outline-none transition-colors"
              >
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Max Submissions</label>
              <input
                type="number"
                value={formData.maxSubmissions}
                onChange={(e) => setFormData({ ...formData, maxSubmissions: parseInt(e.target.value) || 100 })}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-teal focus:outline-none transition-colors"
                min="1"
                required
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-teal text-bg font-bold hover:shadow-[0_0_20px_rgba(0,205,184,0.4)] transition-all"
            >
              {challenge ? 'Update Challenge' : 'Create Challenge'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

// Submission Modal Component
const SubmissionModal = ({ isOpen, onClose, challenge, user, onSubmit, existingSubmission }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubUrl: '',
    demoUrl: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (existingSubmission) {
      setFormData({
        title: existingSubmission.title || '',
        description: existingSubmission.description || '',
        githubUrl: existingSubmission.githubUrl || '',
        demoUrl: existingSubmission.demoUrl || ''
      });
    } else {
      setFormData({ title: '', description: '', githubUrl: '', demoUrl: '' });
    }
  }, [existingSubmission, isOpen]);

  const validateUrl = (url, type) => {
    if (!url) return type === 'github' ? 'GitHub URL is required' : null;
    const githubRegex = /^https:\/\/github\.com\/[\w-]+\/[\w-]+\/?$/;
    const demoRegex = /^https:\/\/.+\..+/;
    if (type === 'github' && !githubRegex.test(url)) return 'Invalid GitHub URL format';
    if (type === 'demo' && !demoRegex.test(url)) return 'Invalid URL format';
    return null;
  };

  const handleBlur = (field, type) => {
    const error = validateUrl(formData[field], type);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const githubError = validateUrl(formData.githubUrl, 'github');
    const demoError = validateUrl(formData.demoUrl, 'demo');
    
    if (githubError || demoError || !formData.title.trim()) {
      setErrors({
        githubUrl: githubError,
        demoUrl: demoError,
        title: !formData.title.trim() ? 'Title is required' : null
      });
      return;
    }

    onSubmit(formData);
    onClose();
  };

  const isValid = formData.title.trim() && formData.githubUrl && !errors.githubUrl;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-[150] backdrop-blur-sm" onClick={onClose} />
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[160] rounded-xl p-6"
        style={{
          background: 'linear-gradient(180deg, #0E0E1A 0%, #080810 100%)',
          border: '1px solid rgba(0,205,184,0.2)'
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {existingSubmission ? 'Update Submission' : 'Submit Solution'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-white focus:outline-none transition-colors ${
                errors.title ? 'border-red-500' : 'border-white/10 focus:border-teal'
              }`}
              placeholder="Submission title"
              required
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-teal focus:outline-none transition-colors resize-none"
              placeholder="Brief explanation of your approach"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-2">GitHub Link</label>
            <div className="relative">
              <input
                type="text"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                onBlur={() => handleBlur('githubUrl', 'github')}
                className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-white focus:outline-none transition-colors pr-10 ${
                  errors.githubUrl ? 'border-red-500' : formData.githubUrl && !errors.githubUrl ? 'border-green-500' : 'border-white/10 focus:border-teal'
                }`}
                placeholder="https://github.com/username/repo"
                required
              />
              {formData.githubUrl && !errors.githubUrl && (
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            {errors.githubUrl && <p className="mt-1 text-xs text-red-500">{errors.githubUrl}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-2">Live Demo URL (optional)</label>
            <div className="relative">
              <input
                type="text"
                value={formData.demoUrl}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                onBlur={() => handleBlur('demoUrl', 'demo')}
                className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-white focus:outline-none transition-colors pr-10 ${
                  errors.demoUrl ? 'border-red-500' : formData.demoUrl && !errors.demoUrl ? 'border-green-500' : 'border-white/10 focus:border-teal'
                }`}
                placeholder="https://your-demo.vercel.app"
              />
              {formData.demoUrl && !errors.demoUrl && (
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            {errors.demoUrl && <p className="mt-1 text-xs text-red-500">{errors.demoUrl}</p>}
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="flex-1 px-4 py-2.5 rounded-lg bg-teal text-bg font-bold hover:shadow-[0_0_20px_rgba(0,205,184,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {existingSubmission ? 'Update Submission' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

const Challenges = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoggedIn } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [filters, setFilters] = useState({ difficulty: 'All', category: 'All' });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', visible: false });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [submissionModal, setSubmissionModal] = useState({ open: false, challenge: null });

  // Load challenges from localStorage
  useEffect(() => {
    setLoading(true);
    const storedChallenges = getChallenges();
    const enrichedChallenges = storedChallenges.map(c => ({
      ...c,
      category: c.category || 'UI/UX',
      status: c.status || 'Active',
      deadline: c.deadline || new Date().toISOString(),
      xp: c.xp || 300,
      submissions: c.submissions || 0,
      maxSubmissions: c.maxSubmissions || 100
    }));
    setChallenges(enrichedChallenges);
    setLoading(false);
  }, []);

  const showToast = (message) => {
    setToast({ message, visible: true });
  };

  const hideToast = () => setToast({ message: '', visible: false });

  // Filter challenges
  const filteredChallenges = challenges.filter(c => {
    const difficultyMatch = filters.difficulty === 'All' || c.difficulty === filters.difficulty;
    const categoryMatch = filters.category === 'All' || c.category === filters.category;
    return difficultyMatch && categoryMatch;
  });

  // Check if user has submitted to a challenge
  const getExistingSubmission = (challengeId) => {
    if (!isLoggedIn() || !user?.email) return null;
    const submissions = getSubmissions();
    return submissions.find(s => s.challengeId === challengeId && s.userId === user.email);
  };

  // Handle submit solution
  const handleSubmitSolution = (challenge) => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    setSubmissionModal({ open: true, challenge });
  };

  // Handle submission save
  const handleSubmissionSave = (formData) => {
    const challenge = submissionModal.challenge;
    const existing = getExistingSubmission(challenge.id);
    const submissions = getSubmissions();

    if (existing) {
      // Update existing
      const updatedSubmissions = submissions.map(s => 
        s.id === existing.id 
          ? { ...s, ...formData, submittedAt: new Date().toISOString() }
          : s
      );
      saveSubmissions(updatedSubmissions);
      showToast('Submission updated!');
    } else {
      // Create new
      const newSubmission = {
        id: crypto.randomUUID(),
        challengeId: challenge.id,
        challengeTitle: challenge.title,
        userId: user.email,
        userName: user.name || user.email,
        ...formData,
        submittedAt: new Date().toISOString(),
        score: null,
        status: 'Pending'
      };
      saveSubmissions([...submissions, newSubmission]);
      
      // Update challenge submission count
      const updatedChallenges = challenges.map(c => 
        c.id === challenge.id 
          ? { ...c, submissions: (c.submissions || 0) + 1 }
          : c
      );
      saveChallenges(updatedChallenges);
      setChallenges(updatedChallenges);
      showToast('Solution submitted!');
    }
  };

  // Admin CRUD handlers
  const handleCreateChallenge = () => {
    setEditingChallenge(null);
    setDrawerOpen(true);
  };

  const handleEditChallenge = (challenge) => {
    setEditingChallenge(challenge);
    setDrawerOpen(true);
  };

  const handleSaveChallenge = (formData) => {
    const currentChallenges = getChallenges();
    
    if (editingChallenge) {
      const updatedChallenges = currentChallenges.map(c => 
        c.id === editingChallenge.id 
          ? { ...c, ...formData, deadline: new Date(formData.deadline).toISOString() }
          : c
      );
      saveChallenges(updatedChallenges);
      setChallenges(updatedChallenges);
      logAdminAction(user, AuditActions.UPDATE_CHALLENGE, formData.title);
      showToast('Challenge updated!');
    } else {
      const newChallenge = {
        ...formData,
        id: crypto.randomUUID(),
        deadline: new Date(formData.deadline).toISOString(),
        submissions: 0
      };
      const updatedChallenges = [...currentChallenges, newChallenge];
      saveChallenges(updatedChallenges);
      setChallenges(updatedChallenges);
      logAdminAction(user, AuditActions.CREATE_CHALLENGE, formData.title);
      showToast('Challenge created!');
    }
    
    setDrawerOpen(false);
    setEditingChallenge(null);
  };

  const handleDeleteChallenge = (challenge) => {
    if (deleteConfirm === challenge.id) {
      const updatedChallenges = challenges.filter(c => c.id !== challenge.id);
      saveChallenges(updatedChallenges);
      setChallenges(updatedChallenges);
      logAdminAction(user, AuditActions.DELETE_CHALLENGE, challenge.title);
      setDeleteConfirm(null);
      showToast('Challenge deleted!');
    } else {
      setDeleteConfirm(challenge.id);
    }
  };

  return (
    <div className="page-content min-h-screen bg-bg">
      <ChallengeStats />
      <ChallengeFilters filters={filters} onFilterChange={setFilters} />

      {/* Admin Create Button */}
      {isAdmin() && (
        <button
          onClick={handleCreateChallenge}
          className="fixed bottom-8 right-8 w-14 h-14 bg-teal text-bg rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,205,184,0.4)] hover:scale-110 transition-all duration-300 z-50"
          title="Create Challenge"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      <section className="section-spacing">
        <div className="section-container">
          {/* Loading */}
          {loading && challenges.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-3 border-teal/30 border-t-teal rounded-full animate-spin mb-4"></div>
              <p className="text-muted animate-pulse">Loading challenges...</p>
            </div>
          )}

          {/* Empty */}
          {!loading && filteredChallenges.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted text-xl">No challenges found matching your filters.</p>
              <button 
                onClick={() => setFilters({ difficulty: 'All', category: 'All' })}
                className="mt-4 text-teal hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Grid */}
          {filteredChallenges.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredChallenges.map((challenge, index) => (
                <ChallengeCard 
                  key={challenge.id} 
                  challenge={challenge} 
                  index={index}
                  isAdmin={isAdmin()}
                  onEdit={() => handleEditChallenge(challenge)}
                  onDelete={() => handleDeleteChallenge(challenge)}
                  onSubmit={() => handleSubmitSolution(challenge)}
                  deleteConfirm={deleteConfirm}
                  setDeleteConfirm={setDeleteConfirm}
                  existingSubmission={getExistingSubmission(challenge.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Challenge Drawer */}
      <ChallengeDrawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditingChallenge(null);
        }}
        challenge={editingChallenge}
        onSave={handleSaveChallenge}
        user={user}
      />

      {/* Submission Modal */}
      <SubmissionModal
        isOpen={submissionModal.open}
        onClose={() => setSubmissionModal({ open: false, challenge: null })}
        challenge={submissionModal.challenge}
        user={user}
        onSubmit={handleSubmissionSave}
        existingSubmission={submissionModal.challenge ? getExistingSubmission(submissionModal.challenge.id) : null}
      />

      {/* Toast */}
      <Toast message={toast.message} visible={toast.visible} onClose={hideToast} />
      
      <AdminModeChip />
    </div>
  );
};

export default Challenges;
