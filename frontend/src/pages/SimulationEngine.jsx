import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSimulationFlow, fetchQuestionsForRound, submitRound } from '../services/api';
import { useAppContext } from '../context/AppContext';
import { Clock, Check, Loader2, PlayCircle, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import AptitudeRound from '../components/AptitudeRound';
import CodingRound from '../components/CodingRound';
import HRRound from '../components/HRRound';
import './SimulationEngine.css';

const SimulationEngine = () => {
  const navigate = useNavigate();
  const { selectedRole, attemptId, simulationFlow, setSimulationFlow } = useAppContext();
  
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes default
  const [sideMenuOpen, setSideMenuOpen] = useState(true);

  useEffect(() => {
    if (!selectedRole || !attemptId) {
      navigate('/');
      return;
    }
    loadFlow();
  }, []);

  const loadFlow = async () => {
    try {
      const res = await fetchSimulationFlow(selectedRole.id);
      setSimulationFlow(res.data);
      if (res.data.length > 0) {
        await loadQuestions(res.data[0].id);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load flow");
    }
  };

  const loadQuestions = async (roundId) => {
    setLoading(true);
    try {
      const res = await fetchQuestionsForRound(roundId);
      setQuestions(res.data);
      setTimeLeft(1800);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleRoundSubmit = async (answers) => {
    const currentRound = simulationFlow[currentRoundIndex];
    const timeTakenInSeconds = 1800 - timeLeft;

    try {
      await submitRound(attemptId, currentRound.id, { answers, timeTakenInSeconds });
      toast.success(`${currentRound.roundType.replace('_', ' ')} submitted!`);
      
      if (currentRoundIndex < simulationFlow.length - 1) {
        const nextIndex = currentRoundIndex + 1;
        setCurrentRoundIndex(nextIndex);
        await loadQuestions(simulationFlow[nextIndex].id);
      } else {
        toast.success("Simulation Complete!");
        navigate('/result');
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to submit round");
    }
  };

  const quitSimulation = () => {
    if(window.confirm("Are you sure you want to abort the simulation? Progress will be lost.")) {
        navigate('/');
    }
  }

  if (!simulationFlow.length || loading) {
    return (
      <div className="sim-loading-screen">
        <Loader2 className="spinner" size={48} color="var(--primary)" />
        <p className="text-subtle">Initializing environment...</p>
      </div>
    );
  }

  const currentRound = simulationFlow[currentRoundIndex];

  return (
    <div className="sim-grid-layout">
      
      {/* Fixed Vertical Sidebar */}
      <div className={`sim-sidebar ${sideMenuOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-brand">PrepFlow IDE</div>
        
        <div className="sidebar-stepper">
          <p className="sidebar-heading">Assessment Pipeline</p>
          {simulationFlow.map((round, idx) => (
            <div 
              key={round.id} 
              className={`sidebar-step ${idx === currentRoundIndex ? 'active' : idx < currentRoundIndex ? 'completed' : 'locked'}`}
            >
              <div className="sidebar-step-icon">
                {idx < currentRoundIndex ? <Check size={14} strokeWidth={3} /> : (idx === currentRoundIndex ? <PlayCircle size={14} /> : (idx + 1))}
              </div>
              <div className="sidebar-step-details">
                <span className="sidebar-step-title">{round.roundType.replace('_', ' ')}</span>
                {idx === currentRoundIndex && <span className="sidebar-step-status">IN PROGRESS</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <button className="sidebar-abort-btn" onClick={quitSimulation}>
             <LogOut size={16}/> Abort Run
          </button>
        </div>
      </div>

      {/* Main IDE Right Canvas */}
      <div className="sim-main-canvas">
        
        <div className="sim-topbar">
          <h2 className="sim-round-heading">{currentRound.roundType.replace('_', ' ')} Phase</h2>
          <div className={`sim-timer ${timeLeft < 300 ? 'danger' : ''}`}>
            <Clock size={16} />
            <span className="timer-text">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="sim-module-wrapper">
          {(currentRound.roundType === 'APTITUDE' || currentRound.roundType === 'TECHNICAL_INTERVIEW') && (
            <AptitudeRound questions={questions} onSubmit={handleRoundSubmit} roundType={currentRound.roundType} />
          )}
          {currentRound.roundType === 'CODING' && (
             <CodingRound questions={questions} onSubmit={handleRoundSubmit} />
          )}
          {currentRound.roundType === 'HR_INTERVIEW' && (
             <HRRound questions={questions} onSubmit={handleRoundSubmit} />
          )}
        </div>

      </div>
    </div>
  );
};

export default SimulationEngine;
