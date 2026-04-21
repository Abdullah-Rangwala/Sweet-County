import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [mode, setMode] = useState('user'); // 'user' or 'admin'
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { user, login, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    // Redirect already-logged-in users away from login page
    useEffect(() => {
        if (!authLoading && user) {
            navigate(user.isAdmin ? '/admin' : '/store', { replace: true });
        }
    }, [user, authLoading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = isRegistering
                ? 'http://localhost:5000/api/auth/register'
                : 'http://localhost:5000/api/auth/login';

            const body = isRegistering
                ? { name, email, password }
                : { email, password };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Something went wrong');
                setLoading(false);
                return;
            }

            // Check if user is trying admin login but isn't an admin
            if (mode === 'admin' && !data.isAdmin) {
                setError('This account does not have admin privileges.');
                setLoading(false);
                return;
            }

            login(data);
            navigate(mode === 'admin' ? '/admin' : '/store');
        } catch (err) {
            setError('Could not connect to the server. Is the backend running?');
        }
        setLoading(false);
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setIsRegistering(false);
        setEmail('');
        setPassword('');
        setName('');
        setError('');
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #faf7f2 0%, #f0e6d6 100%)',
            padding: '20px'
        }}>
            <div style={{
                background: '#fff',
                padding: '40px',
                borderRadius: '20px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '420px'
            }}>
                {/* Logo */}
                <h1 style={{ textAlign: 'center', color: '#a36b4f', marginBottom: '25px', fontSize: '1.8rem' }}>
                    Sweet County 🍰
                </h1>

                {/* Mode Toggle: User / Admin */}
                <div style={{
                    display: 'flex',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '25px',
                    border: '2px solid #e0d5c1'
                }}>
                    <button
                        onClick={() => switchMode('user')}
                        style={{
                            flex: 1,
                            padding: '12px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '0.95rem',
                            transition: '0.3s',
                            background: mode === 'user' ? '#a36b4f' : 'transparent',
                            color: mode === 'user' ? '#fff' : '#7a635c'
                        }}
                    >
                        👤 Customer Login
                    </button>
                    <button
                        onClick={() => switchMode('admin')}
                        style={{
                            flex: 1,
                            padding: '12px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '0.95rem',
                            transition: '0.3s',
                            background: mode === 'admin' ? '#4b3832' : 'transparent',
                            color: mode === 'admin' ? '#fff' : '#7a635c'
                        }}
                    >
                        🛠️ Admin Login
                    </button>
                </div>

                <h2 style={{ textAlign: 'center', color: '#3d2b1f', marginBottom: '20px', fontSize: '1.3rem' }}>
                    {mode === 'admin'
                        ? 'Admin Access'
                        : (isRegistering ? 'Create Your Account' : 'Welcome Back')}
                </h2>

                {error && (
                    <p style={{
                        color: '#cc4444',
                        textAlign: 'center',
                        marginBottom: '15px',
                        fontSize: '0.9rem',
                        background: '#fff0f0',
                        padding: '10px',
                        borderRadius: '8px'
                    }}>
                        {error}
                    </p>
                )}

                {/* Admin hint */}
                {mode === 'admin' && (
                    <p style={{
                        textAlign: 'center',
                        fontSize: '0.85rem',
                        color: '#7a635c',
                        marginBottom: '15px',
                        background: '#f9f5ef',
                        padding: '10px',
                        borderRadius: '8px'
                    }}>
                        Default: <strong>admin@sweetcounty.com</strong> / <strong>admin123</strong>
                    </p>
                )}
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {isRegistering && mode === 'user' && (
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required 
                            className="search-input"
                            style={{ marginBottom: '0' }}
                        />
                    )}
                    
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                        className="search-input"
                        style={{ marginBottom: '0' }}
                    />
                    
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        className="search-input"
                        style={{ marginBottom: '0' }}
                    />
                    
                    <button
                        type="submit"
                        className="cta-btn"
                        style={{
                            marginTop: '10px',
                            width: '100%',
                            background: mode === 'admin' ? '#4b3832' : '#f1d27a',
                            color: mode === 'admin' ? '#fff' : '#4b3832'
                        }}
                        disabled={loading}
                    >
                        {loading
                            ? 'Please wait...'
                            : mode === 'admin'
                                ? 'Login as Admin'
                                : (isRegistering ? 'Sign Up' : 'Login')}
                    </button>
                </form>

                {/* Toggle register/login — only for user mode */}
                {mode === 'user' && (
                    <p
                        style={{
                            textAlign: 'center',
                            marginTop: '20px',
                            cursor: 'pointer',
                            color: '#a36b4f',
                            fontWeight: 'bold'
                        }}
                        onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                    >
                        {isRegistering ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Login;
