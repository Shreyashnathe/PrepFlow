import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [simulationFlow, setSimulationFlow] = useState([]);

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
    
    if (userId) localStorage.setItem('userId', userId);
    else localStorage.removeItem('userId');

    if (userName) localStorage.setItem('userName', userName);
    else localStorage.removeItem('userName');
  }, [token, userId, userName]);

  const loginUser = (authData) => {
    setToken(authData.token);
    setUserId(authData.userId);
    setUserName(authData.name);
  };

  const logoutUser = () => {
    setToken(null);
    setUserId(null);
    setUserName(null);
  };

  return (
    <AppContext.Provider value={{ 
      token, userId, userName, loginUser, logoutUser,
      selectedCompany, setSelectedCompany,
      selectedRole, setSelectedRole,
      attemptId, setAttemptId,
      simulationFlow, setSimulationFlow
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
