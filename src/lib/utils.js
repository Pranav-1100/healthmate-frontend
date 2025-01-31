// Date formatting utilities
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  export const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // BMI calculation
  export const calculateBMI = (weight, height) => {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return Number(bmi.toFixed(1));
  };
  
  export const getBMICategory = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };
  
  // Form validation
  export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  export const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
  };
  
  // Error handling
  export const getErrorMessage = (error) => {
    if (typeof error === 'string') return error;
    if (error.response?.data?.message) return error.response.data.message;
    if (error.message) return error.message;
    return 'An unexpected error occurred';
  };
  
  // Local storage helpers
  export const storage = {
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    },
    get: (key) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
      }
    },
    remove: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing from localStorage:', error);
      }
    }
  };
  
  // Data transformation helpers
  export const groupByDate = (array, dateKey) => {
    return array.reduce((acc, item) => {
      const date = new Date(item[dateKey]).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});
  };
  
  export const calculateAverages = (data, key) => {
    if (!data.length) return 0;
    const sum = data.reduce((acc, item) => acc + (item[key] || 0), 0);
    return Number((sum / data.length).toFixed(2));
  };
  
  // Medication helpers
  export const generateMedicationSchedule = (medication) => {
    const schedule = [];
    const today = new Date();
    const times = medication.frequency === 'twice_daily' ? ['09:00', '21:00'] : [medication.time];
  
    times.forEach(time => {
      const [hours, minutes] = time.split(':');
      const date = new Date(today);
      date.setHours(parseInt(hours), parseInt(minutes), 0);
  
      schedule.push({
        medicationId: medication.id,
        medicationName: medication.name,
        dosage: medication.dosage,
        time: date.toISOString(),
        taken: false
      });
    });
  
    return schedule;
  };
  
  // Health metrics helpers
  export const calculateHealthScore = (metrics) => {
    const weights = {
      bmi: 0.2,
      activity: 0.3,
      sleep: 0.2,
      nutrition: 0.3
    };
  
    let score = 0;
    let totalWeight = 0;
  
    for (const [key, value] of Object.entries(metrics)) {
      if (typeof value === 'number' && weights[key]) {
        score += value * weights[key];
        totalWeight += weights[key];
      }
    }
  
    return totalWeight > 0 ? Math.round(score / totalWeight) : 0;
  };

  export const auth = {
    setToken: (token) => {
      if (token) {
        localStorage.setItem('token', token);
        document.cookie = `authToken=${token}; path=/`;
      }
    },
    
    removeToken: () => {
      localStorage.removeItem('token');
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    },
    
    getToken: () => {
      return localStorage.getItem('token');
    },
    
    isAuthenticated: () => {
      const token = localStorage.getItem('token');
      return !!token;
    }
  };
  