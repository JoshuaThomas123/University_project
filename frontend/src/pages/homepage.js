import React from 'react';
import App from '../App'; 
import Hubpage from './hubpage';
import image1 from '../images/flashcards.png';
import fro222 from '../images/MINDMAPS.jpg';
import summary from '../images/summary.png';
import questions from '../images/Icon-round-Question_mark.png';
import { Navigate, useNavigate } from 'react-router-dom'; 
function Homepage() {
  const layout = {
    padding: '20px',
    fontSize: '18px',
    color: '#333',
    lineHeight: '1.6',
  }; // main style
  const image2 = {
    display: 'flex', 
    justifyContent: 'space-between', 
    padding: '10px', 
    backgroundColor: '#f9f9f9', 
  }; // button style

  const image = {
    width: '10%', 
    borderRadius: '0px', 
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
  }; // photo style
  const button = {
    padding: '10px 20px', 
    fontSize: '16px',
    backgroundColor: '#ff6347', 
    color: 'white', 
    border: 'none', 
    borderRadius: '5px',
    cursor: 'pointer', 
  }; // text spacing, size and color
  const navigate = useNavigate(); 

  return (
    <div>
      
    
      <Hubpage />
     
      
      <main style={layout}>
        <h1>Welcome to the Homepage</h1>
      </main>
      <div  style ={image2}>
      <img
        src={image1} 
         alt="Placeholder 1"
         style = {image}
        
        
      />
      <img
      src = {fro222}
       
        alt="Placeholder 2"
        style ={image}
        
      />
      <img
        src={summary}
        style ={image}
        alt="Placeholder 3"
        
      />
       <img
        src={questions}
        style ={image}
        alt="Placeholder 4"
        
      />
      </div>
      <div style = {image2}>
      <button style={button} onClick={() => navigate('/Viewpage_Flashcard')}>
        flashcards
      </button>
      <button style={button} onClick={() => navigate('/Viewpage_Mindmap')}>
        mindmaps
      </button>
      <button style={button} onClick={() => navigate('/viewpage')}>
       summary page
      </button>
      <button style={button} onClick={() => navigate('/Viewpage_Question')}>
        questions
      </button>

      </div>
    </div>
    
  );
}

export default Homepage;
