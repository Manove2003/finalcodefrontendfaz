import React, { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai"; // Importing the plus icon

const PenthouseForm = () => {
  const [formData, setFormData] = useState({
    reference: "",
    propertyType: "",
    size: "",
    bedrooms: "",
    bathrooms: "",
    community: "",
    subcommunity: "",
    country: "",
    furnishing: "",
    builtUpArea: "",
    projectStatus: "",
    price: "",
    title: "",
    subTitle: "",
    description: "",
    amenities: "",
    images: [],
    videoLink: "",
    address: "",
    unitNo: "",
    tag: "",
    agentName: "",
    designation: "",
    contactNo: "",
    email: "",
    whatsappNo: "",
    callNo: "",
    agentImage: "",
  });
  const [amenities, setAmenities] = useState([""]); // Initial state with one empty field

  const handleChange1 = (index, value) => {
    const updatedAmenities = [...amenities];
    updatedAmenities[index] = value;
    setAmenities(updatedAmenities);
  };

  const addAmenity = () => {
    setAmenities([...amenities, ""]); // Add a new empty field
  };
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files) {
      if (name === "images") {
        const newImages = Array.from(files).map((file) => ({
          file,
          previewUrl: URL.createObjectURL(file),
        }));
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...newImages],
        }));
      } else {
        setFormData({ ...formData, [name]: files[0] });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="w-full mx-auto p-4 md:p-8  mb-8 font-inter">
      {/* Section 1 */}
      <div className="bg-white shadow-md p-6  mb-6">
        <h2 className="text-xl font-bold mb-4">Penthouse Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            "Reference",
            "Property Type",
            "Size (SQFT)",
            "No of Bedrooms",
            "No of Bathroom",
            "Furnishing Type",
            "Built-up Area (SQFT)",
            "Project Status",
            "Community",
            "Sub community",
            "Country",
          ].map((field) => (
            <div key={field}>
              <label className="block font-semibold">{field}</label>
              <input
                type="text"
                name={field.toLowerCase().replace(/[^a-zA-Z0-9]/g, "")}
                value={
                  formData[field.toLowerCase().replace(/[^a-zA-Z0-9]/g, "")]
                }
                onChange={handleChange}
                className="w-full p-2 border outline-none "
                placeholder={`Enter ${field}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section 2 */}
      <div className="bg-white shadow-md p-6  mb-6">
        <h2 className="text-xl font-bold mb-4">Pricing & Description</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {["Price", "Title", "Sub Title"].map((field) => (
            <div key={field}>
              <label className="block font-semibold">{field}</label>
              <input
                type="text"
                name={field.toLowerCase().replace(/[^a-zA-Z0-9]/g, "")}
                value={
                  formData[field.toLowerCase().replace(/[^a-zA-Z0-9]/g, "")]
                }
                onChange={handleChange}
                className="w-full p-2 border outline-none "
                placeholder={`Enter ${field}`}
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="block font-semibold">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border outline-none"
              placeholder="Enter Description"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block font-semibold">Amenities</label>
            {amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  name={`amenities-${index}`}
                  value={amenity}
                  onChange={(e) => handleChange1(index, e.target.value)}
                  className="w-full p-2 mb-2 border outline-none"
                  placeholder="Enter Amenities"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addAmenity}
              className="flex items-center gap-1 px-3 py-2 mt-2 text-black  border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
            >
              <AiOutlinePlus size={18} />
              Add Amenity
            </button>
          </div>
        </div>
      </div>

      {/* Section 3 */}
      <div className="bg-white shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Media</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Images Upload */}
          <div>
            <label className="block font-semibold">Images</label>
            <input
              type="file"
              name="images"
              onChange={handleChange}
              className="w-full p-2 border"
              multiple
            />
            {formData.images.length > 0 && (
              <div className="mt-2">
                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-1 bg-gray-100 border rounded mt-1"
                  >
                    <span className="text-sm">{image.file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleImageRemove(index)}
                      className="ml-2 text-red-500 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video Link */}
          <div>
            <label className="block font-semibold">Video Link</label>
            <input
              type="text"
              name="videoLink"
              value={formData.videoLink}
              onChange={handleChange}
              className="w-full p-2 border outline-none"
              placeholder="Enter Video Link"
            />
          </div>
        </div>
      </div>

      {/* Section 4 */}
      <div className="bg-white shadow-md p-6  mb-6">
        <h2 className="text-xl font-bold mb-4">Location & Tags</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {["Property Address (Map)", "Unit No", "Tag"].map((field) => (
            <div key={field}>
              <label className="block font-semibold">{field}</label>
              <input
                type="text"
                name={field.toLowerCase().replace(/[^a-zA-Z0-9]/g, "")}
                value={
                  formData[field.toLowerCase().replace(/[^a-zA-Z0-9]/g, "")]
                }
                onChange={handleChange}
                className="w-full p-2 border outline-none "
                placeholder={`Enter ${field}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section 5 */}
      <div className="bg-white shadow-md p-6  mb-6">
        <h2 className="text-xl font-bold mb-4">Agent Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            "Agent Name",
            "Designation",
            "Contact No",
            "Email",
            "Whatsapp No",
            "Call No",
          ].map((field) => (
            <div key={field}>
              <label className="block font-semibold">{field}</label>
              <input
                type="text"
                name={field.toLowerCase().replace(/[^a-zA-Z0-9]/g, "")}
                value={
                  formData[field.toLowerCase().replace(/[^a-zA-Z0-9]/g, "")]
                }
                onChange={handleChange}
                className="w-full p-2 border outline-none"
                placeholder={`Enter ${field}`}
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="block font-semibold">Agent Profile Image</label>
            <input
              type="file"
              name="agentImage"
              onChange={handleChange}
              className="w-full p-2 border "
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button className="font-inter px-20 py-3 text-black  border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300">
          Submit
        </button>
      </div>
    </div>
  );
};

export default PenthouseForm;
