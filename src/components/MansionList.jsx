import React, { useState } from "react";
import { useMansions } from "../context/MansionContext";
import MansionCard from "./Card";
import CurrencySwitcher from "./CurrencySwitcher";

const MansionList = ({ searchQuery = "", filters = {} }) => {
  const { mansions } = useMansions();
  const [visibleCount, setVisibleCount] = useState(9);

  const searchTerms = searchQuery
    .toLowerCase()
    .split(" ")
    .filter((term) => term);

  const filteredMansions = mansions.filter((mansion) => {
    if (mansion.propertytype !== "Mansion") return false;

    if (searchTerms.length > 0) {
      const matchesSearch = searchTerms.some((term) =>
        [
          mansion.country,
          mansion.area,
          mansion.district,
          mansion.city,
          mansion.community,
          mansion.subcommunity,
        ].some((field) => field && field.toLowerCase().includes(term))
      );
      if (!matchesSearch) return false;
    }

    if (filters.bedrooms && mansion.bedrooms < parseInt(filters.bedrooms)) {
      return false;
    }

    if (filters.minPrice && mansion.price < parseInt(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && mansion.price > parseInt(filters.maxPrice)) {
      return false;
    }

    if (filters.minSize && mansion.size < parseInt(filters.minSize)) {
      return false;
    }
    if (filters.maxSize && mansion.size > parseInt(filters.maxSize)) {
      return false;
    }

    if (filters.projectstatus && filters.projectstatus !== "Any") {
      if (mansion.projectstatus !== filters.projectstatus) {
        return false;
      }
    }

    if (filters.furnishingtype && filters.furnishingtype !== "Any") {
      if (mansion.furnishingtype !== filters.furnishingtype) {
        return false;
      }
    }

    return true;
  });

  const sortedMansions = [...filteredMansions].sort((a, b) => {
    switch (filters.sortBy) {
      case "price_low":
        return a.price - b.price;
      case "price_high":
        return b.price - a.price;
      case "size_low":
        return a.size - b.size;
      case "size_high":
        return b.size - a.size;
      case "newest":
      default:
        return a.reference < b.reference ? 1 : -1;
    }
  });

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const hasMoreToShow = sortedMansions.length > visibleCount;

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedMansions.length > 0 ? (
          sortedMansions
            .slice(0, visibleCount)
            .map((mansion) => (
              <MansionCard key={mansion.reference} mansion={mansion} />
            ))
        ) : (
          <p className="text-gray-600 text-center w-full text-lg py-8 col-span-full">
            No mansions found matching your criteria. Try adjusting your search
            or filters.
          </p>
        )}
      </div>
      {hasMoreToShow && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSeeMore}
            className="px-16 py-3 border border-[#00603A] rounded-none text-[#00603A] bg-white hover:bg-[#00603A] hover:text-white transition text-sm "
          >
            View More
          </button>
        </div>
      )}
    </div>
  );
};

export default MansionList;
