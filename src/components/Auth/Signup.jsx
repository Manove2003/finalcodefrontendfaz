// src/components/Signup.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assests/TMM_Logo_Non-responsive.svg";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.firstName) return "First name is required";
    if (!formData.lastName) return "Last name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "Invalid email format";
    if (formData.password.length < 6) return "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) return "Passwords do not match";
    if (!["admin", "superadmin"].includes(formData.role)) return "Invalid role";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    const { confirmPassword, ...signupData } = formData;
    console.log("Signup payload:", signupData);
    const result = await signup(signupData);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="max-w-md w-full space-y-8">
        <img src={logo} alt="Logo image" />
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <input
              name="firstName"
              type="text"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-none text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00603A]"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
            <input
              name="lastName"
              type="text"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-none text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00603A]"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
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
            <input
              name="confirmPassword"
              type="password"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-none text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00603A]"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <select
              name="role"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-[#00603A]"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full font-inter px-20 py-[6px] text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
          <p className="text-sm text-center">
            Have an account?{" "}
            <Link to="/login" className="text-[#00603A] hover:text-indigo-500">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;