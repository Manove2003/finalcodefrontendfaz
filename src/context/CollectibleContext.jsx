// contexts/CollectiblesContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CollectiblesContext = createContext();

export const CollectiblesProvider = ({ children }) => {
  const [collectibles, setCollectibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL =
  process.env.NODE_ENV === "production"
      ? "https://backendfaz.onrender.com"
      : "http://localhost:5001";


  const fetchCollectibles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/luxury-collectibles`);
      setCollectibles(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching collectibles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectibles();
  }, []);



  const getCollectibleByReference = (reference) => {
    return collectibles.find(item => item.reference === reference);
  };

  return (
    <CollectiblesContext.Provider value={{ 
      collectibles, 
      loading, 
      error,
      getCollectibleByReference,
      refreshCollectibles: fetchCollectibles
    }}>
      {children}
    </CollectiblesContext.Provider>
  );
};

export const useCollectibles = () => {
  const context = useContext(CollectiblesContext);
  if (!context) {
    throw new Error('useCollectibles must be used within a CollectiblesProvider');
  }
  return context;
};