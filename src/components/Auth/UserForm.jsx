// src/components/UserForm.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, api } = useAuth();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin",
  });
  const [loading, setLoading] = useState(false);

  // Restrict to superadmins
  useEffect(() => {
    if (user?.role !== "superadmin") {
      toast.error("Access denied. Superadmin only.");
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isEditMode && user?.role === "superadmin") {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/api/users/${id}`);
          const { firstName, lastName, email, role } = response.data;
          setFormData({ firstName, lastName, email, password: "", confirmPassword: "", role });
        } catch (error) {
          console.error("Error fetching user:", error);
          toast.error("Failed to fetch user data");
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [id, isEditMode, user, api]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        const updateData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          role: formData.role,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await api.put(`/api/users/${id}`, updateData);
        toast.success("User updated successfully");
      } else {
        await api.post("/api/auth/signup", formData);
        toast.success("User created successfully");
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "Failed to submit form");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "superadmin") return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F8] py-12 px-4 font-inter">
      <ToastContainer />
      <div className="max-w-md w-full space-y-8 bg-white p-6 shadow-md rounded">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          {isEditMode ? "Edit User" : "Add New User"}
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00603A]"
                placeholder="First Name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00603A]"
                placeholder="Last Name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00603A]"
                placeholder="Email address"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
                {isEditMode ? "New Password (optional)" : "Password"}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00603A]"
                placeholder="Password"
                required={!isEditMode}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
                {isEditMode ? "Confirm New Password" : "Confirm Password"}
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00603A]"
                placeholder="Confirm Password"
                required={!isEditMode}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#00603A]"
                required
              >
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#00603A] text-white rounded-md hover:bg-[#004d2e] focus:outline-none focus:ring-2 focus:ring-[#00603A] disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Submitting..." : isEditMode ? "Update User" : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;