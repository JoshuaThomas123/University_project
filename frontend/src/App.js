import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Homepage from './pages/homepage';
import Viewpage from './pages/viewpage';
import Login from './pages/login';
import Signup from './pages/signup';
import Question from './pages/viewpage_question';
import Flashcard from './pages/viewpage_flashcard';
import Mindmaps from './pages/viewpage_mindmaps';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 


  const handleLogin = () => {
    setIsAuthenticated(true);
  };


  const handleLogout = () => {
    setIsAuthenticated(false);
  }; // sets login to true and logout to false

 
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }; // prevent users from accessing other pages

  return (
    <Router>
      <div>
   
        <nav style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
          <button onClick={handleLogout}>Logout</button>
        </nav>

        <Routes>
         
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />

         
          <Route
            path="/viewpage"
            element={
              <ProtectedRoute>
                <Viewpage />
              </ProtectedRoute>
            }
          />
           <Route
            path="/Viewpage_Question"
            element={
              <ProtectedRoute>
                <Question />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Viewpage_Flashcard"
            element={
              <ProtectedRoute>
                <Flashcard />
              </ProtectedRoute>
            }
          />
            <Route
            path="/Viewpage_Mindmap"
            element={
              <ProtectedRoute>
                <Mindmaps />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

