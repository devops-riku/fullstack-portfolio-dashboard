
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Login } from '../features/auth/pages/Login';
import { ProjectList } from '../features/projects/pages/ProjectList';
import { UserProfile } from '../features/users/pages/UserProfile';
import { Portfolio } from '../features/portfolio/pages/Portfolio';

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
        path: '',
        element: <Portfolio />
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <ProjectList />
          </ProtectedRoute>
        )
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  }
]);
