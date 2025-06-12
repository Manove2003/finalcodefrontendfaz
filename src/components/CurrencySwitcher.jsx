import { useCurrency } from "../context/CurrencyContext";
import Flag from "react-flagkit";
import { useState, useRef, useEffect } from "react";

// Mapping of currencies to country codes for flags
const currencyToCountry = {
  USD: "US",
  EUR: "EU",
  GBP: "GB",
  JPY: "JP",
  AUD: "AU",
  CAD: "CA",
  CHF: "CH",
  CNY: "CN",
  INR: "IN",
  BRL: "BR",
  MXN: "MX",
  ZAR: "ZA",
  KRW: "KR",
  SGD: "SG",
  NZD: "NZ",
  SEK: "SE",
  NOK: "NO",
  DKK: "DK",
  AED: "AE",
  HKD: "HK",
};

const CurrencySwitcher = () => {
  const { currency, setCurrency, exchangeRates } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const handleCurrencyChange = (curr) => {
    setCurrency(curr);
    setIsOpen(false);
    setSearchTerm("");
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm("");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter currencies based on search term
  const filteredCurrencies = Object.keys(exchangeRates).filter((curr) =>
    curr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-3 py-2 rounded-none  text-white border  transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none  "
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="flex items-center">
          {currencyToCountry[currency] && (
            <span className="mr-2 flex-shrink-0 overflow-hidden rounded-sm">
              <Flag country={currencyToCountry[currency]} size={20} />
            </span>
          )}
          <span className="font-medium">{currency}</span>
        </span>
        <svg
          className={`h-5 w-5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 bottom-full mb-2 w-64 rounded-lg bg-white shadow-xl border border-gray-200 transform transition-all duration-200 origin-bottom-right">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Search currency..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 pl-9 text-sm text-black rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>

          <ul
            className="py-1 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            role="listbox"
          >
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map((curr) => (
                <li
                  key={curr}
                  onClick={() => handleCurrencyChange(curr)}
                  className={`flex items-center px-3 py-2 text-sm cursor-pointer transition-colors duration-150 ${
                    currency === curr
                      ? "bg-emerald-50 text-emerald-800 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  role="option"
                  aria-selected={currency === curr}
                >
                  <div className="flex items-center w-full">
                    {currencyToCountry[curr] && (
                      <span className="mr-3 flex-shrink-0 overflow-hidden rounded-sm">
                        <Flag country={currencyToCountry[curr]} size={20} />
                      </span>
                    )}
                    <span>{curr}</span>
                    {currency === curr && (
                      <svg
                        className="ml-auto h-4 w-4 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-gray-500 text-center">
                No currencies found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CurrencySwitcher;
