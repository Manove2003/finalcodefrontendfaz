import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import MansionCard from "../components/Card";

const AboutPageListing = () => {
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
                <button className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300">
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
        <>
          {/* Mansion Featured Section */}
          <div className="px-4 md:px-8 lg:px-20 py-20 border-b border-[#00603A]">
            <h2 className="text-2xl md:text-3xl text-center  text-[#00603A] font-playfair mt-2 mb-6">
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
                    <button className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300">
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
            <h2 className="text-2xl md:text-3xl text-center  text-[#00603A] font-playfair mt-2 mb-6">
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
                    <button className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300">
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
        </>
    </>
  );
};

export default AboutPageListing;
