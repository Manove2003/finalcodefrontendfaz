import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import MansionCard from "./Card";
import CurrencySwitcher from "./CurrencySwitcher";

const FeaturedListings = ({ searchQuery }) => {
  // State for all data
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [mansionFeatured, setMansionFeatured] = useState([]);
  const [penthouseFeatured, setPenthouseFeatured] = useState([]);
  const [collectiblesFeatured, setCollectiblesFeatured] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Content state
  const [mansionDescription, setMansionDescription] = useState("");
  const [mansionBtnText, setMansionBtnText] = useState("");
  const [penthouseDescription, setPenthouseDescription] = useState("");
  const [penthouseBtnText, setPenthouseBtnText] = useState("");
  const [collectiblesDescription, setCollectiblesDescription] = useState("");
  const [collectiblesBtnText, setCollectiblesBtnText] = useState("");

  // Loading and error states
  const [loading, setLoading] = useState({
    featured: true,
    mansions: true,
    penthouses: true,
    collectibles: true,
    search: false,
  });

  const [errors, setErrors] = useState({
    featured: null,
    mansions: null,
    penthouses: null,
    collectibles: null,
    search: null,
  });

  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://backendfaz.onrender.com"
      : "http://localhost:5001";

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel for better performance
        const [
          featuredRes,
          mansionRes,
          penthouseRes,
          collectiblesRes,
          mansionContentRes,
          penthouseContentRes,
          collectiblesContentRes,
        ] = await Promise.all([
          axios.get(`${BASE_URL}/api/featured`, { timeout: 10000 }),
          axios.get(`${BASE_URL}/api/mansion/featured`, { timeout: 10000 }),
          axios.get(`${BASE_URL}/api/penthouse/featured`, { timeout: 10000 }),
          axios.get(`${BASE_URL}/api/collectibles/featured`, {
            timeout: 10000,
          }),
          axios.get(`${BASE_URL}/api/mansion`),
          axios.get(`${BASE_URL}/api/penthouse`),
          axios.get(`${BASE_URL}/api/collectibles`),
        ]);

        // Set properties data
        setFeaturedProperties(
          Array.isArray(featuredRes.data) ? featuredRes.data : []
        );
        setMansionFeatured(
          Array.isArray(mansionRes.data) ? mansionRes.data : []
        );
        setPenthouseFeatured(
          Array.isArray(penthouseRes.data) ? penthouseRes.data : []
        );
        setCollectiblesFeatured(
          Array.isArray(collectiblesRes.data) ? collectiblesRes.data : []
        );

        // Set content data
        setMansionDescription(
          mansionContentRes.data.description || "Explore our luxury mansions."
        );
        setMansionBtnText(
          mansionContentRes.data.btntext || "View All Mansions"
        );
        setPenthouseDescription(
          penthouseContentRes.data.description || "Discover premium penthouses."
        );
        setPenthouseBtnText(
          penthouseContentRes.data.btntext || "View All Penthouses"
        );
        setCollectiblesDescription(
          collectiblesContentRes.data.description ||
            "Browse exclusive collectibles."
        );
        setCollectiblesBtnText(
          collectiblesContentRes.data.btntext || "View All Collectibles"
        );

        setLoading({
          featured: false,
          mansions: false,
          penthouses: false,
          collectibles: false,
          search: false,
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setErrors({
          featured: "Failed to load featured listings.",
          mansions: "Failed to load mansion listings.",
          penthouses: "Failed to load penthouse listings.",
          collectibles: "Failed to load collectibles listings.",
          search: null,
        });
        setLoading({
          featured: false,
          mansions: false,
          penthouses: false,
          collectibles: false,
          search: false,
        });
      }
    };

    fetchData();
  }, []);

  // Handle search with debounce for multi-word queries
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setErrors((prev) => ({ ...prev, search: null }));
      return;
    }

    setLoading((prev) => ({ ...prev, search: true }));

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/search`, {
          params: { query: searchQuery },
          timeout: 10000,
        });
        setSearchResults(response.data);
        setHasSearched(true);
        setErrors((prev) => ({ ...prev, search: null }));
      } catch (err) {
        console.error("Search error:", err);
        setErrors((prev) => ({
          ...prev,
          search: "Search failed. Please try again.",
        }));
        setSearchResults([]);
        setHasSearched(true);
      } finally {
        setLoading((prev) => ({ ...prev, search: false }));
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Render helper function for featured sections
  const renderFeaturedSection = (
    title,
    items,
    loadingState,
    error,
    description,
    btnText,
    path
  ) => {
    return (
      <div className="px-4 md:px-8 lg:px-20 py-20 border-b border-[#00603A]">
        <h2 className="text-2xl md:text-3xl text-center md:text-left font-playfair text-[#00603A] mb-6">
          {title}
        </h2>
        {loadingState ? (
          <p className="text-center text-gray-600 col-span-4">
            Loading {title.toLowerCase()}...
          </p>
        ) : error ? (
          <p className="text-center text-red-600 col-span-4">{error}</p>
        ) : items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 py-8">
              {items.map((mansion) => (
                <MansionCard key={mansion.reference} mansion={mansion} />
              ))}
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between mt-8 space-y-6 md:space-y-0">
              <p className="font-inter text-gray-600 text-center md:text-left max-w-2xl">
                {description}
              </p>
              <a href={path}>
                <button className="font-inter px-8 md:px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300">
                  {btnText}
                </button>
              </a>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600 col-span-4">
            No {title.toLowerCase()} available
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Search Results Section */}
      {hasSearched && searchQuery.trim() && (
        <div id="search-results" className="mt-4 md:-mt-8 w-full relative z-50 ">
          {/* <h2 className="text-3xl font-playfair text-[#00603A] text-center mb-8 bg-gray-50">
            {loading.search ? "Searching..." : `Results for "${searchQuery}"`}
          </h2> */}

          {loading.search ? (
            <div className="text-center">
              <p className="text-gray-600">Searching properties...</p>
            </div>
          ) : errors.search ? (
            <div className="text-center">
              <p className="text-red-600 mb-4">{errors.search}</p>
            </div>
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
            <div className="px-4 md:px-10 lg:px-20 grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 z-9999 gap-6 ">
              {searchResults.map((mansion) => (
                <MansionCard key={mansion.reference} mansion={mansion} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Regular Featured Sections - now written out individually */}
      {(!hasSearched || !searchQuery.trim()) && (
        <>
          {/* Featured Listings Section */}
          <div className="px-4 md:px-8 lg:px-20 py-16 border-b border-[#00603A]">
            <h2 className="text-2xl md:text-3xl text-center md:text-left font-playfair text-[#00603A] mb-6">
              Featured Listings
            </h2>
            {loading.featured ? (
              <p className="text-center text-gray-600 col-span-4">
                Loading featured listings...
              </p>
            ) : errors.featured ? (
              <p className="text-center text-red-600 col-span-4">
                {errors.featured}
              </p>
            ) : featuredProperties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 py-8">
                  {featuredProperties.map((mansion) => (
                    <MansionCard key={mansion.reference} mansion={mansion} />
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-600 col-span-4">
                No featured properties available
              </p>
            )}
          </div>

          {/* Mansion Featured Section */}
          <div className="px-4 md:px-8 lg:px-20 py-20 border-b border-[#00603A]">
            <h2 className="text-2xl md:text-3xl text-center md:text-left font-playfair text-[#00603A] mb-6">
              Newly Listed Mansions
            </h2>
            {loading.mansions ? (
              <p className="text-center text-gray-600 col-span-4">
                Loading featured mansions...
              </p>
            ) : errors.mansions ? (
              <p className="text-center text-red-600 col-span-4">
                {errors.mansions}
              </p>
            ) : mansionFeatured.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 py-8 ">
                  {mansionFeatured.map((mansion) => (
                    <MansionCard key={mansion.reference} mansion={mansion} />
                  ))}
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between  space-y-6 md:space-y-2">
                  <p className="font-inter text-gray-600 text-center md:text-left max-w-2xl">
                    {mansionDescription}
                  </p>
                  <a href="/mansions">
                    <button className="font-inter px-12 md:px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300">
                      {mansionBtnText}
                    </button>
                  </a>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-600 col-span-4">
                No featured mansions available
              </p>
            )}
          </div>

          {/* Penthouse Featured Section */}
          <div className="px-4 md:px-8 lg:px-20 py-20 border-b border-[#00603A]">
            <h2 className="text-2xl md:text-3xl text-center md:text-left font-playfair text-[#00603A] mb-6">
              Newly Listed Penthouses
            </h2>
            {loading.penthouses ? (
              <p className="text-center text-gray-600 col-span-4">
                Loading featured penthouses...
              </p>
            ) : errors.penthouses ? (
              <p className="text-center text-red-600 col-span-4">
                {errors.penthouses}
              </p>
            ) : penthouseFeatured.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 py-8 ">
                  {penthouseFeatured.map((mansion) => (
                    <MansionCard key={mansion.reference} mansion={mansion} />
                  ))}
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between  space-y-6 md:space-y-0">
                  <p className="font-inter text-gray-600 text-center md:text-left max-w-2xl">
                    {penthouseDescription}
                  </p>
                  <a href="/penthouses">
                    <button className="font-inter px-12 md:px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300">
                      {penthouseBtnText}
                    </button>
                  </a>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-600 col-span-4">
                No featured penthouses available
              </p>
            )}
          </div>

          {/* Collectibles Featured Section */}
          <div className="px-4 md:px-8 lg:px-20 py-20 border-b border-[#00603A]">
            <h2 className="text-2xl md:text-3xl text-center md:text-left font-playfair text-[#00603A] mb-6">
              Newly Listed Collectibles
            </h2>
            {loading.collectibles ? (
              <p className="text-center text-gray-600 col-span-4">
                Loading featured collectibles...
              </p>
            ) : errors.collectibles ? (
              <p className="text-center text-red-600 col-span-4">
                {errors.collectibles}
              </p>
            ) : collectiblesFeatured.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 py-8">
                  {collectiblesFeatured.map((mansion) => (
                    <MansionCard key={mansion.reference} mansion={mansion} />
                  ))}
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between  space-y-6 md:space-y-0">
                  <p className="font-inter text-gray-600 text-center md:text-left max-w-2xl">
                    {collectiblesDescription}
                  </p>
                  <a href="/luxecollectibles">
                    <button className="font-inter px-12 md:px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300">
                      {collectiblesBtnText}
                    </button>
                  </a>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-600 col-span-4">
                No featured collectibles available
              </p>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default FeaturedListings;
