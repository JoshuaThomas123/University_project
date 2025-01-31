import React from 'react';
import App from '../App'; 
import Hubpage from './hubpage';
import image from '../images/flashcards.png';
import fro222 from '../images/MINDMAPS.jpg';
import summary from '../images/summary.png';
import questions from '../images/Icon-round-Question_mark.png';
import { Navigate, useNavigate } from 'react-router-dom'; 
function Homepage() {
  const mainStyle = {
    padding: '20px',
    fontSize: '18px',
    color: '#333',
    lineHeight: '1.6',
  };
  const galleryStyle = {
    display: 'flex', 
    justifyContent: 'space-between', 
    padding: '10px', 
    backgroundColor: '#f9f9f9', 
  };

  const imageStyle = {
    width: '10%', 
    borderRadius: '0px', 
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
  };
  const buttonStyle = {
    padding: '10px 20px', 
    fontSize: '16px',
    backgroundColor: '#ff6347', 
    color: 'white', 
    border: 'none', 
    borderRadius: '5px',
    cursor: 'pointer', 
  };
  const navigate = useNavigate(); 

  return (
    <div>
      
    
      <Hubpage />
     
      
      <main style={mainStyle}>
        <h1>Welcome to the Homepage</h1>
      </main>
      <div  style ={galleryStyle}>
      <img
        src={image} 
         alt="Placeholder 1"
         style = {imageStyle}
        
        
      />
      <img
      src = {fro222}
       
        alt="Placeholder 2"
        style ={imageStyle}
        
      />
      <img
        src={summary}
        style ={imageStyle}
        alt="Placeholder 3"
        
      />
       <img
        src={questions}
        style ={imageStyle}
        alt="Placeholder 4"
        
      />
      </div>
      <div style = {galleryStyle}>
      <button style={buttonStyle} onClick={() => navigate('/viewpage')}>
        flashcards
      </button>
      <button style={buttonStyle} onClick={() => navigate('/viewpage')}>
        mindmaps
      </button>
      <button style={buttonStyle} onClick={() => navigate('/viewpage')}>
       summary page
      </button>
      <button style={buttonStyle} onClick={() => navigate('/viewpage')}>
        questions
      </button>

      </div>
    </div>
    
  );
}

export default Homepage;