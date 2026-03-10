import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Layouts
import { AppLayout } from './layouts/AppLayout';

// Auth Pages
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

// Common Pages
import { Notifications } from './pages/Notifications';
import { TicketDetail } from './pages/TicketDetail';
import { Profile } from './pages/Profile';

// Citizen Pages
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { SubmitComplaint } from './pages/citizen/SubmitComplaint';
import { MyComplaints } from './pages/citizen/MyComplaints';
import { Rewards } from './pages/citizen/Rewards';
import { TransparencyPortal } from './pages/citizen/TransparencyPortal';

// Admin Pages
import { CommandCenter } from './pages/admin/CommandCenter';
import { AdminComplaints } from './pages/admin/AdminComplaints';
import { AdminMap } from './pages/admin/AdminMap';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { DepartmentManagement } from './pages/admin/DepartmentManagement';

// Provider Pages
import { ProviderDashboard } from './pages/provider/ProviderDashboard';
import { ComplaintManagement } from './pages/provider/ComplaintManagement';
import { ProviderAnalytics } from './pages/provider/Analytics';
import { FieldWorkerTasks } from './pages/provider/FieldWorker';

type ProtectedProps = {
  children: React.ReactNode;
  roles?: string[];
};

const ProtectedRoute: React.FC<ProtectedProps> = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectMap: Record<string, string> = {
      citizen: '/dashboard',
      admin: '/admin/command-center',
      department_manager: '/provider/dashboard',
      field_worker: '/worker/tasks',
    };
    return <Navigate to={redirectMap[user.role] || '/login'} replace />;
  }

  return <>{children}</>;
};

const SmartRedirect: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  const redirectMap: Record<string, string> = {
    citizen: '/dashboard',
    admin: '/admin/command-center',
    department_manager: '/provider/dashboard',
    field_worker: '/worker/tasks',
  };

  return <Navigate to={redirectMap[user?.role || ''] || '/login'} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<SmartRedirect />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes inside AppLayout */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          {/* Citizen Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute roles={['citizen']}><CitizenDashboard /></ProtectedRoute>
          } />
          <Route path="/submit-complaint" element={
            <ProtectedRoute roles={['citizen']}><SubmitComplaint /></ProtectedRoute>
          } />
          <Route path="/my-complaints" element={
            <ProtectedRoute roles={['citizen']}><MyComplaints /></ProtectedRoute>
          } />
          <Route path="/rewards" element={
            <ProtectedRoute roles={['citizen']}><Rewards /></ProtectedRoute>
          } />
          <Route path="/transparency" element={<TransparencyPortal />} />

          {/* Admin Routes */}
          <Route path="/admin/command-center" element={
            <ProtectedRoute roles={['admin']}><CommandCenter /></ProtectedRoute>
          } />
          <Route path="/admin/complaints" element={
            <ProtectedRoute roles={['admin']}><AdminComplaints /></ProtectedRoute>
          } />
          <Route path="/admin/map" element={
            <ProtectedRoute roles={['admin']}><AdminMap /></ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute roles={['admin']}><AdminAnalytics /></ProtectedRoute>
          } />
          <Route path="/admin/departments" element={
            <ProtectedRoute roles={['admin']}><DepartmentManagement /></ProtectedRoute>
          } />

          {/* Provider / Manager Routes */}
          <Route path="/provider/dashboard" element={
            <ProtectedRoute roles={['department_manager']}><ProviderDashboard /></ProtectedRoute>
          } />
          <Route path="/provider/complaints" element={
            <ProtectedRoute roles={['department_manager']}><ComplaintManagement /></ProtectedRoute>
          } />
          <Route path="/provider/workers" element={
            <ProtectedRoute roles={['department_manager']}><FieldWorkerTasks /></ProtectedRoute>
          } />
          <Route path="/provider/analytics" element={
            <ProtectedRoute roles={['department_manager']}><ProviderAnalytics /></ProtectedRoute>
          } />

          {/* Field Worker Routes */}
          <Route path="/worker/tasks" element={
            <ProtectedRoute roles={['field_worker']}><FieldWorkerTasks /></ProtectedRoute>
          } />
          <Route path="/worker/map" element={
            <ProtectedRoute roles={['field_worker']}><AdminMap /></ProtectedRoute>
          } />

          {/* Common Routes */}
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/ticket/:id" element={<TicketDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Catch All */}
        <Route path="*" element={<SmartRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
