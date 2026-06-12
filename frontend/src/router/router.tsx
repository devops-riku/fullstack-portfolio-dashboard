
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Login } from '../features/auth/pages/Login';
import { Portfolio } from '../features/portfolio/pages/Portfolio';
import { DashboardLayout } from '../features/dashboard/components/DashboardLayout';
import { DashboardConsole } from '../features/dashboard/pages/DashboardConsole';
import { DashboardPortfolio } from '../features/dashboard/pages/DashboardPortfolio';
import { DashboardProjects } from '../features/dashboard/pages/DashboardProjects';
import { DashboardSkills } from '../features/dashboard/pages/DashboardSkills';
import { DashboardExperience } from '../features/dashboard/pages/DashboardExperience';
import { DashboardAccount } from '../features/dashboard/pages/DashboardAccount';

// eslint-disable-next-line react-refresh/only-export-components
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!localStorage.getItem('token')) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Portfolio />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard/console" replace /> },
      { path: 'console',    element: <DashboardConsole /> },
      { path: 'portfolio',  element: <DashboardPortfolio /> },
      { path: 'projects',   element: <DashboardProjects /> },
      { path: 'skills',     element: <DashboardSkills /> },
      { path: 'experience', element: <DashboardExperience /> },
      { path: 'account',    element: <DashboardAccount /> },
    ],
  },
  // Legacy redirect — /profile used to be the account page
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Navigate to="/dashboard/account" replace />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
]);
