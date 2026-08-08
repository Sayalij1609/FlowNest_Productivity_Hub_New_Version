import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/client';
import toast from 'react-hot-toast';

export default function CategoryCreate() {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6366f1');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/categories', { name, color });
      toast.success('Category created!');
      navigate('/categories');
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  return (
    <div className="page-wrapper with-sidebar">
      <div className="page-content">
        <div className="page-header fade-in"><h1>Create Category</h1></div>
        <div className="glass-card no-hover fade-in" style={{ padding: 'var(--space-xl)', maxWidth: '500px' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Category Name</label><input className="form-control" value={name} onChange={e => setName(e.target.value)} required minLength={2} maxLength={100} placeholder="e.g. Work, Personal" /></div>
            <div className="form-group"><label>Color</label><input type="color" className="form-control" value={color} onChange={e => setColor(e.target.value)} style={{ height: 44, padding: 4 }} /></div>
            <button type="submit" className="btn btn-primary btn-submit btn-lg">Create Category</button>
          </form>
        </div>
      </div>
    </div>
  );
}
