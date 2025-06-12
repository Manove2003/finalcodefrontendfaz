import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import Footer from "../components/Footer";
import "react-world-flags"; // Ensure this library is installed in your project
import logo from "../assests/TMM_Logo_Non-responsive.svg";
import { Menu, X } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import MansionCard from "../components/Card";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";

const ContactUs = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [phonenumber, setphonenumber] = useState("");
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

  // Handle phone number change
  const handleChangenumber = (value) => {
    setphonenumber(value);
  };

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

        {/* Navigation Popup */}
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

      <div className="flex flex-col items-center px-4 md:px-10 lg:px-20 py-12 space-y-12">
        <div className="container mx-auto p-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-12 lg:space-y-0 lg:space-x-12">
            {/* Contact Text */}
            <div className="lg:w-1/2 space-y-4">
              <h2 className="text-3xl text-[#00603A] font-playfair">
                Contact Us
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed font-inter leading-[2]">
                Complete the form and we will ensure your message is directed to
                the right staff member, who will contact you at their earliest
                convenience.
              </p>
            </div>

            {/* Form Section */}
            <div className="lg:w-1/2 w-full p-6 space-y-6">
              <form className="space-y-6">
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00603A]"
                  placeholder="Full name"
                  aria-label="Full name"
                />
                <input
                  type="email"
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00603A]"
                  placeholder="E-mail address"
                  aria-label="E-mail address"
                />
                <div className="flex items-center mt-4">
                  <PhoneInput
                    country={"us"}
                    containerStyle={{ width: "100%" }}
                    inputStyle={{
                      width: "100%",
                      height: "50px",
                      borderRadius: "0",
                    }}
                    className="border-none border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#00603A]"
                    placeholder="Phone number"
                    aria-label="Phone number"
                    value={phonenumber}
                    onChange={handleChangenumber}
                    inputProps={{
                      required: true,
                    }}
                  />
                </div>
                <select
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00603A]"
                  aria-label="Subject"
                >
                  <option value="buy-property">
                    I'd like to buy a property
                  </option>
                  <option value="inquiry">General Inquiry</option>
                  <option value="support">Support</option>
                  <option value="listaproperty">
                    I'd like to list a property
                  </option>
                </select>
                <select
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00603A]"
                  aria-label="Location"
                >
                  <option value="dubai">Dubai</option>
                  <option value="london">London</option>
                  <option value="new-york">New York</option>
                </select>
                <textarea
                  rows="4"
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00603A]"
                  placeholder="Your message"
                  aria-label="Your message"
                ></textarea>
                <div className="flex flex-col items-start space-y-4">
                  <button
                    type="submit"
                    className="w-full font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
                  >
                    Submit Enquiry
                  </button>
                  <div className="text-sm text-gray-500">
                    This site is protected by reCAPTCHA and the Google Privacy
                    Policy and Terms of Service apply.
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContactUs;
