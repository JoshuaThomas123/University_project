import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/homepage';
import Viewpage from './pages/viewpage';
import Login from './pages/login';
import Signup from './pages/signup';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 


  const handleLogin = () => {
    setIsAuthenticated(true);
  };


  const handleLogout = () => {
    setIsAuthenticated(false);
  };

 
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
