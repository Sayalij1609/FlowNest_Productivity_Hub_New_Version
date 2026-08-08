import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/client';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/dashboard').then((res) => {
      setData(res.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-wrapper with-sidebar"><div className="page-content"><p>Loading...</p></div></div>;
  if (!data) return null;

  return (
    <div className="page-wrapper with-sidebar">
      <div className="page-content">
        {/* Header */}
        <div className="dashboard-header fade-in">
          <h1>Welcome back, {user?.username} 👋</h1>
          <p>Here's your productivity overview for today</p>
        </div>

        {/* Stat Cards */}
        <div className="stats-grid">
          <div className="glass-card stat-card fade-in fade-in-delay-1">
            <div className="stat-icon icon-indigo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            </div>
            <div className="stat-label">Today's Tasks</div>
            <div className="stat-value">{data.todays_tasks.length}</div>
          </div>
          <div className="glass-card stat-card fade-in fade-in-delay-2">
            <div className="stat-icon icon-amber">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            </div>
            <div className="stat-label">Pending</div>
            <div className="stat-value">{data.pending_count}</div>
          </div>
          <div className="glass-card stat-card fade-in fade-in-delay-3">
            <div className="stat-icon icon-green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            </div>
            <div className="stat-label">Completed Today</div>
            <div className="stat-value" style={{ color: 'var(--success)' }}>{data.completed_today}</div>
          </div>
          <div className="glass-card stat-card fade-in fade-in-delay-4">
            <div className="stat-icon icon-cyan">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            </div>
            <div className="stat-label">Current Streak</div>
            <div className="stat-value">{data.streak} day{data.streak !== 1 ? 's' : ''}</div>
          </div>
          <div className="glass-card stat-card fade-in fade-in-delay-1">
            <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.12)', color: 'var(--danger)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            </div>
            <div className="stat-label">Overdue</div>
            <div className="stat-value" style={{ color: 'var(--danger)' }}>{data.overdue_count}</div>
          </div>
          <div className="glass-card stat-card fade-in fade-in-delay-2">
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--warning)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            </div>
            <div className="stat-label">High Priority</div>
            <div className="stat-value">{data.high_priority_pending}</div>
          </div>
          <div className="glass-card stat-card fade-in fade-in-delay-3">
            <div className="stat-icon icon-indigo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
            </div>
            <div className="stat-label">Completed This Week</div>
            <div className="stat-value">{data.completed_this_week}</div>
          </div>
          <div className="glass-card stat-card fade-in fade-in-delay-4">
            <div className="stat-icon icon-cyan">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
            </div>
            <div className="stat-label">Categories</div>
            <div className="stat-value">{data.categories_count}</div>
          </div>
        </div>

        {/* Widgets Row */}
        <div className="dashboard-widgets">
          {/* Today's Tasks */}
          <div className="glass-card no-hover dashboard-widget fade-in fade-in-delay-1">
            <div className="widget-header">
              <h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                Today's Tasks
              </h3>
              <Link to="/tasks?filter=today" className="widget-link">View All →</Link>
            </div>
            {data.todays_tasks.length > 0 ? (
              <div className="widget-list">
                {data.todays_tasks.map((task) => (
                  <div className="widget-list-item" key={task.id}>
                    <div className="widget-list-item-left">
                      <span className={`priority-indicator priority-indicator-${task.priority.toLowerCase()}`}></span>
                      <Link to={`/tasks/${task.id}`} className="widget-task-title">{task.title}</Link>
                    </div>
                    <span className={`badge badge-${task.status.toLowerCase()}`}>{task.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="widget-empty"><p>No tasks due today 🎉</p></div>
            )}
          </div>

          {/* Upcoming Deadlines */}
          <div className="glass-card no-hover dashboard-widget fade-in fade-in-delay-2">
            <div className="widget-header">
              <h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                Upcoming Deadlines
              </h3>
              <Link to="/tasks?filter=upcoming" className="widget-link">View All →</Link>
            </div>
            {data.upcoming_deadlines.length > 0 ? (
              <div className="widget-list">
                {data.upcoming_deadlines.map((task) => (
                  <div className="widget-list-item" key={task.id}>
                    <div className="widget-list-item-left">
                      <span className={`priority-indicator priority-indicator-${task.priority.toLowerCase()}`}></span>
                      <Link to={`/tasks/${task.id}`} className="widget-task-title">{task.title}</Link>
                    </div>
                    <span className="widget-date">{new Date(task.deadline).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="widget-empty"><p>No upcoming deadlines this week</p></div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <h3 className="quick-actions-title fade-in fade-in-delay-3">Quick Actions</h3>
        <div className="quick-actions-grid">
          <Link to="/tasks/create" className="glass-card quick-action-card fade-in fade-in-delay-1">
            <div className="qa-icon icon-indigo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </div>
            <div className="qa-text"><h4>Create Task</h4><p>Add a new task to your list</p></div>
          </Link>
          <Link to="/tasks" className="glass-card quick-action-card fade-in fade-in-delay-2">
            <div className="qa-icon icon-cyan">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
            </div>
            <div className="qa-text"><h4>View Tasks</h4><p>Browse and manage your tasks</p></div>
          </Link>
          <Link to="/categories/create" className="glass-card quick-action-card fade-in fade-in-delay-3">
            <div className="qa-icon icon-green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
            </div>
            <div className="qa-text"><h4>New Category</h4><p>Organize tasks by category</p></div>
          </Link>
          <Link to="/tasks/archived" className="glass-card quick-action-card fade-in fade-in-delay-4">
            <div className="qa-icon icon-amber">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" /></svg>
            </div>
            <div className="qa-text"><h4>Archived Tasks</h4><p>View completed archives</p></div>
          </Link>
        </div>
      </div>
    </div>
  );
}
