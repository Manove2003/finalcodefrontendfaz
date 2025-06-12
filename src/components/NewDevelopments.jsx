import React, { useState } from "react";

const NewDevelopmentform = () => {
  const [formData, setFormData] = useState({
    image: null,
    title: "",
    link: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // You can add form submission logic here
  };

  return (
    <div className="w-full mx-auto p-4 md:p-8 font-inter">
      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-md p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4">
            New Development Section
          </h3>

          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-2 border outline-none mb-4"
            accept="image/*"
          />

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full p-2 border outline-none mb-4"
          />

          <input
            type="text"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="Link"
            className="w-full p-2 border outline-none"
          />
        </div>

        <div className="text-center mt-4">
          <button
            className="font-inter px-6 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewDevelopmentform;
