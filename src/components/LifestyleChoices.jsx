import React from "react";
import l1 from "../assests/Waterfront Living.jpeg";
import l2 from "../assests/Golf Community.jpg";
const LifestyleChoices = () => {
  return (
    <div className="min-h-screen bg-white px-4 py-20 md:px-8 lg:px-16  border-b   border-[#00603A]">
      {/* Header Section */}
      <div className="text-center my-8 ">
        <h2 className="font-inter  text-base text-gray-500 mt-2">
          Explore exclusive homes – A home tailored to your lifestyles
        </h2>
        <h1 className="font-playfair text-2xl md:text-4xl  mt-2 mb-12  text-[#00603A] mt-4">
          Choose Your Lifestyle Decision
        </h1>
      </div>

      {/* Image Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
        {/* First Row */}
        <div className="relative group col-span-1 sm:col-span-1 lg:col-span-2">
          <img
            src={l1}
            alt="Dubai Mansions"
            className="w-full h-[250px] object-cover "
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center  opacity-100 ">
            <h3 className="font-playfair text-white text-xl ">Mansions</h3>
          </div>
        </div>

        <div className="relative group col-span-1 sm:col-span-1 lg:col-span-2">
          <img
            src={l2}
            alt="Waterfront Living"
            className="w-full h-[250px] object-cover "
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center  opacity-100 ">
            <h3 className="text-white text-xl font-playfair">
              Waterfront Living
            </h3>
          </div>
        </div>

        {/* Second Row */}
        <div className="relative group">
          <img
            src={l2}
            alt="Private Living"
            className="w-full h-[280px] object-cover "
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center  opacity-100 ">
            <h3 className="text-white text-xl font-playfair">Private Living</h3>
          </div>
        </div>

        <div className="relative group">
          <img
            src={l1}
            alt="Community Living"
            className="w-full h-[280px] object-cover "
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center  opacity-100 ">
            <h3 className="text-white text-xl font-playfair">Penthouses</h3>
          </div>
        </div>

        <div className="relative group">
          <img
            src={l2}
            alt="Golf Course Living"
            className="w-full h-[280px] object-cover "
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center  opacity-100">
            <h3 className="text-white text-xl font-playfair">
              Golf Course Living
            </h3>
          </div>
        </div>

        <div className="relative group">
          <img
            src={l1}
            alt="Branded Residences"
            className="w-full h-[280px] object-cover "
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center  opacity-100 ">
            <h3 className="text-white text-xl font-playfair">
              Branded Residences
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifestyleChoices;
