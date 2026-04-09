import { useState, useRef, useCallback } from 'react';

const albums = [
  { id: 'devfest-2024', name: 'DevFest 2024' },
  { id: 'hackathon-2025', name: 'Hackathon 2025' },
  { id: 'react-workshop', name: 'Workshop: React' },
  { id: 'social-night-2024', name: 'Social Night 2024' },
  { id: 'tech-talk-2025', name: 'Tech Talk 2025' },
  { id: 'orientation-2024', name: 'Orientation 2024' },
  { id: 'project-expo', name: 'Project Expo' },
];

const UploadModal = ({ isOpen, onClose, onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [newAlbumName, setNewAlbumName] = useState('');
  const [isNewAlbum, setIsNewAlbum] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = useCallback((files) => {
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
    
    // Generate previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, { name: file.name, src: e.target.result }]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    if (!selectedAlbum && !newAlbumName) {
      alert('Please select or create an album');
      return;
    }

    setIsUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onUpload?.({
            files: selectedFiles,
            album: isNewAlbum ? newAlbumName : selectedAlbum
          });
          
          // Reset and close
          setSelectedFiles([]);
          setPreviews([]);
          setSelectedAlbum('');
          setNewAlbumName('');
          setIsNewAlbum(false);
          setUploadProgress(0);
          setIsUploading(false);
          onClose();
        }, 500);
      }
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(0,205,184,0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Upload Photos</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drag and drop zone */}
        <div
          className="relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all mb-6"
          style={{
            borderColor: isDragging ? 'rgba(0,205,184,0.6)' : 'rgba(0,205,184,0.3)',
            background: isDragging ? 'rgba(0,205,184,0.05)' : 'transparent'
          }}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
          
          <svg 
            className="w-12 h-12 mx-auto mb-3"
            style={{ color: isDragging ? '#00CDB8' : 'rgba(255,255,255,0.5)' }}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          
          <p className="text-white font-medium mb-1">
            Drop images here or click to browse
          </p>
          <p className="text-muted text-sm">
            Supports: JPG, PNG, WebP (max 10MB each)
          </p>
        </div>

        {/* Preview grid */}
        {previews.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white font-medium mb-3">
              Selected ({previews.length} {previews.length === 1 ? 'photo' : 'photos'})
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-2 rounded-lg bg-white/5">
              {previews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                  <img 
                    src={preview.src} 
                    alt={preview.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Remove button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Album selection */}
        <div className="mb-6">
          <h3 className="text-white font-medium mb-3">Assign to Album</h3>
          
          {!isNewAlbum ? (
            <div className="relative">
              <select
                value={selectedAlbum}
                onChange={(e) => {
                  if (e.target.value === 'new') {
                    setIsNewAlbum(true);
                  } else {
                    setSelectedAlbum(e.target.value);
                  }
                }}
                className="w-full appearance-none px-4 py-3 pr-10 rounded-lg text-sm font-medium bg-white/5 border border-white/10 text-white focus:outline-none focus:border-teal/50 cursor-pointer hover:bg-white/[0.08] transition-colors"
              >
                <option value="" className="bg-bg">Select an album...</option>
                {albums.map(album => (
                  <option key={album.id} value={album.id} className="bg-bg">{album.name}</option>
                ))}
                <option value="new" className="bg-bg text-teal">+ Create New Album</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter new album name..."
                value={newAlbumName}
                onChange={(e) => setNewAlbumName(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-teal/50"
              />
              <button
                onClick={() => {
                  setIsNewAlbum(false);
                  setNewAlbumName('');
                }}
                className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Upload progress */}
        {isUploading && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white">Uploading...</span>
              <span className="text-teal">{uploadProgress}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div 
                className="h-full bg-teal transition-all duration-200 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isUploading}
            className="px-5 py-2.5 rounded-lg text-white hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || isUploading || (!selectedAlbum && !newAlbumName)}
            className="px-5 py-2.5 rounded-lg bg-teal text-bg font-medium hover:shadow-[0_0_20px_rgba(0,205,184,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
