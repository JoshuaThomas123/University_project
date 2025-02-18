import React, { useState } from 'react';
import Hubpage from './hubpage';

function Viewpage() {
  const [pdfText, setPdfText] = useState(''); 
  const [loading, setLoading] = useState(false);

  
  const handleFileUpload = async (event) => {
    const file = event.target.files[0]; 
    if (file && file.type === 'application/pdf') {
      setLoading(true); 
      try {
        const text = await extractTextFromPDF(file);
        setPdfText(text); 
      } catch (error) {
        console.error('Error extracting PDF text:', error);
        alert('Failed to process the PDF file.');
      } finally {
        setLoading(false); 
      }
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  
  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer(); 
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise; 

    let fullText = '';

  
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();

      
      const pageText = textContent.items.map((item) => item.str).join(' ');
      fullText += pageText + '\n'; 
    }

    return fullText; 
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
    </div>
  );
}

export default Viewpage;
