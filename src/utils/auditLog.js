// Admin Action Audit Log Utility
// Stores admin actions in localStorage for the Audit Log tab

export function logAdminAction(user, action, target) {
  if (!user || user.role !== 'admin') return;
  
  const logs = JSON.parse(localStorage.getItem('clubverseAuditLog') || '[]');
  
  const entry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    admin: user.email,
    adminName: user.name || user.email,
    action,
    target
  };
  
  // Add to beginning (newest first)
  logs.unshift(entry);
  
  // Keep only last 200 entries
  localStorage.setItem('clubverseAuditLog', JSON.stringify(logs.slice(0, 200)));
}

export function getAuditLogs() {
  return JSON.parse(localStorage.getItem('clubverseAuditLog') || '[]');
}

export function clearAuditLogs() {
  localStorage.removeItem('clubverseAuditLog');
}

// Action type constants for consistency
export const AuditActions = {
  CREATE_EVENT: 'Created Event',
  EDIT_EVENT: 'Edited Event',
  UPDATE_EVENT: 'Updated Event',
  DELETE_EVENT: 'Deleted Event',
  PUBLISH_EVENT: 'Published Event',
  UNPUBLISH_EVENT: 'Unpublished Event',
  CREATE_CHALLENGE: 'Created Challenge',
  UPDATE_CHALLENGE: 'Updated Challenge',
  DELETE_CHALLENGE: 'Deleted Challenge',
  GRADE_SUBMISSION: 'Graded Submission',
  BULK_GRADE: 'Bulk Graded Submissions',
  CREATE_USER: 'Created User',
  UPDATE_USER: 'Updated User',
  DELETE_USER: 'Deleted User',
  BAN_USER: 'Banned User',
  UNBAN_USER: 'Unbanned User',
  PROMOTE_USER: 'Promoted to Admin',
  DEMOTE_USER: 'Demoted from Admin',
  RESET_PASSWORD: 'Reset User Password',
  ADD_TEAM_MEMBER: 'Added Team Member',
  UPDATE_TEAM_MEMBER: 'Updated Team Member',
  REMOVE_TEAM_MEMBER: 'Removed Team Member',
  CREATE_PROJECT: 'Created Project',
  UPDATE_PROJECT: 'Updated Project',
  DELETE_PROJECT: 'Deleted Project',
  FEATURE_PROJECT: 'Featured Project',
  UNFEATURE_PROJECT: 'Unfeatured Project',
  CREATE_ALBUM: 'Created Gallery Album',
  DELETE_PHOTO: 'Deleted Gallery Photo',
  BULK_UPLOAD: 'Bulk Uploaded Photos',
  PUBLISH_ANNOUNCEMENT: 'Published Announcement',
  REMOVE_ANNOUNCEMENT: 'Removed Announcement',
  EXPORT_AUDIT_LOG: 'Exported Audit Log',
  ADMIN_LOGIN: 'Admin Login',
  ADMIN_LOGOUT: 'Admin Logout'
};

// Get action color for audit log display
export function getActionColor(action) {
  if (action.includes('Created') || action.includes('Added') || action.includes('Published')) {
    return { bg: 'rgba(0,205,184,0.15)', color: '#00CDB8', border: 'rgba(0,205,184,0.3)' };
  }
  if (action.includes('Updated') || action.includes('Graded') || action.includes('Reset') || action.includes('Promoted') || action.includes('Demoted')) {
    return { bg: 'rgba(59,130,246,0.15)', color: '#60A5FA', border: 'rgba(59,130,246,0.3)' };
  }
  if (action.includes('Deleted') || action.includes('Removed') || action.includes('Banned') || action.includes('Unbanned')) {
    return { bg: 'rgba(239,68,68,0.15)', color: '#EF4444', border: 'rgba(239,68,68,0.3)' };
  }
  if (action.includes('Exported') || action.includes('Login') || action.includes('Logout')) {
    return { bg: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: 'rgba(245,158,11,0.3)' };
  }
  return { bg: 'rgba(255,255,255,0.1)', color: '#8A8A9A', border: 'rgba(255,255,255,0.2)' };
}
