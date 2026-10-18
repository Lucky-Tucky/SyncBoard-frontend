import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginSubmit, signUpSubmit } from '../api/loginApi.jsx';
import TokenClass from '../Service/AuthService.js';
import { setAuthentication } from '../AuthGuard/AuthContext';

const DefaultForm = {
    name: "",
    email: "",
    password: ""
};

export default function Login() {
    const navigate = useNavigate();
    const [loginState, setLoginState] = useState(DefaultForm);
    const [loginAuthType, setLoginAuthType] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const onAction = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        try {
            if (loginAuthType) {
                await loginSubmit(loginState);
            } else {
                await signUpSubmit(loginState);
            }
            if (TokenClass.getToken()) {
                setAuthentication(true);
                navigate('/dashboard');
            } else if (!loginAuthType) {
                setLoginAuthType(true);
                setErrorMsg("Account created! Please enter credentials to login.");
            }
        } catch (error) {
            setErrorMsg(error?.message || "Authentication failed. You can also use Demo Login below.");
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = () => {
        TokenClass.setToken("demo_syncboard_jwt_token_auth");
        setAuthentication(true);
        navigate('/dashboard');
    };

    useEffect(() => {
        TokenClass.clearToken();
        setAuthentication(false);
    }, []);

    return (
        <>
            <div className='header'>
                <div className='left'>
                    SyncBoard
                </div>
            </div>
            <div className='form'>
                <form onSubmit={onAction}>
                    {errorMsg && (
                        <div style={{
                            border: '1px solid #000000',
                            padding: '0.65rem 0.85rem',
                            fontSize: '0.825rem',
                            fontFamily: 'monospace',
                            backgroundColor: '#ffffff'
                        }}>
                            {errorMsg}
                        </div>
                    )}
                    {
                        Object.keys(DefaultForm)
                            .filter((key) => !(loginAuthType && key === 'name'))
                            .map((key) => {
                                return (
                                    <div className='form-input' key={key}>
                                        <label htmlFor={key}>
                                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                                        </label>
                                        <input
                                            disabled={loading}
                                            id={key}
                                            required
                                            minLength={3}
                                            maxLength={50}
                                            type={key === 'password' ? 'password' : (key === 'email' ? 'email' : 'text')}
                                            value={loginState[key] || ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setLoginState({ ...loginState, [key]: value });
                                            }}
                                        />
                                    </div>
                                );
                            })
                    }
                    <div className='form-input'>
                        <button type='submit' disabled={loading}>
                            {loginAuthType ? 'Login' : 'Sign Up'}
                        </button>
                    </div>

                    <div className='form-input'>
                        <button
                            type='button'
                            style={{
                                border: '1px solid #000000',
                                background: '#000000',
                                color: '#ffffff',
                                padding: '0.75rem',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontFamily: 'inherit'
                            }}
                            onClick={handleDemoLogin}
                        >
                            [Quick Demo Access → Dashboard]
                        </button>
                    </div>
                </form>
                <div>
                    <button
                        disabled={loading}
                        type='button'
                        onClick={() => {
                            setLoginAuthType(!loginAuthType);
                            setLoginState(DefaultForm);
                            setErrorMsg("");
                        }}
                    >
                        {loginAuthType ? "Don't have an account? Sign Up" : "Already Signed Up? Login"}
                    </button>
                </div>
            </div>
        </>
    );
}

