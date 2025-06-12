import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import logo from "../assests/TMM_Logo_Non-responsive.svg";
import { Menu, X } from "lucide-react";
import MansionList from "./MansionList";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const MansionMarket = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [filters, setFilters] = useState({
    bedrooms: "",
    minPrice: "",
    maxPrice: "",
    minSize: "",
    maxSize: "",
    sortBy: "newest",
    projectstatus: "Any",
    furnishingtype: "Any",
  });

  const sizeRef = useRef(null);
  const bedroomsRef = useRef(null);
  const priceRef = useRef(null);
  const moreRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sizeRef.current &&
        !sizeRef.current.contains(event.target) &&
        bedroomsRef.current &&
        !bedroomsRef.current.contains(event.target) &&
        priceRef.current &&
        !priceRef.current.contains(event.target) &&
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

  const handleProjectStatusChange = (option) => {
    setFilters((prev) => ({
      ...prev,
      projectstatus: option,
    }));
  };

  const handleFurnishingTypeChange = (option) => {
    setFilters((prev) => ({
      ...prev,
      furnishingtype: option,
    }));
  };

  const resetFilters = () => {
    setFilters({
      bedrooms: "",
      minPrice: "",
      maxPrice: "",
      minSize: "",
      maxSize: "",
      sortBy: "newest",
      projectstatus: "Any",
      furnishingtype: "Any",
    });
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
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
                href="https://www.youtube.com/@TheMansionMarket"
                className="text-[#00603A] hover:text-gray-400 text-2xl"
                target="_blank"
              >
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>
      )}
      <h2 className="text-xl md:text-3xl pt-12 font-playfair text-[#00603A] text-center capitalize">
        Explore luxurious mansions for sale globally
      </h2>
      <p className="text-sm font-inter md:text-lg text-gray-600 text-center max-w-3xl leading-relaxed">
        Discover a curated selection of exceptional mansions from around the
        globe at The Mansion Market. Each listing is handpicked to meet your
        ultra-luxury requirements, offering unparalleled elegance, opulence, and
        breathtaking views.
      </p>
      <div className="flex pt-6 flex-wrap gap-4 items-center w-full justify-between">
        <div className="flex gap-2 md:gap-4">
          <div className="relative" ref={sizeRef}>
            <button
              onClick={() => toggleDropdown("size")}
              className="px-3 py-2 border rounded-none border-[#00603A] text-[#00603A] bg-white hover:bg-[#00603A] hover:text-white transition text-sm font-medium"
            >
              Size
            </button>
            {activeDropdown === "size" && (
              <div className="absolute z-10 mt-2 w-64 bg-white border shadow-lg p-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600">
                    Size Range (sq.ft)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="minSize"
                      placeholder="Min"
                      value={filters.minSize}
                      onChange={handleFilterChange}
                      className="border border-gray-300 px-3 py-1 w-1/2 rounded-none focus:outline-none focus:ring-1 focus:ring-[#00603A]"
                    />
                    <input
                      type="number"
                      name="maxSize"
                      placeholder="Max"
                      value={filters.maxSize}
                      onChange={handleFilterChange}
                      className="border rounded-none border-gray-300 px-3 py-1 w-1/2 focus:outline-none focus:ring-1 focus:ring-[#00603A]"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={resetFilters}
                      className="px-3 py-1 rounded-none border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setActiveDropdown(null)}
                      className="px-3 py-1 bg-[#00603A] rounded-none text-white hover:bg-[#004e30] text-sm"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="relative" ref={bedroomsRef}>
            <button
              onClick={() => toggleDropdown("bedrooms")}
              className="px-3 py-2 border border-[#00603A] rounded-none text-[#00603A] bg-white hover:bg-[#00603A] hover:text-white transition text-sm font-medium"
            >
              Bedrooms
            </button>
            {activeDropdown === "bedrooms" && (
              <div className="absolute z-10 mt-2 w-48 bg-white border shadow-lg p-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600">
                    Bedrooms
                  </label>
                  <select
                    name="bedrooms"
                    value={filters.bedrooms}
                    onChange={handleFilterChange}
                    className="border border-gray-300 px-3 py-1 focus:outline-none focus:ring-1 focus:ring-[#00603A]"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                    <option value="6">6+</option>
                  </select>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={resetFilters}
                      className="px-3 py-1 border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setActiveDropdown(null)}
                      className="px-3 py-1 bg-[#00603A] text-white hover:bg-[#004e30] text-sm"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="relative" ref={priceRef}>
            <button
              onClick={() => toggleDropdown("price")}
              className="px-3 py-2 border border-[#00603A] rounded-none text-[#00603A] bg-white hover:bg-[#00603A] hover:text-white transition text-sm font-medium"
            >
              Price
            </button>
            {activeDropdown === "price" && (
              <div className="absolute -left-40 md:left-0 mt-2 w-[280px] bg-white shadow-lg border border-gray-300 p-4 z-10">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600">
                    Price Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="minPrice"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      className="border border-gray-300 px-3 py-1 w-1/2 rounded-none focus:outline-none focus:ring-1 focus:ring-[#00603A]"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      className="border border-gray-300 px-3 py-1 w-1/2 rounded-none focus:outline-none focus:ring-1 focus:ring-[#00603A]"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={resetFilters}
                      className="px-3 py-1 border border-gray-300 text-gray-600 rounded-none hover:bg-gray-100 text-sm"
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
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => toggleDropdown("more")}
              className="px-3 py-2 border border-[#00603A] rounded-none text-[#00603A] bg-white hover:bg-[#00603A] hover:text-white transition text-sm font-medium"
            >
              More
            </button>
            {activeDropdown === "more" && (
              <div className="absolute -left-48 md:left-0 mt-2 w-54 md:w-80 bg-white shadow-lg border border-gray-300 p-4 z-10">
                <div className="flex flex-col gap-2">
                  <h2 className="my-4">Project Status</h2>
                  <div className="flex flex-wrap justify-start md:justify-between gap-2 md:gap-0">
                    {["Any", "Ready", "Under Construction"].map((option) => (
                      <button
                        key={option}
                        className={`px-2 py-2 font-inter border border-[#00603A] transition-all duration-300 ${
                          filters.projectstatus === option
                            ? "bg-[#00603A] text-white"
                            : "text-black"
                        } hover:bg-[#00603A] hover:text-white`}
                        onClick={() => handleProjectStatusChange(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <h2 className="my-4">Furnishing Type</h2>
                  <div className="flex gap-4">
                    {["Any", "Furnished", "Unfurnished"].map((option) => (
                      <button
                        key={option}
                        className={`px-2 py-2 font-inter border border-[#00603A] transition-all duration-300 ${
                          filters.furnishingtype === option
                            ? "bg-[#00603A] text-white"
                            : "text-black"
                        } hover:bg-[#00603A] hover:text-white`}
                        onClick={() => handleFurnishingTypeChange(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={resetFilters}
                      className="px-3 py-1 border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setActiveDropdown(null)}
                      className="px-3 py-1 bg-[#00603A] text-white hover:bg-[#004e30] text-sm"
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
          <option value="size_low">Size (Small to Large)</option>
          <option value="size_high">Size (Large to Small)</option>
        </select>
      </div>
      <MansionList searchQuery={searchQuery} filters={filters} />
    </div>
  );
};

export default MansionMarket;
