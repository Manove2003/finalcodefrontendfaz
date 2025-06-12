import React, { useState, useEffect } from "react";

const EditForm = ({ lead, onClose, onSave }) => {
  const [formData, setFormData] = useState(lead || {});

  useEffect(() => {
    setFormData(lead || {});
  }, [lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-1/2">
        <h2 className="text-lg font-bold mb-4">Edit Lead</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            First Name:
            <input
              type="text"
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleChange}
              className="border w-full p-2 mt-1"
            />
          </label>
          <label className="block mb-2">
            Last Name:
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleChange}
              className="border w-full p-2 mt-1"
            />
          </label>
          <label className="block mb-2">
            Email:
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="border w-full p-2 mt-1"
            />
          </label>
          <label className="block mb-2">
            Phone:
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="border w-full p-2 mt-1"
            />
          </label>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 mr-2"
            >
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditForm;
