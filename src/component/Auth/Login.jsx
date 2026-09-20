import { useState } from 'react';
import { signUpSubmit, loginSubmit } from '../api/loginApi.jsx';

const DefaultForm = {
    name: "",
    email: "",
    password: ""
};

export default function Login() {
    const [loginState, setLoginState] = useState(DefaultForm);
    const [loginAuthType, setLoginAuthType] = useState(false);
    const [loading, setLoading] = useState(false);

    const onAction = async (e) => {
        e.preventDefault();
        setLoading(true);
        const response = await (loginAuthType ? loginSubmit : signUpSubmit)(loginState);
        setLoading(false);
        if (response != null) {
            loginAuthType === false && setLoginAuthType(!loginAuthType);
            console.log(response);
        }
    };

    return (
        <>
            <div className='header'>
                <div className='left'>
                    SyncBoard
                </div>
            </div>
            <div className='form'>
                <form onSubmit={onAction}>
                    {
                        Object.keys(DefaultForm)
                            .filter((key) => !(loginAuthType && key === 'name'))
                            .map((key) => {
                                return (
                                    <div className='form-input' key={key}>
                                        {/* Capitalize the first letter for the label */}
                                        <label htmlFor={key}>
                                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                                        </label>
                                        <input
                                            disabled={loading}
                                            id={key}
                                            required
                                            minLength={3}
                                            maxLength={20}
                                            type={key === 'password' ? 'password' : 'text'}
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
                        {/* Dynamic button text based on the auth mode */}
                        <button type='submit' disabled={loading}>
                            {loginAuthType ? 'Login' : 'Sign Up'}
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
                        }}
                    >
                        {loginAuthType ? "Don't have an account? Sign Up" : "Already Signed Up? Login"}
                    </button>
                </div>
            </div>
        </>
    );
}
