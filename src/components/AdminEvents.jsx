import { useState } from 'react';
import { logAdminAction, AuditActions } from '../utils/auditLog';

const sampleEvents = [
  { _id: '1', title: 'DevFest 2024', category: 'Conference', date: 'Dec 15, 2024', status: 'Published', registrations: 156 },
  { _id: '2', title: 'React Workshop', category: 'Workshop', date: 'Nov 10, 2024', status: 'Draft', registrations: 0 },
  { _id: '3', title: 'Hackathon 2025', category: 'Competition', date: 'Jan 20, 2025', status: 'Upcoming', registrations: 89 },
  { _id: '4', title: 'AI Challenge', category: 'Competition', date: 'Feb 5, 2025', status: 'Published', registrations: 234 },
  { _id: '5', title: 'Social Night', category: 'Social', date: 'Oct 20, 2024', status: 'Past', registrations: 78 },
];

const getStatusStyles = (status) => {
  switch (status) {
    case 'Published': return { bg: 'rgba(0,205,184,0.15)', color: '#00CDB8', border: 'rgba(0,205,184,0.3)' };
    case 'Upcoming': return { bg: 'rgba(59,130,246,0.15)', color: '#60A5FA', border: 'rgba(59,130,246,0.3)' };
    case 'Draft': return { bg: 'rgba(255,255,255,0.1)', color: '#8A8A9A', border: 'rgba(255,255,255,0.2)' };
    default: return { bg: 'rgba(255,255,255,0.05)', color: '#8A8A9A', border: 'rgba(255,255,255,0.1)' };
  }
};

const AdminEvents = ({ user }) => {
  const [events, setEvents] = useState(sampleEvents);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

  const handleDelete = (id) => {
    if (confirmDelete === id) {
      const event = events.find(e => e._id === id);
      setEvents(events.filter(e => e._id !== id));
      setConfirmDelete(null);
      // Log audit action
      logAdminAction(user, AuditActions.DELETE_EVENT, event?.title || 'Unknown Event');
    } else {
      setConfirmDelete(id);
    }
  };

  const handleToggleStatus = (id) => {
    setEvents(events.map(e => {
      if (e._id === id) {
        const newStatus = e.status === 'Published' ? 'Draft' : 'Published';
        const action = newStatus === 'Published' ? AuditActions.PUBLISH_EVENT : AuditActions.UNPUBLISH_EVENT;
        // Log audit action
        logAdminAction(user, action, e.title);
        return { ...e, status: newStatus };
      }
      return e;
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Events</h1>
        <button 
          onClick={() => setShowDrawer(true)}
          className="px-5 py-2 bg-teal text-bg font-medium rounded-lg hover:shadow-[0_0_20px_rgba(0,205,184,0.4)] transition-all"
        >
          + Create Event
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
              {['Title', 'Category', 'Date', 'Status', 'Registrations', 'Actions'].map(h => (
                <th key={h} className="text-left py-3 px-5 text-xs font-bold uppercase text-muted tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const statusStyles = getStatusStyles(event.status);
              const isConfirming = confirmDelete === event._id;

              return (
                <tr key={event._id} className="border-t border-white/5">
                  {isConfirming ? (
                    <td colSpan={6} className="py-3 px-5">
                      <div className="flex items-center justify-between">
                        <span className="text-red-400">Are you sure?</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleDelete(event._id)}
                            className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm"
                          >
                            Delete
                          </button>
                          <button 
                            onClick={() => setConfirmDelete(null)}
                            className="px-3 py-1 bg-white/10 text-white rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="py-3 px-5 text-white">{event.title}</td>
                      <td className="py-3 px-5 text-muted">{event.category}</td>
                      <td className="py-3 px-5 text-muted">{event.date}</td>
                      <td className="py-3 px-5">
                        <span 
                          className="px-2 py-1 rounded-full text-xs"
                          style={{
                            background: statusStyles.bg,
                            color: statusStyles.color,
                            border: `1px solid ${statusStyles.border}`
                          }}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-white">{event.registrations}</td>
                      <td className="py-3 px-5">
                        <div className="flex gap-2">
                          <button className="p-1.5 text-teal hover:bg-teal/10 rounded transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleToggleStatus(event._id)}
                            className="p-1.5 text-white/60 hover:bg-white/10 rounded transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(event._id)}
                            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create Event Drawer */}
      {showDrawer && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowDrawer(false)}
        >
          <div 
            className="absolute right-0 top-0 bottom-0 w-[400px] p-6"
            style={{
              background: '#0A0A1A',
              borderLeft: '1px solid rgba(0,205,184,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-white mb-6">Create Event</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted block mb-2">Title</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-teal/50 outline-none" placeholder="Event title" />
              </div>
              <div>
                <label className="text-sm text-muted block mb-2">Description</label>
                <textarea rows={4} className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-teal/50 outline-none" placeholder="Event description"></textarea>
              </div>
              <div>
                <label className="text-sm text-muted block mb-2">Date</label>
                <input type="datetime-local" className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-teal/50 outline-none" />
              </div>
              <div>
                <label className="text-sm text-muted block mb-2">Category</label>
                <select className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-teal/50 outline-none">
                  <option>Conference</option>
                  <option>Workshop</option>
                  <option>Competition</option>
                  <option>Social</option>
                </select>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input type="checkbox" id="publish" className="rounded border-white/30" />
                <label htmlFor="publish" className="text-sm text-white">Publish immediately</label>
              </div>
              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => setShowDrawer(false)}
                  className="flex-1 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowDrawer(false);
                    // Log audit action for event creation
                    logAdminAction(user, AuditActions.CREATE_EVENT, 'New Event');
                  }}
                  className="flex-1 py-2 rounded-lg bg-teal text-bg font-medium hover:shadow-[0_0_20px_rgba(0,205,184,0.4)] transition-all"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
