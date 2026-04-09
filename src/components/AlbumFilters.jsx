const albums = [
  { id: 'all', name: 'All Albums', count: 500 },
  { id: 'devfest-2024', name: 'DevFest 2024', count: 87 },
  { id: 'hackathon-2025', name: 'Hackathon 2025', count: 124 },
  { id: 'react-workshop', name: 'Workshop: React', count: 45 },
  { id: 'social-night-2024', name: 'Social Night 2024', count: 62 },
  { id: 'tech-talk-2025', name: 'Tech Talk 2025', count: 38 },
  { id: 'orientation-2024', name: 'Orientation 2024', count: 56 },
  { id: 'project-expo', name: 'Project Expo', count: 73 },
];

const AlbumFilters = ({ activeAlbum, onAlbumChange }) => {
  return (
    <section className="border-b border-white/[0.05] bg-bg/80 backdrop-blur-xl sticky top-[72px] z-40">
      <div className="section-container py-4">
        {/* Horizontal scrollable pills */}
        <div 
          className="flex gap-3 overflow-x-auto hide-scrollbar pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {albums.map((album) => {
            const isActive = activeAlbum === album.id;
            return (
              <button
                key={album.id}
                onClick={() => onAlbumChange(album.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0"
                style={{
                  background: isActive ? 'rgba(0, 205, 184, 0.2)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isActive ? 'rgba(0, 205, 184, 0.6)' : 'rgba(255,255,255,0.1)'}`,
                  color: isActive ? '#00CDB8' : 'rgba(255,255,255,0.7)'
                }}
              >
                <span>{album.name}</span>
                <span 
                  className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{
                    background: isActive ? 'rgba(0, 205, 184, 0.25)' : 'rgba(255,255,255,0.1)',
                    color: isActive ? '#00CDB8' : 'rgba(255,255,255,0.5)'
                  }}
                >
                  {album.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AlbumFilters;
