import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import TokenClass from '../Service/AuthService';
import { setAuthentication } from '../AuthGuard/AuthContext';
import './Header.css';

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        TokenClass.clearToken();
        setAuthentication(false);
        navigate('/auth', { replace: true });
    };

    return (
        <header className="common-header">
            <div className="brand">
                <Link to="/dashboard" className="brand-title">
                    SyncBoard
                </Link>
                <nav className="nav-links">
                    <Link
                        to="/dashboard"
                        className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                    >
                        [Dashboard]
                    </Link>
                    <a
                        href="#boards-section"
                        className="nav-link"
                    >
                        [Boards]
                    </a>
                    <a
                        href="#activity-section"
                        className="nav-link"
                    >
                        [Activity]
                    </a>
                </nav>
            </div>

            <div className="header-right">
                <span className="user-badge">
                    ● AUTHENTICATED
                </span>
                <button
                    type="button"
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </header>
    );
}
