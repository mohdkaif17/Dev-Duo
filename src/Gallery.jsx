import { useState, useEffect, useMemo } from 'react';
import { getPhotos, savePhotos } from './utils/storage';
import { logAdminAction, AuditActions } from './utils/auditLog';
import { useAuth } from './context/AuthContext';
import GalleryStats from './components/GalleryStats';
import AlbumFilters from './components/AlbumFilters';
import PhotoGrid from './components/PhotoGrid';
import Lightbox from './components/Lightbox';
import VideoReels from './components/VideoReels';
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

// Upload Modal Component
const UploadModal = ({ isOpen, onClose, onUpload, photos }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [album, setAlbum] = useState('');
  const [newAlbumName, setNewAlbumName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Get unique albums from existing photos
  const existingAlbums = useMemo(() => {
    const albums = [...new Set(photos.map(p => p.album))];
    return albums.filter(Boolean).sort();
  }, [photos]);

  useEffect(() => {
    if (!isOpen) {
      setFiles([]);
      setPreviews([]);
      setAlbum('');
      setNewAlbumName('');
    }
  }, [isOpen]);

  const handleFileSelect = (selectedFiles) => {
    const validFiles = Array.from(selectedFiles).filter(file => file.type.startsWith('image/'));
    
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, { name: file.name, dataUrl: e.target.result }]);
      };
      reader.readAsDataURL(file);
    });
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    const targetAlbum = album === '__new__' ? newAlbumName.trim() : album;
    if (!targetAlbum || files.length === 0) return;

    const today = new Date().toISOString().split('T')[0];
    const newPhotos = previews.map((preview, i) => ({
      id: crypto.randomUUID(),
      src: preview.dataUrl,
      album: targetAlbum,
      date: today,
      height: [260, 300, 220, 280, 320][i % 5]
    }));

    onUpload(newPhotos, targetAlbum);
    onClose();
  };

  const isValid = files.length > 0 && (album !== '__new__' ? album : newAlbumName.trim());

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-[150] backdrop-blur-sm" onClick={onClose} />
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[160] rounded-xl p-6 max-h-[90vh] overflow-y-auto"
        style={{
          background: 'linear-gradient(180deg, #0E0E1A 0%, #080810 100%)',
          border: '1px solid rgba(0,205,184,0.2)'
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Upload Photos</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors mb-6 ${
            isDragging 
              ? 'border-teal bg-teal/5' 
              : 'border-white/20 hover:border-teal/50'
          }`}
        >
          <svg className="w-12 h-12 text-muted mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-white font-medium mb-1">Drag & drop photos here</p>
          <p className="text-muted text-sm mb-3">or click to browse</p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white text-sm hover:bg-white/10 transition-colors cursor-pointer inline-block"
          >
            Select Files
          </label>
        </div>

        {/* Preview Thumbnails */}
        {previews.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-muted mb-3">{previews.length} file(s) selected</p>
            <div className="grid grid-cols-4 gap-2">
              {previews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                  <img src={preview.dataUrl} alt={preview.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Album Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-muted mb-2">Album</label>
          <select
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-teal focus:outline-none transition-colors mb-3"
          >
            <option value="">Select an album</option>
            {existingAlbums.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
            <option value="__new__">+ Create New Album</option>
          </select>

          {album === '__new__' && (
            <input
              type="text"
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
              placeholder="Enter new album name"
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-teal focus:outline-none transition-colors"
              autoFocus
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!isValid}
            className="flex-1 px-4 py-2.5 rounded-lg bg-teal text-bg font-bold hover:shadow-[0_0_20px_rgba(0,205,184,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload {files.length > 0 && `(${files.length})`}
          </button>
        </div>
      </div>
    </>
  );
};

const Gallery = () => {
  const { user, isAdmin } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [activeAlbum, setActiveAlbum] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [toast, setToast] = useState({ message: '', visible: false });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Load photos from localStorage
  useEffect(() => {
    const storedPhotos = getPhotos();
    setPhotos(storedPhotos);
  }, []);

  const showToastMessage = (message) => {
    setToast({ message, visible: true });
  };

  const hideToast = () => setToast({ message: '', visible: false });

  // Filter photos by album
  const filteredPhotos = useMemo(() => {
    if (activeAlbum === 'all') return photos;
    return photos.filter(p => p.album === activeAlbum);
  }, [photos, activeAlbum]);

  const handlePhotoSelect = (id) => {
    setSelectedPhotos(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const handleDeletePhoto = (id) => {
    if (deleteConfirm === id) {
      const photo = photos.find(p => p.id === id);
      const updatedPhotos = photos.filter(p => p.id !== id);
      savePhotos(updatedPhotos);
      setPhotos(updatedPhotos);
      setSelectedPhotos(prev => prev.filter(p => p !== id));
      setDeleteConfirm(null);
      showToastMessage('Photo deleted');
      
      // Log admin action
      if (photo) {
        logAdminAction(user, AuditActions.DELETE_PHOTO, photo.album);
      }
    } else {
      setDeleteConfirm(id);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedPhotos.length} selected photos?`)) {
      const updatedPhotos = photos.filter(p => !selectedPhotos.includes(p.id));
      savePhotos(updatedPhotos);
      setPhotos(updatedPhotos);
      setSelectedPhotos([]);
      showToastMessage(`${selectedPhotos.length} photos deleted`);
      
      // Log admin action
      logAdminAction(user, AuditActions.BULK_UPLOAD, `Deleted ${selectedPhotos.length} photos`);
    }
  };

  const handleUpload = (newPhotos, albumName) => {
    const updatedPhotos = [...photos, ...newPhotos];
    savePhotos(updatedPhotos);
    setPhotos(updatedPhotos);
    showToastMessage(`${newPhotos.length} photo(s) uploaded to ${albumName}`);
    
    // Log admin action
    logAdminAction(user, AuditActions.BULK_UPLOAD, `${newPhotos.length} photos to ${albumName}`);
  };

  // Open lightbox with the correct index in filtered photos
  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  // Navigate in lightbox
  const handleLightboxNavigate = (newIndex) => {
    setLightboxIndex(newIndex);
  };

  return (
    <div className="page-content min-h-screen bg-bg">
      {/* Hero Stats */}
      <GalleryStats photos={photos} />

      {/* Album Filters */}
      <AlbumFilters 
        activeAlbum={activeAlbum} 
        onAlbumChange={setActiveAlbum}
        albums={[...new Set(photos.map(p => p.album))].filter(Boolean)}
      />

      {/* Bulk Delete Bar */}
      {isAdmin() && selectedPhotos.length > 0 && (
        <div className="sticky top-[132px] z-30 bg-bg/95 backdrop-blur-md border-b border-white/10 py-3">
          <div className="section-container flex items-center justify-between">
            <span className="text-white text-sm">
              <span className="text-teal font-bold">{selectedPhotos.length}</span> photos selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPhotos([])}
                className="px-4 py-2 rounded-lg text-sm text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 rounded-lg text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin FAB */}
      {isAdmin() && (
        <button
          onClick={() => setShowUploadModal(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-teal text-bg rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,205,184,0.4)] hover:scale-110 transition-all duration-300 z-50"
          title="Upload Photos"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {/* Photo Grid */}
      <section className="section-spacing">
        <div className="section-container">
          <PhotoGrid
            photos={filteredPhotos}
            activeAlbum={activeAlbum}
            isAdmin={isAdmin()}
            selectedPhotos={selectedPhotos}
            onSelectPhoto={handlePhotoSelect}
            onDeletePhoto={handleDeletePhoto}
            onPhotoClick={openLightbox}
            deleteConfirm={deleteConfirm}
            setDeleteConfirm={setDeleteConfirm}
          />

          {/* Empty State */}
          {filteredPhotos.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted text-xl">No photos in this album yet.</p>
              {isAdmin() && (
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="mt-4 px-6 py-2 bg-teal text-bg font-medium rounded-lg hover:shadow-[0_0_20px_rgba(0,205,184,0.4)] transition-all"
                >
                  Upload Photos
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Video Reels Section */}
      <VideoReels />

      {/* Lightbox */}
      <Lightbox
        photos={filteredPhotos}
        currentIndex={lightboxIndex || 0}
        isOpen={lightboxIndex !== null}
        albumName={activeAlbum === 'all' ? 'All Albums' : activeAlbum}
        onClose={() => setLightboxIndex(null)}
        onNavigate={handleLightboxNavigate}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
        photos={photos}
      />

      {/* Toast */}
      <Toast message={toast.message} visible={toast.visible} onClose={hideToast} />

      <AdminModeChip />
    </div>
  );
};

export default Gallery;
