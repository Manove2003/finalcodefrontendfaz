import React, { useState, useEffect, useRef } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useMansions } from "../context/MansionContext";

const SearchBar = ({ searchQuery, onSearchChange, onSearchSubmit }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef(null);
  const inputRef = useRef(null);
  const {
    mansions,
    featuredMansions,
    mansionFeatured,
    penthouseFeatured,
    collectiblesFeatured,
  } = useMansions();

  // Generate autocomplete suggestions from context data
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
  }, [
    searchQuery,
    mansions,
    featuredMansions,
    mansionFeatured,
    penthouseFeatured,
    collectiblesFeatured,
  ]);

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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setShowSuggestions(false);
        onSearchSubmit(searchQuery);
      }}
      className=" w-full max-w-2xl h-10 flex items-center relative"
      ref={inputRef}
    >
      <div className="flex flex-1 items-center relative">
        <input
          type="text"
          placeholder="Search by community, sub-community, country, or property type"
          className="w-full px-4 py-2 text-[#000000] text-sm  focus:outline-none"
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
      </div>
    </form>
  );
};

export default SearchBar;
