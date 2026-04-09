import { useEffect, useRef, useState } from 'react';

const StatCard = ({ icon, label, value, trend }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div 
      className="p-5 rounded-xl"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(0,205,184,0.1)'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-teal text-2xl">{icon}</div>
        <span className={`text-xs ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </span>
      </div>
      <div className="text-3xl font-bold text-teal mb-1">{displayValue.toLocaleString()}</div>
      <div className="text-sm text-muted">{label}</div>
    </div>
  );
};

const AdminDashboard = () => {
  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);

  const stats = [
    { icon: '👥', label: 'Total Users', value: 245, trend: 12 },
    { icon: '📅', label: 'Active Events', value: 8, trend: 5 },
    { icon: '🎯', label: 'Open Challenges', value: 5, trend: -2 },
    { icon: '📝', label: 'Total Submissions', value: 156, trend: 24 },
    { icon: '🚀', label: 'Projects', value: 42, trend: 8 },
    { icon: '🖼️', label: 'Gallery Photos', value: 387, trend: 15 },
  ];

  useEffect(() => {
    const loadChartJS = () => {
      return new Promise((resolve) => {
        if (window.Chart) {
          resolve(window.Chart);
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => resolve(window.Chart);
        document.body.appendChild(script);
      });
    };

    const initCharts = async () => {
      const Chart = await loadChartJS();
      if (!Chart || !barChartRef.current || !lineChartRef.current) return;

      // Bar Chart - Signups per month
      const barCtx = barChartRef.current.getContext('2d');
      new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Signups',
            data: [28, 35, 42, 38, 52, 48],
            backgroundColor: '#00CDB8',
            borderRadius: 4,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              grid: { color: 'rgba(0,205,184,0.1)' },
              ticks: { color: '#8A8A9A' }
            },
            y: {
              grid: { color: 'rgba(0,205,184,0.1)' },
              ticks: { color: '#8A8A9A' }
            }
          }
        }
      });

      // Line Chart - Event Registrations
      const lineCtx = lineChartRef.current.getContext('2d');
      const gradient = lineCtx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, 'rgba(0, 205, 184, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 205, 184, 0.05)');

      new Chart(lineCtx, {
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
          datasets: [{
            label: 'Registrations',
            data: [45, 62, 58, 78, 95, 112],
            borderColor: '#00CDB8',
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#00CDB8',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              grid: { color: 'rgba(0,205,184,0.1)' },
              ticks: { color: '#8A8A9A' }
            },
            y: {
              grid: { color: 'rgba(0,205,184,0.1)' },
              ticks: { color: '#8A8A9A' }
            }
          }
        }
      });
    };

    initCharts();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div 
          className="p-6 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(0,205,184,0.1)'
          }}
        >
          <h3 className="text-white font-semibold mb-4">Signups per Month</h3>
          <div className="h-64">
            <canvas ref={barChartRef}></canvas>
          </div>
        </div>

        <div 
          className="p-6 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(0,205,184,0.1)'
          }}
        >
          <h3 className="text-white font-semibold mb-4">Event Registrations</h3>
          <div className="h-64">
            <canvas ref={lineChartRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
