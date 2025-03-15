import React, { useState, useEffect } from 'react';
import Hubpage from './hubpage';

function Viewpage_Mindmaps() {
  const [mindmap, setMindmap] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [userId, setUserId] = useState(null); 

  
  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(storedUserId); 
    } else {
      alert('Please log in first'); 
    }
  }, []);

   //  handles file
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

       // upload file
      const uploadResponse = await fetch(`http://localhost:5000/upload_pdf/${userId}`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || 'Failed to upload the PDF file.');
      }

      const uploadResult = await uploadResponse.json();

     
      const mindmapResponse = await fetch(`http://localhost:5000/generate_mindmap/${userId}`, {
        method: 'POST',
      }); // gets mindmap


      if (!mindmapResponse.ok) {
        const errorData = await mindmapResponse.json();
        throw new Error(errorData.message || 'Error generating mind map');
      }

      const mindmapResult = await mindmapResponse.json();
      const parsedMindmap = mindmapResult.mindmap || {};
      setMindmap(parsedMindmap);
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
