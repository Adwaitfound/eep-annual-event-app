import React, { createContext, useState, useEffect, useContext } from 'react';
import { subscribeToSessions } from '../services/firebase/firestore';
import { useAuth } from './AuthContext';

const ScheduleContext = createContext({});

export const ScheduleProvider = ({ children }) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);

  useEffect(() => {
    if (!user) {
      setSessions([]);
      setLoading(false);
      return;
    }

    // Subscribe to sessions
    const unsubscribe = subscribeToSessions(
      {
        orderBy: { field: 'startTime', direction: 'asc' },
      },
      (sessionsData) => {
        setSessions(sessionsData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const getSessionsByDay = (day) => {
    if (!day) return sessions;
    return sessions.filter(session => {
      const sessionDate = new Date(session.date).toDateString();
      const filterDate = new Date(day).toDateString();
      return sessionDate === filterDate;
    });
  };

  const getSessionsByTrack = (track) => {
    if (!track) return sessions;
    return sessions.filter(session => session.track === track);
  };

  const getFilteredSessions = () => {
    let filtered = sessions;
    
    if (selectedDay) {
      filtered = getSessionsByDay(selectedDay);
    }
    
    if (selectedTrack) {
      filtered = filtered.filter(session => session.track === selectedTrack);
    }
    
    return filtered;
  };

  const value = {
    sessions,
    loading,
    error,
    selectedDay,
    setSelectedDay,
    selectedTrack,
    setSelectedTrack,
    getSessionsByDay,
    getSessionsByTrack,
    getFilteredSessions,
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

export default ScheduleContext;
