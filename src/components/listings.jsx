import React, { useState } from "react";
import { FaBed, FaBath } from "react-icons/fa";
import { BsFullscreen } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import img1 from "../assests/BrandedResi-P.jpg";
import sharelogo from "../assests/Share Icon_1.svg";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";
import { X } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6"; // Impor
// import newImage1 from "../assests/image 5.png";

const listings = [
  {
    type: "Villa",
    title: "Signature Villas, Palm Jumeirah, Dubai",
    price: "AED 160,000,000",
    beds: 6,
    baths: 7,
    size: "12,469 SQ.FT.",
    image: img1,
  },
  {
    type: "Villa",
    title: "Signature Villas, Palm Jumeirah, Dubai",
    price: "Price on Request",
    beds: 6,
    baths: 8,
    size: "16,439 SQ.FT.",
    image: img1,
  },
  {
    type: "Villa",
    title: "Six Senses Residences, Palm Jumeirah, Dubai",
    price: "AED 145,000,000",
    beds: 5,
    baths: 7,
    size: "26,514 SQ.FT.",
    image: img1,
  },
  {
    type: "Villa",
    title: "Contemporary Villa, Dubai Hills",
    price: "AED 120,000,000",
    beds: 5,
    baths: 6,
    size: "14,000 SQ.FT.",
    image: img1,
  },
];

const SimilarListings = () => {
  const [visibleListings, setVisibleListings] = useState(3);

  const handleViewMore = () => {
    setVisibleListings((prev) => prev + 3); // Show 3 more items
  };
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="container mx-auto px-4  ">
      <h2 className="text-3xl text-center mb-12 mt-8 font-playfair text-[#00603A]">
        Similar Listings
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {listings.slice(0, visibleListings).map((listing, index) => (
          <div key={index} className="">
            <div className="relative">
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-[250px] object-cover"
              />
              {/* <span className="absolute top-3 left-3 bg-white text-black text-xs px-3 py-1  border">
                {listing.type}
              </span> */}
              <button
                className="absolute top-3 right-3 bg-white text-black p-2 border shadow-sm hover:bg-gray-100"
                onClick={() => setIsOpen(true)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <img src={sharelogo} className="w-4" />
              </button>

              {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-10">
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
                          src={img1}
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
            <div className="pt-4">
              <h3 className="text-base   font-medium mt-2 mb-2">
                {listing.title}
              </h3>
              <div className="block  justify-between items-center">
                <p className="text-black text-sm font-semibold mt-2 mb-2">
                  {listing.price}
                </p>
                <div className="flex items-center text-gray-500 text-sm  space-x-2">
                  <div className="flex items-center gap-1">
                    <span>{listing.beds} </span>Beds |
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{listing.baths}</span>Baths |
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{listing.size}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {visibleListings < listings.length && (
        <div className="text-center mt-20">
          <button
            onClick={handleViewMore}
            className="w-[250px] font-inter px-20 py-3 text-black  border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
          >
            View More
          </button>
        </div>
      )}
    </div>
  );
};

export default SimilarListings;
