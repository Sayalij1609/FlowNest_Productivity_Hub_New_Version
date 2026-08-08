import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/client';

export default function CalendarView() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/calendar', { params: { year, month } })
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [year, month]);

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="page-wrapper with-sidebar">
      <div className="page-content">
        <div className="page-header fade-in"><h1>Calendar</h1></div>
        {loading ? <p>Loading...</p> : data && (
          <div className="glass-card no-hover fade-in" style={{ padding: 'var(--space-xl)' }}>
            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
              <button className="btn btn-outline" onClick={prevMonth}>← Prev</button>
              <h2 style={{ margin: 0 }}>{data.month_name} {data.year}</h2>
              <button className="btn btn-outline" onClick={nextMonth}>Next →</button>
            </div>
            {/* Day Headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center', marginBottom: 'var(--space-sm)' }}>
              {days.map(d => <div key={d} style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', padding: '8px 0' }}>{d}</div>)}
            </div>
            {/* Calendar Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {data.calendar.flat().map((day, i) => {
                if (day === 0) return <div key={i} />;
                const isToday = day === data.current_day && month === data.current_month && year === data.current_year;
                const hasTask = data.task_dates.includes(day);
                const hasHabit = data.habit_dates.includes(day);
                return (
                  <Link
                    key={i}
                    to={`/calendar/day/${year}/${month}/${day}`}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      height: 64, borderRadius: 'var(--radius-md)', textDecoration: 'none',
                      background: isToday ? 'var(--accent-start)' : 'var(--bg-tertiary)',
                      color: isToday ? '#fff' : 'var(--text-primary)',
                      border: isToday ? '2px solid var(--accent-mid)' : '1px solid var(--glass-border)',
                      fontWeight: isToday ? 700 : 400,
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    {day}
                    <div style={{ display: 'flex', gap: 3, marginTop: 4 }}>
                      {hasTask && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-mid)' }} />}
                      {hasHabit && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }} />}
                    </div>
                  </Link>
                );
              })}
            </div>
            {/* Legend */}
            <div style={{ display: 'flex', gap: 'var(--space-lg)', marginTop: 'var(--space-lg)', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-mid)' }} />
                <small style={{ color: 'var(--text-muted)' }}>Tasks</small>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
                <small style={{ color: 'var(--text-muted)' }}>Habits</small>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
