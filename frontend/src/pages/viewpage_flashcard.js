import React, { useState } from 'react';
import Hubpage from './hubpage';

function Viewpage_Flashcard() {
  const [flashcards, setFlashcards] = useState([]); //  To store flashcards
  const [loading, setLoading] = useState(false); //for loading 

  //handle pdf file
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);

        // upload pdf
        const uploadResponse = await fetch('http://localhost:5000/upload_pdf/1', {
          method: 'POST',
          body: formData,
        });
        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadResult.message || 'Failed to upload the PDF file.');
        }

        // creates flashcard
        const flashcardResponse = await fetch('http://localhost:5000/generate_flashcards/1', {
          method: 'POST',
        });
        const flashcardResult = await flashcardResponse.json();

        if (flashcardResponse.ok) {
          // check
          const parsedFlashcards = Array.isArray(flashcardResult.flashcards) ? flashcardResult.flashcards : [];
          setFlashcards(parsedFlashcards);
        } else {
          throw new Error(flashcardResult.message || 'Failed');
        }
      } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'An error with the pdf');
      } finally {
        setLoading(false);
      }
    } else {
      alert('error with uploading pdf');
    }
  };

  return (
    <div>
      <Hubpage />
      <h2>Upload a PDF File</h2>
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />
      
      {loading && <p>Loading PDF and generating flashcards...</p>}
     
      {flashcards.length > 0 && (
        <div>
          <h3>Generated Flashcards:</h3>
          <ul>
            {flashcards.map((flashcard, index) => (
              <li key={index}>
                 {flashcard.question} :
                <br />
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
