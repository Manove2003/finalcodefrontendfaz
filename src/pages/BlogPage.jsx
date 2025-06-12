import React, { useState, useEffect, useRef } from "react";
import newImage from "../assests/about.jpeg";
import Footer from "../components/Footer";
import logo from "../assests/TMM_Logo_Non-responsive.svg";
import { Menu, X } from "lucide-react";
import axios from "axios";
import DOMPurify from "dompurify";
import { useParams } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaSearch,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Breadcrumb from "./Breadcrumb";
import { useMansions } from "../context/MansionContext";
import SearchBar from "../components/SearchBar";
import MansionCard from "../components/Card";

const BlogPage = () => {
  const { id } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [magazineDetails, setMagazineDetails] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedMansion, setSelectedMansion] = useState(null);
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
    const fetchMagazineDetail = async () => {
      try {
        const detailResponse = await axios.get(
          `${BASE_URL}/api/magazineDetail/${id}`
        );
        setFeaturedArticle(detailResponse.data);

        const allResponse = await axios.get(`${BASE_URL}/api/magazineDetails`);
        setMagazineDetails(
          allResponse.data.filter((article) => article._id !== id)
        );
        setLoading(false);
      } catch (err) {
        console.error("Error fetching magazine details:", err);
        setError("Failed to load article. Please try again later.");
        setLoading(false);
      }
    };

    fetchMagazineDetail();
  }, [id]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setSearchError(null);
      return;
    }

    setSearchLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/search`, {
          params: { query: searchQuery },
          timeout: 10000,
        });
        setSearchResults(Array.isArray(response.data) ? response.data : []);
        setHasSearched(true);
        setSearchError(null);
      } catch (err) {
        console.error("Search error:", err);
        setSearchError("Search failed. Please try again.");
        setSearchResults([]);
        setHasSearched(true);
      } finally {
        setSearchLoading(false);
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
    setSearchLoading(true);
    axios
      .get(`${BASE_URL}/api/search`, {
        params: { query },
        timeout: 10000,
      })
      .then((response) => {
        setSearchResults(Array.isArray(response.data) ? response.data : []);
        setHasSearched(true);
        setSearchError(null);
      })
      .catch((err) => {
        console.error("Search error:", err);
        setSearchError("Search failed. Please try again.");
        setSearchResults([]);
        setHasSearched(true);
      })
      .finally(() => {
        setSearchLoading(false);
      });
  };

  const handleShareClick = (mansion) => {
    setSelectedMansion(mansion);
    setShareModalOpen(true);
  };

  const visibleNews = showAll ? magazineDetails : magazineDetails.slice(0, 4);

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
              {searchLoading ? "Searching..." : `Results for "${searchQuery}"`}
            </h2>
            {searchError ? (
              <div className="text-center">
                <p className="text-red-600 mb-4">{searchError}</p>
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
            <div className="bg-white shadow-md p-4 z-50 absolute w-full right-0 px-20">
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
      </div>
      <div className="px-4 py-8 md:px-10 lg:px-24">
        <div className="w-full ">
          <Breadcrumb type="blog" magazineId={id} />
        </div>
        <div className="px-0 sm:px-24 mt-16">
          {loading ? (
            <p className="text-center text-gray-500">Loading article...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : featuredArticle ? (
            <div className="flex flex-col items-center text-center">
              <h1 className="text-3xl md:text-4xl font-playfair text-[#00603A] mb-4 text-center">
                {featuredArticle.title}
              </h1>
              <h2 className="text-xl font-inter text-gray-600 mb-4 mt-4 text-center">
                {featuredArticle.subtitle}
              </h2>
              <p className="text-sm font-inter text-gray-500 mt-4 mb-4">
                By {featuredArticle.author} |{" "}
                {new Date(featuredArticle.time).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <div
                className="prose max-w-3xl mt-4 pb-4 font-inter text-gray-800"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(featuredArticle.content),
                }}
              />
            </div>
          ) : (
            <p className="text-center text-gray-500">No article found.</p>
          )}
        </div>
        <div className="container mx-auto py-12">
          <h2 className="text-2xl md:text-3xl text-center mb-8 font-playfair text-[#00603A]">
            Related Publishings
          </h2>
          {loading ? (
            <p className="text-center text-gray-500">Loading articles...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleNews.map((news, index) => (
                <Link
                  to={`/blogpage/${news._id}`}
                  key={index}
                  className="block"
                >
                  <div className="">
                    <img
                      src={news.mainImage ? `${news.mainImage}` : newImage}
                      alt={news.title}
                      className="w-full h-80 object-cover"
                      onError={(e) => (e.target.src = newImage)}
                    />
                    <div className="py-4 text-start">
                      <p className="text-sm font-inter text-[#00603A] uppercase underline md:underline-offset-4">
                        Lifestyle
                      </p>
                      <h3 className="text-lg mt-2 font-playfair text-[#000000]">
                        {news.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-4 font-inter">
                        {new Date(news.time).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        {" | "}
                        {Math.ceil(news.content.length / 500)} min read
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="flex justify-center mt-16">
            {!showAll && magazineDetails.length > 4 && (
              <button
                onClick={() => setShowAll(true)}
                className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
              >
                View All
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogPage;
