import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/client';
import toast from 'react-hot-toast';

export default function HabitCreate() {
  const [habitName, setHabitName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/habits', { habit_name: habitName, description });
      toast.success('Habit created!');
      navigate('/habits');
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  return (
    <div className="page-wrapper with-sidebar">
      <div className="page-content">
        <div className="page-header fade-in"><h1>Create Habit</h1></div>
        <div className="glass-card no-hover fade-in" style={{ padding: 'var(--space-xl)', maxWidth: '500px' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Habit Name</label><input className="form-control" value={habitName} onChange={e => setHabitName(e.target.value)} required maxLength={100} placeholder="e.g. Read 30 minutes" /></div>
            <div className="form-group"><label>Description (optional)</label><textarea className="form-control" rows={3} value={description} onChange={e => setDescription(e.target.value)} maxLength={500} placeholder="What does this habit involve?" /></div>
            <button type="submit" className="btn btn-primary btn-submit btn-lg">Create Habit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
