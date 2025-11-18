'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

// Load theme from localStorage
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  }
  return 'light';
};

const initialState = {
  user: null,
  notifications: [],
  currentChat: null,
  healthMetrics: null,
  theme: 'light', // Will be updated on mount
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'SET_CURRENT_CHAT':
      return { ...state, currentChat: action.payload };
    case 'SET_HEALTH_METRICS':
      return { ...state, healthMetrics: action.payload };
    case 'SET_THEME':
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
        // Apply to document
        if (action.payload === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return { ...state, theme: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load theme on mount
  useEffect(() => {
    const theme = getInitialTheme();
    dispatch({ type: 'SET_THEME', payload: theme });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export const actions = {
  setUser: (user) => ({ type: 'SET_USER', payload: user }),
  setNotifications: (notifications) => ({ type: 'SET_NOTIFICATIONS', payload: notifications }),
  setCurrentChat: (chat) => ({ type: 'SET_CURRENT_CHAT', payload: chat }),
  setHealthMetrics: (metrics) => ({ type: 'SET_HEALTH_METRICS', payload: metrics }),
  setTheme: (theme) => ({ type: 'SET_THEME', payload: theme }),
};