import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import logo from "../assests/TMM_Logo_Non-responsive.svg";
import Footer from "../components/Footer";
import { Menu, X } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import axios from "axios";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
const NewDevelopment = () => {
  const [developments, setDevelopments] = useState([]);
  const [filteredDevelopments, setFilteredDevelopments] = useState([]);
  const [visibleDevelopments, setVisibleDevelopments] = useState(15);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://backendfaz.onrender.com"
      : "http://localhost:5001";

  // Fetch developments from the backend
  useEffect(() => {
    const fetchDevelopments = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/developments`);
        setDevelopments(response.data);
        setFilteredDevelopments(response.data); // Initialize filteredDevelopments
        setLoading(false);
      } catch (err) {
        console.error("Error fetching developments:", err);
        setError("Failed to load developments. Please try again later.");
        setLoading(false);
      }
    };
    fetchDevelopments();
  }, []);

  // Filter developments based on search query
  useEffect(() => {
    const filtered = developments.filter((development) =>
      development.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDevelopments(filtered);
    setVisibleDevelopments(15); // Reset visible count when search changes
  }, [searchQuery, developments]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
  };

  const handleLoadMore = () => {
    setVisibleDevelopments(filteredDevelopments.length);
  };

  return (
    <>
      <div className="flex flex-col items-center px-4 md:px-10 lg:px-20 py-12 space-y-8">
        {/* Title and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6 relative">
          {/* Logo */}
          <Link to="/">
            <img
              src={logo}
              className="w-[250px] md:w-[400px] cursor-pointer"
              alt="logo"
            />
          </Link>

          <div className="flex gap-2 w-full md:w-auto items-center">
            {/* Search Bar */}
            <div className="flex items-center w-full md:w-[300px] border border-[#000000] shadow-sm">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onSearchSubmit={handleSearchSubmit}
              />
            </div>{" "}
            {/* Search Button */}
            <button className="bg-[#00603A] px-4 py-[12px] flex items-center justify-center border border-[#00603A] text-white hover:text-[#00603A] hover:bg-transparent transition">
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
          <div className="mt-2">
            <div className="bg-white shadow-md p-4 z-50 absolute w-full right-0 px-12  md:px-20">
              {[
                { name: "Home", href: "/" },
                { name: "Mansions", href: "/mansions" },
                { name: "Penthouses", href: "/penthouses" },
                { name: "Magazine", href: "/magazine" },
                { name: "Luxe Collectibles", href: "/luxecollectibles" },
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="block font-inter py-2 text-gray-800 hover:text-[#00603A] text-lg"
                >
                  {link.name}
                </a>
              ))}

              <p
                className="flex justify-start border-t border-[#000000] space-x-0 mt-3 pt-4"
                style={{ textTransform: "capitalize" }}
              >
                FOLLOW THE MANSION MARKET
              </p>
              <div className="flex justify-start mt-4 py-4 space-x-6 mb-2">
                <a
                  target="_blank"
                  href="https://www.facebook.com/themansionmarketcom"
                  className="text-[#00603A] hover:text-gray-400 text-2xl"
                >
                  <FaFacebook />
                </a>
                <a
                  target="_blank"
                  href="https://x.com/the_mansion_m"
                  className="text-[#00603A] hover:text-gray-400 text-2xl"
                >
                  <FaXTwitter />
                </a>
                <a
                  target="_blank"
                  href="https://www.instagram.com/themansionmarketcom"
                  className="text-[#00603A] hover:text-gray-400 text-2xl"
                >
                  <FaInstagram />
                </a>
                <a
                  target="_blank"
                  href="https://www.linkedin.com/company/the-mansion-market"
                  className="text-[#00603A] hover:text-gray-400 text-2xl"
                >
                  <FaLinkedin />
                </a>
                <a
                  target="_blank"
                  href="https://www.youtube.com/@TheMansionMarket"
                  className="text-[#00603A] hover:text-gray-400 text-2xl"
                >
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col md:space-x-6 mt-4 py-6 md:mt-6 space-x-2 md:space-y-0">
          <h3 className="text-xl md:text-3xl pt-8 capitalize font-playfair text-[#00603A] text-center mb-8 bg-white">
            Explore the Finest New Luxury Developments Globally
          </h3>

          <p className="text-base max-w-[650px] text-center font-inter">
            Uncover the latest in luxury real estate, featuring stunning designs
            and exclusive amenities across the globe.
          </p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto p-6">
        {loading ? (
          <p className="text-gray-600 text-center w-full text-lg py-8">
            Loading developments...
          </p>
        ) : error ? (
          <p className="text-red-600 text-center w-full text-lg py-8">
            {error}
          </p>
        ) : filteredDevelopments.length === 0 ? (
          <p className="text-gray-600 text-center w-full text-lg py-8">
            No developments found matching your search. Please try a different
            title.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredDevelopments
              .slice(0, visibleDevelopments)
              .map((development) => (
                <a
                  key={development._id}
                  href={development.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={development.image}
                      alt={development.title}
                      className="w-full h-96 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full p-3 text-white">
                      <h3 className="text-lg font-semibold">
                        {development.title}
                      </h3>
                    </div>
                  </div>
                </a>
              ))}
          </div>
        )}
        {!loading &&
          !error &&
          visibleDevelopments < filteredDevelopments.length && (
            <div className="flex justify-center mt-20 mb-6">
              <button
                onClick={handleLoadMore}
                className="px-16 py-3 font-inter text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
              >
                View More
              </button>
            </div>
          )}
      </div>
      <Footer />
    </>
  );
};

export default NewDevelopment;
