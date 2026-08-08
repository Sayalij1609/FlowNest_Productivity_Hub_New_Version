import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/client';
import toast from 'react-hot-toast';

const COLORS = ['yellow', 'blue', 'green', 'pink', 'orange', 'purple', 'gray'];
const COLOR_HEX = { yellow: '#fbbf24', blue: '#3b82f6', green: '#22c55e', pink: '#ec4899', orange: '#f97316', purple: '#a855f7', gray: '#6b7280' };

export default function NoteCreate() {
  const { id } = useParams();
  const isEditing = !!id;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('yellow');
  const [loading, setLoading] = useState(isEditing);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditing) {
      API.get(`/notes/${id}`).then(r => {
        setTitle(r.data.title);
        setContent(r.data.content);
        setColor(r.data.color || 'yellow');
      }).catch(console.error).finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await API.put(`/notes/${id}`, { title, content, color });
        toast.success('Note updated!');
      } else {
        await API.post('/notes', { title, content, color });
        toast.success('Note created!');
      }
      navigate('/notes');
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  if (loading) return <div className="page-wrapper with-sidebar"><div className="page-content"><p>Loading...</p></div></div>;

  return (
    <div className="page-wrapper with-sidebar">
      <div className="page-content">
        <div className="page-header fade-in"><h1>{isEditing ? 'Edit Note' : 'Create Note'}</h1></div>
        <div className="glass-card no-hover fade-in" style={{ padding: 'var(--space-xl)', maxWidth: '600px' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Title</label><input className="form-control" value={title} onChange={e => setTitle(e.target.value)} required maxLength={200} placeholder="Note title" /></div>
            <div className="form-group"><label>Content</label><textarea className="form-control" rows={8} value={content} onChange={e => setContent(e.target.value)} required placeholder="Write your note..." /></div>
            <div className="form-group">
              <label>Color</label>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                {COLORS.map(c => (
                  <button type="button" key={c} onClick={() => setColor(c)} style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: COLOR_HEX[c], border: color === c ? '3px solid var(--text-primary)' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }} />
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-submit btn-lg">{isEditing ? 'Save Changes' : 'Create Note'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
