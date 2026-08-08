import { useState, useEffect } from 'react';
import API from '../../api/client';
import toast from 'react-hot-toast';

export default function TaskArchived() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/tasks/archived').then(r => setTasks(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleRestore = async (id) => {
    try {
      await API.patch(`/tasks/${id}/restore`);
      setTasks(tasks.filter(t => t.id !== id));
      toast.success('Task restored!');
    } catch (err) { toast.error('Failed to restore'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this task?')) return;
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
      toast.success('Task deleted!');
    } catch (err) { toast.error('Failed to delete'); }
  };

  return (
    <div className="page-wrapper with-sidebar">
      <div className="page-content">
        <div className="page-header fade-in"><h1>Archived Tasks</h1></div>
        {loading ? <p>Loading...</p> : tasks.length === 0 ? (
          <div className="glass-card no-hover fade-in" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No archived tasks</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {tasks.map(task => (
              <div key={task.id} className="glass-card no-hover fade-in" style={{ padding: 'var(--space-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                <div>
                  <strong>{task.title}</strong>
                  <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}>
                    <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
                    {task.category_name && <span className="badge">{task.category_name}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                  <button className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleRestore(task.id)}>↩ Restore</button>
                  <button className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: 'var(--danger)' }} onClick={() => handleDelete(task.id)}>🗑 Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
