import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import newImage from "../assests/Modern Minimalist Interior.jpeg";
import img1 from "../assests/Serenity Waters Luxury Villa 1.png";
import image from "../assests/Elegant Living Room with Designer Furniture and Artistic Sculptures.jpeg";
import Footer from "../components/Footer";
import logo from "../assests/TMM_Logo_Non-responsive.svg";
import { Menu, X } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import AboutPageListing from "./AboutPageListing.jsx";
import { Link } from "react-router-dom";
import axios from "axios";
import MansionCard from "../components/Card";
import SearchBar from "../components/SearchBar.jsx";

const Register = () => {
  const listings1 = [
    {
      id: 1,
      price: "13 AED",
      location: "Villa in Marbella, Andalusia, Spain",
      imageUrl: img1,
      bedrooms: 5,
      bathrooms: 4,
      size: "6,500",
      name: "Sienna Views",
    },
    {
      id: 2,
      price: "13 AED",
      location: "Villa in Marbella, Andalusia, Spain",
      imageUrl: img1,
      bedrooms: 6,
      bathrooms: 5,
      size: "7,200",
      name: "Sienna Views",
    },
    {
      id: 3,
      price: "13 AED",
      location: "Villa in Marbella, Andalusia, Spain",
      imageUrl: img1,
      bedrooms: 4,
      bathrooms: 3,
      size: "5,800",
      name: "Sienna Views",
    },
    {
      id: 4,
      price: "13 AED",
      location: "Villa in Marbella, Andalusia, Spain",
      imageUrl: img1,
      bedrooms: 7,
      bathrooms: 6,
      size: "8,000",
      name: "mansion",
    },
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchTimeoutRef = useRef(null);

  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://backendfaz.onrender.com"
      : "http://localhost:5001";

  // Handle search with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setError(null);
      return;
    }

    setLoading(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/search`, {
          params: { query: searchQuery },
          timeout: 10000,
        });
        setSearchResults(Array.isArray(response.data) ? response.data : []);
        setHasSearched(true);
        setError(null);
      } catch (err) {
        console.error("Search error:", err);
        setError("Search failed. Please try again.");
        setSearchResults([]);
        setHasSearched(true);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
  };

  return (
    <>
      {/* Title and Search Bar */}
      <div className="flex flex-col items-center px-4 md:px-10 lg:px-20 py-12 space-y-8">
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
            </div>

            {/* Search Button */}
            <button className="bg-[#00603A] px-4 py-[12px] flex items-center justify-center border border-[#00603A] text-white hover:text-[#00603A] hover:bg-transparent transition">
              <FaSearch className="font-thin hover:text-[#00603A]" />
            </button>

            {/* Menu Icon */}
            <button className="p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <X className="w-6 h-6 text-[#000000]" />
              ) : (
                <Menu className="w-6 h-6 text-[#000000]" />
              )}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="mt-2">
            <div className="bg-white shadow-md p-4 z-50 absolute w-full right-0 px-12 md:px-20">
              {[
                { name: "Home", href: "/" },
                { name: "Mansions", href: "/mansions" },
                { name: "Penthouses", href: "/penthouses" },
                { name: "Developments", href: "/newdevelopment" },
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
        {/* Search Results Section */}
        {hasSearched && searchQuery.trim() && (
          <section className="w-full mt-8 px-4 md:px-10 lg:px-20 py-12">
            <h2 className="text-3xl font-playfair text-[#00603A] text-center mb-8">
              {loading ? "Searching..." : `Results for "${searchQuery}"`}
            </h2>
            {loading ? (
              <p className="text-center text-gray-600">
                Searching properties...
              </p>
            ) : error ? (
              <p className="text-center text-red-600">{error}</p>
            ) : searchResults.length === 0 ? (
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  No properties found matching all terms: "{searchQuery}"
                </p>
                <p className="text-gray-500">
                  Try different combinations of location, community, or property
                  type
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((mansion) => (
                  <MansionCard key={mansion.reference} mansion={mansion} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* <div className="relative w-full h-screen">
        <img
          src={newImage}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <h1 className="text-white text-3xl md:text-5xl w-full max-w-[900px] leading-[1] text-center font-playfair px-4">
            Connect with the best luxury real estate marketplace worldwide.
          </h1>
        </div>
      </div> */}

      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16 bg-gray-50">
        <div className="max-w-2xl text-center space-y-8 font-inter">
          <h1 className="text-[#00603A] text-3xl pb-6 md:text-5xl w-full max-w-[900px] leading-[1]  text-center font-playfair ">
            Connect with the best luxury real estate marketplace worldwide.
          </h1>

          <p className="text-lg text-center font-inter mt-8 pb-8 leading-[2]">
            Become a part of an elite marketplace for ultra-luxurious mansions
            and penthouses. Our exclusive platform draws ultra-high-net-worth
            buyers who seek unparalleled quality and distinction in their homes.
          </p>
          <p className="text-lg text-center font-inter pb-8 leading-[2]">
            With a commitment to excellence, we carefully curate listings,
            focusing on exceptional properties located in the city’s most
            prestigious areas.
          </p>
          <p className="text-lg text-center font-inter pb-8 leading-[2]">
            Who can join our distinguished marketplace? Individual agents,
            agencies, holiday home operators, property developers, and property
            owners.
          </p>
        </div>
        <div className="mt-20 mb-16">
          <a
            href="https://forms.gle/DK3nCFoGdoHhhiqWA"
            target="_blank"
            rel="noopener noreferrer"
            // className="font-inter px-6 py-3 w-full md:w-[500px] text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
            className="font-inter px-20 py-3 text-black mb-16 border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
          >
            Register Now
          </a>
        </div>
      </div>

      <AboutPageListing />

      <div className="flex flex-col md:flex-row items-center px-4 md:px-8 gap-8 py-12 space-y-8 md:space-y-0 mt-20 mb-24">
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={image}
            alt="Mansion Market Magazine"
            className="w-full md:w-[70%] lg:w-[80%] h-auto"
          />
        </div>

        {/* Text Section */}
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl md:text-3xl w-full md:w-[500px] font-playfair text-[#000000] mb-12">
            The <span className="text-[#00603A]">Mansion Market Magazine</span>
          </h2>
          <p className="text-gray-600 mb-6 font-inter mb-12 mr-0 md:mr-16 ">
            Expert articles, market insights, and lifestyle features that
            showcase the latest in luxury properties and valuable assets. Check
            out our journal for exclusive updates, tips, and intriguing stories
            that celebrate the world of high-end real estate in Dubai and
            beyond.
          </p>
          <Link to="/magazine">
            <button
              //  className="px-8 py-3 w-full mt-6 md:w-[300px] font-inter text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
              className="font-inter  px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
            >
              Explore magazine
            </button>
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Register;
