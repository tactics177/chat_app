import React, { useState } from 'react';
import { login } from '../services/api';

interface LoginFormProps {
  onLogin: (token: string, username: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      if (response.token) {
        localStorage.setItem('jwtToken', response.token); // Store token in localStorage
        localStorage.setItem('username', response.username); // Store username in localStorage
        onLogin(response.token, response.username);
      } else {
        setError('Invalid username or password');
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
      </form>
    </div>
  );
};

export default LoginForm;
