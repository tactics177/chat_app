import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

interface LoginFormProps {
  onLogin: (token: string, username: string, userId: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      if (response.token && response.username && response.userId) {
        localStorage.setItem('jwtToken', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('userId', response.userId);
        onLogin(response.token, response.username, response.userId);
        navigate('/'); // Redirect to chat page
      } else {
        throw new Error('Invalid login response');
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit} className="card p-4">
        <h2>Login</h2>
        {error && <p className="text-danger">{error}</p>}
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
        <p className="mt-2">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
