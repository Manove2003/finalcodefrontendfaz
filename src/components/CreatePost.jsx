import React, { useState } from "react";
import MansionForm from "./MansionForm";
import PenthouseForm from "./PenthouseForm";
import MagazineForm from "./MagazineForm";
import Collectibles from "./Collectibles";
import HomePageForm from "./HomePageForm";
import NewDevelopmentForm from "./NewDevelopmentform";
function CreatePost() {
  const [category, setCategory] = useState("");

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);

    let fields = {};
    if (selectedCategory === "Magazine") {
    } else if (selectedCategory === "Penthouse") {
    } else if (selectedCategory === "Home") {
      fields = {
        propertySize: "",
        neighborhood: "",
      };
    }
  };

  return (
    <div className="flex flex-col p-6 max-w-6xl mx-auto bg-white mt-10">
      <h2 className="text-2xl font-semibold mb-4">Create a Post</h2>

      <label className="block mb-2 font-semibold">Category</label>
      <select
        value={category}
        onChange={handleCategoryChange}
        className="w-full p-2 border  mb-4"
      >
        <option value="">Select Category</option>
        <option value="Magazine">Magazine</option>
        <option value="Mansion">Mansion</option>
        <option value="Penthouse">Penthouse</option>
        <option value="Home">Home</option>
        <option value="Collectibles">Collectibles</option>
        <option value="new development">New Development</option>
      </select>

      {category === "Magazine" && (
        <>
          <MagazineForm />
        </>
      )}

      {category === "Mansion" && (
        <>
          <MansionForm />
        </>
      )}

      {category === "Penthouse" && (
        <>
          <PenthouseForm />
        </>
      )}
      {category === "Collectibles" && (
        <>
          <Collectibles />
        </>
      )}

      {category === "Home" && (
        <>
          <HomePageForm />
        </>
      )}
      {category === "new development" && (
        <>
          <NewDevelopmentForm />
        </>
      )}
    </div>
  );
}

export default CreatePost;
