import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './services/authContext';
import { useAuth } from './services/useAuth';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';

// Route-level code splitting for faster initial bundle load
const Register = lazy(() => import('./pages/Register'));
const PatientDashboard = lazy(() => import('./pages/PatientDashboard'));
const DoctorDashboard = lazy(() => import('./pages/DoctorDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

const LoadingFallback = () => (
  <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
    <div className="w-7 h-7 border-2 border-[#1C1917] border-t-[#C85A32] rounded-full animate-spin" />
  </div>
);

// Protected route wrapper enforcing authenticated roles
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'PATIENT') return <Navigate to="/patient" replace />;
    if (user.role === 'DOCTOR') return <Navigate to="/doctor" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

// Root index redirect based on user role
const RootRedirect = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'PATIENT') return <Navigate to="/patient" replace />;
  if (user.role === 'DOCTOR') return <Navigate to="/doctor" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;

  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Root redirect */}
            <Route path="/" element={<RootRedirect />} />

            {/* Patient Sidebar Views */}
            <Route
              path="/patient"
              element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <PatientDashboard view="overview" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/appointments"
              element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <PatientDashboard view="appointments" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/records"
              element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <PatientDashboard view="records" />
                </ProtectedRoute>
              }
            />
            <Route path="/patient/*" element={<Navigate to="/patient" replace />} />

            {/* Doctor Sidebar Views */}
            <Route
              path="/doctor"
              element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                  <DoctorDashboard view="queue" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/appointments"
              element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                  <DoctorDashboard view="appointments" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/reports"
              element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                  <DoctorDashboard view="reports" />
                </ProtectedRoute>
              }
            />
            <Route path="/doctor/*" element={<Navigate to="/doctor" replace />} />

            {/* Admin Sidebar Views */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard view="overview" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/doctors"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard view="doctors" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/appointments"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard view="appointments" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/infra"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard view="infra" />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/*" element={<Navigate to="/admin" replace />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
