import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin }) => {
    const { user, loading } = useContext(AuthContext);

    // Wait for auth state to load from localStorage before redirecting
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <p style={{ fontSize: '1.2rem', color: '#7a635c' }}>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" />;
    }

    if (requireAdmin && !user.isAdmin) {
        return <Navigate to="/store" />;
    }

    return children;
};

export default ProtectedRoute;
