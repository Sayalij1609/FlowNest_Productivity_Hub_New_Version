import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/client';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/profile').then(r => setProfile(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-wrapper with-sidebar"><div className="page-content"><p>Loading...</p></div></div>;
  if (!profile) return null;

  return (
    <div className="page-wrapper with-sidebar">
      <div className="page-content">
        <div className="page-header fade-in"><h1>Profile</h1><Link to="/profile/edit" className="btn btn-primary">Edit Profile</Link></div>
        <div className="glass-card no-hover fade-in" style={{ padding: 'var(--space-xl)', maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--accent-start)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
              {profile.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h2 style={{ margin: '0 0 0.25rem' }}>{profile.username}</h2>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{profile.email}</p>
              {profile.bio && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{profile.bio}</p>}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-md)', textAlign: 'center' }}>
            <div style={{ padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{profile.task_count}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Tasks</div>
            </div>
            <div style={{ padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{profile.habit_count}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Habits</div>
            </div>
            <div style={{ padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{profile.note_count}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Notes</div>
            </div>
          </div>
          {profile.created_at && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 'var(--space-lg)', textAlign: 'center' }}>
              Member since {new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </p>
          )}
          <div style={{ marginTop: 'var(--space-lg)', textAlign: 'center' }}>
            <Link to="/profile/change-password" className="btn btn-outline">Change Password</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
