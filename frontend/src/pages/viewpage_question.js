import React, { useState } from 'react';
import Hubpage from './hubpage';

function Viewpage_Question() {
  const [questions, setQuestions] = useState([]); // store questions
  const [loading, setLoading] = useState(false); // for loading

  //handles pdf file
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            //upload pdf file
            const uploadResponse = await fetch('http://localhost:5000/upload_pdf/1', {
                method: 'POST',
                body: formData,
            });

            const uploadResult = await uploadResponse.json();
            if (!uploadResponse.ok) {
                throw new Error(uploadResult.message || 'Failed to upload the PDF file.');
            }

            // create backend
            const questionResponse = await fetch('http://localhost:5000/generate_questions/1', {
                method: 'POST',
            });

            const questionResult = await questionResponse.json();
            if (questionResponse.ok) {
                const parsedQuestions = Array.isArray(questionResult.questions) ? questionResult.questions : [];
                setQuestions(parsedQuestions);
            } else {
                throw new Error(questionResult.message || 'Error creating questions');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Error processing pdf file');
        } finally {
            setLoading(false);
        }
    } else {
        alert('Upload a pdf file');
    }
};
  return (
    <div>
      <Hubpage />
      <h2>Upload a PDF File</h2>
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />

     
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