import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';
import Header from '../Header/Header';
import TokenClass from '../Service/AuthService';

export default function AuthGuard() {
    const navigate = useNavigate();
    const [isAuthenticated] = AuthContext();
    const hasToken = Boolean(TokenClass.getToken());

    useEffect(() => {
        if (!isAuthenticated && !hasToken) {
            navigate('/auth', { replace: true });
        }
    }, [isAuthenticated, hasToken, navigate]);

    if (!isAuthenticated && !hasToken) {
        return null;
    }

    return (
        <div className="authenticated-layout">
            <Header />
            <main className="authenticated-main">
                <Outlet />
            </main>
        </div>
    );
}