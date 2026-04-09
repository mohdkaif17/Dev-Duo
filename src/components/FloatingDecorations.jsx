const FloatingDecorations = () => {
  const leftTriangles = [
    { size: 24, x: 20, y: 15, rot: 15 },
    { size: 12, x: 45, y: 35, rot: -10 },
    { size: 16, x: 10, y: 60, rot: 45 },
    { size: 8, x: 55, y: 70, rot: 25 },
    { size: 20, x: 30, y: 85, rot: -20 },
  ];

  const rightTriangles = [
    { size: 20, x: 30, y: 10, rot: -15 },
    { size: 14, x: 10, y: 40, rot: 30 },
    { size: 24, x: 50, y: 25, rot: 10 },
    { size: 10, x: 65, y: 60, rot: -5 },
    { size: 18, x: 40, y: 80, rot: 50 },
    { size: 12, x: 15, y: 90, rot: -30 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-70">
      {/* Left Decoration - mid-page */}
      <div 
        className="absolute left-4 top-[50%] w-32 h-44 -translate-y-1/2"
        style={{ animation: 'float 4s ease-in-out infinite alternate' }}
      >
        {leftTriangles.map((t, i) => (
          <svg 
            key={i} 
            width={t.size} 
            height={t.size} 
            viewBox="0 0 24 24" 
            className="absolute fill-teal"
            style={{ 
              left: `${t.x}%`, 
              top: `${t.y}%`, 
              transform: `rotate(${t.rot}deg)` 
            }}
          >
            <path d="M12 2L2 22H22L12 2Z" />
          </svg>
        ))}
      </div>

      {/* Right Decoration - upper-page */}
      <div 
        className="absolute right-4 top-[15%] w-32 h-44"
        style={{ animation: 'float 4s ease-in-out infinite alternate-reverse' }}
      >
        {rightTriangles.map((t, i) => (
          <svg 
            key={i} 
            width={t.size} 
            height={t.size} 
            viewBox="0 0 24 24" 
            className="absolute fill-teal"
            style={{ 
              left: `${t.x}%`, 
              top: `${t.y}%`, 
              transform: `rotate(${t.rot}deg)` 
            }}
          >
            <path d="M12 2L2 22H22L12 2Z" />
          </svg>
        ))}
      </div>
    </div>
  );
};

export default FloatingDecorations;
