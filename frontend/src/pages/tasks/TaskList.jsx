import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../../api/client';
import toast from 'react-hot-toast';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const filter = searchParams.get('filter') || '';
  const category = searchParams.get('category') || '';
  const priority = searchParams.get('priority') || '';

  useEffect(() => {
    Promise.all([
      API.get('/tasks', { params: { search, filter, category, priority } }),
      API.get('/categories')
    ]).then(([tasksRes, catsRes]) => {
      setTasks(tasksRes.data);
      setCategories(catsRes.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, [search, filter, category, priority]);

  const handleComplete = async (id) => {
    try {
      await API.patch(`/tasks/${id}/complete`);
      setTasks(tasks.map(t => t.id === id ? { ...t, status: 'Completed' } : t));
      toast.success('Task completed!');
    } catch (err) { toast.error('Failed to complete task'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
      toast.success('Task deleted!');
    } catch (err) { toast.error('Failed to delete task'); }
  };

  const handleArchive = async (id) => {
    try {
      await API.patch(`/tasks/${id}/archive`);
      setTasks(tasks.filter(t => t.id !== id));
      toast.success('Task archived!');
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to archive'); }
  };

  const filters = [
    { key: '', label: 'All' },
    { key: 'today', label: "Today's" },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'overdue', label: 'Overdue' },
    { key: 'high', label: 'High Priority' },
    { key: 'pending', label: 'Pending' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <div className="page-wrapper with-sidebar">
      <div className="page-content">
        <div className="page-header fade-in">
          <h1>My Tasks</h1>
          <Link to="/tasks/create" className="btn btn-primary">+ New Task</Link>
        </div>

        {/* Search & Filters */}
        <div className="glass-card no-hover fade-in" style={{ marginBottom: 'var(--space-lg)', padding: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text" className="form-control" placeholder="Search tasks..."
              value={search} onChange={(e) => { const p = new URLSearchParams(searchParams); p.set('search', e.target.value); setSearchParams(p); }}
              style={{ flex: '1', minWidth: '200px' }}
            />
            <select className="form-control" value={category} onChange={(e) => { const p = new URLSearchParams(searchParams); p.set('category', e.target.value); setSearchParams(p); }} style={{ width: 'auto' }}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select className="form-control" value={priority} onChange={(e) => { const p = new URLSearchParams(searchParams); p.set('priority', e.target.value); setSearchParams(p); }} style={{ width: 'auto' }}>
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)', flexWrap: 'wrap' }}>
            {filters.map(f => (
              <button key={f.key} className={`btn ${filter === f.key ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                onClick={() => { const p = new URLSearchParams(searchParams); p.set('filter', f.key); setSearchParams(p); }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        {loading ? <p>Loading...</p> : tasks.length === 0 ? (
          <div className="glass-card no-hover fade-in" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No tasks found. Create your first task!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {tasks.map(task => (
              <div key={task.id} className="glass-card no-hover fade-in" style={{ padding: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-xs)' }}>
                      <span className={`priority-indicator priority-indicator-${task.priority.toLowerCase()}`}></span>
                      <Link to={`/tasks/${task.id}`} style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)', textDecoration: 'none' }}>{task.title}</Link>
                    </div>
                    {task.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.25rem 0' }}>{task.description.substring(0, 100)}{task.description.length > 100 ? '...' : ''}</p>}
                    <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)', flexWrap: 'wrap' }}>
                      <span className={`badge badge-${task.status.toLowerCase()}`}>{task.status}</span>
                      <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
                      {task.category_name && <span className="badge" style={{ background: task.category_color + '22', color: task.category_color, border: `1px solid ${task.category_color}44` }}>{task.category_name}</span>}
                      {task.deadline && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📅 {new Date(task.deadline).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-xs)', flexShrink: 0 }}>
                    {task.status === 'Pending' && <button className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleComplete(task.id)}>✓ Complete</button>}
                    {task.status === 'Completed' && <button className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleArchive(task.id)}>📦 Archive</button>}
                    <Link to={`/tasks/${task.id}/edit`} className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>✏️ Edit</Link>
                    <button className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: 'var(--danger)' }} onClick={() => handleDelete(task.id)}>🗑</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
