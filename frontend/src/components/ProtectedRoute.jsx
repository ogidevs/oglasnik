import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from './Spinner';

const ProtectedRoute = ({ adminOnly = false }) => {
    const { isAuthed, user, isLoading } = useAuth();

    if (isLoading) return <Spinner />;
    if (!isLoading && !isAuthed && !user) return <Navigate to="/login" replace />;
    if (adminOnly && user.role !== 'ROLE_ADMIN') return <Navigate to="/" replace />;

    return <Outlet />;
};

export default ProtectedRoute;