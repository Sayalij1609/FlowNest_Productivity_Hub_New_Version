import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';

export default function AppLayout() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-md)',
            backdropFilter: 'blur(12px)',
          },
          success: {
            iconTheme: { primary: 'var(--success)', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: 'var(--danger)', secondary: '#fff' },
          },
        }}
      />
      <Navbar />
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
