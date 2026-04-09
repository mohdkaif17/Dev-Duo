import { useState } from 'react';

const getGradient = (index) => {
  const gradients = [
    'linear-gradient(135deg, #00CDB8 0%, #0A2540 100%)',
    'linear-gradient(135deg, #0A2540 0%, #00CDB8 100%)',
    'linear-gradient(135deg, #1a1a2e 0%, #00CDB8 50%, #0A2540 100%)',
  ];
  return gradients[index % gradients.length];
};

const sampleVideos = [
  {
    id: '1',
    title: 'DevFest 2024 Highlights',
    duration: '3:42',
    views: '1.2K',
    thumbnail: 0
  },
  {
    id: '2',
    title: 'Hackathon 2025 Recap',
    duration: '5:18',
    views: '856',
    thumbnail: 1
  },
  {
    id: '3',
    title: 'React Workshop Teaser',
    duration: '1:30',
    views: '2.1K',
    thumbnail: 2
  },
  {
    id: '4',
    title: 'Social Night Moments',
    duration: '4:05',
    views: '643',
    thumbnail: 0
  },
  {
    id: '5',
    title: 'Tech Talk: AI Future',
    duration: '45:20',
    views: '3.5K',
    thumbnail: 1
  },
  {
    id: '6',
    title: 'Orientation Day 2024',
    duration: '2:55',
    views: '1.8K',
    thumbnail: 2
  },
];

const VideoCard = ({ video, index, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative rounded-xl overflow-hidden cursor-pointer group"
      style={{
        background: getGradient(video.thumbnail),
        transform: isHovered ? 'scale(1.04)' : 'scale(1)',
        transition: 'transform 0.3s ease'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(video)}
    >
      {/* Thumbnail aspect ratio */}
      <div className="aspect-video relative">
        {/* Play button overlay */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: isHovered ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.2)',
            transition: 'background 0.3s ease'
          }}
        >
          <div 
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300"
            style={{
              boxShadow: isHovered ? '0 0 30px rgba(0,205,184,0.5)' : 'none',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            <svg 
              className="w-8 h-8 text-white ml-1" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-xs font-medium">
          {video.duration}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 bg-white/5">
        <h3 className="text-white font-medium text-sm mb-1 line-clamp-1">{video.title}</h3>
        <p className="text-muted text-xs">{video.views} views</p>
      </div>
    </div>
  );
};

const VideoModal = ({ video, isOpen, onClose }) => {
  if (!isOpen || !video) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Video container */}
      <div 
        className="w-full max-w-[800px] rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Video placeholder */}
        <div 
          className="aspect-video flex items-center justify-center"
          style={{ background: getGradient(video.thumbnail) }}
        >
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 mx-auto">
              <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="text-white text-lg font-medium">{video.title}</p>
            <p className="text-white/60 text-sm mt-2">Video player would load here</p>
          </div>
        </div>

        {/* Video info */}
        <div className="p-4 bg-bg2 border-t border-white/10">
          <h2 className="text-white font-bold text-lg">{video.title}</h2>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted">
            <span>{video.views} views</span>
            <span>•</span>
            <span>{video.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoReels = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <section className="section-spacing border-t border-white/[0.05]">
      <div className="section-container">
        {/* Section heading */}
        <div className="mb-8">
          <h2 className="text-[clamp(24px,3vw,36px)] font-bold">
            <span className="text-teal">EVENT</span>
            <span className="text-white"> REELS</span>
          </h2>
          <p className="text-muted mt-2">Relive our best moments in motion</p>
        </div>

        {/* Video grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sampleVideos.map((video, index) => (
            <VideoCard
              key={video.id}
              video={video}
              index={index}
              onClick={setSelectedVideo}
            />
          ))}
        </div>
      </div>

      {/* Video modal */}
      <VideoModal
        video={selectedVideo}
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </section>
  );
};

export default VideoReels;
