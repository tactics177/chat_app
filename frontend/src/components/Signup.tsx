import React, { useState } from 'react';
import axios from 'axios';

const Signup: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSignup = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await axios.post('/users', { username, email, password });
            setSuccess('User created successfully');
            setError('');
        } catch (err) {
            setError('Username or Email already exists');
            setSuccess('');
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSignup}>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {error && <p>{error}</p>}
                {success && <p>{success}</p>}
                <button type="submit">Signup</button>
            </form>
        </div>
    );
};

export default Signup;
