import { useEffect, useState, useCallback } from 'react';

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

const Lightbox = ({ photos, currentIndex, isOpen, albumName, onClose, onNavigate }) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const minSwipeDistance = 50;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'ArrowRight':
          handleNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, currentIndex, photos.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      onNavigate(currentIndex - 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [currentIndex, isTransitioning, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < photos.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      onNavigate(currentIndex + 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [currentIndex, photos.length, isTransitioning, onNavigate]);

  // Touch handlers for swipe
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  if (!isOpen || !photos[currentIndex]) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'rgba(0,0,0,0.94)',
        backdropFilter: 'blur(14px)'
      }}
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Top info bar */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
        <span className="text-white/80 font-medium">{currentPhoto.album?.name || albumName}</span>
        <span className="text-white/50 text-sm">
          {currentIndex + 1} / {photos.length}
        </span>
      </div>

      {/* Previous button */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 hover:shadow-[0_0_20px_rgba(0,205,184,0.3)] transition-all z-10"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Next button */}
      {currentIndex < photos.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 hover:shadow-[0_0_20px_rgba(0,205,184,0.3)] transition-all z-10"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Image container */}
      <div 
        className="relative max-w-[90vw] max-h-[85vh] rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-[80vw] h-[70vh] max-w-[1200px] max-h-[800px] transition-all duration-300"
          style={{
            background: getGradient(currentIndex),
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'scale(0.95)' : 'scale(1)'
          }}
        />
      </div>

      {/* Thumbnail strip */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto hide-scrollbar px-4">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={(e) => { e.stopPropagation(); onNavigate(index); }}
            className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all"
            style={{
              background: getGradient(index),
              border: `2px solid ${index === currentIndex ? '#00CDB8' : 'transparent'}`,
              opacity: index === currentIndex ? 1 : 0.5,
              transform: index === currentIndex ? 'scale(1.1)' : 'scale(1)'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Lightbox;
