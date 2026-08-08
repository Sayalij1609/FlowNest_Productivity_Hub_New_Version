import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../api/client';

export default function TaskView() {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    API.get(`/tasks/${id}`).then(r => setTask(r.data)).catch(console.error);
  }, [id]);

  if (!task) return <div className="page-wrapper with-sidebar"><div className="page-content"><p>Loading...</p></div></div>;

  return (
    <div className="page-wrapper with-sidebar">
      <div className="page-content">
        <div className="page-header fade-in">
          <h1>{task.title}</h1>
          <Link to={`/tasks/${task.id}/edit`} className="btn btn-primary">Edit Task</Link>
        </div>
        <div className="glass-card no-hover fade-in" style={{ padding: 'var(--space-xl)', maxWidth: '700px' }}>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
            <span className={`badge badge-${task.status.toLowerCase()}`}>{task.status}</span>
            <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
            {task.category_name && <span className="badge" style={{ background: task.category_color + '22', color: task.category_color }}>{task.category_name}</span>}
          </div>
          {task.description && (
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <h4 style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>Description</h4>
              <p style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{task.description}</p>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
            {task.deadline && <div><h4 style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>Deadline</h4><p>{new Date(task.deadline).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p></div>}
            {task.reminder && <div><h4 style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>Reminder</h4><p>{new Date(task.reminder).toLocaleString()}</p></div>}
            {task.created_at && <div><h4 style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>Created</h4><p>{new Date(task.created_at).toLocaleDateString()}</p></div>}
            {task.attachment && <div><h4 style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>Attachment</h4><p>{task.attachment}</p></div>}
          </div>
          <div style={{ marginTop: 'var(--space-xl)' }}>
            <Link to="/tasks" className="btn btn-outline">← Back to Tasks</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
