import React, { createContext, useState, useEffect, useContext } from 'react';
import { getDocuments, subscribeToCollection } from '../services/firebase/firestore';
import { COLLECTIONS } from '../utils/constants';
import { useAuth } from './AuthContext';

const NetworkingContext = createContext({});

export const NetworkingProvider = ({ children }) => {
  const { user, userProfile } = useAuth();
  const [participants, setParticipants] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setParticipants([]);
      setConnections([]);
      setLoading(false);
      return;
    }

    // Fetch participants (all users except current user)
    const fetchParticipants = async () => {
      try {
        const users = await getDocuments(COLLECTIONS.USERS);
        const filtered = users.filter(u => u.uid !== user.uid);
        setParticipants(filtered);
      } catch (err) {
        console.error('Fetch participants error:', err);
        setError(err.message);
      }
    };

    fetchParticipants();

    // Subscribe to connections involving current user
    const unsubscribe = subscribeToCollection(
      COLLECTIONS.CONNECTIONS,
      {
        where: [
          ['senderId', '==', user.uid],
        ],
      },
      (connectionsData) => {
        setConnections(connectionsData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const getConnectedUsers = () => {
    if (!userProfile) return [];
    
    const connectedIds = connections
      .filter(conn => conn.status === 'accepted')
      .map(conn => conn.receiverId);
    
    return participants.filter(p => connectedIds.includes(p.uid));
  };

  const getPendingRequests = () => {
    return connections.filter(conn => conn.status === 'pending');
  };

  const isConnected = (userId) => {
    return connections.some(
      conn => 
        conn.receiverId === userId && 
        conn.status === 'accepted'
    );
  };

  const value = {
    participants,
    connections,
    loading,
    error,
    getConnectedUsers,
    getPendingRequests,
    isConnected,
  };

  return (
    <NetworkingContext.Provider value={value}>
      {children}
    </NetworkingContext.Provider>
  );
};

export const useNetworking = () => {
  const context = useContext(NetworkingContext);
  if (!context) {
    throw new Error('useNetworking must be used within a NetworkingProvider');
  }
  return context;
};

export default NetworkingContext;
