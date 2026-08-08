import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/tasks/TaskList';
import TaskCreate from './pages/tasks/TaskCreate';
import TaskEdit from './pages/tasks/TaskEdit';
import TaskView from './pages/tasks/TaskView';
import TaskArchived from './pages/tasks/TaskArchived';
import CategoryList from './pages/categories/CategoryList';
import CategoryCreate from './pages/categories/CategoryCreate';
import CategoryEdit from './pages/categories/CategoryEdit';
import HabitList from './pages/habits/HabitList';
import HabitCreate from './pages/habits/HabitCreate';
import HabitEdit from './pages/habits/HabitEdit';
import NoteList from './pages/notes/NoteList';
import NoteCreate from './pages/notes/NoteCreate';
import CalendarView from './pages/calendar/CalendarView';
import DayDetails from './pages/calendar/DayDetails';
import Statistics from './pages/Statistics';
import Profile from './pages/profile/Profile';
import EditProfile from './pages/profile/EditProfile';
import ChangePassword from './pages/profile/ChangePassword';
import Notifications from './pages/Notifications';

function RedirectIfAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Public */}
        <Route path="/" element={<RedirectIfAuth><Home /></RedirectIfAuth>} />
        <Route path="/login" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
        <Route path="/register" element={<RedirectIfAuth><Register /></RedirectIfAuth>} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        <Route path="/tasks" element={<ProtectedRoute><TaskList /></ProtectedRoute>} />
        <Route path="/tasks/create" element={<ProtectedRoute><TaskCreate /></ProtectedRoute>} />
        <Route path="/tasks/archived" element={<ProtectedRoute><TaskArchived /></ProtectedRoute>} />
        <Route path="/tasks/:id" element={<ProtectedRoute><TaskView /></ProtectedRoute>} />
        <Route path="/tasks/:id/edit" element={<ProtectedRoute><TaskEdit /></ProtectedRoute>} />

        <Route path="/categories" element={<ProtectedRoute><CategoryList /></ProtectedRoute>} />
        <Route path="/categories/create" element={<ProtectedRoute><CategoryCreate /></ProtectedRoute>} />
        <Route path="/categories/:id/edit" element={<ProtectedRoute><CategoryEdit /></ProtectedRoute>} />

        <Route path="/habits" element={<ProtectedRoute><HabitList /></ProtectedRoute>} />
        <Route path="/habits/create" element={<ProtectedRoute><HabitCreate /></ProtectedRoute>} />
        <Route path="/habits/:id/edit" element={<ProtectedRoute><HabitEdit /></ProtectedRoute>} />

        <Route path="/notes" element={<ProtectedRoute><NoteList /></ProtectedRoute>} />
        <Route path="/notes/create" element={<ProtectedRoute><NoteCreate /></ProtectedRoute>} />
        <Route path="/notes/:id/edit" element={<ProtectedRoute><NoteCreate /></ProtectedRoute>} />

        <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
        <Route path="/calendar/day/:year/:month/:day" element={<ProtectedRoute><DayDetails /></ProtectedRoute>} />

        <Route path="/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />

        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/profile/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/app">
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
