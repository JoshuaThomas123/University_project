import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  }); // store username and password
  const [error, setError] = useState(''); 
  const navigate = useNavigate(); 

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }); // takes user info from there signup

      const result = await response.json();

      if (response.ok) {
        alert('Login successful!');
        onLogin(); 
        navigate('/'); 
      } else {
        setError(result.message || 'Invalid');
      }
    } catch (err) {
      setError('try again.');
      console.error('Error during login:', err);
    }
  };

  return (
    <div>
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>

          
          <div className="input-box">
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          
          <div className="input-box">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

         
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <button type="button" onClick={() => navigate('/signup')}>
              Create an account
            </button>
          </div>

         
          {error && <p style={{ color: 'red' }}>{error}</p>}

          
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;

