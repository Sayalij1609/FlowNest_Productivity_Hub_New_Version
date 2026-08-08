import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/client';
import toast from 'react-hot-toast';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    try {
      await API.post('/profile/change-password', { current_password: currentPassword, new_password: newPassword });
      toast.success('Password changed!');
      navigate('/profile');
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  return (
    <div className="page-wrapper with-sidebar">
      <div className="page-content">
        <div className="page-header fade-in"><h1>Change Password</h1></div>
        <div className="glass-card no-hover fade-in" style={{ padding: 'var(--space-xl)', maxWidth: '500px' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Current Password</label><input type="password" className="form-control" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required /></div>
            <div className="form-group"><label>New Password</label><input type="password" className="form-control" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} /></div>
            <div className="form-group"><label>Confirm New Password</label><input type="password" className="form-control" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required /></div>
            <button type="submit" className="btn btn-primary btn-submit btn-lg">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  );
}
