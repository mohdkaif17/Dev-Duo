import { useEffect, useRef, useState, useMemo } from 'react';

const ActivityHeatmap = () => {
  const gridRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Generate sample activity data (52 weeks × 7 days) - memoized
  const { data: activityData, months } = useMemo(() => {
    const data = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();
    
    for (let week = 0; week < 52; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() - ((51 - week) * 7 + (6 - day)));
        
        // Random activity level 0-4
        const level = Math.floor(Math.random() * 5);
        
        weekData.push({
          date: date,
          level,
          count: level === 0 ? 0 : Math.floor(Math.random() * 8) + 1
        });
      }
      data.push(weekData);
    }
    
    return { data, months };
  }, []);

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getActivityColor = (level) => {
    const colors = {
      0: 'rgba(255,255,255,0.04)',
      1: 'rgba(0,205,184,0.2)',
      2: 'rgba(0,205,184,0.45)',
      3: 'rgba(0,205,184,0.7)',
      4: '#00CDB8'
    };
    return colors[level];
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getMonthLabelPositions = () => {
    const positions = [];
    let currentMonth = -1;
    
    activityData.forEach((week, weekIndex) => {
      const weekMonth = week[0].date.getMonth();
      if (weekMonth !== currentMonth) {
        currentMonth = weekMonth;
        positions.push({ month: months[weekMonth], index: weekIndex });
      }
    });
    
    return positions;
  };

  const monthLabels = getMonthLabelPositions();

  return (
    <section className="section-spacing border-t border-white/[0.05]">
      <div className="section-container">
        {/* Section Heading */}
        <h2 className="text-[clamp(24px,3vw,36px)] font-bold mb-8">
          <span className="text-teal">ACTIVITY</span>
          <span className="text-white"> HEATMAP</span>
        </h2>

        {/* Heatmap Container */}
        <div
          ref={gridRef}
          className="p-6 rounded-xl overflow-x-auto"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(0,205,184,0.1)'
          }}
        >
          {/* Month Labels */}
          <div className="flex mb-2 relative h-5" style={{ paddingLeft: '20px' }}>
            {monthLabels.map((label) => (
              <div
                key={`${label.month}-${label.index}`}
                className="absolute text-[11px] text-muted"
                style={{ 
                  left: `${label.index * 15 + 20}px`,
                  transform: 'translateX(-50%)'
                }}
              >
                {label.month}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-[3px]" style={{ paddingTop: '8px' }}>
            {activityData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.map((day, dayIndex) => {
                  const cellIndex = weekIndex * 7 + dayIndex;
                  const delay = cellIndex * 2; // 2ms stagger

                  return (
                    <div
                      key={dayIndex}
                      className="w-3 h-3 rounded-[2px] relative cursor-pointer"
                      style={{
                        background: getActivityColor(day.level),
                        opacity: isVisible ? 1 : 0,
                        transition: `opacity 0.3s ease ${delay}ms, transform 0.2s ease`,
                        transform: isVisible ? 'scale(1)' : 'scale(0.8)'
                      }}
                      onMouseEnter={(e) => {
                        setHoveredCell(day);
                        const rect = e.target.getBoundingClientRect();
                        setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 10 });
                      }}
                      onMouseLeave={() => setHoveredCell(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 text-xs text-muted">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="w-3 h-3 rounded-[2px]"
                style={{ background: getActivityColor(level) }}
              />
            ))}
            <span>More</span>
          </div>
        </div>

        {/* Tooltip */}
        {hoveredCell && (
          <div
            className="fixed z-50 px-3 py-2 rounded-lg text-xs pointer-events-none"
            style={{
              background: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              left: tooltipPos.x,
              top: tooltipPos.y,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="text-white font-medium">
              {hoveredCell.count} {hoveredCell.count === 1 ? 'activity' : 'activities'}
            </div>
            <div className="text-muted">{formatDate(hoveredCell.date)}</div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ActivityHeatmap;
