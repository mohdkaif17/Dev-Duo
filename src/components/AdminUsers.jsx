import { useState } from 'react';

const sampleUsers = [
  { _id: '1', name: 'Alex Johnson', email: 'alex@cmr.edu', role: 'Member', status: 'Active', joined: 'Jan 15, 2024' },
  { _id: '2', name: 'Sarah Chen', email: 'sarah@cmr.edu', role: 'Member', status: 'Active', joined: 'Jan 20, 2024' },
  { _id: '3', name: 'Mike Rodriguez', email: 'mike@cmr.edu', role: 'Admin', status: 'Active', joined: 'Dec 1, 2023' },
  { _id: '4', name: 'Tom Brown', email: 'tom@cmr.edu', role: 'Member', status: 'Banned', joined: 'Feb 5, 2024' },
];

const AdminUsers = () => {
  const [users, setUsers] = useState(sampleUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [confirmingAction, setConfirmingAction] = useState(null);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                         u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAction = (userId, action) => {
    if (confirmingAction?.id === userId && confirmingAction?.action === action) {
      // Execute action
      if (action === 'ban') {
        setUsers(users.map(u => u._id === userId ? { ...u, status: u.status === 'Banned' ? 'Active' : 'Banned' } : u));
      } else if (action === 'promote') {
        setUsers(users.map(u => u._id === userId ? { ...u, role: u.role === 'Admin' ? 'Member' : 'Admin' } : u));
      }
      setConfirmingAction(null);
    } else {
      setConfirmingAction({ id: userId, action });
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm w-48 focus:border-teal/50 outline-none"
          />
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-teal/50 outline-none"
          >
            <option className="bg-bg">All Roles</option>
            <option className="bg-bg">Admin</option>
            <option className="bg-bg">Member</option>
          </select>
        </div>
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
              {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                <th key={h} className="text-left py-3 px-5 text-xs font-bold uppercase text-muted tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-t border-white/5">
                <td className="py-3 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center text-teal text-xs font-bold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-white">{user.name}</span>
                  </div>
                </td>
                <td className="py-3 px-5 text-muted text-sm">{user.email}</td>
                <td className="py-3 px-5">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === 'Admin' 
                      ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' 
                      : 'bg-white/10 text-white/70 border border-white/20'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-5">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === 'Active' 
                      ? 'bg-green-500/15 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/15 text-red-400 border border-red-500/30'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-5 text-muted text-sm">{user.joined}</td>
                <td className="py-3 px-5">
                  {confirmingAction?.id === user._id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-400">
                        {confirmingAction.action === 'ban' ? 'Ban?' : confirmingAction.action === 'promote' ? 'Promote?' : 'Reset?'}
                      </span>
                      <button 
                        onClick={() => handleAction(user._id, confirmingAction.action)}
                        className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs"
                      >
                        Yes
                      </button>
                      <button 
                        onClick={() => setConfirmingAction(null)}
                        className="px-2 py-1 bg-white/10 text-white rounded text-xs"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAction(user._id, 'promote')}
                        className="p-1.5 text-yellow-400 hover:bg-yellow-500/10 rounded transition-colors"
                        title="Promote to Admin"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleAction(user._id, 'ban')}
                        className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Ban User"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      </button>
                      <button 
                        className="p-1.5 text-amber-400 hover:bg-amber-500/10 rounded transition-colors"
                        title="Reset Password"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </button>
                    </div>
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

export default AdminUsers;
