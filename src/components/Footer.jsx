"use client";

import { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import axios from "axios";
import CurrencySwitcher from "./CurrencySwitcher";

const Footer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [mansionLinks, setMansionLinks] = useState([]);
  const [penthouseLinks, setPenthouseLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://backendfaz.onrender.com"
      : "http://localhost:5001";

  // Fetch links data for Mansion and Penthouse
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/links`);
        const linksData = response.data;

        // Assuming the latest links data is used (or adjust to select a specific one)
        if (linksData && linksData.length > 0) {
          const latestLinks = linksData[0]; // Use the most recent entry
          // Mansion links
          const mansion = [
            { text: latestLinks.mansionText1, link: latestLinks.mansionLink1 },
            { text: latestLinks.mansionText2, link: latestLinks.mansionLink2 },
            { text: latestLinks.mansionText3, link: latestLinks.mansionLink3 },
            { text: latestLinks.mansionText4, link: latestLinks.mansionLink4 },
          ].filter((item) => item.text && item.link); // Filter out empty pairs

          // Penthouse links
          const penthouse = [
            {
              text: latestLinks.penthouseText1,
              link: latestLinks.penthouseLink1,
            },
            {
              text: latestLinks.penthouseText2,
              link: latestLinks.penthouseLink2,
            },
            {
              text: latestLinks.penthouseText3,
              link: latestLinks.penthouseLink3,
            },
            {
              text: latestLinks.penthouseText4,
              link: latestLinks.penthouseLink4,
            },
          ].filter((item) => item.text && item.link); // Filter out empty pairs

          setMansionLinks(mansion);
          setPenthouseLinks(penthouse);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to load links. Please try again later.");
        console.error("Error fetching links:", err);
        setLoading(false);
      }
    };

    fetchLinks();
  }, [BASE_URL]);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URL}/api/newsletter`, {
        email,
        category: "Newsletter",
      });

      setMessage(res.data.message);
      setEmail("");
    } catch (err) {
      setMessage(err.response?.data?.error || "An error occurred");
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Disable body scroll
    } else {
      document.body.style.overflow = ""; // Re-enable body scroll
    }
    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="bg-[#00603A] text-white">
      <div className="flex flex-col md:flex-row items-center justify-around mt-8 lg:px-24 space-y-6 md:space-y-0 bg-[#101132] text-white p-8 text-center">
        <div className="md:text-start text-center">
          <h2 className="text-3xl font-playfair">The Newsletter</h2>
          <p className="mt-2 max-w-2xl text-base">
            Sign-up for our meticulously crafted collection highlighting the
            hottest luxury offerings, accompanied by exclusive insights.
          </p>
        </div>
        <div className="relative">
          <button
            className="px-8 md:px-20 font-inter py-3 mr-0 md:mr-8 text-[#ffffff] border bg-[#101132] hover:bg-[#ffffff] hover:text-[#101132] transition-all duration-300 md:ml-6"
            onClick={() => setIsOpen(true)}
          >
            Sign-up for Newsletter
          </button>

          {/* Popup Modal */}
          {isOpen && (
            <div className="fixed  inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
              <div className="w-[90%] md:w-[600px]   p-6  relative">
                <button
                  className="absolute top-1 right-6 text-[#ffffff] text-xl hover:text-[#00603A]"
                  onClick={() => setIsOpen(false)}
                >
                  ✕
                </button>
                <div className="border bg-white border-[#00603A] mt-4 p-8 md:p-12">
                  {message ? (
                    <p
                      className={`text-center text-xl ${
                        message.includes("error")
                          ? "text-red-600"
                          : "text-[#00603A]"
                      }`}
                    >
                      {message}
                    </p>
                  ) : (
                    <>
                      <h2 className="text-[#00603A] font-playfair text-2xl md:text-3xl text-center">
                        The Newsletter
                      </h2>
                      <p className="text-gray-700 text-center mt-4">
                        Sign-up for our meticulously crafted collection
                        highlighting the hottest luxury offerings, accompanied
                        by exclusive insights.
                      </p>
                <form onSubmit={handleSubscribe}>
  <div className="mt-8 flex items-center flex-col md:flex-row gap-2">
    <input
      type="email"
      placeholder="email@example.com"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="flex-1 px-0 py-2 border text-[#000000] text-center border-gray-300 outline-none"
      required
    />
    <button className="w-full md:w-auto font-inter px-8 md:px-12 py-[8px] text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300">
      SIGN UP
    </button>
  </div>
</form>

                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="container text-center md:text-left font-inter py-10 px-4 md:px-24 flex flex-wrap gap-6 text-sm justify-between">
        {/* Mansions for Sale */}
        <div className="flex-1 min-w-[250px]">
          <h3 className="font-semibold text-lg mb-4">Mansions for Sale</h3>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : mansionLinks.length > 0 ? (
            <ul>
              {mansionLinks.map((link, index) => (
                <li key={index} className="mb-2">
                  <a href={link.link} className="hover:underline">
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No mansion links available.</p>
          )}
        </div>

        {/* Penthouses for Sale */}
        <div className="flex-1 min-w-[250px]">
          <h3 className="font-semibold text-lg mb-4">Penthouses for Sale</h3>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : penthouseLinks.length > 0 ? (
            <ul>
              {penthouseLinks.map((link, index) => (
                <li key={index} className="mb-2">
                  <a href={link.link} className="hover:underline">
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No penthouse links available.</p>
          )}
        </div>

        {/* Mansion Market Office */}
        <div className="flex-1 min-w-[250px]">
          <h3 className="font-semibold text-lg mb-4">Mansion Market Office</h3>
          <ul>
            <li className="mb-2">
              <a href="/about">About Mansion Market</a>
            </li>
            <li className="mb-2">
              <a href="/register">Register (Broker/Brokerage)</a>
            </li>
            <li className="mb-2">
              <a href="/contactus">Contact Us</a>
            </li>
            <li className="mb-2">
              <a href="/privacypolicy">Privacy & Policy</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col pb-16 md:flex-row items-center justify-between mx-20 border-t border-[#ffffff] py-4 pt-8 text-center">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
          <div className="flex justify-center space-x-6 px-4">
            <a
              href="https://www.facebook.com/themansionmarketcom"
              className="hover:text-gray-400 text-lg"
              aria-label="Facebook"
              target="_blank"
            >
              <FaFacebook />
            </a>
            <a
              target="_blank"
              href="https://x.com/the_mansion_m"
              className="hover:text-gray-400 text-lg"
              aria-label="Twitter X"
            >
              <FaXTwitter />
            </a>
            <a
              target="_blank"
              href="https://www.instagram.com/themansionmarketcom"
              className="hover:text-gray-400 text-lg"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              target="_blank"
              href="https://www.linkedin.com/company/the-mansion-market"
              className="hover:text-gray-400 text-lg"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              target="_blank"
              href="https://www.youtube.com/@TheMansionMarket"
              className="hover:text-gray-400 text-lg"
              aria-label="YouTube"
            >
              <FaYoutube />
            </a>
          </div>
          <CurrencySwitcher />
        </div>
        <p className="font-inter text-[8px] mt-4 md:mt-0 md:text-sm text-[#ffffff] w-[300px] md:w-[660px]">
          The Mansion Market® holds a registered trademark and operates as a
          luxury property marketplace.
        </p>
      </div>
    </div>
  );
};

export default Footer;
