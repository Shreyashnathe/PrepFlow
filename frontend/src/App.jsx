import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import CompanySelection from './pages/CompanySelection';
import SimulationEngine from './pages/SimulationEngine';
import ResultDashboard from './pages/ResultDashboard';
import './index.css';

function App() {
  return (
    <AppProvider>
      <Router>
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
