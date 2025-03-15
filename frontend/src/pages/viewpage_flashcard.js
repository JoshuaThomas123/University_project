import React, { useState, useEffect } from 'react';
import Hubpage from './hubpage';

function Viewpage_Flashcard() {
  const [flashcards, setFlashcards] = useState([]); //  To store flashcards
  const [loading, setLoading] = useState(false); //for loading 
  const [userId, setUserId] = useState(null); 

  
  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(storedUserId); 
    } else {
      alert('Please log in first'); 
    }
  }, []);

 //handle pdf file
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

       // upload pdf
      const uploadResponse = await fetch(`http://localhost:5000/upload_pdf/${userId}`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || 'Failed to upload the PDF file.');
      }

      const uploadResult = await uploadResponse.json();

       // creates flashcard
      const flashcardResponse = await fetch(`http://localhost:5000/generate_flashcards/${userId}`, {
        method: 'POST',
      });

      if (!flashcardResponse.ok) {
        const errorData = await flashcardResponse.json();
        throw new Error(errorData.message || 'Error generating flashcards');
      }   // check

      const flashcardResult = await flashcardResponse.json();
      const parsedFlashcards = Array.isArray(flashcardResult.flashcards) ? flashcardResult.flashcards : [];
      setFlashcards(parsedFlashcards);
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

      
      {loading && <p>Loading PDF and generating flashcards...</p>}

      
      {flashcards.length > 0 && (
        <div>
          <h3>Generated Flashcards:</h3>
          <ul>
            {flashcards.map((flashcard, index) => (
              <li key={index}>
                <strong>{flashcard.question}</strong>:<br />
                {flashcard.answer}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Viewpage_Flashcard;
