import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/client';
import toast from 'react-hot-toast';

export default function HabitEdit() {
  const { id } = useParams();
  const [habitName, setHabitName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/habits').then(r => {
      const h = r.data.find(h => h.id === parseInt(id));
      if (h) { setHabitName(h.habit_name); setDescription(h.description || ''); }
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/habits/${id}`, { habit_name: habitName, description });
      toast.success('Habit updated!');
      navigate('/habits');
    } catch (err) { toast.error('Failed'); }
  };

  if (loading) return <div className="page-wrapper with-sidebar"><div className="page-content"><p>Loading...</p></div></div>;

  return (
    <div className="page-wrapper with-sidebar">
      <div className="page-content">
        <div className="page-header fade-in"><h1>Edit Habit</h1></div>
        <div className="glass-card no-hover fade-in" style={{ padding: 'var(--space-xl)', maxWidth: '500px' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Habit Name</label><input className="form-control" value={habitName} onChange={e => setHabitName(e.target.value)} required /></div>
            <div className="form-group"><label>Description</label><textarea className="form-control" rows={3} value={description} onChange={e => setDescription(e.target.value)} /></div>
            <button type="submit" className="btn btn-primary btn-submit btn-lg">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
}
