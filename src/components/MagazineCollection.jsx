import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import React, { useState, useEffect } from "react";
import axios from "axios";
import mockupimg from "../assests/Mockup.png";
import newImage from "../assests/about.jpeg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const MagazineCollection = () => {
  const navigate = useNavigate();

  const [magazineImage, setMagazineImage] = useState("");
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [magazineLink, setMagazineLink] = useState("");
  const [reviews, setReviews] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [magazineDetails, setMagazineDetails] = useState([]);
  const [homeArticles, setHomeArticles] = useState([]); // New state for home page articles
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [errorDetails, setErrorDetails] = useState("");
  const [hasMovedForward, setHasMovedForward] = useState(false);
  const [iconicData, setIconicData] = useState(null); // State to store fetched data

  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://backendfaz.onrender.com"
      : "http://localhost:5001";

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchIconicData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/iconic`);
        if (res.data && res.data.length > 0) {
          const sortedData = res.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setIconicData(sortedData[0]); // latest item
        }
      } catch (err) {
        console.error("Error fetching iconic data:", err);
      }
    };

    fetchIconicData();
  }, []); // Empty dependency array to run only on mount

  // Fetch magazine data
  useEffect(() => {
    const fetchMagazineData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/magazine`);
        console.log("Magazine API Response:", response.data);
        if (response.data) {
          setHeading(response.data.heading || "No heading available");
          setSubheading(response.data.subheading || "No subheading available");
          setMagazineImage(response.data.image || "/default-image.jpg");
          setMagazineLink(response.data.link || "");
        }
      } catch (error) {
        console.error("Error fetching magazine content:", error);
      }
    };

    // Fetch reviews
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/reviews`);
        console.log("Reviews API Response:", response.data);
        if (response.data && response.data.length > 0) {
          setReviews(response.data);
        } else {
          setReviews([
            {
              reviewerName: "No reviews available",
              company: "",
              content: "Check back later for client testimonials.",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([
          {
            reviewerName: "Error",
            company: "",
            content: "Failed to load reviews. Please try again later.",
          },
        ]);
      }
    };

    // Fetch magazine details
    const fetchMagazineDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/magazineDetails`);
        console.log("Magazine Details API Response:", response.data);
        const sanitizedMagazines = response.data.map((article) => ({
          ...article,
          category: article.category || "lifestyle",
          page: article.page || "Magazine",
        }));
        // Split articles into Magazine and Home
        setMagazineDetails(
          sanitizedMagazines.filter((article) => article.page === "Magazine")
        );
        setHomeArticles(
          sanitizedMagazines.filter((article) => article.page === "Home")
        );
        setLoadingDetails(false);
      } catch (error) {
        console.error("Error fetching magazine details:", error);
        setErrorDetails("Failed to load magazine details.");
        setLoadingDetails(false);
      }
    };

    fetchMagazineData();
    fetchReviews();
    fetchMagazineDetails();
  }, []);

  // Handle review navigation
  const nextReview = () => {
    setCurrentReviewIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
    setHasMovedForward(true);
  };

  const prevReview = () => {
    setCurrentReviewIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  // Handle card click (navigate to blog page)
  const handleCardClick = (id) => {
    window.location.href = `/blogpage/${id}`;
  };

  return (
    <>
      <div className="bg-white py-8 px-4 md:px-8 lg:px-16">
        <div className="text-start">
          <h2 className="text-2xl md:text-3xl text-center md:text-left font-playfair text-[#00603A]  mt-8 mb-16">
            The Magazine Collection
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-0 p-0">
          <Link to={magazineLink}>
            <div className="relative w-full h-[70vh] cursor-pointer">
              <img
                src={magazineImage}
                alt="Magazine"
                className="w-full h-full object-cover"
                onError={(e) => (e.target.src = "/default-image.jpg")}
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4 md:p-12 text-white flex flex-col">
                <h3 className="text-xl md:text-3xl font-playfair">{heading}</h3>
                <p className="mt-2 md:mt-4 text-sm md:text-base font-inter max-w-3xl">
                  {subheading}
                </p>
              </div>
            </div>
          </Link>

          {/* Magazine Cards Section */}
          <div className="mt-12">
            {loadingDetails ? (
              <p className="text-gray-500 text-center">Loading articles...</p>
            ) : errorDetails ? (
              <p className="text-red-500 text-center">{errorDetails}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {homeArticles.length > 0
                  ? homeArticles.slice(0, 4).map((article, index) => (
                      <div
                        key={index}
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
                            {article.category || "Lifestyle"}
                          </span>
                          <h4 className="text-lg mt-2 font-playfair">
                            {article.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1 font-inter">
                            {article.time
                              ? new Date(article.time).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )
                              : article.date || "No date available"}
                          </p>
                        </div>
                      </div>
                    ))
                  : magazineDetails.slice(0, 4).map((article, index) => (
                      <div
                        key={index}
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
                            {article.category || "Lifestyle"}
                          </span>
                          <h4 className="text-lg mt-2 font-playfair">
                            {article.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1 font-inter">
                            {article.time
                              ? new Date(article.time).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )
                              : article.date || "No date available"}
                          </p>
                        </div>
                      </div>
                    ))}
              </div>
            )}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between space-x-0 mt-8 md:space-x-6 space-y-12 md:space-y-0">
            <p className="text-gray-600 font-inter text-center md:text-left max-w-2xl">
Discover expert articles, market insights, and lifestyle features on luxury properties and valuable assets. Read exclusive updates, tips, and captivating stories.
            </p>

            <button
              onClick={() => navigate("/magazine")}
              // className="z-0 mr-0 md:mr-20 font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
              className="font-inter px-20 py-3 text-black border border-[#00603A] mt-6  hover:bg-[#00603A] hover:text-white transition-all duration-300"
            >
              Read Journals
            </button>
          </div>
        </div>
      </div>

      <div className="min-h-screen px-4 py-12 mt-8 md:px-8 lg:px-8 border-t border-[#00603A]">
        <div className="p-2 md:p-6 pb-6 md:pb-6">
          {/* <div className="text-center flex-1 p-4 md:p-6 flex flex-col justify-center items-center">
            <h2 className="text-2xl md:text-3xl  font-playfair  mb-8">
              <span className="text-[#00603A] font-playfair">
                {iconicData?.title || "The Spotlight On Iconic Estate"}
              </span>{" "}
              <span className="text-[#000000] font-inter font-thin pr-4">
                |
              </span>
              <span className="text-black font-inter tracking-[8px]">
                {iconicData?.year || "2025"}
              </span>
              <span className="text-[#000000] font-inter font-thin">
                {" "}
                EDITION
              </span>
            </h2>
          </div> */}
          <div className="flex flex-col md:flex-row items-center justify-center">
            <div className="w-[320px] md:w-[740px] md:h-[320px] lg:h-[420px] font-inter flex flex-col items-center md:items-start px-6 md:px-16 lg:px-20 justify-center space-y-4 text-center md:text-left">
              {/* <h3 className="text-xl md:text-3xl text-gray-700 leading-[2] tracking-[2px] mb-2 md:mb-12">
                {iconicData?.title || "The Spotlight On Iconic Estate"}
              </h3> */}
                    <h2 className="text-2xl md:text-3xl  font-playfair  mb-8">
              <span className="text-[#00603A] font-playfair">
                {iconicData?.title || "The Spotlight On Iconic Estate"}
              </span>{" "}
              <span className="text-[#000000] leading-[2] font-inter font-thin pr-4">
                |
              </span>
              <span className="text-black font-inter tracking-[8px]">
                {iconicData?.year || "2025"}
              </span>
              <span className="text-[#000000] font-inter font-thin">
                {" "}
                EDITION
              </span>
            </h2>
              <p className="text-gray-600 text-[13px]  mt-2 pb-6   md:pb-8 text-transform: uppercase">
                {iconicData?.subtitle || "The Spotlight On Iconic Estate"}
              </p>
              <a href="/signupsection">
                <button
                  // className="w-[300px] md:w-full mt-6 p-2 text-base tracking-[0px] md:tracking-[2px] font-inter px-1 md:px-8 py-4 text-[#00603A] border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
                   className="font-inter px-8 py-3 text-black border border-[#00603A] mt-6  hover:bg-[#00603A] hover:text-white transition-all duration-300"
                  //className="font-inter  md:w-max:[400px] px-4  py-3 text-black border border-[#00603A] mt-6 tracking-[0px] md:tracking-[2px] hover:bg-[#00603A] hover:text-white transition-all duration-300"
                >
                  {iconicData?.btnText || "SIGN UP FOR YOUR COPY"}
                </button>
              </a>
            </div>
            <div className="w-full md:w-[740px] px-4 md:px-0 flex justify-center items-center mt-8 md:mt-0">
              <img
                src={iconicData?.photoHome || mockupimg}
                alt="Book Cover"
                className="w-full max-w-4xl md:max-w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#f5f5f5] py-8 px-4 md:px-20 lg:px-28 mx-6 mt-0 md:mt-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xl md:text-3xl font-playfair text-[#00603A] mt-4">
              Read the opinions shared by our clients
            </h2>

            {reviews.length > 0 && (
              <>
                {/* Fixed height review box */}
        <div className="h-72 md:h-40 overflow-hidden  flex items-center justify-center text-center">
  <p className="text-gray-700 text-lg leading-relaxed">
    {reviews[currentReviewIndex].content}
  </p>
</div>


                <p className="text-gray-900 text-sm md:text-base">
                  - {reviews[currentReviewIndex].reviewerName},{" "}
                  {reviews[currentReviewIndex].company}
                </p>
              </>
            )}

            {reviews.length > 1 && (
              <div className="flex justify-center items-center mt-6 space-x-4">
                {hasMovedForward && (
                  <button
                    onClick={prevReview}
                    className="text-gray-700 hover:text-gray-900 text-xl"
                  >
                    <BsArrowLeft />
                  </button>
                )}
                <button
                  onClick={nextReview}
                  className="text-gray-700 hover:text-gray-900 text-xl"
                >
                  <BsArrowRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MagazineCollection;
