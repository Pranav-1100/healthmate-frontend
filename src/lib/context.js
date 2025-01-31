'use client';

import { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  user: null,
  notifications: [],
  currentChat: null,
  healthMetrics: null,
  theme: 'light',
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
      return { ...state, theme: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

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