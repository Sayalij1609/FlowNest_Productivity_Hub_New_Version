import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/client';
import toast from 'react-hot-toast';

export default function CategoryEdit() {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#007bff');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/categories').then(r => {
      const cat = r.data.find(c => c.id === parseInt(id));
      if (cat) { setName(cat.name); setColor(cat.color); }
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/categories/${id}`, { name, color });
      toast.success('Category updated!');
      navigate('/categories');
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  if (loading) return <div className="page-wrapper with-sidebar"><div className="page-content"><p>Loading...</p></div></div>;

  return (
    <div className="page-wrapper with-sidebar">
      <div className="page-content">
        <div className="page-header fade-in"><h1>Edit Category</h1></div>
        <div className="glass-card no-hover fade-in" style={{ padding: 'var(--space-xl)', maxWidth: '500px' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Category Name</label><input className="form-control" value={name} onChange={e => setName(e.target.value)} required /></div>
            <div className="form-group"><label>Color</label><input type="color" className="form-control" value={color} onChange={e => setColor(e.target.value)} style={{ height: 44, padding: 4 }} /></div>
            <button type="submit" className="btn btn-primary btn-submit btn-lg">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
}
