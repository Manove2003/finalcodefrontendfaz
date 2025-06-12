import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import imageCompression from "browser-image-compression";

// Utility function to add commas to a number
const formatPriceWithCommas = (value) => {
  if (!value) return "";
  // Remove non-numeric characters except for decimal point
  const numericValue = value.replace(/[^0-9]/g, "");
  // Add commas every three digits
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Utility function to remove commas for raw numeric value
const parsePrice = (value) => {
  return value.replace(/,/g, "");
};

const MansionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, api } = useAuth();

  const [mansionData, setMansionData] = useState({
    reference: "",
    propertytype: "",
    size: "",
    bedrooms: "",
    bathrooms: "",
    furnishingtype: "",
    builtuparea: "",
    projectstatus: "",
    community: "",
    subcommunity: "",
    country: "",
    price: "", // Store raw numeric value (e.g., "199999000")
    title: "",
    subtitle: "",
    description: "",
    amenities: "",
    video: "",
    propertyaddress: "",
    unitno: "",
    tag: "",
    status: "",
    agentname: "",
    designation: "",
    email: "",
    phone: "",
    whatsaapno: "",
    callno: "",
    category: "",
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [agentImage, setAgentImage] = useState(null);
  const [existingAgentImage, setExistingAgentImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [descriptionCharCount, setDescriptionCharCount] = useState(0);
  const [displayPrice, setDisplayPrice] = useState(""); // State for formatted price display

  const compressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (id) {
      const fetchProperty = async () => {
        try {
          const response = await api.get(`/api/propertyDetail/${id}`);
          const data = response.data;
          const normalizedData = {
            ...data,
            size:
              data.propertytype === "Luxury Collectibles"
                ? ""
                : data.size || "",
            bedrooms:
              data.propertytype === "Luxury Collectibles"
                ? ""
                : data.bedrooms || "",
            bathrooms:
              data.propertytype === "Luxury Collectibles"
                ? ""
                : data.bathrooms || "",
            furnishingtype:
              data.propertytype === "Luxury Collectibles"
                ? ""
                : data.furnishingtype || "",
            builtuparea:
              data.propertytype === "Luxury Collectibles"
                ? ""
                : data.builtuparea || "",
            projectstatus:
              data.propertytype === "Luxury Collectibles"
                ? ""
                : data.projectstatus || "",
            community:
              data.propertytype === "Luxury Collectibles"
                ? ""
                : data.community || "",
            subcommunity:
              data.propertytype === "Luxury Collectibles"
                ? ""
                : data.subcommunity || "",
            country:
              data.propertytype === "Luxury Collectibles"
                ? ""
                : data.country || "",
            propertyaddress:
              data.propertytype === "Luxury Collectibles"
                ? ""
                : data.propertyaddress || "",
            unitno:
              data.propertytype === "Luxury Collectibles"
                ? ""
                : data.unitno || "",
            tag:
              data.propertytype === "Luxury Collectibles" ? "" : data.tag || "",
            status:
              data.propertytype === "Luxury Collectibles"
                ? ""
                : data.status || "",
            amenities:
              data.propertytype === "Luxury Collectibles"
                ? ""
                : Array.isArray(data.amenities)
                ? data.amenities.join(", ")
                : data.amenities || "",
            description: data.description || "",
            price: data.price || "", // Store raw price
          };
          setMansionData(normalizedData);
          setDisplayPrice(formatPriceWithCommas(data.price)); // Set formatted price for display
          setExistingImages(data.images || []);
          setExistingAgentImage(data.agentimage || "");
          setDescriptionCharCount(
            data.description ? data.description.length : 0
          );
        } catch (error) {
          console.error("Error fetching property:", error);
          setSubmitError("Failed to load property data.");
          if (error.response?.status === 403) {
            navigate("/dashboard");
          }
        }
      };
      fetchProperty();
    }
  }, [id, user, api, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMansionData((prev) => ({
      ...prev,
      [name]: name === "price" ? parsePrice(value) : value, // Store raw price
    }));
    if (name === "description") {
      const normalizedValue = value.replace(/\r\n/g, "\n");
      setDescriptionCharCount(normalizedValue.length);
    }
    if (name === "price") {
      setDisplayPrice(formatPriceWithCommas(value)); // Update display price
    }
  };

  const handlePriceBlur = () => {
    // Ensure the display price is formatted when the input loses focus
    setDisplayPrice(formatPriceWithCommas(mansionData.price));
  };

  const compressImage = async (file) => {
    try {
      const compressedFile = await imageCompression(file, compressionOptions);
      return new File([compressedFile], file.name, { type: file.type });
    } catch (error) {
      console.error("Image compression error:", error);
      setSubmitError("Failed to compress image: " + file.name);
      return file;
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const compressedFiles = await Promise.all(
      files.map(async (file) => await compressImage(file))
    );
    setImages((prev) => [...prev, ...compressedFiles]);
  };

  const handleAgentImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressedFile = await compressImage(file);
      setAgentImage(compressedFile);
      setExistingAgentImage("");
    }
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
      const isLuxuryCollectibles =
        mansionData.propertytype === "Luxury Collectibles";

      const fieldsToInclude = isLuxuryCollectibles
        ? [
            "reference",
            "propertytype",
            "price",
            "title",
            "subtitle",
            "description",
            "video",
            "agentname",
            "designation",
            "email",
            "phone",
            "whatsaapno",
            "callno",
            "category",
          ]
        : Object.keys(mansionData);

      const normalizedData = { ...mansionData };
      if (isLuxuryCollectibles) {
        const irrelevantFields = [
          "size",
          "bedrooms",
          "bathrooms",
          "furnishingtype",
          "builtuparea",
          "projectstatus",
          "community",
          "subcommunity",
          "country",
          "propertyaddress",
          "unitno",
          "tag",
          "status",
          "amenities",
        ];
        irrelevantFields.forEach((field) => {
          normalizedData[field] = null;
        });
      }

      fieldsToInclude.forEach((key) => {
        let value = normalizedData[key];
        if (key === "description") {
          value = value.replace(/\r\n/g, "\n") || "";
        } else {
          value = value !== null && value !== undefined ? value.toString() : "";
        }
        formData.append(key, value);
      });

      images.forEach((image) => {
        formData.append("images", image);
      });

      if (existingImages.length > 0) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      if (agentImage) {
        formData.append("agentimage", agentImage);
      } else if (existingAgentImage) {
        formData.append("existingAgentImage", existingAgentImage);
      }

      let response;
      if (id) {
        response = await api.put(`/api/propertyDetail/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000,
        });
      } else {
        response = await api.post("/api/propertyDetail", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSubmitSuccess(true);
      if (!id) {
        setMansionData({
          reference: "",
          propertytype: "",
          size: "",
          bedrooms: "",
          bathrooms: "",
          furnishingtype: "",
          builtuparea: "",
          projectstatus: "",
          community: "",
          subcommunity: "",
          country: "",
          price: "",
          title: "",
          subtitle: "",
          description: "",
          amenities: "",
          video: "",
          propertyaddress: "",
          unitno: "",
          tag: "",
          status: "",
          agentname: "",
          designation: "",
          email: "",
          phone: "",
          whatsaapno: "",
          callno: "",
          category: "",
        });
        setImages([]);
        setExistingImages([]);
        setAgentImage(null);
        setExistingAgentImage("");
        setDescriptionCharCount(0);
        setDisplayPrice(""); // Reset display price
        document
          .querySelectorAll('input[type="file"]')
          .forEach((input) => (input.value = ""));
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Submission error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit form.";
      setSubmitError(errorMessage);
      if (error.response?.status === 403) {
        navigate("/dashboard");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  const isLuxuryCollectibles =
    mansionData.propertytype === "Luxury Collectibles";

  return (
    <div className="w-full mx-auto p-4 md:p-20 mb-8 font-inter">
      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-md p-6 mb-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {id ? "Edit Property" : "Add New Property"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Reference*</label>
              <input
                type="text"
                name="reference"
                placeholder="Add Reference"
                value={mansionData.reference}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Property Type*</label>
              <select
                name="propertytype"
                value={mansionData.propertytype}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
              >
                <option value="">Select Property Type</option>
                <option value="Mansion">Mansion</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Luxury Collectibles">Luxury Collectibles</option>
              </select>
            </div>
            {isLuxuryCollectibles && (
              <div className="form-group">
                <label className="block text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  name="category"
                  placeholder="Add Category (e.g., Art, Jewelry)"
                  value={mansionData.category}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                />
              </div>
            )}
            {!isLuxuryCollectibles && (
              <>
                <div className="form-group">
                  <label className="block text-gray-700 mb-2">
                    Size (SQFT)*
                  </label>
                  <input
                    type="number"
                    name="size"
                    placeholder="Add Size"
                    value={mansionData.size}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                    required
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label className="block text-gray-700 mb-2">Bedrooms*</label>
                  <input
                    type="number"
                    name="bedrooms"
                    placeholder="Add Bedrooms"
                    value={mansionData.bedrooms}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label className="block text-gray-700 mb-2">Bathrooms*</label>
                  <input
                    type="number"
                    name="bathrooms"
                    placeholder="Add Bathrooms"
                    value={mansionData.bathrooms}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label className="block text-gray-700 mb-2">
                    Furnishing Type
                  </label>
                  <select
                    name="furnishingtype"
                    value={mansionData.furnishingtype}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                  >
                    <option value="">Select Furnishing Type</option>
                    <option value="Furnished">Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="block text-gray-700 mb-2">
                    Built-up Area (SQFT)
                  </label>
                  <input
                    type="number"
                    name="builtuparea"
                    placeholder="Add Built-up Area"
                    value={mansionData.builtuparea}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label className="block text-gray-700 mb-2">
                    Project Status
                  </label>
                  <select
                    name="projectstatus"
                    value={mansionData.projectstatus}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                  >
                    <option value="">Select Project Status</option>
                    <option value="Ready">Ready</option>
                    <option value="Under Construction">
                      Under Construction
                    </option>
                    <option value="Off Plan">Off Plan</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="block text-gray-700 mb-2">Community*</label>
                  <input
                    type="text"
                    name="community"
                    placeholder="Add Community"
                    value={mansionData.community}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="block text-gray-700 mb-2">
                    Sub Community
                  </label>
                  <input
                    type="text"
                    name="subcommunity"
                    placeholder="Add Sub Community"
                    value={mansionData.subcommunity}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                  />
                </div>
                <div className="form-group">
                  <label className="block text-gray-700 mb-2">Country*</label>
                  <input
                    type="text"
                    name="country"
                    placeholder="Add Country"
                    value={mansionData.country}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                    required
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white shadow-md p-6 mb-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Pricing & Description
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Price (AED)*</label>
              <input
                type="text" // Changed from number to text to allow commas
                name="price"
                placeholder="Add Price (e.g., 199,999,000)"
                value={displayPrice} // Use displayPrice for input
                onChange={handleChange}
                onBlur={handlePriceBlur} // Format on blur
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Title*</label>
              <input
                type="text"
                name="title"
                placeholder="Add Title"
                value={mansionData.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
              />
            </div>
            <div className="form-group md:col-span-2">
              <label className="block text-gray-700 mb-2">Sub Title</label>
              <input
                type="text"
                name="subtitle"
                placeholder="Add Sub Title"
                value={mansionData.subtitle}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
              />
            </div>
            <div className="form-group md:col-span-2">
              <label className="block text-gray-700 mb-2">
                Description* ({descriptionCharCount} characters)
              </label>
              <textarea
                rows="4"
                name="description"
                placeholder="Add Description"
                value={mansionData.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
                style={{ whiteSpace: "pre-wrap" }}
              ></textarea>
            </div>
            {!isLuxuryCollectibles && (
              <div className="form-group md:col-span-2">
                <label className="block text-gray-700 mb-2">Amenities</label>
                <textarea
                  rows="4"
                  name="amenities"
                  placeholder="List amenities separated by commas"
                  value={mansionData.amenities}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                  required
                ></textarea>
              </div>
            )}
          </div>
        </div>

        {/* Rest of the form remains unchanged */}
        <div className="bg-white shadow-md p-6 mb-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="block text-gray-700 mb-2">
                Property Images{!id && "*"}
              </label>
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required={!id && existingImages.length === 0}
              />
              {(existingImages.length > 0 || images.length > 0) && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Image Previews:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                    {existingImages.map((imageUrl, index) => (
                      <div key={`existing-${index}`} className="relative">
                        <img
                          src={imageUrl}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {images.map((image, index) => (
                      <div key={`new-${index}`} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`New ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Video Link</label>
              <input
                type="url"
                name="video"
                placeholder="Enter Video Link"
                value={mansionData.video}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
              />
            </div>
          </div>
        </div>

        {!isLuxuryCollectibles && (
          <div className="bg-white shadow-md p-6 mb-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Location & Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="block text-gray-700 mb-2">
                  Property Address*
                </label>
                <input
                  type="text"
                  name="propertyaddress"
                  placeholder="Add Property Address"
                  value={mansionData.propertyaddress}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                  required
                />
              </div>
              <div className="form-group">
                <label className="block text-gray-700 mb-2">Unit No</label>
                <input
                  type="text"
                  name="unitno"
                  placeholder="Add Unit No"
                  value={mansionData.unitno}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                />
              </div>
              <div className="form-group">
                <label className="block text-gray-700 mb-2">Tag</label>
                <select
                  name="tag"
                  value={mansionData.tag}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                >
                  <option value="">Select Tag</option>
                  <option value="Featured">Featured</option>
                  <option value="Popular">Popular</option>
                  <option value="New">New</option>
                  <option value="Hot Deal">Hot Deal</option>
                </select>
              </div>
              <div className="form-group">
                <label className="block text-gray-700 mb-2">Status*</label>
                <select
                  name="status"
                  value={mansionData.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="For Sale">For Sale</option>
                  <option value="For Rent">For Rent</option>
                  <option value="Sold">Sold</option>
                  <option value="Rented">Rented</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow-md p-6 mb-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Agent Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Agent Name*</label>
              <input
                type="text"
                name="agentname"
                placeholder="Add Agent Name"
                value={mansionData.agentname}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Designation</label>
              <input
                type="text"
                name="designation"
                placeholder="Add Designation"
                value={mansionData.designation}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Phone*</label>
              <input
                type="tel"
                name="phone"
                placeholder="Add Phone Number"
                value={mansionData.phone}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Email*</label>
              <input
                type="email"
                name="email"
                placeholder="Add Email"
                value={mansionData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">WhatsApp No</label>
              <input
                type="tel"
                name="whatsaapno"
                placeholder="Add WhatsApp Number"
                value={mansionData.whatsaapno}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Call No</label>
              <input
                type="tel"
                name="callno"
                placeholder="Add Call Number"
                value={mansionData.callno}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">
                Agent Profile Image
              </label>
              <input
                type="file"
                name="agentimage"
                accept="image/*"
                onChange={handleAgentImageChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
              />
              {(existingAgentImage || agentImage) && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Agent Image Preview:</p>
                  <div className="relative w-24 h-24 mt-2">
                    {existingAgentImage && !agentImage ? (
                      <>
                        <img
                          src={existingAgentImage}
                          alt="Existing Agent"
                          className="w-full h-24 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveExistingAgentImage}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      agentImage && (
                        <>
                          <img
                            src={URL.createObjectURL(agentImage)}
                            alt="New Agent"
                            className="w-full h-24 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => setAgentImage(null)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                          >
                            ×
                          </button>
                        </>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-100 text-green-700">
            Property {id ? "updated" : "submitted"} successfully!
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
            {isSubmitting ? "Submitting..." : id ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MansionForm;
