import React, { useState } from 'react';
import Hubpage from './hubpage';

function Viewpage() {
  const [pdfText, setPdfText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);

        
        const response = await fetch('http://localhost:5000/upload_pdf/1', { 
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        if (response.ok) {
          setPdfText(result.pdf_text); 
          setSummary(result.summary); 
        } else {
          alert(result.message || 'Failed to process the PDF file.');
        }
      } catch (error) {
        console.error('Error uploading PDF:', error);
        alert('Failed to process the PDF file.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  return (
    <div>
      <Hubpage />
      <h2>Upload a PDF File</h2>
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />
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
