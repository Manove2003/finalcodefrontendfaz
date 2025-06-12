import React, { useState, useEffect, useRef } from "react";
import Footer from "../components/Footer";
import Mockupimg from "../assests/Magaine Page Image.gif";
import logo from "../assests/TMM_Logo_Non-responsive.svg";
import { Menu, X } from "lucide-react";
import axios from "axios";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaSearch,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useMansions } from "../context/MansionContext";
import SearchBar from "../components/SearchBar";
import MansionCard from "../components/Card";

const SignupSection = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedMansion, setSelectedMansion] = useState(null);
  const [iconicData, setIconicData] = useState(null);
  const searchTimeoutRef = useRef(null);
  const {
    mansions,
    featuredMansions,
    mansionFeatured,
    penthouseFeatured,
    collectiblesFeatured,
  } = useMansions();

  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://backendfaz.onrender.com"
      : "http://localhost:5001";

  useEffect(() => {
    const fetchIconicData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/iconic`);
        if (res.data && res.data.length > 0) {
          setIconicData(res.data[0]);
        }
      } catch (err) {
        console.error("Error fetching iconic data:", err);
      }
    };

    fetchIconicData();
  }, []);

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
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    setLoading(true);
    axios
      .get(`${BASE_URL}/api/search`, {
        params: { query },
        timeout: 10000,
      })
      .then((response) => {
        setSearchResults(Array.isArray(response.data) ? response.data : []);
        setHasSearched(true);
        setError(null);
      })
      .catch((err) => {
        console.error("Search error:", err);
        setError("Search failed. Please try again.");
        setSearchResults([]);
        setHasSearched(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URL}/api/newsletter`, {
        email,
        category: "Magazine",
      });

      setMessage(res.data.message);
      setEmail("");
    } catch (err) {
      setMessage(err.response?.data?.error || "An error occurred");
      console.error(err);
    }
  };

  const handleShareClick = (mansion) => {
    setSelectedMansion(mansion);
    setShareModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col items-center px-4 md:px-10 lg:px-20 py-12 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6 relative">
          <Link to="/">
            <img
              src={logo}
              className="w-[250px] md:w-[400px] cursor-pointer"
              alt="logo"
            />
          </Link>
          <div className="flex gap-2 w-full md:w-auto items-center">
            <div className="flex items-center w-full md:w-[300px] border border-[#000000] shadow-sm">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onSearchSubmit={handleSearchSubmit}
              />
            </div>
            <button className="bg-[#00603A] px-4 py-[12px] flex items-center justify-center border border-[#00603A] text-white hover:text-[#00603A] hover:bg-transparent transition">
              <FaSearch className="font-thin hover:text-[#00603A]" />
            </button>
            <button className="p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <X className="w-6 h-6 text-[#000000]" />
              ) : (
                <Menu className="w-6 h-6 text-[#000000]" />
              )}
            </button>
          </div>
        </div>
        {hasSearched && searchQuery.trim() && (
          <div className="w-full mx-auto mt-8">
            <h2 className="text-2xl text-[#00603A] mb-6 font-inter text-center">
              {loading ? "Searching..." : `Results for "${searchQuery}"`}
            </h2>
            {error ? (
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  No properties found matching "{searchQuery}"
                </p>
                <p className="text-gray-500">
                  Try different keywords like location, community, or property
                  type
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.slice(0, 6).map((mansion) => (
                  <MansionCard
                    key={mansion.reference}
                    mansion={mansion}
                    searchQuery={searchQuery}
                    onShare={() => handleShareClick(mansion)}
                  />
                ))}
                {searchResults.length > 6 && (
                  <p className="text-gray-600 text-center w-full">
                    Showing 6 of {searchResults.length} results. Refine your
                    search for more specific results.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
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
        <div className="flex flex-col md:flex-row items-center justify-center  py-12 ">
          <div className="md:w-1/2 text-center md:text-left flex flex-col items-center md:items-start ">
            <h2 className="text-xl md:text-2xl mb-8">
              <span className="text-[#00603A] font-playfair">
                {iconicData?.title || "The Spotlight On Iconic Estate"}
              </span>{" "}
              <span className="text-[#000000] font-inter font-thin pr-2">
                |
              </span>
              <span className="text-black font-inter tracking-[4px]">
                {iconicData?.year || "2025"}
              </span>
              <span className="text-[#000000] font-inter font-thin">
                {" "}
                EDITION
              </span>
            </h2>
            <p className="text-gray-600 w-full md:w-[400px] mb-6 leading-relaxed">
              {iconicData?.description ||
                "Be the first to receive our 2025 edition of SPOTLIGHTS ON by subscribing now!"}
            </p>
            <p className="text-gray-700 font-medium mb-8">
              {iconicData?.subtitle ||
                "Luxury Living | Expert Interviews | Travel to Luxury"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mb-4">
              <form onSubmit={handleSubscribe}>
                <div className="w-full">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border border-gray-300 p-3 w-full sm:flex-1 focus:outline-none"
                    />
                    <button className="bg-[#00603A] text-white px-5 py-3 border border-[#00603A] hover:bg-[#ffffff] hover:text-[#00603A] transition-all">
                      {iconicData?.btnText || "SIGN UP"}
                    </button>
                  </div>
                </div>
                <span>{message && <p>{message}</p>}</span>
              </form>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center items-center mt-6 md:mt-0 border-0 lg:border-l lg:border-l-[#000000] pl-6">
            <img
              src={iconicData?.photoHome || Mockupimg}
              alt="Magazine Preview"
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignupSection;
