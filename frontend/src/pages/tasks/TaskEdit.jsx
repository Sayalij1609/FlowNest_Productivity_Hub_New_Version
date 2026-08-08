import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/client';
import toast from 'react-hot-toast';

export default function TaskEdit() {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium', category_id: '', deadline: '', reminder: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([API.get(`/tasks/${id}`), API.get('/categories')]).then(([taskRes, catsRes]) => {
      const t = taskRes.data;
      setForm({ title: t.title, description: t.description || '', priority: t.priority, category_id: t.category_id || '', deadline: t.deadline || '', reminder: t.reminder ? t.reminder.substring(0, 16) : '' });
      setCategories(catsRes.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, category_id: form.category_id || null };
      // Convert local reminder time to UTC ISO string for the server
      if (payload.reminder) {
        const localDate = new Date(payload.reminder);
        payload.reminder = localDate.toISOString();
      }
      await API.put(`/tasks/${id}`, payload);
      toast.success('Task updated!');
      navigate('/tasks');
    } catch (err) { toast.error('Failed to update task'); }
  };

  if (loading) return <div className="page-wrapper with-sidebar"><div className="page-content"><p>Loading...</p></div></div>;

  return (
    <div className="page-wrapper with-sidebar">
      <div className="page-content">
        <div className="page-header fade-in"><h1>Edit Task</h1></div>
        <div className="glass-card no-hover fade-in" style={{ padding: 'var(--space-xl)', maxWidth: '700px' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-control" rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              <div className="form-group">
                <label>Priority</label>
                <select className="form-control" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select className="form-control" value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              <div className="form-group"><label>Deadline</label><input type="date" className="form-control" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} /></div>
              <div className="form-group"><label>Reminder</label><input type="datetime-local" className="form-control" value={form.reminder} onChange={e => setForm({ ...form, reminder: e.target.value })} /></div>
            </div>
            <button type="submit" className="btn btn-primary btn-submit btn-lg">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
}
