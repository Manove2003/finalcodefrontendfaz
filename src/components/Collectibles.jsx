import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CollectiblesForm = () => {
  const { reference } = useParams(); // Get reference from URL for editing
  const navigate = useNavigate();
  const [collectibleData, setCollectibleData] = useState({
    _id: "", // Store _id for PUT request
    reference: "",
    category: "",
    title: "",
    subTitle: "",
    price: "",
    description: "",
    videoLink: "",
    agentName: "",
    designation: "",
    contactNo: "",
    email: "",
    whatsappNo: "",
    callNo: "",
  });
  const [images, setImages] = useState([]); // New images to upload
  const [existingImages, setExistingImages] = useState([]); // Existing image URLs
  const [agentImage, setAgentImage] = useState(null); // New agent image
  const [existingAgentImage, setExistingAgentImage] = useState(""); // Existing agent image URL
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://backendfaz.onrender.com"
      : "http://localhost:5001";


  // Fetch existing data for editing using reference
  useEffect(() => {
    if (reference) {
      const fetchCollectible = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/luxury-collectibles/${reference}`);
          const data = response.data;
          setCollectibleData({
            _id: data._id || "", 
            reference: data.reference || "",
            category: data.category || "",
            title: data.title || "",
            subTitle: data.subTitle || "",
            price: data.price || "",
            description: data.description || "",
            videoLink: data.videoLink || "",
            agentName: data.agentName || "",
            designation: data.designation || "",
            contactNo: data.contactNo || "",
            email: data.email || "",
            whatsappNo: data.whatsappNo || "",
            callNo: data.callNo || "",
          });
          setExistingImages(data.images || []);
          setExistingAgentImage(data.agentImage || "");
        } catch (error) {
          console.error("Error fetching collectible:", error);
          setSubmitError(error.response?.data?.message || "Failed to load collectible data.");
        }
      };
      fetchCollectible();
    }
  }, [reference, BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCollectibleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleAgentImageChange = (e) => {
    setAgentImage(e.target.files[0]);
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingAgentImage = () => {
    setExistingAgentImage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const formData = new FormData();
      // Append all collectible data fields
      Object.keys(collectibleData).forEach((key) => {
        if (key !== "_id") { // Exclude _id from form data
          const value = collectibleData[key] !== null && collectibleData[key] !== undefined
            ? collectibleData[key].toString()
            : "";
          formData.append(key, value);
        }
      });

      // Append new images
      images.forEach((image) => {
        formData.append("images", image);
      });

      // Append existing image URLs
      if (existingImages.length > 0) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      // Append agent image if it exists
      if (agentImage) {
        formData.append("agentimage", agentImage);
      }

      // Append existing agent image URL
      if (existingAgentImage) {
        formData.append("existingAgentImage", existingAgentImage);
      }

      let response;
      if (reference && collectibleData._id) {
        // Update existing collectible using _id
        response = await axios.put(`${BASE_URL}/api/luxury-collectibles/${collectibleData._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000,
        });
      } else {
        // Create new collectible
        response = await axios.post(`${BASE_URL}/api/luxury-collectibles`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      console.log("Submission successful:", response.data);
      setSubmitSuccess(true);

      // Reset form for create, or navigate back for update
      if (!reference) {
        setCollectibleData({
          _id: "",
          reference: "",
          category: "",
          title: "",
          subTitle: "",
          price: "",
          description: "",
          videoLink: "",
          agentName: "",
          designation: "",
          contactNo: "",
          email: "",
          whatsappNo: "",
          callNo: "",
        });
        setImages([]);
        setExistingImages([]);
        setAgentImage(null);
        setExistingAgentImage("");
        document.querySelectorAll('input[type="file"]').forEach((input) => (input.value = ""));
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Submission error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to submit form.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto p-4 md:p-20 mb-8 font-inter">
      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-md p-6 mb-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {reference ? "Edit Luxury Collectible" : "Add New Luxury Collectible"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Reference*</label>
              <input
                type="text"
                name="reference"
                placeholder="Add Reference"
                value={collectibleData.reference}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Category*</label>
              <select
                name="category"
                value={collectibleData.category}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
              >
                <option value="">Select Category</option>
                <option value="Car">Car</option>
                <option value="Watch">Watch</option>
                <option value="Jewelry">Jewelry</option>
                <option value="Art">Art</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Title*</label>
              <input
                type="text"
                name="title"
                placeholder="Add Title"
                value={collectibleData.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Subtitle</label>
              <input
                type="text"
                name="subTitle"
                placeholder="Add Subtitle"
                value={collectibleData.subTitle}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Price ($)*</label>
              <input
                type="number"
                name="price"
                placeholder="Add Price"
                value={collectibleData.price}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
                min="1"
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Video Link</label>
              <input
                type="url"
                name="videoLink"
                placeholder="Add Video Link"
                value={collectibleData.videoLink}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
              />
            </div>
            <div className="form-group md:col-span-2">
              <label className="block text-gray-700 mb-2">Description*</label>
              <textarea
                rows="4"
                name="description"
                placeholder="Add Description"
                value={collectibleData.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
              ></textarea>
            </div>
            <div className="form-group md:col-span-2">
              <label className="block text-gray-700 mb-2">Images{!reference && "*"}</label>
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Existing Images:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {existingImages.map((imageUrl, index) => (
                      <div key={index} className="relative">
                        <img
                          src={imageUrl}
                          alt={`Collectible ${index}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required={!reference && existingImages.length === 0}
              />
              {images.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  <p>Selected new images:</p>
                  <ul className="list-disc pl-5">
                    {images.map((image, index) => (
                      <li key={index}>{image.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md p-6 mb-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Agent Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Agent Name</label>
              <input
                type="text"
                name="agentName"
                placeholder="Add Agent Name"
                value={collectibleData.agentName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Designation</label>
              <input
                type="text"
                name="designation"
                placeholder="Add Designation"
                value={collectibleData.designation}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Contact No</label>
              <input
                type="tel"
                name="contactNo"
                placeholder="Add Contact Number"
                value={collectibleData.contactNo}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Add Email"
                value={collectibleData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">WhatsApp No</label>
              <input
                type="tel"
                name="whatsappNo"
                placeholder="Add WhatsApp Number"
                value={collectibleData.whatsappNo}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Call No</label>
              <input
                type="tel"
                name="callNo"
                placeholder="Add Call Number"
                value={collectibleData.callNo}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Agent Image</label>
              {existingAgentImage && (
                <div className="mb-4 relative">
                  <img
                    src={existingAgentImage}
                    alt="Agent Image"
                    className="w-32 h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveExistingAgentImage}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              )}
              <input
                type="file"
                name="agentimage"
                accept="image/*"
                onChange={handleAgentImageChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
              />
            </div>
          </div>
        </div>

        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-100 text-green-700">
            Luxury collectible {reference ? "updated" : "submitted"} successfully!
          </div>
        )}
        {submitError && (
          <div className="mb-6 p-4 bg-red-100 text-red-700">{submitError}</div>
        )}

        <div className="text-right">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : reference ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CollectiblesForm;