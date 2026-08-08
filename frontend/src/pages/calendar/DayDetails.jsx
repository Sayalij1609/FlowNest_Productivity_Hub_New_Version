import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../api/client';

export default function DayDetails() {
  const { year, month, day } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/calendar/day/${year}/${month}/${day}`).then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false));
  }, [year, month, day]);

  if (loading) return <div className="page-wrapper with-sidebar"><div className="page-content"><p>Loading...</p></div></div>;
  if (!data) return null;

  return (
    <div className="page-wrapper with-sidebar">
      <div className="page-content">
        <div className="page-header fade-in">
          <h1>{new Date(data.selected_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h1>
          {data.is_today && <span className="badge badge-pending">Today</span>}
        </div>
        {/* Tasks */}
        <div className="glass-card no-hover fade-in" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-md)' }}>
          <h3>Tasks ({data.tasks.length})</h3>
          {data.tasks.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No tasks on this day</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {data.tasks.map(t => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-sm)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)' }}>
                  <Link to={`/tasks/${t.id}`} style={{ fontWeight: 500, color: 'var(--text-primary)', textDecoration: 'none' }}>{t.title}</Link>
                  <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                    <span className={`badge badge-${t.status.toLowerCase()}`}>{t.status}</span>
                    <span className={`badge badge-${t.priority.toLowerCase()}`}>{t.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Habit Logs */}
        <div className="glass-card no-hover fade-in" style={{ padding: 'var(--space-lg)' }}>
          <h3>Habits ({data.habit_logs.length})</h3>
          {data.habit_logs.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No habits completed on this day</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {data.habit_logs.map(log => (
                <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: 'var(--space-sm)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)' }}>
                  <span style={{ color: 'var(--success)' }}>✓</span>
                  <span>{log.habit_name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ marginTop: 'var(--space-lg)' }}>
          <Link to="/calendar" className="btn btn-outline">← Back to Calendar</Link>
        </div>
      </div>
    </div>
  );
}
