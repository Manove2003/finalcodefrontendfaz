import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import MansionCard from "../components/Card";
import { FaSearch } from "react-icons/fa";
import desktopImage from "../assests/destopimg.png";
import mobileImage from "../assests/mobileimg.png";
import tabletImage from "../assests/Tabletimg.png";
import Footer from "../components/Footer";
import logo from "../assests/TMM_Logo_Non-responsive.svg";
import { Menu, X } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";

const About = () => {
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
      <div className="">
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
              <div className="flex items-center w-full md:w-[300px] border border-[#000000]  shadow-sm">
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
                    Try different combinations of location, community, or
                    property type
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
        <div className=" w-full ">
          {/* Mobile Image */}
          <img
            src={mobileImage}
            alt="Mobile Background"
            className=" inset-0 w-full h-full object-cover sm:hidden"
          />

          {/* Tablet Image */}
          <img
            src={tabletImage}
            alt="Tablet Background"
            className=" inset-0 w-full h-full object-cover hidden sm:block md:hidden"
          />

          {/* Desktop Image */}
          <img
            src={desktopImage}
            alt="Desktop Background"
            className=" inset-0 w-full h-full object-cover hidden md:block"
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center text-center mt-12">
        <div className="text-gray-700 w-9/12 md:px-10 lg:px-20 py-12 space-y-8">
          <div className="space-y-6">
            <p className="text-lg text-center font-inter pb-8 leading-[2]">
              <span className="text-2xl text-[#00603A] font-playfair">
                The Mansion Market
              </span>
              , the premier marketplace for finest mansions and penthouses. We
              specialize in properties those with a built-up area of 6,000
              square feet or more. Our exclusive focus ensures that we cater to
              the upper echelons of the luxury real estate market.
            </p>
            <p className="text-lg text-center font-inter pb-8 leading-[2]">
              We take immense pride in our rigorous vetting process for both
              properties and agents, guaranteeing that only the highest quality
              listings are presented to our discerning clients. As pioneers in
              Dubai’s luxury real estate sector, we are acutely aware of the
              increasing number of homes entering the market, and we remain
              steadfast in our commitment to excellence.
            </p>
            <p className="text-lg text-center font-inter leading-[2]">
              We collaborate with the leading agencies in the industry, ensuring
              that we showcase only the most exquisite properties. At The
              Mansion Market, we fully understand the expectations of modern
              luxury home buyers and sellers. We are dedicated to not just
              meeting but exceeding those expectations. With us, you can trust
              that your journey through Dubai’s real estate market will be
              nothing short of exceptional and rewarding.
            </p>
          </div>
        </div>
        <h2 className="text-2xl md:text-4xl m-10 text-center text-[#00603A] font-playfair">
          List Your Property With Us?
        </h2>
        <div className="text-gray-700 w-9/12 md:px-10 lg:px-20 py-2 space-y-2">
          <p className="text-lg text-center font-inter pb-8 leading-[2]">
            Put your property in front of the right eyeballs and enhance its
            visibility tenfold. with us property will attract high-end buyers
            actively seeking luxury homes in the market.
          </p>
        </div>
        <a
          href="https://forms.gle/DK3nCFoGdoHhhiqWA"
          target="_blank"
          rel="noopener noreferrer"
          className="font-inter px-20 py-3 mb-16 mt-12 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
        >
          List your properties
        </a>
      </div>

      <Footer />
    </>
  );
};

export default About;
