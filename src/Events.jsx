import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents, saveEvents } from './utils/storage';
import { logAdminAction, AuditActions } from './utils/auditLog';
import { useAuth } from './context/AuthContext';
import AdminModeChip from './components/AdminModeChip';

// Simple Toast Component
const Toast = ({ message, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div 
      className="fixed bottom-6 right-6 z-[200] px-6 py-3 rounded-lg font-medium shadow-lg animate-fade-up"
      style={{
        background: 'rgba(0, 205, 184, 0.95)',
        color: '#080810'
      }}
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

// Event Form Drawer Component
const EventDrawer = ({ isOpen, onClose, event, onSave, user }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Workshop',
    date: '',
    description: '',
    maxSlots: 100,
    status: 'Upcoming',
    image: ''
  });

  useEffect(() => {
    if (event) {
      // Format date for datetime-local input
      const dateValue = event.date ? new Date(event.date).toISOString().slice(0, 16) : '';
      setFormData({
        title: event.title || '',
        category: event.category || 'Workshop',
        date: dateValue,
        description: event.description || '',
        maxSlots: event.maxSlots || 100,
        status: event.status || 'Upcoming',
        image: event.image || ''
      });
    } else {
      setFormData({
        title: '',
        category: 'Workshop',
        date: '',
        description: '',
        maxSlots: 100,
        status: 'Upcoming',
        image: ''
      });
    }
  }, [event, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-[150] backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className="fixed top-0 right-0 h-full w-full max-w-md z-[160] flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #0E0E1A 0%, #080810 100%)',
          borderLeft: '1px solid rgba(0,205,184,0.2)'
        }}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {event ? 'Edit Event' : 'Create Event'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
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
              placeholder="Event title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-teal focus:outline-none transition-colors"
            >
              <option value="Workshop">Workshop</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Talk">Talk</option>
              <option value="Social">Social</option>
              <option value="Conference">Conference</option>
              <option value="Competition">Competition</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-2">Date & Time</label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
              placeholder="Event description..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-2">Max Slots</label>
            <input
              type="number"
              value={formData.maxSlots}
              onChange={(e) => setFormData({ ...formData, maxSlots: parseInt(e.target.value) || 100 })}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-teal focus:outline-none transition-colors"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-teal focus:outline-none transition-colors"
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Active">Active</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Past">Past</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-2">Image URL (optional)</label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-teal focus:outline-none transition-colors"
              placeholder="https://example.com/image.jpg"
            />
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
              {event ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

const Events = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoggedIn } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', visible: false });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Load events from localStorage
  useEffect(() => {
    setLoading(true);
    const storedEvents = getEvents();
    // Enrich with defaults if needed
    const enrichedEvents = storedEvents.map(e => ({
      ...e,
      registrations: e.registrations || [],
      maxSlots: e.maxSlots || 100,
      description: e.description || 'Join us for an exciting tech event with hands-on learning and networking opportunities.',
      registeredCount: e.registrations?.length || 0
    }));
    setEvents(enrichedEvents);
    setLoading(false);
  }, []);

  const showToast = (message) => {
    setToast({ message, visible: true });
  };

  const hideToast = () => {
    setToast({ message: '', visible: false });
  };

  const handleRegister = (event) => {
    // Check if logged in
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    const currentUserEmail = user?.email;
    
    // Check if already registered
    if (event.registrations?.includes(currentUserEmail)) {
      return; // Already registered
    }

    // Update event in localStorage
    const updatedEvents = events.map(e => {
      if (e.id === event.id) {
        const updatedRegistrations = [...(e.registrations || []), currentUserEmail];
        return {
          ...e,
          registrations: updatedRegistrations,
          registeredCount: updatedRegistrations.length
        };
      }
      return e;
    });

    saveEvents(updatedEvents);
    setEvents(updatedEvents);
    showToast("You're registered!");
  };

  const isUserRegistered = (event) => {
    if (!isLoggedIn() || !user?.email) return false;
    return event.registrations?.includes(user.email);
  };

  // Admin CRUD handlers
  const handleCreateEvent = () => {
    setEditingEvent(null);
    setDrawerOpen(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setDrawerOpen(true);
  };

  const handleSaveEvent = (formData) => {
    const currentEvents = getEvents();
    
    if (editingEvent) {
      // Update existing
      const updatedEvents = currentEvents.map(e => {
        if (e.id === editingEvent.id) {
          return {
            ...e,
            ...formData,
            date: new Date(formData.date).toISOString()
          };
        }
        return e;
      });
      saveEvents(updatedEvents);
      setEvents(updatedEvents);
      logAdminAction(user, AuditActions.EDIT_EVENT, formData.title);
      showToast('Event updated!');
    } else {
      // Create new
      const newEvent = {
        ...formData,
        id: crypto.randomUUID(),
        date: new Date(formData.date).toISOString(),
        registrations: [],
        registeredCount: 0
      };
      const updatedEvents = [...currentEvents, newEvent];
      saveEvents(updatedEvents);
      setEvents(updatedEvents);
      logAdminAction(user, AuditActions.CREATE_EVENT, formData.title);
      showToast('Event created!');
    }
    
    setDrawerOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (event) => {
    if (deleteConfirm === event.id) {
      const updatedEvents = events.filter(e => e.id !== event.id);
      saveEvents(updatedEvents);
      setEvents(updatedEvents);
      logAdminAction(user, AuditActions.DELETE_EVENT, event.title);
      setDeleteConfirm(null);
      showToast('Event deleted!');
    } else {
      setDeleteConfirm(event.id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryStyle = (category) => {
    switch (category?.toLowerCase()) {
      case 'workshop': return 'text-[#22C55E] border-[#22C55E] bg-[#22C55E]/10';
      case 'hackathon': return 'text-[#EF4444] border-[#EF4444] bg-[#EF4444]/10';
      case 'talk': return 'text-[#3B82F6] border-[#3B82F6] bg-[#3B82F6]/10';
      case 'social': return 'text-[#F59E0B] border-[#F59E0B] bg-[#F59E0B]/10';
      case 'conference': return 'text-[#8B5CF6] border-[#8B5CF6] bg-[#8B5CF6]/10';
      default: return 'text-teal border-teal bg-teal/10';
    }
  };

  return (
    <div className="page-content min-h-screen bg-bg">
      {/* Hero Strip */}
      <section className="page-hero relative overflow-hidden border-b border-white/[0.05]">
        <div className="bg-blob top-0 left-1/4 opacity-20"></div>
        <div className="section-container relative z-10 text-center">
          <h1 className="text-[clamp(36px,6vw,72px)] font-black tracking-tighter uppercase mb-4">
            <span className="text-white">EVE</span>
            <span className="text-teal">NTS</span>
          </h1>
          <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto">
            Discover workshops, hackathons, and networking opportunities.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="px-5 py-2.5 rounded-full border border-teal/30 bg-teal/10 backdrop-blur-xl text-sm font-semibold text-teal">
              {events.length} Upcoming
            </div>
            <div className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-sm font-semibold text-white/70">
              Join the Community
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="section-spacing">
        <div className="section-container">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
            {isAdmin() && (
              <button 
                onClick={handleCreateEvent}
                className="px-4 py-2 bg-teal text-bg font-bold rounded-lg hover:shadow-[0_0_20px_rgba(0,205,184,0.4)] transition-all"
              >
                + Create Event
              </button>
            )}
          </div>

          {/* Loading State */}
          {loading && events.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-3 border-teal/30 border-t-teal rounded-full animate-spin mb-4"></div>
              <p className="text-muted animate-pulse">Loading events...</p>
            </div>
          )}

          {/* Empty State */}
          {events.length === 0 && !loading && (
            <div className="text-center py-16 text-muted">
              <p className="text-lg mb-2">No events found</p>
              <p className="text-sm opacity-60">Check back later for upcoming events</p>
            </div>
          )}

          {/* Grid */}
          {events.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {events.map((event) => {
                const userRegistered = isUserRegistered(event);
                const isDeleteConfirm = deleteConfirm === event.id;
                
                return (
                  <div 
                    key={event.id} 
                    className="group relative rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(0,205,184,0.1)',
                    }}
                  >
                    {/* Admin Edit/Delete Buttons */}
                    {isAdmin() && (
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="p-2 rounded-lg bg-white/10 hover:bg-teal/20 text-white hover:text-teal transition-colors"
                          title="Edit Event"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event)}
                          className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400 transition-colors"
                          title="Delete Event"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* Delete Confirmation */}
                    {isDeleteConfirm && (
                      <div className="absolute inset-0 bg-bg/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6">
                        <p className="text-white font-medium mb-4 text-center">Delete this event?</p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-4 py-2 rounded-lg border border-white/20 text-white text-sm hover:bg-white/5 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event)}
                            className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition-colors"
                          >
                            Yes, Delete
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="p-6">
                      {/* Header with badge */}
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryStyle(event.category)}`}>
                          {event.category}
                        </span>
                        <div className="flex items-center gap-2">
                          {userRegistered && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal/20 text-teal border border-teal/30">
                              Registered ✓
                            </span>
                          )}
                          <span className="text-xs text-muted">
                            {event.registeredCount || 0}/{event.maxSlots || 100} registered
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-3 group-hover:text-teal transition-colors pr-16">
                        {event.title}
                      </h3>
                      
                      <p className="text-sm text-muted mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      
                      {/* Date */}
                      <div className="flex items-center gap-2 text-sm text-muted mb-6">
                        <svg className="w-4 h-4 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(event.date)}
                      </div>

                      {/* Progress bar */}
                      <div className="mb-4">
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-teal rounded-full transition-all duration-1000"
                            style={{ width: `${Math.min(((event.registeredCount || 0) / (event.maxSlots || 100)) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Register Button */}
                      <button
                        onClick={() => handleRegister(event)}
                        disabled={userRegistered}
                        className={`w-full py-2.5 rounded-lg border font-medium transition-all duration-300 ${
                          userRegistered
                            ? 'border-teal/30 bg-teal/10 text-teal cursor-not-allowed'
                            : 'border-teal/40 text-teal hover:bg-teal hover:text-bg'
                        }`}
                      >
                        {userRegistered ? 'Registered ✓' : 'Register Now'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Event Drawer */}
      <EventDrawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditingEvent(null);
        }}
        event={editingEvent}
        onSave={handleSaveEvent}
        user={user}
      />

      {/* Toast */}
      <Toast 
        message={toast.message} 
        visible={toast.visible} 
        onClose={hideToast} 
      />

      {/* Admin Mode Chip - only visible to admins */}
      <AdminModeChip />
    </div>
  );
};

export default Events;
