// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Layouts
import MainLayout from './components/MainLayout';
import AuthLayout from './components/AuthLayout';

// Pages
import HomePage from './pages/HomePage';
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";

// --- Import Dashboard Layout and Nested Pages ---
// (Adjust paths based on your file structure)
import Dashboard from './pages/Dashboard'; 
import ExplorePage from './pages/Dashboard/ExplorePage';
import ConnectionsPage from './pages/Dashboard/ConnectionsPage';
import MessagesPage from './pages/Dashboard/MessagesPage';
import ProfilePage from './pages/Dashboard/ProfilePage';

import './index.css';

// --- Auth Route Components (These stay the same) ---

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

const PublicOnlyRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};


// --- UPDATED AppRoutes Component ---
const AppRoutes = () => {
  return (
    <Routes>
      
      {/* Group 1: Main Public Routes (with Navbar) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      {/* Group 2: Auth Routes (no Navbar, centered) */}
      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>
      </Route>

      {/* --- Group 3: Protected App Routes (UPDATED) --- */}
      <Route element={<ProtectedRoute />}>
        {/* This route now acts as a layout for all dashboard pages.
          The Dashboard component will have its own <Outlet />
        */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* This makes /dashboard/explore the default page for /dashboard */}
          <Route index element={<Navigate to="explore" replace />} />
          
          {/* Nested Dashboard Pages */}
          <Route path="explore" element={<ExplorePage />} />
          <Route path="connections" element={<ConnectionsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* 404 Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};

// --- Main App Component (Stays the same) ---
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;