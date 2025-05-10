import React, { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        userName: username,
        password: password,
      });

      const token = response.data;
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login Failed:', err);
      setError('Invalid username or password!');
    }
  };

  return (
    <div style={{
      height: '100vh',
      background: 'linear-gradient(to right, #74ebd5, #ACB6E5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif',
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '40px 30px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        width: '340px',
        maxWidth: '90%',
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '20px',
          color: '#333',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          🎓 Student Vaccination Login
        </h1>

        <p style={{ textAlign: 'center', color: '#777', marginBottom: '10px' }}>
          Welcome to the Vaccination Management Portal
        </p>

        {error && <p style={{
          color: 'red',
          backgroundColor: '#ffe5e5',
          borderRadius: '5px',
          padding: '8px',
          textAlign: 'center',
          fontSize: '14px',
          marginBottom: '10px'
        }}>{error}</p>}

        <InputField
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <InputField
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div style={{ marginTop: '20px' }}>
          <Button label="Login" onClick={handleLogin} />
        </div>

        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '13px', color: '#666' }}>
          Don't have an account? Contact admin.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
