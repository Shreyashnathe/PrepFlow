import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Login from './pages/Login';
import CompanySelection from './pages/CompanySelection';
import SimulationEngine from './pages/SimulationEngine';
import ResultDashboard from './pages/ResultDashboard';
import ProtectedRoute from './components/ProtectedRoute';
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
        <div className="app-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={
              <ProtectedRoute>
                <CompanySelection />
              </ProtectedRoute>
            } />
            <Route path="/simulate" element={
              <ProtectedRoute>
                <SimulationEngine />
              </ProtectedRoute>
            } />
            <Route path="/result" element={
              <ProtectedRoute>
                <ResultDashboard />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
