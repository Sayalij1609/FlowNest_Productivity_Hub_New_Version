import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function FloatingParticles() {
  return (
    <div className="particles-container">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${Math.random() * 10 + 10}s`,
          }}
        />
      ))}
    </div>
  );
}

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
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
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <FloatingParticles />
        <div className="hero-glow hero-glow-1"></div>
        <div className="hero-glow hero-glow-2"></div>
        <div className="hero-glow hero-glow-3"></div>
        <div className="hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            Your Productivity Hub
          </div>
          <h1 className="hero-title">
            Organize Your Life<br />
            with <span className="gradient-text">FlowNest</span>
          </h1>
          <p className="hero-subtitle">
            A beautiful, all-in-one workspace to manage tasks, capture notes,
            build habits, and stay on top of your schedule — effortlessly.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="hero-btn hero-btn-primary">
              <span className="hero-btn-shimmer"></span>
              Get Started Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
            <Link to="/login" className="hero-btn hero-btn-outline">Sign In</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><span className="hero-stat-number"><AnimatedCounter target={6} suffix="+" /></span><span className="hero-stat-label">Modules</span></div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat"><span className="hero-stat-number">∞</span><span className="hero-stat-label">Tasks & Notes</span></div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat"><span className="hero-stat-number"><AnimatedCounter target={100} suffix="%" /></span><span className="hero-stat-label">Free Forever</span></div>
          </div>
        </div>
      </section>

      {/* TRUSTED BY / BUILT WITH */}
      <section className="home-marquee">
        <p className="home-marquee-label">Built With Modern Technologies</p>
        <div className="home-marquee-track">
          <div className="home-marquee-content">
            {['React 18', 'Vite', 'Flask', 'PostgreSQL', 'JWT Auth', 'Chart.js', 'Brevo Email', 'APScheduler', 'React 18', 'Vite', 'Flask', 'PostgreSQL', 'JWT Auth', 'Chart.js', 'Brevo Email', 'APScheduler'].map((tech, i) => (
              <span key={i} className="home-marquee-item">{tech}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="home-features">
        <div className="home-section-header">
          <span className="home-section-badge">Features</span>
          <h2 className="home-section-title">Everything You Need</h2>
          <p className="home-section-subtitle">Powerful features to supercharge your productivity</p>
        </div>
        <div className="features-grid">
          <div className="feature-card feature-card-glow-hover">
            <div className="feature-icon-wrap feature-icon-indigo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
            </div>
            <h3>Task Management</h3>
            <p>Organize, prioritize, and track your tasks with categories, deadlines, and smart reminders.</p>
            <div className="feature-card-glow"></div>
            <div className="feature-card-border-glow"></div>
          </div>
          <div className="feature-card feature-card-glow-hover">
            <div className="feature-icon-wrap feature-icon-cyan">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
            </div>
            <h3>Smart Notes</h3>
            <p>Capture ideas instantly with color-coded notes, pinning, and full-text search.</p>
            <div className="feature-card-glow"></div>
            <div className="feature-card-border-glow"></div>
          </div>
          <div className="feature-card feature-card-glow-hover">
            <div className="feature-icon-wrap feature-icon-green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            </div>
            <h3>Habit Tracker</h3>
            <p>Build positive habits with streaks, daily check-ins, and completion analytics.</p>
            <div className="feature-card-glow"></div>
            <div className="feature-card-border-glow"></div>
          </div>
          <div className="feature-card feature-card-glow-hover">
            <div className="feature-icon-wrap feature-icon-amber">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            </div>
            <h3>Calendar View</h3>
            <p>See your full schedule at a glance with an integrated calendar showing tasks &amp; habits.</p>
            <div className="feature-card-glow"></div>
            <div className="feature-card-border-glow"></div>
          </div>
          <div className="feature-card feature-card-glow-hover">
            <div className="feature-icon-wrap feature-icon-pink">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
            </div>
            <h3>Email Reminders</h3>
            <p>Never miss a deadline — get automatic email notifications before tasks are due.</p>
            <div className="feature-card-glow"></div>
            <div className="feature-card-border-glow"></div>
          </div>
          <div className="feature-card feature-card-glow-hover">
            <div className="feature-icon-wrap feature-icon-purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></svg>
            </div>
            <h3>Statistics &amp; Insights</h3>
            <p>Track your productivity with beautiful charts, completion rates, and trend analysis.</p>
            <div className="feature-card-glow"></div>
            <div className="feature-card-border-glow"></div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="home-steps">
        <div className="home-section-header">
          <span className="home-section-badge">How it works</span>
          <h2 className="home-section-title">Get Started in Minutes</h2>
          <p className="home-section-subtitle">Three simple steps to boost your productivity</p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <h3>Create Your Account</h3>
            <p>Sign up for free in seconds. No credit card required.</p>
          </div>
          <div className="step-connector">
            <svg width="40" height="24" viewBox="0 0 40 24" fill="none"><path d="M0 12h36m0 0l-6-6m6 6l-6 6" stroke="var(--accent-mid)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div className="step-card">
            <div className="step-number">02</div>
            <h3>Organize Everything</h3>
            <p>Add tasks, notes, and habits. Set reminders and deadlines.</p>
          </div>
          <div className="step-connector">
            <svg width="40" height="24" viewBox="0 0 40 24" fill="none"><path d="M0 12h36m0 0l-6-6m6 6l-6 6" stroke="var(--accent-mid)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div className="step-card">
            <div className="step-number">03</div>
            <h3>Stay Productive</h3>
            <p>Track progress with analytics and never miss a deadline.</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="home-cta">
        <div className="home-cta-inner">
          <div className="home-cta-glow"></div>
          <h2>Ready to Get Productive?</h2>
          <p>Join FlowNest today and take control of your day.</p>
          <Link to="/register" className="hero-btn hero-btn-primary">
            <span className="hero-btn-shimmer"></span>
            Create Free Account
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="home-footer-brand">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
          <span>FlowNest</span>
        </div>
        <p className="home-footer-copy">© 2026 FlowNest. Built with ❤️ for productivity.</p>
      </footer>
    </>
  );
}
