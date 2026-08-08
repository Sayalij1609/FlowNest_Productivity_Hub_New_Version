import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="auth-wrapper">
        <div className="auth-container fade-in">
          <div className="auth-decor">
            <div className="auth-decor-content">
              <h2>Welcome Back!</h2>
              <p>Sign in to access your personal productivity hub. Your tasks, notes, and habits are waiting for you.</p>
              <div className="auth-decor-dots"><span></span><span></span><span></span></div>
            </div>
          </div>
          <div className="auth-form-panel">
            <h2>Sign In</h2>
            <p className="auth-subtitle">Enter your credentials to continue</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" className="form-control" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-wrapper">
                  <input id="password" type={showPw ? 'text' : 'password'} className="form-control" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <button type="button" className="password-toggle" aria-label="Toggle password visibility" onClick={() => setShowPw(!showPw)}>
                    <svg className={showPw ? 'eye-closed' : 'eye-open'} style={{ display: showPw ? 'none' : 'block' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    <svg className={showPw ? 'eye-open' : 'eye-closed'} style={{ display: showPw ? 'block' : 'none' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-submit btn-lg" disabled={loading}>
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>
            <div className="auth-footer">
              Don't have an account? <Link to="/register">Create one</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
