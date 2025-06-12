// src/contexts/MansionContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const MansionContext = createContext();

export const MansionProvider = ({ children }) => {
  const [mansions, setMansions] = useState([]);
  const [featuredMansions, setFeaturedMansions] = useState([]);
  const [mansionFeatured, setMansionFeatured] = useState([]);
  const [penthouseFeatured, setPenthouseFeatured] = useState([]);
  const [collectiblesFeatured, setCollectiblesFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { api } = useAuth();

  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://backendfaz.onrender.com"
      : "http://localhost:5001";

  const fetchMansions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/local/properties`);
      console.log("Fetched mansions:", res.data);
      setMansions(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch properties");
    }
  };

  const fetchFeaturedMansions = async () => {
    try {
      const res = await api.get("/api/featured");
      console.log("Fetched featured mansions:", res.data);
      setFeaturedMansions(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch featured properties"
      );
    }
  };

  const fetchMansionFeatured = async () => {
    try {
      const res = await api.get("/api/mansion/featured");
      console.log("Fetched mansion featured:", res.data);
      setMansionFeatured(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch featured mansions"
      );
    }
  };

  const fetchPenthouseFeatured = async () => {
    try {
      const res = await api.get("/api/penthouse/featured");
      console.log("Fetched penthouse featured:", res.data);
      setPenthouseFeatured(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch featured penthouses"
      );
    }
  };

  const fetchCollectiblesFeatured = async () => {
    try {
      const res = await api.get("/api/collectibles/featured");
      console.log("Fetched collectibles featured:", res.data);
      setCollectiblesFeatured(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch featured collectibles"
      );
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchMansions(),
        fetchFeaturedMansions(),
        fetchMansionFeatured(),
        fetchPenthouseFeatured(),
        fetchCollectiblesFeatured(),
      ]);
      setLoading(false);
    };
    loadData();
  }, [api]);

  return (
    <MansionContext.Provider
      value={{
        mansions,
        featuredMansions,
        mansionFeatured,
        penthouseFeatured,
        collectiblesFeatured,
        loading,
        error,
        fetchMansions,
        fetchFeaturedMansions,
        fetchMansionFeatured,
        fetchPenthouseFeatured,
        fetchCollectiblesFeatured,
      }}
    >
      {children}
    </MansionContext.Provider>
  );
};

export const useMansions = () => useContext(MansionContext);
