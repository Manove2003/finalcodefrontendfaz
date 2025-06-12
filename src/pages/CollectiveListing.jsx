import React, { useState, useEffect } from "react";

import { X } from "lucide-react";

import { FaSearch } from "react-icons/fa";
import newImage1 from "../assests/image 5.png";
import newImage2 from "../assests/BrandedResi-P.jpg";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // Impor
import newImage3 from "../assests/Mansions.jpg"; // Add more images as needed
import { FaPhoneAlt } from "react-icons/fa"; // Importing WhatsApp and phone icons
import { BsFlag } from "react-icons/bs";
import Listing from "../components/listings";
import Footer from "../components/Footer";
import logo from "../assests/TMM_Logo_Non-responsive.svg";
import ImageGallerys from "../components/ImageGallerys";
import sharelogo from "../assests/Share Icon_1.svg";
import sharelogoHover from "../assests/Share Icon White.svg";
// import PopupForm from "./PopupForm";
const CollectiveListing = () => {
  const [isOpen1, setIsOpen1] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 50
      ) {
        setIsOpen1(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [newImage1, newImage2, newImage3]; // Array of images

  const [isHovered, setIsHovered] = useState(false);
  // Handle next and previous buttons

  const [isOpen, setIsOpen] = useState(false);
  // const handleSubmit = () => {
  //   setIsOpen(true);
  // };

  // const handleClose = () => {
  //   setIsOpen(false);
  // };

  return (
    <>
      <div className="flex flex-col items-center px-4 md:px-10 lg:px-20 py-12 space-y-8">
        {/* Title and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-evenly w-full gap-6">
          <img src={logo} className="w-[400px]" alt="logo" />
          <div className="flex gap-2 w-full md:w-auto">
            <div className="flex items-center w-full md:w-[300px] border border-[#000000] overflow-hidden shadow-sm">
              <input
                type="text"
                placeholder="Country, Area, District..."
                className="w-full px-4 py-2 text-[#000000] text-sm bg-[#f5f5f5] focus:outline-none"
              />
            </div>
            <button className="bg-[#00603A] px-4 py-2 flex items-center justify-center border border-[#00603A] text-white hover:text-[#00603A] hover:bg-transparent transition">
              <FaSearch className="font-thin hover:text-[#00603A]" />
            </button>
          </div>
        </div>
        <div className="flex flex-col md:space-x-6 mt-4 py-6 md:mt-6 space-x-2 md:space-y-0">
          <h3 className="text-3xl pt-8 font-playfair text-[##00603A] text-center mb-8 bg-white">
            Exquisite villa in Palm Jumeirah with private pool
          </h3>
        </div>

        <div className="relative w-full h-screen">
          <img
            src={images[currentImageIndex]}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <ImageGallerys images={images} />
        </div>

        <div className="w-full mx-auto  py-8 lg:flex lg:justify-between border-b border-black">
          {/* Left Section */}
          <div className="w-full lg:w-7/12">
            <h1 className="text-3xl -mt-4 font-playfair  text-[#00603A]">
              Palm Jumeirah Mansion
            </h1>
            <p className="text-3xl font-inter  text-green-900 mt-4">AED 95</p>
            <p className="text-sm text-gray-500 mt-2 font-inter">
              PROPERTY REF: 44421
            </p>

            <p className="text-base text-gray-700 mt-4 leading-7 font-inter w-full md:w-10/12">
              It is hard to imagine a luxury property more impressive than this
              extraordinary five-bedroom Presidential penthouse apartment in the
              Armani Beach Residences, Palm Jumeirah.
            </p>
            <p className="text-base font-inter text-gray-700 mt-4 leading-7 w-full md:w-10/12">
              The Armani Beach Residences is one of Dubai’s most anticipated
              luxury branded residences and its Presidential penthouse
              apartments represent the pinnacle of indulgent opulence. This
              expansive five-bedroom penthouse apartment has a meticulously
              designed interior by Armani/Casa and a host of state-of-the-art
              features that blend elegant style with contemporary functionality.
              The living areas are spacious and inviting, with unique detailing
              and stunning accents. The gourmet kitchen is equipped with...
            </p>
            <div className="flex   items-center gap-6">
              <button className="mt-6 font-inter px-8 md:px-20 py-3 text-black  border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300">
                Show full description
              </button>

              <div className="text-center mt-6 ">
                {/* Button to open popup */}
                <button
                  onClick={() => setIsOpen(true)}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className=" py-4 flex items-center justify-center gap-2 font-inter px-4  text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
                >
                  <img
                    src={isHovered ? sharelogoHover : sharelogo}
                    className="w-4"
                    alt="images"
                  />
                </button>

                {/* Popup Modal */}
                {isOpen && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                    <div className="bg-white  shadow-lg max-w-md w-full">
                      <div className="relative">
                        <button
                          onClick={() => setIsOpen(false)}
                          className="absolute -top-8 right-2  p-1 "
                        >
                          <X size={22} />
                        </button>
                        <div className="relative w-full h-64">
                          <img
                            src={newImage1}
                            alt="Villa in Palm Jumeirah"
                            className="w-full h-full object-cover mt-8"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-black/55 to-transparent"></div>
                          <div className="absolute top-4 left-4 text-white">
                            <h2 className="text-2xl text-left font-playfair">
                              Exquisite villa in Palm Jumeirah with private pool
                            </h2>
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-5 text-left">
                        <h3 className="text-lg font-semibold ">Share</h3>
                        <p className="text-gray-600 mt-2">
                          Presidential penthouse in luxury branded residence on
                          Palm Jumeirah
                        </p>

                        {/* Share Icons */}
                        <div className="flex justify-left space-x-4 mt-4">
                          <button className="p-2 bg-gray-200 rounded-full">
                            <FaFacebook size={20} />
                          </button>
                          <button className="p-2 bg-gray-200 rounded-full">
                            <FaInstagram size={20} />
                          </button>
                          <button className="p-2 bg-gray-200 rounded-full">
                            <FaLinkedin size={20} />
                          </button>
                          <button className="p-2 bg-gray-200 rounded-full">
                            <FaXTwitter size={20} />
                          </button>
                          <button className="p-2 bg-gray-200 rounded-full">
                            <FaWhatsapp size={20} />
                          </button>
                        </div>
                      </div>
                      <div className="bg-[#00603A] h-4"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Right Section */}
          <div className="lg:w-5/12  ml-0 md:ml-12   lg:mt-0 ">
            <div className="border border-[#00603A] p-6 mt-8 md:-mt-4 z-0   sticky top-20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-inter font-semibold text-gray-800">
                    Stephan Hirzel
                  </h3>
                  <p className="text-sm text-gray-500 font-inter">
                    Associate Director
                  </p>
                </div>
                <img
                  src={newImage1}
                  alt="Stephan Hirzel"
                  className="w-20 h-20 rounded-full object-cover mr-4"
                />
              </div>

              <div className="flex gap-2  mt-4 border-b pb-4">
                <button className="text-[#00603A] font-inter flex items-center  space-x-1">
                  <FaWhatsapp />
                  <span>WhatsApp</span>
                </button>
                <span className="text-[#f5f5f5]">|</span>
                <button className="text-[#00603A] font-inter flex items-center space-x-1">
                  <FaPhoneAlt />
                  <span>Call</span>
                </button>
              </div>

              <form className="mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First name *"
                    className="border p-2 w-full text-gray-700"
                  />
                  <input
                    type="text"
                    placeholder="Last name *"
                    className="border p-2 w-full text-gray-700"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email *"
                  className="border p-2 w-full mt-4 text-gray-700"
                />
                <div className="flex items-center mt-4">
                  <span className="bg-gray-200 p-2 flex items-center text-gray-700">
                    <BsFlag className="mr-1" />
                    +971
                  </span>
                  <input
                    type="text"
                    placeholder="Phone"
                    className="border-t border-b border-r p-2 w-full text-gray-700"
                  />
                </div>
                <textarea
                  placeholder="I'd like to have more information about the "
                  className="border p-2 w-full mt-4 text-gray-700"
                  rows="4"
                ></textarea>
              </form>

              <button
                type="button"
                className="w-full mt-6 px-6 py-2 flex items-center justify-center gap-2  font-inter px-20 text-[#ffffff]  border bg-[#00603A] border-[#00000] hover- border-[#00603A] hover:bg-[#FFFFFF] hover:text-[#000000] transition-all duration-300"
              >
                Submit enquiry
              </button>
            </div>
          </div>
        </div>
        <Listing />
      </div>
      {/* <PopupForm isOpen1={isOpen1} onClose={() => setIsOpen1(false)} /> */}
      <Footer />
    </>
  );
};

export default CollectiveListing;
