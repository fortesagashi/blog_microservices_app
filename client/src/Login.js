import React, { useState } from 'react';
import axios from 'axios';
import './style.css'; 
import Cookies from 'js-cookie';


const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const register = async () => {
    try {
      await axios.post('http://localhost:4002/register', { email, password });
      setMessage('User created successfully');
    } catch (error) {
      console.log(error);
      setMessage('Error creating user');
    }
  };

  const login = async () => {
    try {
      const response = await axios.post('http://localhost:4002/login', { email, password });
      const { token } = response.data;
      Cookies.set('authToken', token, { expires: 1/24 }); // set the cookie to expire after 7 days
      setMessage('Logged in successfully');
      window.location.reload();
    } catch (error) {
      console.log(error);
      setMessage('Invalid credentials');
    }
  };
  return (
    <div className="app-container">
      <div className="LoginForm"> 
        <h1>User Login</h1>
        <div>
          <label>Email:</label>
          <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div>
          <button onClick={register}>Register</button>
          <button onClick={login}>Login</button>
        </div>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default App;
