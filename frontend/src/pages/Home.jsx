import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 1600;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}{suffix}</span>;
}

export default function Home() {
  return (
    <div className="home-container">
      {/* Ambient background glows */}
      <div className="ambient-glow glow-top-left"></div>
      <div className="ambient-glow glow-center-right"></div>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-pill-badge">
            <span className="pill-dot"></span>
            <span>All-in-One Productivity Workspace</span>
          </div>

          <h1 className="hero-headline">
            Simplify your workflow.<br />
            Focus on <span className="gradient-text">what matters</span>.
          </h1>

          <p className="hero-description">
            FlowNest brings your tasks, notes, daily habits, and calendar together into a single, beautifully organized hub.
          </p>

          <div className="hero-cta-group">
            <Link to="/register" className="btn-primary-glow">
              Get Started Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link to="/login" className="btn-secondary-glass">Sign In</Link>
          </div>

          <div className="hero-metrics-bar">
            <div className="metric-item">
              <span className="metric-value"><AnimatedCounter target={6} suffix="+" /></span>
              <span className="metric-label">Productivity Modules</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-value">∞</span>
              <span className="metric-label">Tasks &amp; Notes</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-value"><AnimatedCounter target={100} suffix="%" /></span>
              <span className="metric-label">Free &amp; Secure</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-container">
        <div className="section-header text-center">
          <span className="section-tag">Capabilities</span>
          <h2 className="section-title">Designed for Modern Productivity</h2>
          <p className="section-subtitle">Everything you need to plan, track, and execute your day efficiently.</p>
        </div>

        <div className="features-grid">
          <div className="pro-feature-card">
            <div className="icon-container icon-maroon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <h3>Task Management</h3>
            <p>Organize, prioritize, and track your tasks with categories, deadlines, and smart email reminders.</p>
          </div>

          <div className="pro-feature-card">
            <div className="icon-container icon-pink">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h3>Smart Notes</h3>
            <p>Capture ideas instantly with color-coded notes, quick pinning, and instant search capabilities.</p>
          </div>

          <div className="pro-feature-card">
            <div className="icon-container icon-rose">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <h3>Habit Tracker</h3>
            <p>Build long-term habits with automated streak tracking, completion heatmaps, and weekly statistics.</p>
          </div>

          <div className="pro-feature-card">
            <div className="icon-container icon-wine">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3>Calendar Schedule</h3>
            <p>Visualize your workload with an integrated monthly calendar showing all tasks and habit activities.</p>
          </div>

          <div className="pro-feature-card">
            <div className="icon-container icon-magenta">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <h3>Automated Reminders</h3>
            <p>Stay notified on critical deadlines via timely email alerts powered by automated background services.</p>
          </div>

          <div className="pro-feature-card">
            <div className="icon-container icon-plum">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 20V10" />
                <path d="M12 20V4" />
                <path d="M6 20v-6" />
              </svg>
            </div>
            <h3>Productivity Analytics</h3>
            <p>Analyze your progress over time with responsive visual charts and completion rate breakdowns.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="workflow-section">
        <div className="section-header text-center">
          <span className="section-tag">Workflow</span>
          <h2 className="section-title">How FlowNest Works</h2>
          <p className="section-subtitle">A straightforward 3-step approach to mastering your daily schedule.</p>
        </div>

        <div className="workflow-steps">
          <div className="workflow-card">
            <div className="step-badge">1</div>
            <h4>Create &amp; Organize</h4>
            <p>Group your tasks and notes by priority and custom categories.</p>
          </div>
          <div className="workflow-card">
            <div className="step-badge">2</div>
            <h4>Track Daily Progress</h4>
            <p>Check off habits, update tasks, and view your interactive calendar.</p>
          </div>
          <div className="workflow-card">
            <div className="step-badge">3</div>
            <h4>Review &amp; Improve</h4>
            <p>Analyze weekly stats to refine your routine and optimize your time.</p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="cta-banner-section">
        <div className="cta-glass-card">
          <div className="cta-glow-bg"></div>
          <h2>Ready to streamline your productivity?</h2>
          <p>Join FlowNest today and experience a clean, focused workspace.</p>
          <Link to="/register" className="btn-primary-glow btn-lg">
            Create Free Account
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pro-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span>FlowNest</span>
          </div>
          <p className="footer-copyright">© 2026 FlowNest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
