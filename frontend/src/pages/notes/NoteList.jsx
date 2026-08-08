import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/client';
import toast from 'react-hot-toast';

const NOTE_COLORS = { yellow: '#fbbf24', blue: '#3b82f6', green: '#22c55e', pink: '#ec4899', orange: '#f97316', purple: '#a855f7', gray: '#6b7280' };

export default function NoteList() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/notes', { params: { search } }).then(r => setNotes(r.data)).catch(console.error).finally(() => setLoading(false));
  }, [search]);

  const handlePin = async (id) => {
    try { const r = await API.patch(`/notes/${id}/pin`); setNotes(notes.map(n => n.id === id ? r.data : n)); toast.success(r.data.is_pinned ? 'Pinned!' : 'Unpinned!'); }
    catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this note?')) return;
    try { await API.delete(`/notes/${id}`); setNotes(notes.filter(n => n.id !== id)); toast.success('Deleted!'); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="page-wrapper with-sidebar">
      <div className="page-content">
        <div className="page-header fade-in"><h1>My Notes</h1><Link to="/notes/create" className="btn btn-primary">+ New Note</Link></div>
        <div className="glass-card no-hover fade-in" style={{ marginBottom: 'var(--space-lg)', padding: 'var(--space-lg)' }}>
          <input type="text" className="form-control" placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {loading ? <p>Loading...</p> : notes.length === 0 ? (
          <div className="glass-card no-hover fade-in" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}><p style={{ color: 'var(--text-secondary)' }}>No notes yet</p></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
            {notes.map(note => (
              <div key={note.id} className="glass-card no-hover fade-in" style={{ padding: 'var(--space-lg)', borderTop: `3px solid ${NOTE_COLORS[note.color] || NOTE_COLORS.yellow}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-sm)' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{note.is_pinned ? '📌 ' : ''}{note.title}</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-md)', whiteSpace: 'pre-wrap', maxHeight: 100, overflow: 'hidden' }}>{note.content}</p>
                <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
                  <button className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => handlePin(note.id)}>{note.is_pinned ? 'Unpin' : 'Pin'}</button>
                  <Link to={`/notes/${note.id}/edit`} className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>Edit</Link>
                  <button className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: 'var(--danger)' }} onClick={() => handleDelete(note.id)}>Delete</button>
                </div>
                <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: 'var(--space-sm)' }}>{new Date(note.updated_at).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
