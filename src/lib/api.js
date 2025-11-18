import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://doc-appointment.trou.hackclub.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// ============================================================================
// AUTHENTICATION API
// ============================================================================
export const authAPI = {
  setAuthToken,

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  },

  logout: async () => {
    setAuthToken(null);
    return { success: true };
  },

  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/user/profile', userData);
    return response.data;
  },
};

// ============================================================================
// CHAT API
// ============================================================================
export const chatAPI = {
  sendMessage: async (message, category) => {
    const response = await api.post('/chat/message', { message, category });
    return response.data;
  },

  getChatHistory: async (page = 1, limit = 10, category) => {
    const response = await api.get('/chat/history', {
      params: { page, limit, category },
    });
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/chat/categories');
    return response.data;
  },
};

// ============================================================================
// HEALTH API
// ============================================================================
export const healthAPI = {
  getTrends: async () => {
    const response = await api.get('/health/trends');
    return response.data;
  },

  getReport: async () => {
    const response = await api.get('/health/report');
    return response.data;
  },

  getSymptoms: async () => {
    const response = await api.get('/health/symptoms');
    return response.data;
  },

  getMetrics: async () => {
    const response = await api.get('/health/metrics');
    return response.data;
  },

  getRiskAssessment: async () => {
    const response = await api.get('/health/risk-assessment');
    return response.data;
  },

  getDashboard: async () => {
    const response = await api.get('/health/dashboard');
    return response.data;
  },
};

// ============================================================================
// DOCTOR SEARCH API
// ============================================================================
export const doctorAPI = {
  searchBySymptoms: async (symptoms) => {
    const response = await api.post('/doctors/search-by-symptoms', { symptoms });
    return response.data;
  },

  searchBySpecialty: async (specialty, location, radius = 5000) => {
    const response = await api.post('/doctors/search', {
      specialty,
      location,
      radius,
    });
    return response.data;
  },

  getDirections: async (userLocation, doctorLocation) => {
    const response = await api.post('/doctors/directions', {
      userLocation,
      doctorLocation,
    });
    return response.data;
  },

  checkPractoAvailability: async (doctorName, city, specialty) => {
    const response = await api.post('/doctors/check-practo', {
      doctorName,
      city,
      specialty,
    });
    return response.data;
  },
};

// ============================================================================
// DOCUMENT API
// ============================================================================
export const documentAPI = {
  upload: async (formData) => {
    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAll: async (filters = {}) => {
    const response = await api.get('/documents', { params: filters });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },

  download: async (id) => {
    const response = await api.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },

  search: async (searchTerm) => {
    const response = await api.get(`/documents/search/${searchTerm}`);
    return response.data;
  },

  createPrescription: async (documentId) => {
    const response = await api.post(`/documents/${documentId}/create-prescription`);
    return response.data;
  },
};

// ============================================================================
// MEDICATION API
// ============================================================================
export const medicationAPI = {
  add: async (medicationData) => {
    const response = await api.post('/medications', medicationData);
    return response.data;
  },

  getAll: async (activeOnly = false) => {
    const response = await api.get('/medications', {
      params: { activeOnly },
    });
    return response.data;
  },

  getSuggestions: async (symptoms, condition) => {
    const response = await api.post('/medications/suggest', {
      symptoms,
      condition,
    });
    return response.data;
  },

  getPatterns: async () => {
    const response = await api.get('/medications/patterns');
    return response.data;
  },

  checkInteractions: async (medicationName) => {
    const response = await api.post('/medications/check-interactions', {
      medication: medicationName,
    });
    return response.data;
  },

  update: async (id, updates) => {
    const response = await api.put(`/medications/${id}`, updates);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/medications/${id}`);
    return response.data;
  },
};

// ============================================================================
// PRESCRIPTION API
// ============================================================================
export const prescriptionAPI = {
  create: async (prescriptionData) => {
    const response = await api.post('/prescriptions', prescriptionData);
    return response.data;
  },

  getAll: async (filters = {}) => {
    const response = await api.get('/prescriptions', { params: filters });
    return response.data;
  },

  getRecent: async (months = 3) => {
    const response = await api.get('/prescriptions/recent', {
      params: { months },
    });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/prescriptions/stats');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/prescriptions/${id}`);
    return response.data;
  },

  update: async (id, updates) => {
    const response = await api.put(`/prescriptions/${id}`, updates);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/prescriptions/${id}`);
    return response.data;
  },
};

// ============================================================================
// NOTIFICATION API
// ============================================================================
export const notificationAPI = {
  getAll: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/mark-all-read');
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/notifications/stats');
    return response.data;
  },

  scheduleReminders: async (medicationId, times) => {
    const response = await api.post('/notifications/schedule-reminders', {
      medicationId,
      times,
    });
    return response.data;
  },
};

// ============================================================================
// APPOINTMENTS API (if exists in backend)
// ============================================================================
export const appointmentAPI = {
  create: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  update: async (id, updates) => {
    const response = await api.put(`/appointments/${id}`, updates);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },
};

export default api;
