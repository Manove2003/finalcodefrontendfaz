import React, { useState, useEffect } from "react";
import axios from "axios";

const IconicForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    year: "",
    btnText: "",
    description: "",
    photoHome: null,
    photoSignup: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://backendfaz.onrender.com"
      : "http://localhost:5001";


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      submitData.append(key, formData[key]);
    });

    try {
      const response = await axios.post(`${BASE_URL}/api/iconic`, submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Form submitted successfully!");
      setFormData({
        title: "",
        subtitle: "",
        year: "",
        btnText: "",
        description: "",
        photoHome: null,
        photoSignup: null,
      });
      document.querySelectorAll('input[type="file"]').forEach((input) => (input.value = ""));
    } catch (err) {
      setError("Failed to submit form. Please try again.");
    }
  };

  return (
    <div className="w-full p-4 md:p-20 mb-8 font-sans bg-white shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Iconic Form</h2>
      {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
      {success && <div className="mb-4 text-green-500 text-center">{success}</div>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Title", name: "title", type: "text" },
          { label: "Subtitle", name: "subtitle", type: "text" },
          { label: "Year", name: "year", type: "text" },
          { label: "Button Text", name: "btnText", type: "text" },
          { label: "Description", name: "description", type: "textarea" },
          { label: "Photo for Home Page", name: "photoHome", type: "file" },
          { label: "Photo for Sign Up Page", name: "photoSignup", type: "file" },
        ].map((field) => (
          <div key={field.name} className="w-full">
            <label className="block font-semibold mb-2">{field.label}</label>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full p-2 border outline-none"
                rows="4"
              />
            ) : field.type === "file" ? (
              <input
                type="file"
                name={field.name}
                onChange={handleChange}
                className="w-full p-2 border outline-none"
                accept="image/*"
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full p-2 border outline-none"
                required={field.name === "title" || field.name === "year"}
              />
            )}
          </div>
        ))}
        <div className="text-center mt-8 md:col-span-2">
          <button
            type="submit"
            className="px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
          >
            {formData.btnText || "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IconicForm;