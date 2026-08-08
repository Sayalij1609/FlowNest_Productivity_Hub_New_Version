import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/client';
import toast from 'react-hot-toast';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/categories').then(r => setCategories(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await API.delete(`/categories/${id}`);
      setCategories(categories.filter(c => c.id !== id));
      toast.success('Category deleted!');
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to delete'); }
  };

  return (
    <div className="page-wrapper with-sidebar">
      <div className="page-content">
        <div className="page-header fade-in"><h1>Categories</h1><Link to="/categories/create" className="btn btn-primary">+ New Category</Link></div>
        {loading ? <p>Loading...</p> : categories.length === 0 ? (
          <div className="glass-card no-hover fade-in" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}><p style={{ color: 'var(--text-secondary)' }}>No categories yet</p></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
            {categories.map(cat => (
              <div key={cat.id} className="glass-card no-hover fade-in" style={{ padding: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                  <strong style={{ fontSize: '1.05rem' }}>{cat.name}</strong>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 'var(--space-md)' }}>{cat.task_count} task{cat.task_count !== 1 ? 's' : ''}</p>
                <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                  <Link to={`/categories/${cat.id}/edit`} className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Edit</Link>
                  <button className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: 'var(--danger)' }} onClick={() => handleDelete(cat.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
