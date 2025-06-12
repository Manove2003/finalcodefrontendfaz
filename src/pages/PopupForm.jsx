import React from "react";
import { X } from "lucide-react";
import image from "../assests/Mansions.jpg";

const PopupForm = ({
  isOpen1,
  onClose,
}: {
  isOpen1: boolean,
  onClose: () => void,
}) => {
  if (!isOpen1) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 ">
      <div className="bg-white  w-full max-w-2xl p-6  md:flex">
        {/* Left Side - Image */}
        <div className="hidden md:block md:w-1/2 mt-8">
          <img src={image} alt="Villa" className="w-full h-full object-cover" />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              Can’t find what you are looking for?
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-500"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Share your requirements, and we’ll assist you with your search.
          </p>

          <form className="space-y-3">
            <input
              type="text"
              placeholder="Full name"
              className="w-full p-2 border rounded-md"
            />
            <input
              type="email"
              placeholder="E-mail address"
              className="w-full p-2 border rounded-md"
            />
            <div className="flex items-center border rounded-md">
              <span className="px-2">🇦🇪 +971</span>
              <input
                type="text"
                placeholder="Phone number"
                className="w-full p-2 border-l"
              />
            </div>
            <select className="w-full p-2 border rounded-md">
              <option>Select location</option>
            </select>
            <select className="w-full p-2 border rounded-md">
              <option>Budget (AED)</option>
            </select>
            <textarea
              placeholder="Let us know what else you require."
              className="w-full p-2 border rounded-md"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
            >
              Submit enquiry
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-3">
            This site is protected by reCAPTCHA and the Google Privacy Policy
            and Terms of Service apply.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PopupForm;
