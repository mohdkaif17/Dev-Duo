import { useEffect, useRef, useState } from 'react';

const PersonalAnalytics = ({ userStats }) => {
  const lineChartRef = useRef(null);
  const donutChartRef = useRef(null);
  const lineChartInstance = useRef(null);
  const donutChartInstance = useRef(null);
  const [chartsReady, setChartsReady] = useState(false);

  // Sample data for charts
  const scoreData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [1200, 1850, 2400, 3200, 4100, 5200]
  };

  const participationData = {
    events: 12,
    challenges: 8,
    projects: 5,
    total: 25
  };

  const activityPercentage = Math.round((participationData.total / 30) * 100);

  useEffect(() => {
    let mounted = true;

    const loadChartJS = () => {
      return new Promise((resolve) => {
        if (window.Chart) {
          resolve(window.Chart);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.async = true;
        script.onload = () => resolve(window.Chart);
        script.onerror = () => resolve(null);
        document.body.appendChild(script);
      });
    };

    const initCharts = async () => {
      try {
        const Chart = await loadChartJS();
        if (!Chart || !mounted) return;

        // Wait for DOM to be ready
        setTimeout(() => {
          if (!lineChartRef.current || !donutChartRef.current || !mounted) return;

          // Destroy existing charts
          if (lineChartInstance.current) {
            lineChartInstance.current.destroy();
          }
          if (donutChartInstance.current) {
            donutChartInstance.current.destroy();
          }

          // Line Chart - Score Over Time
          const lineCtx = lineChartRef.current.getContext('2d');
          if (lineCtx) {
            const lineGradient = lineCtx.createLinearGradient(0, 0, 0, 300);
            lineGradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
            lineGradient.addColorStop(1, 'rgba(0, 205, 184, 0.1)');

            lineChartInstance.current = new Chart(lineCtx, {
              type: 'line',
              data: {
                labels: scoreData.labels,
                datasets: [{
                  label: 'XP',
                  data: scoreData.data,
                  borderColor: '#00CDB8',
                  backgroundColor: lineGradient,
                  fill: true,
                  tension: 0.4,
                  pointBackgroundColor: '#00CDB8',
                  pointBorderColor: '#fff',
                  pointBorderWidth: 2,
                  pointRadius: 4,
                  pointHoverRadius: 6
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#8A8A9A', font: { size: 11 } }
                  },
                  y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#8A8A9A', font: { size: 11 } }
                  }
                }
              }
            });
          }

          // Donut Chart - Participation
          const donutCtx = donutChartRef.current.getContext('2d');
          if (donutCtx) {
            donutChartInstance.current = new Chart(donutCtx, {
              type: 'doughnut',
              data: {
                labels: ['Events', 'Challenges', 'Projects'],
                datasets: [{
                  data: [participationData.events, participationData.challenges, participationData.projects],
                  backgroundColor: ['#00CDB8', '#8B5CF6', '#3B82F6'],
                  borderWidth: 0,
                  hoverOffset: 4
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { color: '#8A8A9A', font: { size: 11 }, padding: 15 }
                  }
                }
              }
            });
          }

          setChartsReady(true);
        }, 100);
      } catch (error) {
        console.error('Chart initialization error:', error);
      }
    };

    initCharts();

    return () => {
      mounted = false;
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy();
      }
      if (donutChartInstance.current) {
        donutChartInstance.current.destroy();
      }
    };
  }, []);

  const statCards = [
    { label: 'Total XP', value: userStats?.xp?.toLocaleString() || '5,200', icon: '⚡' },
    { label: 'Global Rank', value: `#${userStats?.rank || '42'}`, icon: '🏆' },
    { label: 'Challenges', value: userStats?.challenges || '12', icon: '🎯' },
    { label: 'Events', value: userStats?.events || '8', icon: '📅' }
  ];

  return (
    <section className="section-spacing border-t border-white/[0.05]">
      <div className="section-container">
        {/* Section Heading */}
        <h2 className="text-[clamp(24px,3vw,36px)] font-bold mb-8">
          <span className="text-teal">YOUR</span>
          <span className="text-white"> STATS</span>
        </h2>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="p-5 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(0,205,184,0.1)'
              }}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-teal mb-1">{stat.value}</div>
              <div className="text-sm text-muted">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div
            className="p-6 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(0,205,184,0.1)'
            }}
          >
            <h3 className="text-white font-semibold mb-4">Score Over Time</h3>
            <div className="h-64">
              <canvas ref={lineChartRef}></canvas>
            </div>
          </div>

          {/* Donut Chart */}
          <div
            className="p-6 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(0,205,184,0.1)'
            }}
          >
            <h3 className="text-white font-semibold mb-4">Participation Breakdown</h3>
            <div className="h-64 relative">
              <canvas ref={donutChartRef}></canvas>
              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{activityPercentage}%</div>
                  <div className="text-xs text-muted">Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalAnalytics;
