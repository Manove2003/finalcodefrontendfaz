import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import newImage from "../assests/about.jpeg";
import carImage from "../assests/BrandedResi-P.jpg";
import carThumbnail1 from "../assests/WhatsApp Image 2025-01-08 at 01.27.10 (1).jpeg";
import carThumbnail2 from "../assests/Golf Community.jpg";
import carThumbnail3 from "../assests/The Magazine Collecton Placholder.jpeg";
import carThumbnail4 from "../assests/Waterfront Living.jpeg";
import Footer from "../components/Footer";
import logo from "../assests/TMM_Logo_Non-responsive.svg";
import { Menu, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
const Magazine = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [fetchedMagazines, setFetchedMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleArticles, setVisibleArticles] = useState(4);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const categories = [
    { name: "THE MANSION GUIDE", category: "the mansion guide" },
    { name: "THE PENTHOUSE GUIDE", category: "the penthouse guide" },
    { name: "THE LIFESTYLE GUIDE", category: "the lifestyle guide" },
    { name: "DEVELOPMENTS", category: "developments" },
    { name: "NEWSROOM", category: "newsroom" },
  ];

  const dummyArticles = [
    {
      _id: "dummy1",
      type: "The Mansion Guide",
      title:
        "A Look at the Most Exciting Racing Cars at the RM Sotheby's Monterey Auction",
      date: "20 min read",
      image: carThumbnail1,
      category: "mansion",
      description:
        "Discover some of the most remarkable cars featured in the Tegernsee Auction...",
    },
    {
      _id: "dummy2",
      type: "The Penthouse Guide",
      title: "RM Sotheby’s Inaugural Dubai Auction",
      date: "12 min read",
      category: "penthouse",
      image: carThumbnail2,
      description:
        "Explore the highlights of the inaugural Dubai Auction hosted by RM Sotheby’s...",
    },
    {
      _id: "dummy3",
      type: "The Lifestyle Guide",
      title:
        "In Search of 'Gold and Treasures: 3000 Years of Chinese Ornaments'",
      date: "6 min read",
      image: carThumbnail3,
      category: "lifestyle",
      description:
        "A deep dive into the world of Chinese ornaments spanning 3000 years of history...",
    },
    {
      _id: "dummy4",
      type: "Developments",
      title: "Dubai’s Branded Residences",
      date: "8 min read",
      category: "developments",
      image: carThumbnail4,
      description:
        "Luxury living redefined in Dubai with branded residences offering unmatched opulence...",
    },
    {
      _id: "dummy5",
      type: "Newsroom",
      title: "Latest Trends in Luxury Real Estate",
      date: "10 min read",
      category: "newsroom",
      image: carImage,
      description:
        "A look at the emerging trends shaping the luxury real estate market in 2025...",
    },
  ];

  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://backendfaz.onrender.com"
      : "http://localhost:5001";

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/magazineDetails`);
        const sanitizedMagazines = response.data.map((article) => ({
          ...article,
          category: article.category || "lifestyle",
        }));
        setFetchedMagazines(sanitizedMagazines);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching magazines:", err);
        setError("Failed to load articles. Showing dummy data.");
        setFetchedMagazines(dummyArticles);
        setLoading(false);
      }
    };

    fetchMagazines();
  }, []);

  const articlesToDisplay =
    fetchedMagazines.length > 0 ? fetchedMagazines : dummyArticles;

  // Filter articles based on search query with multi-word support
  const filteredArticles = articlesToDisplay.filter((article) => {
    if (!searchQuery.trim()) return true; // Show all if query is empty
    const queryWords = searchQuery.toLowerCase().split(/\s+/);
    const fields = [
      article.title?.toLowerCase() || "",
      article.subtitle?.toLowerCase() || "",
      article.description?.toLowerCase() || "",
      article.category?.toLowerCase() || "",
    ].join(" ");
    return queryWords.every((word) => fields.includes(word));
  });
  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
  };

  const loadMore = () => {
    setVisibleArticles((prev) => prev + 4);
  };

  const handleCardClick = (id) => {
    navigate(`/blogpage/${id}`);
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

        {menuOpen && (
          <div className="mt-2">
            <div className="bg-white shadow-md p-4 z-50 absolute w-full right-0 px-20">
              {[
                { name: "Home", href: "/" },
                { name: "Mansions", href: "/mansions" },
                { name: "Penthouses", href: "/penthouses" },
                { name: "Developments", href: "/newdevelopment" },
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
        <div className="flex flex-wrap flex-row md:items-center justify-start md:justify-center text-center md:space-x-6 pt-8 py-4 md:mt-6 space-x-0 md:space-y-0">
          {categories.map((link, index) => {
            const targetId = link.category.replace(/\s+/g, "-").toLowerCase();
            return (
              <a
                key={index}
                href={`#${targetId}`}
                className="text-gray-800 hover:text-[#00603A] p-2 font-inter text-center text-sm sm:text-base"
              >
                {link.name}
              </a>
            );
          })}
        </div>
      </div>
      <div className="border-b border-[#00603A] mb-8"></div>

      {/* Search Results Section */}
      {searchQuery.trim() && (
        <section className="px-4 py-10 md:px-10 lg:px-20">
          <h2 className="text-3xl mb-8 text-center md:text-start font-playfair text-[#00603A]">
            Search Results
          </h2>
          {filteredArticles.length > 0 ? (
            <div className="grid md:grid-cols-4 grid-cols-1 gap-6">
              {filteredArticles
                .filter((article) => article.category)
                .slice(0, visibleArticles)
                .map((article, index) => (
                  <div
                    key={index}
                    className="cursor-pointer"
                    onClick={() => handleCardClick(article._id)}
                  >
                    <img
                      src={
                        article.mainImage
                          ? `${article.mainImage}`
                          : article.image || newImage
                      }
                      alt={article.title}
                      className="w-full h-60 object-cover"
                      onError={(e) => (e.target.src = newImage)}
                    />
                    <h3 className="text-lg mt-2 font-playfair text-center md:text-start">
                      {article.title}
                    </h3>
                    <p className="mt-2 min-h-24 font-inter text-center md:text-start">
                      {article.subtitle || article.description}
                    </p>
                    <p className="text-gray-600 font-inter text-center md:text-start">
                      {article.category || "Lifestyle"}
                    </p>
                    <p className="text-gray-600 mt-2 min-h-24 font-playfair text-center md:text-start">
                      {article.time
                        ? new Date(article.time).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : article.date}
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500">No articles match your search.</p>
          )}
          {visibleArticles <
            filteredArticles.filter((article) => article.category).length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                className="font-inter px-20 my-8 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
              >
                Load More
              </button>
            </div>
          )}
        </section>
      )}

      {categories.map((cat, index) => {
  const sectionId = cat.category.replace(/\s+/g, "-").toLowerCase(); // e.g., "the mansion guide" => "the-mansion-guide"

  const categoryArticles = articlesToDisplay.filter(
    (article) =>
      article.category &&
      article.category.toLowerCase() === cat.category.toLowerCase()
  );
  const selectedArticle =
    categoryArticles[0] || dummyArticles[index % dummyArticles.length];

  return (
    <section
      key={index}
      id={sectionId}
      className="px-4 py-10 md:px-10 lg:px-20"
    >
      <h2 className="text-3xl mb-8 text-center md:text-start font-playfair text-[#00603A]">
        {cat.name}
      </h2>

      {categoryArticles.length > 0 ? (
        <div className="grid md:grid-cols-1 gap-8">
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 cursor-pointer"
            onClick={() => handleCardClick(selectedArticle._id)}
          >
            <img
              src={
                selectedArticle.mainImage
                  ? `${selectedArticle.mainImage}`
                  : selectedArticle.image || newImage
              }
              alt="Main Article"
              className="w-full h-60 md:h-auto object-cover"
              onError={(e) => (e.target.src = newImage)}
            />
            <div className="flex flex-col">
              <div className="space-y-10">
                <h3 className="text-2xl font-playfair">
                  {selectedArticle.title}
                </h3>
                <p className="text-gray-700 mt-2 font-inter">
                  {selectedArticle.subtitle || selectedArticle.description}
                </p>
                <p className="text-gray-700 mt-2 font-inter">
                  {selectedArticle.category || cat.category}
                </p>
                <p className="text-sm text-gray-500 font-inter">
                  {selectedArticle.time
                    ? new Date(selectedArticle.time).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : selectedArticle.date}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {categoryArticles
              .filter((article) => article._id !== selectedArticle._id) // Exclude the main article
              .slice(0, 4)
              .map((article, idx) => (
                <div
                  key={idx}
                  className="flex flex-col cursor-pointer"
                  onClick={() => handleCardClick(article._id)}
                >
                  <img
                    src={
                      article.mainImage
                        ? `${article.mainImage}`
                        : article.image || newImage
                    }
                    alt={article.title}
                    className="w-full h-40 object-cover"
                    onError={(e) => (e.target.src = newImage)}
                  />
                  <div className="mt-4">
                    <span className="text-sm text-gray-500 uppercase font-inter">
                      {article.category || cat.category}
                    </span>
                    <h4 className="text-lg mt-2 font-playfair">
                      {article.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-2">
                      {article.time
                        ? new Date(article.time).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : article.date}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">
          No articles available for {cat.name}.
        </p>
      )}
    </section>
  );
})}

      <div className="flex justify-center mt-8">
        <div className="text-center">
          {loading ? (
            <p className="text-gray-500">Loading articles...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <div className="grid md:grid-cols-4 grid-cols-1 gap-6 px-4 md:px-20">
                {filteredArticles
                  .filter((article) => article.category)
                  .slice(0, visibleArticles)
                  .map((article, index) => (
                    <div
                      key={index}
                      className="cursor-pointer"
                      onClick={() => handleCardClick(article._id)}
                    >
                      <img
                        src={
                          article.mainImage
                            ? `${article.mainImage}`
                            : article.image || newImage
                        }
                        alt={article.title}
                        className="w-full h-60 object-cover"
                        onError={(e) => (e.target.src = newImage)}
                      />
                      <h3 className="text-lg mt-4 font-playfair text-center md:text-start">
                        {article.title}
                      </h3>
                      <p className="mt-2  font-inter text-center md:text-start">
                        {article.subtitle || article.description}
                      </p>
                      <p className="  text-gray-600 font-inter text-center mt-3 md:text-start">
                        {article.category || "Lifestyle"}
                      </p>
                      <p className="text-gray-600 mt-2  font-inter text-center md:text-start">
                        {article.time
                          ? new Date(article.time).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : article.date}
                      </p>
                    </div>
                  ))}
              </div>

              {visibleArticles <
                filteredArticles.filter((article) => article.category)
                  .length && (
                <button
                  onClick={loadMore}
                  // className="font-inter px-20 my-8 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
                  className="font-inter px-16 py-3 my-16 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
                >
                  View More
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Magazine;
