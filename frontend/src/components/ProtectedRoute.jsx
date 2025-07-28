import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from './Spinner';

const ProtectedRoute = ({ adminOnly = false }) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading || !user) return <Spinner />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (adminOnly && user.role !== 'ROLE_ADMIN') return <Navigate to="/" replace />;

    return <Outlet />;
};

export default ProtectedRoute;