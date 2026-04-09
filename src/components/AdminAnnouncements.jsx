import { useState, useEffect } from 'react';

const loadQuill = () => {
  return new Promise((resolve) => {
    if (window.Quill) {
      resolve(window.Quill);
      return;
    }
    const link = document.createElement('link');
    link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    const script = document.createElement('script');
    script.src = 'https://cdn.quilljs.com/1.3.6/quill.min.js';
    script.onload = () => resolve(window.Quill);
    document.body.appendChild(script);
  });
};

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([
    { id: '1', text: '🎉 Hackathon 2025 registrations are now open! Register today.', createdAt: 'Jan 15, 2025' },
    { id: '2', text: '📢 New React Workshop scheduled for Feb 10. Limited seats available.', createdAt: 'Jan 20, 2025' },
  ]);
  const [editorContent, setEditorContent] = useState('');
  const [quillReady, setQuillReady] = useState(false);

  useEffect(() => {
    let quillInstance = null;
    
    const initQuill = async () => {
      const Quill = await loadQuill();
      if (!document.getElementById('quill-editor')) return;
      
      quillInstance = new Quill('#quill-editor', {
        theme: 'snow',
        placeholder: 'Compose your announcement...',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'size': ['small', false, 'large'] }],
            ['link']
          ]
        }
      });
      
      quillInstance.on('text-change', () => {
        setEditorContent(quillInstance.root.innerHTML);
      });
      
      // Apply dark theme styles
      const editor = document.querySelector('.ql-editor');
      if (editor) {
        editor.style.background = 'rgba(255,255,255,0.05)';
        editor.style.color = '#fff';
        editor.style.borderColor = 'rgba(0,205,184,0.2)';
      }
      
      setQuillReady(true);
    };

    initQuill();
    
    return () => {
      if (quillInstance) {
        quillInstance = null;
      }
    };
  }, []);

  const handlePublish = () => {
    if (!editorContent.trim()) return;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = editorContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    const newAnnouncement = {
      id: Date.now().toString(),
      text: textContent.substring(0, 100) + (textContent.length > 100 ? '...' : ''),
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    setAnnouncements([newAnnouncement, ...announcements]);
    
    // Clear editor
    const editor = document.querySelector('.ql-editor');
    if (editor) editor.innerHTML = '';
    setEditorContent('');
  };

  const handleRemove = (id) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-8">Announcements</h1>

      {/* Editor */}
      <div 
        className="p-6 rounded-xl mb-8"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(0,205,184,0.1)'
        }}
      >
        <h3 className="text-white font-semibold mb-4">Compose Announcement</h3>
        <div id="quill-editor" className="rounded-lg overflow-hidden" style={{ minHeight: '150px' }}></div>
        <div className="flex justify-end mt-4">
          <button 
            onClick={handlePublish}
            disabled={!quillReady}
            className="px-5 py-2 bg-teal text-bg font-medium rounded-lg hover:shadow-[0_0_20px_rgba(0,205,184,0.4)] transition-all disabled:opacity-50"
          >
            Publish to Ticker
          </button>
        </div>
      </div>

      {/* Active Announcements */}
      <div 
        className="p-6 rounded-xl"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(0,205,184,0.1)'
        }}
      >
        <h3 className="text-white font-semibold mb-4">Active Announcements</h3>
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <div 
              key={announcement.id}
              className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
            >
              <div>
                <p className="text-white">{announcement.text}</p>
                <p className="text-muted text-sm mt-1">{announcement.createdAt}</p>
              </div>
              <button 
                onClick={() => handleRemove(announcement.id)}
                className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          {announcements.length === 0 && (
            <p className="text-muted text-center py-8">No active announcements</p>
          )}
        </div>
      </div>

      {/* Custom Quill Dark Styles */}
      <style>{`
        .ql-toolbar {
          background: rgba(255,255,255,0.05) !important;
          border-color: rgba(0,205,184,0.2) !important;
        }
        .ql-toolbar button {
          color: white !important;
        }
        .ql-toolbar button:hover {
          color: #00CDB8 !important;
        }
        .ql-container {
          border-color: rgba(0,205,184,0.2) !important;
          background: rgba(255,255,255,0.05) !important;
        }
        .ql-editor {
          color: white !important;
        }
        .ql-editor.ql-blank::before {
          color: rgba(255,255,255,0.4) !important;
        }
        .ql-picker {
          color: white !important;
        }
        .ql-picker-options {
          background: #0A0A1A !important;
          border-color: rgba(0,205,184,0.2) !important;
        }
        .ql-active {
          color: #00CDB8 !important;
        }
      `}</style>
    </div>
  );
};

export default AdminAnnouncements;
