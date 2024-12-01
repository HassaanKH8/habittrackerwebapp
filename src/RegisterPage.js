import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const backendUrl = process.env.REACT_APP_THE_LINK;

  const handleRegister = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Registration failed');
        return;
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/login')
      } else {
        setErrorMessage('Registration failed');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
      console.error('Registration error:', error);
    }
  };

  return (
    <div className='page'>
      <div className='navbar'>
        <h1 className='heading'>Habit Tracker</h1>
        <img src={require('./assets/profile.png')} className='profileimg' alt='profileimg' />
      </div>
      <div className='bottom-section'>
        <h2 className='loginheading'>Register</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label className='formlable'>Username</label>
            <input
              className='inputtext'
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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
          {errorMessage && <p style={{ color: '#ff424f', textAlign: 'center', marginTop: '10px' }}>{errorMessage}</p>}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px' }}>
            <button type="submit" className='lbtn2'>Register</button>
          </div>
        </form>
        <p onClick={()=>{navigate('/login')}} style={{marginTop: '10px', fontFamily:"EB Garamond", fontWeight: 400, fontSize: '16px', color: '#36454f', cursor: 'pointer'}}>Already have an account? Login</p>

      </div>
    </div>
  );
};

export default RegisterPage;
