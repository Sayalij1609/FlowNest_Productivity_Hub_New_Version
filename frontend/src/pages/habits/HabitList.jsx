import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/client';
import toast from 'react-hot-toast';

export default function HabitList() {
  const [habits, setHabits] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchHabits = () => {
    API.get('/habits', { params: { search } }).then(r => setHabits(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchHabits(); }, [search]);

  const handleComplete = async (id) => {
    try { await API.post(`/habits/${id}/complete`); fetchHabits(); toast.success('Habit completed!'); }
    catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const handleUndo = async (id) => {
    try { await API.post(`/habits/${id}/undo`); fetchHabits(); toast.success('Completion removed'); }
    catch (err) { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this habit?')) return;
    try { await API.delete(`/habits/${id}`); setHabits(habits.filter(h => h.id !== id)); toast.success('Deleted!'); }
    catch (err) { toast.error('Failed'); }
  };

  return (
    <div className="page-wrapper with-sidebar">
      <div className="page-content">
        <div className="page-header fade-in"><h1>My Habits</h1><Link to="/habits/create" className="btn btn-primary">+ New Habit</Link></div>
        <div className="glass-card no-hover fade-in" style={{ marginBottom: 'var(--space-lg)', padding: 'var(--space-lg)' }}>
          <input type="text" className="form-control" placeholder="Search habits..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {loading ? <p>Loading...</p> : habits.length === 0 ? (
          <div className="glass-card no-hover fade-in" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}><p style={{ color: 'var(--text-secondary)' }}>No habits yet. Start building one!</p></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            {habits.map(habit => (
              <div key={habit.id} className="glass-card no-hover fade-in" style={{ padding: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{habit.habit_name}</h3>
                    {habit.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.25rem 0 0' }}>{habit.description}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                    {habit.completed_today ? (
                      <button className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleUndo(habit.id)}>↩ Undo</button>
                    ) : (
                      <button className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleComplete(habit.id)}>✓ Complete</button>
                    )}
                    <Link to={`/habits/${habit.id}/edit`} className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Edit</Link>
                    <button className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: 'var(--danger)' }} onClick={() => handleDelete(habit.id)}>🗑</button>
                  </div>
                </div>
                {/* Stats */}
                <div style={{ display: 'flex', gap: 'var(--space-lg)', marginBottom: 'var(--space-md)', flexWrap: 'wrap' }}>
                  <div><span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-mid)' }}>🔥 {habit.current_streak}</span><br /><small style={{ color: 'var(--text-muted)' }}>Current Streak</small></div>
                  <div><span style={{ fontSize: '1.5rem', fontWeight: 700 }}>🏆 {habit.longest_streak}</span><br /><small style={{ color: 'var(--text-muted)' }}>Best Streak</small></div>
                  <div><span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{habit.stats?.completion_rate || 0}%</span><br /><small style={{ color: 'var(--text-muted)' }}>Completion Rate</small></div>
                </div>
                {/* Weekly Progress */}
                <div style={{ display: 'flex', gap: 'var(--space-xs)', marginBottom: 'var(--space-md)' }}>
                  {habit.weekly?.map((day, i) => (
                    <div key={i} style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', margin: '0 auto 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', background: day.done ? 'var(--accent-start)' : day.is_future ? 'transparent' : 'var(--bg-tertiary)', color: day.done ? '#fff' : 'var(--text-muted)', border: day.is_today ? '2px solid var(--accent-mid)' : '1px solid var(--glass-border)' }}>
                        {day.done ? '✓' : ''}
                      </div>
                      <small style={{ fontSize: '0.65rem', color: day.is_today ? 'var(--accent-mid)' : 'var(--text-muted)' }}>{day.day}</small>
                    </div>
                  ))}
                </div>
                {/* Heatmap */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {habit.heatmap?.map((day, i) => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: day.done ? 'var(--accent-start)' : 'var(--bg-tertiary)', border: day.is_today ? '1px solid var(--accent-mid)' : 'none', opacity: day.done ? 1 : 0.4 }} title={day.date} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
