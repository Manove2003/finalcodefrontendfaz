import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const BASE_URL =
    process.env.NODE_ENV === "production"
         ? "https://backendfaz.onrender.com"
      : "http://localhost:5001";


  const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  api.interceptors.request.use(
    (config) => {
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        error.response?.data?.message !== "No token provided"
      ) {
        originalRequest._retry = true;
        try {
          const refreshResponse = await axios.post(
            `${BASE_URL}/api/auth/refresh`,
            {},
            { withCredentials: true }
          );
          const newToken = refreshResponse.data.accessToken;
          setUser((prev) => ({ ...prev, token: newToken }));
          localStorage.setItem("token", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          logout();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    console.log("AuthContext: Checking authentication state...");
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      console.log("AuthContext: Found token in localStorage:", storedToken);
      api
        .post("/api/auth/validate", { token: storedToken })
        .then((response) => {
          console.log("AuthContext: Token validation response:", response.data);
          if (response.data.valid) {
            setUser({
              token: storedToken,
              role: response.data.role,
              firstName: response.data.firstName,
              lastName: response.data.lastName,
            });
            setLoading(false);
          } else {
            console.log("AuthContext: Token invalid, attempting to refresh...");
            refreshToken();
          }
        })
        .catch((error) => {
          console.error("AuthContext: Token validation failed:", error);
          refreshToken();
        });
    } else {
      console.log("AuthContext: No token found, attempting to refresh...");
      refreshToken();
    }
  }, []);

  const refreshToken = async () => {
    try {
      const refreshResponse = await axios.post(
        `${BASE_URL}/api/auth/refresh`,
        {},
        { withCredentials: true }
      );
      const newToken = refreshResponse.data.accessToken;
      console.log("AuthContext: Token refreshed successfully:", newToken);
      localStorage.setItem("token", newToken);
      const validateResponse = await api.post("/api/auth/validate", { token: newToken });
      if (validateResponse.data.valid) {
        setUser({
          token: newToken,
          role: validateResponse.data.role,
          firstName: validateResponse.data.firstName,
          lastName: validateResponse.data.lastName,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("AuthContext: Token refresh failed:", error);
      setUser(null);
      localStorage.removeItem("token");
      setLoading(false);
    }
  };

  const signup = async ({ firstName, lastName, email, password, role }) => {
    try {
      const response = await api.post("/api/auth/signup", {
        firstName,
        lastName,
        email,
        password,
        role,
      });
      const { token, role: userRole, firstName: userFirstName, lastName: userLastName } = response.data;
      if (!token) throw new Error("No token received");
      console.log("AuthContext: Signup successful, token:", token);
      setUser({ token, role: userRole, firstName: userFirstName, lastName: userLastName });
      localStorage.setItem("token", token);
      localStorage.setItem("role", userRole || "");
      localStorage.setItem("firstName", userFirstName || "");
      localStorage.setItem("lastName", userLastName || "");
      navigate(userRole === "admin" ? "/admin" : "/dashboard", { replace: true });
      return { success: true };
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/api/auth/login", { email, password });
      const { token, role, firstName, lastName } = response.data;
      if (!token) throw new Error("No token received");
      console.log("AuthContext: Login successful, token:", token);
      setUser({ token, role, firstName, lastName });
      localStorage.setItem("token", token);
      localStorage.setItem("role", role || "");
      localStorage.setItem("firstName", firstName || "");
      localStorage.setItem("lastName", lastName || "");
      navigate(role === "admin" ? "/admin" : "/dashboard", { replace: true });
      return { success: true };
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const logout = () => {
    console.log("AuthContext: Logging out...");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    api
      .post("/api/auth/logout", {}, { withCredentials: true })
      .then(() => {
        console.log("AuthContext: Logout successful");
      })
      .catch((error) => {
        console.error("AuthContext: Logout error:", error);
      });
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, api }}>
      {loading ? <div></div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);