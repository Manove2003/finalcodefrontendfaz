import React, { useState, useEffect } from "react";
import axios from "axios";
import "../components/man.css";
import { FaSearch } from "react-icons/fa";
import logo from "../assests/TMM_Logo_Non-responsive.svg";
import Footer from "../components/Footer";
import image1 from "../assests/Golf Community.jpg";
import { Menu, X } from "lucide-react";

const ListedCollectibles = () => {
  const [homes, setHomes] = useState([]);
  const [properties, setProperties] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const cardsPerPage = 9;
  const totalPages = Math.ceil(homes.length / cardsPerPage);
  const [menuOpen, setMenuOpen] = useState(false);
  const handleSeeMore = () => {
    setCurrentPage((prev) => prev + 6); // Load 6 more posts on click
  };

  const propertyList = [
    {
      id: 1,
      images: image1,
      isFeatured: true,
      price: 2500000,
      propertyType: "Villa",
      location: {
        city: "Dubai",
        state: "Dubai",
        country: "UAE",
      },
      bedrooms: 7,
      bathrooms: 3,
      size: 2345,
    },
    {
      id: 2,
      images: image1,
      isFeatured: false,
      price: 1800000,
      propertyType: "Apartment",
      location: {
        city: "Abu Dhabi",
        state: "Abu Dhabi",
        country: "UAE",
      },
      bedrooms: 6,
      bathrooms: 3,
      size: 2345,
    },
    {
      id: 3,
      images: image1,
      isFeatured: true,
      price: 3200000,
      propertyType: "Penthouse",
      location: {
        city: "Sharjah",
        state: "Sharjah",
        country: "UAE",
      },
      bedrooms: 2,
      bathrooms: 2,
      size: 2345,
    },
    {
      id: 4,
      images: image1,
      isFeatured: false,
      price: 1200000,
      propertyType: "Studio",
      location: {
        city: "Ajman",
        state: "Ajman",
        country: "UAE",
      },
      bedrooms: 3,
      bathrooms: 2,
      size: 2345,
    },
    {
      id: 5,
      images: image1,
      isFeatured: true,
      price: 2700000,
      propertyType: "Townhouse",
      location: {
        city: "Fujairah",
        state: "Fujairah",
        country: "UAE",
      },
      bedrooms: 4,
      bathrooms: 3,
      size: 2345,
    },
    {
      id: 6,
      images: image1,
      isFeatured: false,
      price: 1500000,
      propertyType: "Condo",
      location: {
        city: "Ras Al Khaimah",
        state: "RAK",
        country: "UAE",
      },
      bedrooms: 5,
      bathrooms: 3,
      size: 2345,
    },
  ];

  const displayedHomes = homes.slice(0, currentPage);

  const [activePopup, setActivePopup] = useState(null);

  const togglePopup = (popupName) => {
    setActivePopup(activePopup === popupName ? null : popupName);
  };

  // Fetch penthouse data from the API
  useEffect(() => {
    fetchHomes();
    fetchProperties();
  }, []);

  const fetchHomes = async () => {
    try {
      const response = await axios.get(
        "https://backendfaz.onrender.com/penthouses"
      );
      setHomes(response.data);
    } catch (error) {
      console.error("Error fetching penthouses:", error);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await axios.get(
        "https://backendfaz.onrender.com/property"
      );
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching property:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center px-4 md:px-10 lg:px-20 py-12 space-y-8">
        {/* Title and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6 relative">
          {/* Logo */}
          <img src={logo} className="w-[250px] md:w-[400px]" alt="logo" />

          <div className="flex gap-2 w-full md:w-auto items-center">
            {/* Search Bar */}
            <div className="flex items-center w-full md:w-[300px] border border-[#000000] overflow-hidden shadow-sm">
              <input
                type="text"
                placeholder="Country, Area, District..."
                className="w-full px-4 py-2 text-[#000000] text-sm bg-[#f5f5f5] focus:outline-none"
              />
            </div>

            {/* Search Button */}
            <button className="bg-[#00603A] px-4 py-2 flex items-center justify-center border border-[#00603A] text-white hover:text-[#00603A] hover:bg-transparent transition">
              <FaSearch className="font-thin hover:text-[#00603A]" />
            </button>

            {/* Menu Icon (Visible on all screen sizes) */}
            <button className="p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <X className="w-6 h-6 text-[#000000]" />
              ) : (
                <Menu className="w-6 h-6 text-[#000000]" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Popup (Works on all screen sizes) */}
        {menuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white shadow-lg rounded-lg p-6 w-4/5 md:w-1/2 lg:w-1/3 flex flex-col items-start space-y-4 relative">
              {[
                { name: "Mansions", href: "/mansions" },
                { name: "Penthouses", href: "/penthouses" },
                { name: "New Developments", href: "/listingpage" },
                { name: "Magazine", href: "/magazine" },
                { name: "Luxe Collectibles", href: "/luxecollectibles" },
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="font-inter pb-2 text-gray-800 hover:text-[#00603A] text-lg"
                >
                  {link.name}
                </a>
              ))}

              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-black"
                onClick={() => setMenuOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
        <div>
          <h2 className="text-xl  md:text-3xl pt-12 font-playfair text-[#00603A] text-center">
            Explore luxurious penthouses for sale globally
          </h2>
          <p className="text-sm font-inter md:text-lg pt-4 text-gray-600 text-center max-w-3xl leading-relaxed">
            Discover a selection of exquisite penthouses from around the world
            at The Mansion Market. Every listing is handpicked to cater to your
            ultra-luxury desires, offering superior elegance, opulence, and
            breathtaking panoramas.
          </p>
        </div>
      </div>

      <div className="p-4 md:p-8">
        {/* Header Section */}
        <div className="p-4 md:px-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 md:space-x-4">
                <div className="relative inline-block">
                  <button
                    className="px-2 md:px-4 py-2 font-inter text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
                    onClick={() => togglePopup("price")}
                  >
                    Price
                  </button>
                  {activePopup === "price" && (
                    <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg border border-gray-300 p-4  z-10">
                      <div className="flex gap-4">
                        <div>
                          <label className="text-sm text-gray-600">
                            Min. Price
                          </label>
                          <input
                            className="w-full p-2 border border-[#000000] no-arrows focus:outline-none focus:ring-0"
                            type="number"
                            min="1"
                            placeholder="5,000,000"
                            onKeyDown={(e) => {
                              if (e.key === "-" || e.key === "e") {
                                e.preventDefault();
                              }
                            }}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">
                            Max. Price
                          </label>
                          <input
                            className="w-full p-2 border border-[#000000] no-arrows focus:outline-none focus:ring-0"
                            type="number"
                            min="1"
                            onKeyDown={(e) => {
                              if (e.key === "-" || e.key === "e") {
                                e.preventDefault();
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <button className="text-blue-500 mt-2 underline">
                          Clear selection
                        </button>
                        <button className="text-blue-500 mt-2 underline">
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 border border-[#00603A] px-6 py-2">
                <span className="text-gray-700 text-sm font-medium">
                  Sort by
                </span>
                <select className="bg-transparent text-gray-700 font-medium focus:outline-none cursor-pointer">
                  <option className="text-gray-700">Featured</option>
                  <option className="text-gray-700">Price: High to Low</option>
                  <option className="text-gray-700">Price: Low to High</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedHomes.map((home) => (
              <div key={home._id} className=" overflow-hidden">
                <div className="relative">
                  {home.images.length > 0 && (
                    <img
                      src={home.images[0].replace(/['"]+/g, "")} // Ensure first image is displayed
                      alt="Mansion"
                      className="w-full h-96 object-cover"
                    />
                  )}
                  {home.isFeatured === true && (
                    <span className="absolute top-2 left-2 bg-white text-black text-xs font-medium px-3 py-1 shadow">
                      Featured
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-lg text-gray-800">
                    AED {home.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {home.propertyType}
                  </p>

                  <div className="flex items-center space-x-4">
                    <h2 className="text-lg font-medium">
                      {home.location.city}, {home.location.state},{" "}
                      {home.location.country}
                    </h2>
                    {/* <p className="text-sm text-gray-500">{home.status}</p> */}
                  </div>

                  <p className="text-sm text-gray-500">
                    {home.description.length > 100
                      ? home.description.slice(0, 200) + "..."
                      : home.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center m-8 p-4">
        {currentPage < homes.length && ( // Show button only if there are more posts
          <button
            onClick={handleSeeMore}
            className="px-4 py-2 w-60 font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
          >
            See More
          </button>
        )}
      </div>

      <div className="py-10 border-t-2 border-[#00603A]">
        <h2 className="text-2xl md:text-3xl text-center font-playfair text-[#00603A] mb-8">
          Mansions And Penthouses For Sale
        </h2>
        {Array.isArray(propertyList) && propertyList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
            {propertyList.slice(0, 6).map((property) => (
              <div key={property.id} className="overflow-hidden">
                {/* Image and title on the image */}
                <div className="relative">
                  {property.images && (
                    <img
                      src={property.images}
                      alt="Property"
                      className="w-full h-96 object-cover"
                    />
                  )}

                  {property.isFeatured && (
                    <span className="absolute top-2 left-2 bg-white text-black text-xs font-medium px-3 py-1 shadow">
                      Featured
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-800 mt-2">
                    AED {property.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {property.propertyType}
                  </p>
                  <p className="font-inter text-gray-700 text-sm mt-2 mb-2">
                    {property.bedrooms} Beds | {property.bathrooms} Baths |{" "}
                    {property.size} sqft
                  </p>
                  <div className="flex items-center space-x-4">
                    <h2 className="text-base ">
                      {property.location.city}, {property.location.state},{" "}
                      {property.location.country}
                    </h2>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No properties available.</p>
        )}
      </div>

      <Footer />
    </>
  );
};

export default ListedCollectibles;
