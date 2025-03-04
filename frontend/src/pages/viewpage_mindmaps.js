import React, { useState } from 'react';
import Hubpage from './hubpage';

function Viewpage_Mindmaps() {
  const [mindmap, setMindmap] = useState(null); 
  const [loading, setLoading] = useState(false); 

  //  handles file
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('http://localhost:5000/upload_pdf/1', {
          method: 'POST',
          body: formData,
        }); // upload file
        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok) {
          throw new Error(uploadResult.message || 'error with uploading pdf');
        }

        
        const mindmapResponse = await fetch('http://localhost:5000/generate_mindmap/1', {
          method: 'POST',
        }); // gets mindmap
        const mindmapResult = await mindmapResponse.json();

        if (mindmapResponse.ok) {
          
          const parsedMindmap = mindmapResult.mindmap || {};
          setMindmap(parsedMindmap);
        } else {
          throw new Error(mindmapResult.message || 'Failed');
        }
      } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Error whilst processing');
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
      {loading && <p>Loading PDF and generating mind map...</p>}
      {mindmap && Object.keys(mindmap).length > 0 && (
        <div>
          <h3>Generated Mind Map:</h3>
          <ul>
            {Object.entries(mindmap).map(([topic, subtopics], index) => (
              <li key={index}>
                <strong>{topic}</strong>
                <ul>
                  {subtopics.map((subtopic, idx) => (
                    <li key={idx}>{subtopic}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Viewpage_Mindmaps;