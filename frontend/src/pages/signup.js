import React from 'react';
import Hubpage from './hubpage';
import { Navigate, useNavigate } from 'react-router-dom'; 

function signup() {
   
 
  return (
    <div>
      <Hubpage>
      </Hubpage>
    <div className='wrapper'>
      <form action="">
      <h1>Signup</h1>
      <div>
        <p1>username</p1>
        <p1> email</p1>
      </div>
      <div className="input-box">
        <input type="text" placeholder='Username' required/>
        <input type="text" placeholder='Email' required/>

      </div>
      <div className ="input-box">
      <div>
        <p1>Password</p1>
        
      </div>
        <input type="text" PLACEHOLDER ='Password' required/>

      </div>
      <div>
      <div>
        <p1>DOB</p1>
      </div>
      <input type="text" PLACEHOLDER ='DOB' required/>
       
      

      </div>
      </form>
    </div>
    </div>
  );
}

export default signup;