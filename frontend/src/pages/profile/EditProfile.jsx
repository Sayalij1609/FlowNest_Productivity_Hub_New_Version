import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/client';
import toast from 'react-hot-toast';

export default function EditProfile() {
  const { updateUser } = useAuth();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/profile').then(r => { setUsername(r.data.username); setBio(r.data.bio || ''); }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const r = await API.put('/profile', { username, bio });
      updateUser(r.data);
      toast.success('Profile updated!');
      navigate('/profile');
    } catch (err) { toast.error('Failed to update profile'); }
  };

  if (loading) return <div className="page-wrapper with-sidebar"><div className="page-content"><p>Loading...</p></div></div>;

  return (
    <div className="page-wrapper with-sidebar">
      <div className="page-content">
        <div className="page-header fade-in"><h1>Edit Profile</h1></div>
        <div className="glass-card no-hover fade-in" style={{ padding: 'var(--space-xl)', maxWidth: '500px' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Username</label><input className="form-control" value={username} onChange={e => setUsername(e.target.value)} required /></div>
            <div className="form-group"><label>Bio</label><textarea className="form-control" rows={3} value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..." maxLength={500} /></div>
            <button type="submit" className="btn btn-primary btn-submit btn-lg">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
}
