import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import CompanySelection from './pages/CompanySelection';
import SimulationEngine from './pages/SimulationEngine';
import ResultDashboard from './pages/ResultDashboard';
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
            <Route path="/" element={<CompanySelection />} />
            <Route path="/simulate" element={<SimulationEngine />} />
            <Route path="/result" element={<ResultDashboard />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
