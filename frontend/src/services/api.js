import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

export const fetchCompanies = () => api.get('/companies');
export const fetchRoles = (companyId) => api.get(`/companies/${companyId}/roles`);
export const fetchSimulationFlow = (roleId) => api.get(`/roles/${roleId}/flow`);
export const fetchQuestionsForRound = (roundId) => api.get(`/rounds/${roundId}/questions`);

export const startSimulation = (userId, roleId) => 
  api.post(`/attempts/start?userId=${userId}&roleId=${roleId}`);

export const submitRound = (attemptId, roundId, answers) => 
  api.post(`/attempts/${attemptId}/rounds/${roundId}/submit`, { answers });

export const fetchReport = (attemptId) => api.get(`/attempts/${attemptId}/report`);

export default api;
