import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSimulationFlow, fetchQuestionsForRound, submitRound } from '../services/api';
import { useAppContext } from '../context/AppContext';
import { Clock, Check, Loader2 } from 'lucide-react';
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
      setTimeLeft(1800); // Reset timer per round
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
    <div className="sim-container">
      {/* Top Navigation Wrapper */}
      <div className="glass-panel sim-header">
        <div className="sim-stepper">
          {simulationFlow.map((round, idx) => (
            <div 
              key={round.id} 
              className={`sim-step ${idx === currentRoundIndex ? 'active' : idx < currentRoundIndex ? 'completed' : ''}`}
            >
              <div className="step-circle">
                {idx < currentRoundIndex ? <Check size={14} strokeWidth={3} /> : (idx + 1)}
              </div>
              <span className="step-label">{round.roundType.replace('_', ' ')}</span>
              {idx < simulationFlow.length - 1 && <div className="step-line" />}
            </div>
          ))}
        </div>
        
        <div className={`sim-timer ${timeLeft < 300 ? 'danger' : ''}`}>
          <Clock size={18} />
          <span className="timer-text">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Dynamic Module Loader */}
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
  );
};

export default SimulationEngine;
