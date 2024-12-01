import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setToken, setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_THE_LINK}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Invalid login');
                return;
            }

            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                setToken(data.token);
                setIsLoggedIn(true);
                navigate("/")
            } else {
                setErrorMessage('Invalid login');
            }
        } catch (error) {
            setErrorMessage('An error occurred. Please try again later.');
            console.error('Login error:', error);
        }
    };

    return (
        <div className='page'>
            <div className='navbar'>
                <h1 className='heading'>Habit Tracker</h1>
                <img src={require('./assets/profile.png')} className='profileimg' alt='profileimg' />
            </div>
            <div className='bottom-section'>
                <h2 className='loginheading'>Login</h2>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label className='formlable'>Email</label>
                        <input
                            className='inputtext'
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label className='formlable'>Password</label>
                        <input
                            className='inputtext'
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px' }}>
                        <button type="submit" className='lbtn2'>Login</button>
                    </div>
                </form>
                <p onClick={()=>{navigate('/register')}} style={{marginTop: '10px', fontFamily:"EB Garamond", fontWeight: 400, fontSize: '16px', color: '#36454f', cursor: 'pointer'}}>Don't have an account? Register</p>
            </div>
        </div>
    );
};

export default LoginPage;
