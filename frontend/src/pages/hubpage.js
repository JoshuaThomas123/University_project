import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './hubpage.css'; 

function Hubpage() {
  const navigate = useNavigate(); 

  const header = {
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '20px', 
    backgroundColor: '#282c34', 
    color: 'white', 
  };

  const title = {
    fontSize: '24px', 
    fontWeight: 'bold', 
    margin: 0, 
  };

  const button = {
    padding: '10px 20px', 
    fontSize: '16px', 
    backgroundColor: '#ff6347', 
    color: 'white', 
    border: 'none', 
    borderRadius: '5px',
    cursor: 'pointer', 
  };

  return (
    <header style={header}>
       <p style={title} onClick={() => navigate('/')}  >Studybot</p>
      <button style={button} onClick={() => navigate('/Login')}>
        Login
      </button>
    </header>
  );
}

export default Hubpage;
