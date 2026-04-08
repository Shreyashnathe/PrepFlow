import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userId] = useState(1); // Defaulting to seeded user
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [simulationFlow, setSimulationFlow] = useState([]);

  return (
    <AppContext.Provider
      value={{
        userId,
        selectedCompany,
        setSelectedCompany,
        selectedRole,
        setSelectedRole,
        attemptId,
        setAttemptId,
        simulationFlow,
        setSimulationFlow
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
