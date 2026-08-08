import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/client';
import toast from 'react-hot-toast';

export default function TaskCreate() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium', category_id: '', deadline: '', reminder: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/categories').then(r => setCategories(r.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('priority', form.priority);
      if (form.category_id) fd.append('category_id', form.category_id);
      if (form.deadline) fd.append('deadline', form.deadline);
      if (form.reminder) fd.append('reminder', form.reminder);
      if (file) fd.append('attachment', file);

      await API.post('/tasks', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Task created!');
      navigate('/tasks');
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to create task'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-wrapper with-sidebar">
      <div className="page-content">
        <div className="page-header fade-in"><h1>Create Task</h1></div>
        <div className="glass-card no-hover fade-in" style={{ padding: 'var(--space-xl)', maxWidth: '700px' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required maxLength={200} placeholder="Task title" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-control" rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Task description (optional)" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              <div className="form-group">
                <label>Priority</label>
                <select className="form-control" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
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
              <div className="form-group">
                <label>Deadline</label>
                <input type="date" className="form-control" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Reminder</label>
                <input type="datetime-local" className="form-control" value={form.reminder} onChange={e => setForm({ ...form, reminder: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Attachment</label>
              <input type="file" className="form-control" onChange={e => setFile(e.target.files[0])} accept=".png,.jpg,.jpeg,.pdf,.txt,.doc,.docx" />
            </div>
            <button type="submit" className="btn btn-primary btn-submit btn-lg" disabled={loading}>{loading ? 'Creating...' : 'Create Task'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
