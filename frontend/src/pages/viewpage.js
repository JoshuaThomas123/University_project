import React, { useState } from 'react';
import Hubpage from './hubpage';

function Viewpage() {
  const [pdfText, setPdfText] = useState(''); // store pdf text
  const [summary, setSummary] = useState(''); // store summary
  const [loading, setLoading] = useState(false); // track loading

  //  handle PDF file 
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

        if (uploadResponse.ok) {
         
          setPdfText(uploadResult.pdf_text);

          // gets summary text
          const summarizeResponse = await fetch('http://localhost:5000/summarize/1', {
            method: 'POST',
          });

          const summarizeResult = await summarizeResponse.json();

          if (summarizeResponse.ok) {
            setSummary(summarizeResult.summary); 
          } else {
            alert(summarizeResult.message || 'Error creating summary');
          }
        } else {
          alert(uploadResult.message || 'Error processing');
        }
      } catch (error) {
        console.error('Error uploading PDF:', error);
        alert('Error processing the PDF');
      } finally {
        setLoading(false); // stop loading
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
