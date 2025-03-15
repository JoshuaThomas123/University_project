import React, { useState, useEffect } from 'react';
import Hubpage from './hubpage';

function Viewpage_Question() {
  const [questions, setQuestions] = useState([]); // store questions
  const [loading, setLoading] = useState(false); // for loading
  const [userId, setUserId] = useState(null); 

  
  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(storedUserId); 
    } else {
      alert('Please log in first'); 
    }
  }, []);

  //handles pdf file
  const handleFileUpload = async (event) => {
    if (!userId) {
      return alert('User ID not found. Please log in again.'); 
    }

    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      return alert('Please upload a valid PDF file.');
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      //upload pdf file
      const uploadResponse = await fetch(`http://localhost:5000/upload_pdf/${userId}`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || 'Failed to upload the PDF file.');
      }

      const uploadResult = await uploadResponse.json();

      // create backend
      const questionResponse = await fetch(`http://localhost:5000/generate_questions/${userId}`, {
        method: 'POST',
      });

      if (!questionResponse.ok) {
        const errorData = await questionResponse.json();
        throw new Error(errorData.message || 'Error generating questions');
      }

      const questionResult = await questionResponse.json();
      const parsedQuestions = Array.isArray(questionResult.questions) ? questionResult.questions : [];
      setQuestions(parsedQuestions);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'An error occurred while processing the PDF file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Hubpage />
      <h2>Upload a PDF File</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
      />

      
      {loading && <p>Loading PDF and generating questions...</p>}

      
      {questions.length > 0 && (
        <div>
          <h3>Generated Questions:</h3>
          <ul>
            {questions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Viewpage_Question;
