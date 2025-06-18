import React, { useState, useEffect, useRef } from "react";
import { FiArrowRight } from "react-icons/fi";
import axios from "axios";
import { useMansions } from "../context/MansionContext"; // Ensure this is available

const ResponsiveHero = ({ searchQuery, onSearchChange, onSearchSubmit }) => {
  const [heading, setHeading] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [subheading, setSubheading] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef(null);
  const inputRef = useRef(null);
  const { mansions, featuredMansions, mansionFeatured, penthouseFeatured, collectiblesFeatured } = useMansions();

  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://backendfaz.onrender.com"
      : "http://localhost:5001";

  // Fetch hero content
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/hero`);
        if (response.data) {
          setHeading(response.data.heading || "No content available");
          setHeroImage(`${response.data.image}` || "/default-image.jpg");
          setSubheading(response.data.subheading || "No subheading available");
        }
      } catch (error) {
        console.error("Error fetching hero content:", error);
      }
    };
    fetchData();
  }, []);

  // Generate autocomplete suggestions
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      // Combine all property arrays
      const allProperties = [
        ...mansions,
        ...featuredMansions,
        ...mansionFeatured,
        ...penthouseFeatured,
        ...collectiblesFeatured,
      ];

      // Extract unique values for community, subcommunity, country, and propertytype
      const uniqueValues = new Set();
      allProperties.forEach((property) => {
        if (property.community) uniqueValues.add(property.community);
        if (property.subcommunity) uniqueValues.add(property.subcommunity);
        if (property.country) uniqueValues.add(property.country);
        if (property.propertytype) uniqueValues.add(property.propertytype);
      });

      // Filter values based on search query (case-insensitive)
      const filteredSuggestions = Array.from(uniqueValues)
        .filter((value) =>
          value.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort();

      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, mansions, featuredMansions, mansionFeatured, penthouseFeatured, collectiblesFeatured]);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    onSearchChange(suggestion);
    setShowSuggestions(false);
    onSearchSubmit(suggestion);
  };

  return (
    <div className="relative w-full h-[90vh] sm:h-[100vh]">
      <img
        src={heroImage}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

      <div className="relative z-10 flex flex-col justify-center items-center h-full text-white px-4">
        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setShowSuggestions(false);
            onSearchSubmit(searchQuery);
          }}
          className="bg-white shadow-md w-full max-w-[90%] sm:max-w-xl md:max-w-3xl flex   items-center flex-wrap gap-2 p-0 mt-16 sm:mt-20 md:mt-24 rounded-none"
          ref={inputRef}
        >
          <div className="flex flex-1 items-center relative">
            <input
              type="text"
              placeholder="Search by community, sub-community, country, or property type"
              className="flex-1 min-w-[150px] text-xs sm:text-sm md:text-base px-3  text-gray-700 placeholder-gray-400 border-none focus:outline-none"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-full left-0 right-0 bg-white text-gray-700 shadow-md rounded-none max-h-60 overflow-y-auto z-20 text-left">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
            <button
              type="submit"
              className="flex items-center justify-center gap-1 px-3 py-2 text-xs sm:text-sm md:text-base font-semibold text-black bg-transparent hover:text-[#00603A]  transition duration-300"
            >
              Search
              <FiArrowRight className="text-lg sm:text-xl" />
            </button>
          </div>
        </form>

        {/* Heading and Subheading */}
<div className="mt-12 md:mt-16 text-center px-2 md:px-4 w-full  relative">
  <h1 className="font-playfair text-2xl sm:text-3xl md:text-5xl z-0 lg:text-6xl mb-4 leading-tight max-w-5xl mx-auto">
    {heading}
  </h1>
  <p className="font-inter text-sm sm:text-base md:text-lg max-w-3xl z-0 mx-auto leading-relaxed">
    {subheading}
  </p>
</div>

      </div>
    </div>
  );
};

export default ResponsiveHero;