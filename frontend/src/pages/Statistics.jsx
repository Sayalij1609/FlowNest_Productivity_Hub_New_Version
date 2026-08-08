import { useState, useEffect } from 'react';
import API from '../api/client';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/statistics').then(r => setStats(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-wrapper with-sidebar"><div className="page-content"><p>Loading...</p></div></div>;
  if (!stats) return null;

  const chartBg = 'rgba(99, 102, 241, 0.6)';
  const chartBorder = 'rgba(99, 102, 241, 1)';

  return (
    <div className="page-wrapper with-sidebar">
      <div className="page-content">
        <div className="page-header fade-in"><h1>Statistics</h1></div>

        {/* Summary */}
        <div className="stats-grid" style={{ marginBottom: 'var(--space-xl)' }}>
          <div className="glass-card stat-card fade-in">
            <div className="stat-label">Total Tasks</div>
            <div className="stat-value">{stats.total_tasks}</div>
          </div>
          <div className="glass-card stat-card fade-in">
            <div className="stat-label">Completed</div>
            <div className="stat-value" style={{ color: 'var(--success)' }}>{stats.completed_tasks}</div>
          </div>
          <div className="glass-card stat-card fade-in">
            <div className="stat-label">Pending</div>
            <div className="stat-value" style={{ color: 'var(--warning)' }}>{stats.pending_tasks}</div>
          </div>
          <div className="glass-card stat-card fade-in">
            <div className="stat-label">Habits</div>
            <div className="stat-value">{stats.total_habits}</div>
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-lg)' }}>
          {/* Weekly */}
          <div className="glass-card no-hover fade-in" style={{ padding: 'var(--space-lg)' }}>
            <h3 style={{ marginBottom: 'var(--space-md)' }}>Weekly Productivity</h3>
            <Bar data={{ labels: stats.week_labels, datasets: [{ label: 'Completed Tasks', data: stats.week_data, backgroundColor: chartBg, borderColor: chartBorder, borderWidth: 1, borderRadius: 6 }] }}
              options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1, color: 'var(--text-muted)' }, grid: { color: 'rgba(255,255,255,0.06)' } }, x: { ticks: { color: 'var(--text-muted)' }, grid: { display: false } } } }} />
          </div>
          {/* Monthly */}
          <div className="glass-card no-hover fade-in" style={{ padding: 'var(--space-lg)' }}>
            <h3 style={{ marginBottom: 'var(--space-md)' }}>Monthly Productivity</h3>
            <Line data={{ labels: stats.month_labels, datasets: [{ label: 'Completed Tasks', data: stats.month_data, borderColor: chartBorder, backgroundColor: 'rgba(99,102,241,0.1)', tension: 0.4, fill: true, pointRadius: 4, pointBackgroundColor: chartBorder }] }}
              options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1, color: 'var(--text-muted)' }, grid: { color: 'rgba(255,255,255,0.06)' } }, x: { ticks: { color: 'var(--text-muted)' }, grid: { display: false } } } }} />
          </div>
          {/* Category Distribution */}
          {stats.category_labels.length > 0 && (
            <div className="glass-card no-hover fade-in" style={{ padding: 'var(--space-lg)' }}>
              <h3 style={{ marginBottom: 'var(--space-md)' }}>Category Distribution</h3>
              <div style={{ maxWidth: 300, margin: '0 auto' }}>
                <Doughnut data={{ labels: stats.category_labels, datasets: [{ data: stats.category_values, backgroundColor: ['#6366f1', '#06b6d4', '#22c55e', '#f59e0b', '#ec4899', '#a855f7', '#ef4444'], borderWidth: 0 }] }}
                  options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { color: 'var(--text-primary)', padding: 12 } } } }} />
              </div>
            </div>
          )}
          {/* Habit Completion Rates */}
          {stats.habit_labels.length > 0 && (
            <div className="glass-card no-hover fade-in" style={{ padding: 'var(--space-lg)' }}>
              <h3 style={{ marginBottom: 'var(--space-md)' }}>Habit Completion Rates</h3>
              <Bar data={{ labels: stats.habit_labels, datasets: [{ label: 'Completion %', data: stats.habit_rates, backgroundColor: 'rgba(34,197,94,0.6)', borderColor: 'rgba(34,197,94,1)', borderWidth: 1, borderRadius: 6 }] }}
                options={{ responsive: true, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, max: 100, ticks: { color: 'var(--text-muted)' }, grid: { color: 'rgba(255,255,255,0.06)' } }, y: { ticks: { color: 'var(--text-muted)' }, grid: { display: false } } } }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
