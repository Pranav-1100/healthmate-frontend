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
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };

  

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

export const authAPI = {
    setAuthToken,
    
    login: async (email, password) => {
      try {
        const response = await api.post('/auth/login', { email, password });
        
        // For testing without backend
        if (!response.data) {
          // Simulate successful response
          return {
            token: 'test_token_' + Date.now(),
            user: {
              id: 1,
              email,
              name: 'Test User'
            }
          };
        }
        
        return response.data;
      } catch (error) {
        // For testing without backend
        console.log('Using mock login response');
        return {
          token: 'test_token_' + Date.now(),
          user: {
            id: 1,
            email,
            name: 'Test User'
          }
        };
      }
    },
  
    register: async (userData) => {
      try {
        const response = await api.post('/auth/register', userData);
        
        // For testing without backend
        if (!response.data) {
          return {
            token: 'test_token_' + Date.now(),
            user: {
              id: 1,
              ...userData
            }
          };
        }
        
        return response.data;
      } catch (error) {
        // For testing without backend
        console.log('Using mock register response');
        return {
          token: 'test_token_' + Date.now(),
          user: {
            id: 1,
            ...userData
          }
        };
      }
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
    

    export const healthAPI = {
        getTrends: async () => {
          try {
            const response = await api.get('/health/trends');
            return response.data;
          } catch (error) {
            console.error('Error fetching trends:', error);
            // Return mock data for development
            return {
              "timeframe": "30 days",
              "totalInteractions": 1,
              "analysis": "Pattern:\nThis user has recently reported experiencing headaches for three consecutive days.\n\nConcerns:\n- Experiencing headaches for three consecutive days can be concerning. It could be a result of various issues such as stress, lack of sleep, dehydration, poor diet, or potentially a symptom of a more serious underlying condition.\n- Without further information about the severity, location, or accompanying symptoms of the headache, it's hard to determine how serious this symptom might be.\n\nImprovements:\n- The user should make sure he is properly hydrated, getting enough sleep, eating a balanced diet, and managing stress well.\n- If the headaches persist, worsen, or are accompanied by other symptoms, he should consult a health professional.\n- He might consider using an app to track other aspects of his health (diet, sleep, exercise) to identify any correlations with the headaches.",
              "recentSymptoms": ["headaches"],
              "recommendedActions": "Recommendations:\n1. Hydration: Increase daily water intake...",
            };
          }
        },
      
        getReport: async () => {
          try {
            const response = await api.get('/health/report');
            return response.data;
          } catch (error) {
            console.error('Error fetching report:', error);
            // Return mock data for development
            return {
              "userId": 2,
              "generatedAt": "2025-01-30T15:12:18.601Z",
              "healthMetrics": {
                "bmi": 22.86,
                "bmiCategory": "Normal weight",
                "generalHealth": {
                  "status": "Generated",
                  "assessment": "Status: This 30-year-old male is in the standard range...",
                  "generatedAt": "2025-01-30T15:12:05.903Z"
                },
                "riskFactors": [
                  "Existing medical conditions require attention",
                  {
                    "RiskFactor": "Peanut Allergy",
                    "Description": "Severe allergic reactions to peanuts can lead to serious health complications..."
                  }
                ]
              },
              "trends": {
                "timeframe": "30 days",
                "totalInteractions": 1,
                "analysis": "The user, a 30-year-old male with no known medical conditions...",
                "recentSymptoms": ["headaches"],
                "recommendedActions": "Recommendations:\n1. Hydration: Increase daily water intake..."
              }
            };
          }
        },
      
        getSymptoms: async () => {
          try {
            const response = await api.get('/health/symptoms');
            return response.data;
          } catch (error) {
            console.error('Error fetching symptoms:', error);
            // Return mock data for development
            return {
              "0": "headaches",
              "timeframe": "30 days",
              "total_interactions": 1
            };
          }
        }
      };
      

export default api;