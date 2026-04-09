import { useState, useEffect, useRef, useCallback } from 'react';

// Generate gradient placeholders for demo
const getGradient = (index) => {
  const gradients = [
    'linear-gradient(135deg, #00CDB8 0%, #0A2540 100%)',
    'linear-gradient(135deg, #0A2540 0%, #00CDB8 100%)',
    'linear-gradient(135deg, #1a1a2e 0%, #00CDB8 50%, #0A2540 100%)',
    'linear-gradient(45deg, #0A2540 0%, #00CDB8 100%)',
    'linear-gradient(225deg, #00CDB8 0%, #1a1a2e 100%)',
    'linear-gradient(180deg, #0A2540 0%, #1a1a2e 100%)',
  ];
  return gradients[index % gradients.length];
};

// Sample photos data
const generatePhotos = () => {
  const albums = [
    { name: 'DevFest 2024', date: 'Dec 2024' },
    { name: 'Hackathon 2025', date: 'Jan 2025' },
    { name: 'Workshop: React', date: 'Nov 2024' },
    { name: 'Social Night 2024', date: 'Oct 2024' },
    { name: 'Tech Talk 2025', date: 'Feb 2025' },
  ];
  
  return Array.from({ length: 30 }, (_, i) => ({
    id: `photo-${i}`,
    album: albums[i % albums.length],
    gradient: getGradient(i),
    height: [200, 280, 220, 320, 260, 240, 300, 180][i % 8],
  }));
};

// Shimmer placeholder component
const ShimmerPlaceholder = () => (
  <div 
    className="absolute inset-0 overflow-hidden rounded-[10px]"
    style={{
      background: 'linear-gradient(90deg, #0E0E1A 0%, #161625 50%, #0E0E1A 100%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite'
    }}
  />
);

// Individual photo tile
const PhotoTile = ({ photo, index, isAdmin, isSelected, onSelect, onClick, onDelete, isDeleteConfirm, setDeleteConfirm }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const tileRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (tileRef.current) {
      observer.observe(tileRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={tileRef}
      className="relative rounded-[10px] overflow-hidden break-inside-avoid mb-2.5 cursor-zoom-in group"
      style={{ height: `${photo.height || 260}px` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Delete Confirmation Chip */}
      {isDeleteConfirm && (
        <div className="absolute inset-0 z-30 bg-bg/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <p className="text-white font-medium mb-3 text-sm text-center">Delete this photo?</p>
          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setDeleteConfirm(null); }}
              className="px-3 py-1.5 rounded-lg border border-white/20 text-white text-xs hover:bg-white/5 transition-colors"
            >
              No
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(photo.id); }}
              className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs hover:bg-red-600 transition-colors"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      )}

      {/* Shimmer placeholder */}
      {!isLoaded && <ShimmerPlaceholder />}

      {/* Actual image */}
      {isVisible && photo.src && (
        <img
          src={photo.src}
          alt={photo.album}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isHovered ? 'scale(1.025)' : 'scale(1)',
          }}
          onLoad={() => setIsLoaded(true)}
        />
      )}

      {/* Fallback gradient if no image */}
      {!photo.src && (
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{
            background: photo.gradient || getGradient(index),
            opacity: isLoaded ? 1 : 0,
          }}
        />
      )}

      {/* Hover overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-3 transition-opacity duration-200"
        style={{
          background: 'rgba(0,205,184,0.08)',
          opacity: isHovered ? 1 : 0
        }}
      >
        <p className="text-[11px] text-[#8A8A9A] font-medium">{photo.album}</p>
        <p className="text-[10px] text-[#8A8A9A]/70">{photo.date}</p>
      </div>

      {/* Teal glow border on hover */}
      <div
        className="absolute inset-0 rounded-[10px] pointer-events-none transition-shadow duration-300"
        style={{
          boxShadow: isHovered ? '0 0 0 1.5px rgba(0,205,184,0.5)' : 'none'
        }}
      />

      {/* Admin checkbox */}
      {isAdmin && (
        <div 
          className="absolute top-2 left-2 transition-opacity duration-200"
          style={{ opacity: isHovered || isSelected ? 1 : 0 }}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => { e.stopPropagation(); onSelect(photo.id); }}
            className="w-4 h-4 rounded border-white/30 bg-black/50 text-teal focus:ring-teal cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Admin delete button */}
      {isAdmin && !isDeleteConfirm && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(photo.id); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 z-20"
          style={{ opacity: isHovered ? 1 : 0 }}
          title="Delete Photo"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Click handler */}
      <div className="absolute inset-0" onClick={() => onClick(index)} />
    </div>
  );
};

const PhotoGrid = ({ photos, activeAlbum, isAdmin, selectedPhotos, onSelectPhoto, onDeletePhoto, onPhotoClick, deleteConfirm, setDeleteConfirm }) => {
  // Filter photos by album
  const filteredPhotos = activeAlbum === 'all' 
    ? photos 
    : photos.filter(p => p.album === activeAlbum);

  const handleDelete = useCallback((id) => {
    onDeletePhoto?.(id);
  }, [onDeletePhoto]);

  return (
    <>
      {/* CSS for shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* Masonry Grid */}
      <div 
        className="columns-2 md:columns-3 xl:columns-4"
        style={{ columnGap: '10px' }}
      >
        {filteredPhotos.map((photo, index) => (
          <PhotoTile
            key={photo.id}
            photo={photo}
            index={index}
            isAdmin={isAdmin}
            isSelected={selectedPhotos?.includes(photo.id)}
            onSelect={onSelectPhoto}
            onClick={onPhotoClick}
            onDelete={handleDelete}
            isDeleteConfirm={deleteConfirm === photo.id}
            setDeleteConfirm={setDeleteConfirm}
          />
        ))}
      </div>
    </>
  );
};

export default PhotoGrid;
