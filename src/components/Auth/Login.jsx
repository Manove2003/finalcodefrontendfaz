// src/components/Login.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assests/TMM_Logo_Non-responsive.svg";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  console.log("Login payload:", { email: formData.email, password: formData.password }); // Add this
  const result = await login(formData.email, formData.password);
  if (!result.success) {
    setError(result.error);
  }
  setLoading(false);
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <img src={logo} alt="Logo image" />
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <input
              name="email"
              type="email"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-none text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00603A]"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              name="password"
              type="password"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-none text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00603A]"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full font-inter px-20 py-[6px] text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default Login;