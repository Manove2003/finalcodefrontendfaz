import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const NewDevelopmentform = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    link: "",
  });
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const BASE_URL =
    process.env.NODE_ENV === "production"
       ? "https://backendfaz.onrender.com"
      : "http://localhost:5001";

  useEffect(() => {
    if (id) {
      // Fetch existing development data
      const fetchDevelopment = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/developments/${id}`);
          const data = response.data;
          setFormData({
            title: data.title,
            link: data.link,
          });
          setExistingImage(data.image);
        } catch (err) {
          console.error("Error fetching development:", err);
          setError("Failed to fetch development data.");
        }
      };
      fetchDevelopment();
    }
  }, [id, BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validate form data
    if (!formData.title || !formData.link) {
      setError("Please fill out all fields.");
      setLoading(false);
      return;
    }

    // Prepare form data
    const data = new FormData();
    data.append("title", formData.title);
    data.append("link", formData.link);
    if (image) {
      data.append("image", image);
    }

    try {
      if (id) {
        // Update existing development
        await axios.put(`${BASE_URL}/api/developments/${id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccess("Development updated successfully!");
      } else {
        // Create new development
        if (!image) {
          setError("Please select an image.");
          setLoading(false);
          return;
        }
        await axios.post(`${BASE_URL}/api/developments`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccess("Development added successfully!");
        // Reset form
        setFormData({
          title: "",
          link: "",
        });
        setImage(null);
        document.getElementById("imageInput").value = null;
      }
      // Navigate back to the list
      navigate("/dashboard");
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.response?.data?.message || "Failed to save development. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-4 md:p-8 font-inter">
      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-md p-6 mb-6">
          <h3 className="font-semibold text-lg">
            {id ? "Edit Development" : "New Development"}
          </h3>
          {existingImage && (
            <div className="mb-4">
              <p>Current Image:</p>
              <img src={existingImage} alt="Current" className="h-32 w-32 object-cover" />
            </div>
          )}
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border outline-none mb-2"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Development Title"
              className="w-full p-2 border outline-none"
            />
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="Link (e.g., https://example.com)"
              className="w-full p-2 border outline-none"
            />
          </div>
        </div>
        {error && (
          <p className="text-red-600 text-center mb-4">{error}</p>
        )}
        {success && (
          <p className="text-green-600 text-center mb-4">{success}</p>
        )}
        <div className="text-center mt-4">
          <button
            type="submit"
            disabled={loading}
            className={`font-inter px-6 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : id ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewDevelopmentform;