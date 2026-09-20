import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const RoleRoute = ({ children, allowedRole }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner size="lg" text="Verifying permissions..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?role=${allowedRole}`} replace />;
  }

  if (user?.role !== allowedRole) {
    // If buyer tries to access seller, redirect to home with warning
    if (allowedRole === 'seller') {
      return <Navigate to="/" replace />;
    }
    // If seller tries to access buyer checkout/cart, redirect to seller dashboard
    if (allowedRole === 'buyer') {
      return <Navigate to="/seller" replace />;
    }
  }

  return children;
};
