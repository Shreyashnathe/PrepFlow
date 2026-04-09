import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Login from './pages/Login';
import CompanySelection from './pages/CompanySelection';
import SimulationEngine from './pages/SimulationEngine';
import ResultDashboard from './pages/ResultDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './pages/UserProfile';
import LandingPage from './pages/LandingPage';
import './index.css';

function App() {
  return (
    <AppProvider>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#334155',
          color: '#fff',
        },
      }}/>
      <Router>
        <div className="orb-1"></div>
        <div className="orb-2"></div>
          <Routes>
            <Route path="/login" element={<div className="app-container"><Login /></div>} />
            <Route path="/home" element={
              <div className="app-container">
                <ProtectedRoute>
                  <CompanySelection />
                </ProtectedRoute>
              </div>
            } />
            <Route path="/simulate" element={
              <div className="app-container">
                <ProtectedRoute>
                  <SimulationEngine />
                </ProtectedRoute>
              </div>
            } />
            <Route path="/result" element={
              <div className="app-container">
                <ProtectedRoute>
                  <ResultDashboard />
                </ProtectedRoute>
              </div>
            } />
            <Route path="/profile" element={
              <div className="app-container">
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              </div>
            } />
            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
