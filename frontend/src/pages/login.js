import React from 'react';
import Hubpage from './hubpage';
import { Navigate, useNavigate } from 'react-router-dom'; 

function Login() {
   const navigate = useNavigate(); 
 
  return (
    <div>
      <Hubpage>
      </Hubpage>
    <div className='wrapper'>
      <form action="">
      <h1>Login</h1>
      <div className="input-box">
        <input type="text" placeholder='Username' required/>

      </div>
      <div className ="input-box">
        <input type="text" PLACEHOLDER ='Password' required/>

      </div>
      <div className='remember=forgot'>
        <label><input type="checkbox"/>Remember me</label>
        <button  onClick={() => navigate('/signup')}>
        Create an account
      </button>
      </div>
      </form>
    </div>
    </div>
  );
}

export default Login;