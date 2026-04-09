const HexGrid = () => {
  return (
    <div 
      className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.07]"
      style={{ width: '100%', height: '100%' }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern 
            id="hexagons" 
            width="60" 
            height="52" 
            patternUnits="userSpaceOnUse" 
            patternTransform="scale(1)"
          >
            {/* 
              Hexagon path for 60x52 cell 
              Points for a flat-topped hexagon:
              (15,0), (45,0), (60,26), (45,52), (15,52), (0,26)
            */}
            <path 
              d="M15 0 L45 0 L60 26 L45 52 L15 52 L0 26 Z" 
              fill="none" 
              stroke="#00CDB8" 
              strokeWidth="0.5" 
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagons)" />
      </svg>
    </div>
  );
};

export default HexGrid;
