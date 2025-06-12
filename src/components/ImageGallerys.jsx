import { useState, useEffect } from "react";

const ImageGallerys = ({ images }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Disable body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    } else {
      document.body.style.overflow = "auto"; // Restore scrolling
    }
  }, [isOpen]);

  return (
    <div className="w-full absolute bottom-4 left-4">
      {/* Show All Photos Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="absolute bottom-8 right-16 bg-white bg-opacity-75 hover:text-white text-black px-8 py-2 border border-[#00603A] hover:bg-[#00603A] transition-all duration-300"
      >
        Show All Photos
      </button>

      {/* Popup Modal (Single Scrollable Container) */}
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-start z-50  bg-white overflow-y-auto">
          {/* Fixed Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="fixed top-4 right-8 text-[#000000] hover:text-[#00603A] px-3 py-1 rounded-md text-xl z-50"
          >
            ✕
          </button>

          {/* Modal Content (Moved Down) */}
          <div className="relative p-5 w-full mt-16 mb-8  ">
            {/* Images and Text Layout */}
            <div className="flex flex-col md:flex-row gap-4 md:h-auto">
              {/* 🟢 Images Container (First on mobile, second on desktop) */}
              <div className="flex flex-col w-full md:w-[75%] order-1 md:order-2">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Image ${index + 1}`}
                    className="w-full h-auto mb-4"
                  />
                ))}
              </div>

              {/* 🟢 Text Container (Second on mobile, first on desktop) */}
              <div className="w-full md:w-[25%] p-4 md:sticky md:top-4 self-start order-2 md:order-1">
                <div className="flex flex-col  mt-4 py-6 md:mt-6  md:space-y-0">
                  <h3 className="text-3xl font-playfair break-words text-[#000000] mb-8 bg-white">
                    Exquisite villa in Palm Jumeirah with private pool
                  </h3>

                  {/* <p className="text-base break-words font-inter pt-8 border-t border-[#00603A]">
                    Mansion | 6 beds | 8 baths | 9,729 sq. ft. | 9,729 sq. ft.
                    plot
                  </p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallerys;
