import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUserApi = (credentials) => api.post('/auth/login', credentials);

export const fetchCompanies = () => api.get('/companies');
export const fetchRoles = (companyId) => api.get(`/companies/${companyId}/roles`);
export const fetchSimulationFlow = (roleId) => api.get(`/roles/${roleId}/flow`);
export const fetchQuestionsForRound = (roundId) => api.get(`/rounds/${roundId}/questions`);

export const startSimulation = (roleId) => 
  api.post(`/attempts/start?roleId=${roleId}`);

export const submitRound = (attemptId, roundId, payload) => 
  api.post(`/attempts/${attemptId}/rounds/${roundId}/submit`, payload);

export const fetchReport = (attemptId) => api.get(`/attempts/${attemptId}/report`);

export default api;
