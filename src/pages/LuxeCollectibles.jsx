import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import logo from "../assests/TMM_Logo_Non-responsive.svg";
import Footer from "../components/Footer";
import { Menu, X } from "lucide-react";
import LuxuryCollectibleList from "../components/LuxuaryCollectibleList";
import { useMansions } from "../context/MansionContext";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";

const LuxeCollectibles = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCompletion, setActiveCompletion] = useState(null);
  const [activeFurnished, setActiveFurnished] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "newest",
  });

  const { mansions, loading, error } = useMansions();

  const priceRef = useRef(null);
  const sizeRef = useRef(null);
  const bedroomsRef = useRef(null);
  const moreRef = useRef(null);
  const categoryRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        priceRef.current &&
        !priceRef.current.contains(event.target) &&
        categoryRef.current &&
        !categoryRef.current.contains(event.target) &&
        moreRef.current &&
        !moreRef.current.contains(event.target)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchTerms = searchQuery
    .toLowerCase()
    .split(" ")
    .filter((term) => term);

  const filteredCollectibles = mansions.filter((mansion) => {
    if (mansion.propertytype !== "Luxury Collectibles") return false;

    if (searchTerms.length > 0) {
      const matchesSearch = searchTerms.some((term) =>
        [
          mansion.title,
          mansion.community,
          mansion.country,
          mansion.description,
          mansion.subtitle,
        ].some((field) => field && field.toLowerCase().includes(term))
      );
      if (!matchesSearch) return false;
    }

    if (filters.category && mansion.category !== filters.category) {
      return false;
    }

    if (filters.minPrice && mansion.price < parseInt(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && mansion.price > parseInt(filters.maxPrice)) {
      return false;
    }

    return true;
  });

  const sortedCollectibles = [...filteredCollectibles].sort((a, b) => {
    switch (filters.sortBy) {
      case "price_low":
        return a.price - b.price;
      case "price_high":
        return b.price - a.price;
      case "newest":
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
    });
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const categories = [...new Set(mansions.map((item) => item.category))].filter(
    Boolean
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error.message}
      </div>
    );

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
          <div className="flex gap-2 w-full md:w-auto items-center pl-4 md:pl-0">
            <div className="flex items-center w-full md:w-[300px] border border-[#000000] shadow-sm">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onSearchSubmit={handleSearchSubmit}
              />
            </div>{" "}
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
            <div className="bg-white shadow-md p-4 z-50 absolute w-full right-0 px-12  md:px-20">
              {[
                { name: "Home", href: "/" },
                { name: "Mansions", href: "/mansions" },
                { name: "Penthouses", href: "/penthouses" },
                { name: "Development", href: "/newdevelopment" },
                { name: "Magazine", href: "/magazine" },
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

        <h2 className="text-xl md:text-3xl pt-12 font-playfair text-[#00603A] text-center capitalize">
          Explore luxurious collectibles for sale globally
        </h2>
        <p className="text-sm font-inter md:text-lg text-gray-600 text-center max-w-3xl leading-relaxed">
          Discover a curated selection of exceptional luxury collectibles from
          around the globe at The Mansion Market. Each listing is handpicked to
          meet your ultra-luxury requirements, offering unparalleled elegance,
          opulence, and craftsmanship.
        </p>

        <div className="flex flex-wrap pt-6 gap-4 items-center w-full justify-between">
          <div className="flex gap-4">
            <div className="relative" ref={priceRef}>
              <button
                onClick={() => toggleDropdown("price")}
                className="px-4 py-2 border border-[#00603A] text-[#00603A] bg-white hover:bg-[#00603A] hover:text-white transition text-sm font-medium"
              >
                Price
              </button>
              {activeDropdown === "price" && (
                <div className="absolute  left-0 mt-2 w-[280px] bg-white shadow-lg border border-gray-300 p-4  z-10">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-600">
                      Price Range (USD)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="minPrice"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        className="border border-gray-300 px-3 py-1 w-1/2 focus:outline-none focus:ring-1 focus:ring-[#00603A]"
                      />
                      <input
                        type="number"
                        name="maxPrice"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        className="border border-gray-300 px-3 py-1 w-1/2 focus:outline-none focus:ring-1 focus:ring-[#00603A]"
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={resetFilters}
                        className="px-3 py-1 border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-none text-sm"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => setActiveDropdown(null)}
                        className="px-3 py-1 bg-[#00603A] text-white hover:bg-[#004e30] rounded-none text-sm"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-[#00603A]  text-[#00603A] bg-white text-sm font-medium focus:outline-none  transition-all duration-200 appearance-none bg-[url('data:image/svg+xml,%3Csvg viewBox=%270 0 20 20%27 fill=%27%2300603A%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath d=%27M7 7l3-3 3 3m0 6l-3 3-3-3%27/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-[length:1.2rem] pr-10"
          >
            <option value="newest">Sort by Featured</option>
            <option value="price_low">Price (Low to High)</option>
            <option value="price_high">Price (High to Low)</option>
          </select>
        </div>
        {/* <p className="text-gray-600">
          {sortedCollectibles.length} collectibles found
        </p> */}
        <LuxuryCollectibleList
          collectibles={sortedCollectibles}
          searchQuery={searchQuery}
        />
      </div>
      <Footer />
    </>
  );
};

export default LuxeCollectibles;
