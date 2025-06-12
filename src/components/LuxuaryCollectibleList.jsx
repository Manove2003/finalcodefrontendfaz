import React, { useState } from "react";
import MansionCard from "./Card"; // Use MansionCard instead of CollectibleCard

const LuxuryCollectibleList = ({ collectibles, searchQuery = "" }) => {
  const [visibleCount, setVisibleCount] = useState(9); // Initial visible cards

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 6); // Show 6 more on each click
  };

  const filteredCollectibles = collectibles?.filter(
    (collectible) => collectible && collectible.reference
  );

  const hasMoreToShow = filteredCollectibles.length > visibleCount;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCollectibles?.length > 0 ? (
          filteredCollectibles
            .slice(0, visibleCount)
            .map((collectible) => (
              <MansionCard
                key={collectible.reference || collectible._id}
                mansion={collectible}
                searchQuery={searchQuery}
              />
            ))
        ) : (
          <div className="w-full text-center py-12 col-span-full">
            <p className="text-gray-600 text-lg mb-4">
              No luxury collectibles found matching your criteria.
            </p>
            <p className="text-gray-500">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>

      {hasMoreToShow && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSeeMore}
            className="px-16 py-3 border border-[#00603A] rounded-none text-[#00603A] bg-white hover:bg-[#00603A] hover:text-white transition text-sm font-medium"
          >
            View More
          </button>
        </div>
      )}
    </>
  );
};

export default LuxuryCollectibleList;
