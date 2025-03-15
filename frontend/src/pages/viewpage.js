import React, { useState, useEffect } from 'react';
import Hubpage from './hubpage';

function Viewpage() {
  const [pdfText, setPdfText] = useState(''); // store PDF text
  const [summary, setSummary] = useState(''); // store summary
  const [loading, setLoading] = useState(false); // track loading 
  const [userId, setUserId] = useState(null); 

 
  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(storedUserId); 
    } else {
      alert('Please log in first'); 
    }
  }, []);

    //  handle PDF file
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
        throw new Error(errorData.message || 'Error uploading PDF');
      }

      const uploadResult = await uploadResponse.json();
      setPdfText(uploadResult.pdf_text);

      // gets summary text
      const summarizeResponse = await fetch(`http://localhost:5000/summarize/${userId}`, {
        method: 'POST',
      });

      if (!summarizeResponse.ok) {
        const errorData = await summarizeResponse.json();
        throw new Error(errorData.message || 'Error generating summary');
      }

      const summarizeResult = await summarizeResponse.json();
      setSummary(summarizeResult.summary);
    } catch (error) {
      console.error('Error:', error.message);
      alert(error.message || 'An error occurred while processing the PDF');
    } finally {
      setLoading(false); // stop loading
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
      {loading && <p>Loading PDF...</p>}
      {pdfText && (
        <div>
          <h3>Extracted Text:</h3>
          <pre>{pdfText}</pre>
        </div>
      )}
      {summary && (
        <div>
          <h3>Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default Viewpage;
