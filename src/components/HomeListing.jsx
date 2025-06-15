import React from "react";
import "./man.css";
import Footer from "./Footer";
import { useMansions } from "../context/MansionContext";
import MansionCard from "./Card";

const HomeListing = () => {
  const { mansions } = useMansions();

  // Filter mansions to include only those with propertytype "Mansion" or "Penthouse"
  const filteredMansions = mansions
    .filter((mansion) =>
      ["Mansion", "Penthouse"].includes(mansion.propertytype)
    )
    // Sort by reference (newest) or any other criteria if desired
    .sort((a, b) => (a.reference < b.reference ? 1 : -1))
    // Limit to 6 items
    .slice(0, 6);

  return (
    <>
      <div className="w-full pt-4 py-10 px-4 md:px-10 lg:px-20 py-12  mt-4 border-t-2 border-[#00603A]">
        <h2
          className="text-2xl md:text-3xl text-center  capitalize
 mt-12 font-playfair text-[#00603A] mb-16"
        >
          Mansions And penthouses For Sale
        </h2>
        {/* Mansion cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMansions.length > 0 ? (
            filteredMansions.map((mansion) => (
              <MansionCard key={mansion.reference} mansion={mansion} />
            ))
          ) : (
            <p className="text-gray-600 text-center w-full text-lg py-8 col-span-full">
              No mansions or penthouses available at the moment.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomeListing;
