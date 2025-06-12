"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const HomePageForm = () => {
  
   const { api } = useAuth();

  // Existing state variables from HomePageForm
  const [heroData, setHeroData] = useState({
    _id: null,
    heading: "",
    subheading: "",
    image: null,
  });
  const [heroExistingImage, setHeroExistingImage] = useState(null);

  const [mansionData, setMansionData] = useState({
    _id: null,
    description: "",
    btntext: "",
    ref1: "",
    ref2: "",
    ref3: "",
    ref4: "",
  });

  const [penthouseData, setPenthouseData] = useState({
    _id: null,
    description: "",
    btntext: "",
    ref1: "",
    ref2: "",
    ref3: "",
    ref4: "",
  });

  const [collectiblesData, setCollectiblesData] = useState({
    _id: null,
    description: "",
    btntext: "",
    ref1: "",
    ref2: "",
    ref3: "",
    ref4: "",
  });

  const [magazineData, setMagazineData] = useState({
    _id: null,
    heading: "",
    subheading: "",
    link: "", // Added link field
    image: null,
  });
  const [magazineExistingImage, setMagazineExistingImage] = useState(null);

  const [featuredData, setFeaturedData] = useState({
    _id: null,
    ref1: "",
    ref2: "",
    ref3: "",
    ref4: "",
  });

  const [featuredProperties, setFeaturedProperties] = useState(null);
  const [mansionFeaturedProperties, setMansionFeaturedProperties] =
    useState(null);
  const [penthouseFeaturedProperties, setPenthouseFeaturedProperties] =
    useState(null);
  const [collectiblesFeaturedProperties, setCollectiblesFeaturedProperties] =
    useState(null);

  const [linksData, setLinksData] = useState({
    _id: null,
    mansionText1: "",
    mansionLink1: "",
    mansionText2: "",
    mansionLink2: "",
    mansionText3: "",
    mansionLink3: "",
    mansionText4: "",
    mansionLink4: "",
    penthouseText1: "",
    penthouseLink1: "",
    penthouseText2: "",
    penthouseLink2: "",
    penthouseText3: "",
    penthouseLink3: "",
    penthouseText4: "",
    penthouseLink4: "",
  });

  const [reviewData, setReviewData] = useState({
    _id: null,
    reviewerName: "",
    company: "",
    content: "",
    isApproved: false,
  });

  const [reviews, setReviews] = useState([]);
  const [messages, setMessages] = useState({
    hero: "",
    featured: "",
    mansionContent: "",
    mansionReferences: "",
    penthouseContent: "",
    penthouseReferences: "",
    collectiblesContent: "",
    collectiblesReferences: "",
    magazine: "",
    links: "",
    review: "",
    iconic: "",
  });
  const [isLoading, setIsLoading] = useState({
    hero: false,
    featured: false,
    mansionContent: false,
    mansionReferences: false,
    penthouseContent: false,
    penthouseReferences: false,
    collectiblesContent: false,
    collectiblesReferences: false,
    magazine: false,
    links: false,
    review: false,
    iconic: false,
  });

  const [validReferences, setValidReferences] = useState([]);

  const [iconicData, setIconicData] = useState({
    _id: null,
    title: "",
    subtitle: "",
    year: "",
    btnText: "",
    description: "",
    photoHome: null,
    photoSignup: null,
  });

  const [iconicExistingHomeImage, setIconicExistingHomeImage] = useState(null);
  const [iconicExistingSignupImage, setIconicExistingSignupImage] =
    useState(null);

 

  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://backend-5kh4.onrender.com"
      : "http://localhost:5001";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propertiesResponse = await api.get(
          `${BASE_URL}/api/properties`
        );
        const references = propertiesResponse.data
          .map((property) => property.reference)
          .filter((ref) => ref);
        setValidReferences(references);

        const heroResponse = await api.get(`${BASE_URL}/api/hero`);
        if (heroResponse.data) {
          setHeroData({
            _id: heroResponse.data._id,
            heading: heroResponse.data.heading || "",
            subheading: heroResponse.data.subheading || "",
            image: null,
          });
          setHeroExistingImage(heroResponse.data.image || null);
        }

        const featuredResponse = await api.get(`${BASE_URL}/api/featured`);
        setFeaturedProperties(featuredResponse.data || null);
        if (featuredResponse.data && Array.isArray(featuredResponse.data)) {
          setFeaturedData({
            _id: featuredResponse.data._id || null,
            ref1: featuredResponse.data[0]?.reference || "",
            ref2: featuredResponse.data[1]?.reference || "",
            ref3: featuredResponse.data[2]?.reference || "",
            ref4: featuredResponse.data[3]?.reference || "",
          });
        }

        const mansionResponse = await api.get(`${BASE_URL}/api/mansion`);
        if (mansionResponse.data) {
          setMansionData((prev) => ({
            ...prev,
            _id: mansionResponse.data._id,
            description: mansionResponse.data.description || "",
            btntext: mansionResponse.data.btntext || "",
          }));
        }
        const mansionFeaturedResponse = await api.get(
          `${BASE_URL}/api/mansion/featured`
        );
        setMansionFeaturedProperties(mansionFeaturedResponse.data || null);
        if (
          mansionFeaturedResponse.data &&
          Array.isArray(mansionFeaturedResponse.data)
        ) {
          setMansionData((prev) => ({
            ...prev,
            ref1: mansionFeaturedResponse.data[0]?.reference || "",
            ref2: mansionFeaturedResponse.data[1]?.reference || "",
            ref3: mansionFeaturedResponse.data[2]?.reference || "",
            ref4: mansionFeaturedResponse.data[3]?.reference || "",
          }));
        }

        const penthouseResponse = await api.get(`${BASE_URL}/api/penthouse`);
        if (penthouseResponse.data) {
          setPenthouseData((prev) => ({
            ...prev,
            _id: penthouseResponse.data._id,
            description: penthouseResponse.data.description || "",
            btntext: penthouseResponse.data.btntext || "",
          }));
        }
        const penthouseFeaturedResponse = await api.get(
          `${BASE_URL}/api/penthouse/featured`
        );
        setPenthouseFeaturedProperties(penthouseFeaturedResponse.data || null);
        if (
          penthouseFeaturedResponse.data &&
          Array.isArray(penthouseFeaturedResponse.data)
        ) {
          setPenthouseData((prev) => ({
            ...prev,
            ref1: penthouseFeaturedResponse.data[0]?.reference || "",
            ref2: penthouseFeaturedResponse.data[1]?.reference || "",
            ref3: penthouseFeaturedResponse.data[2]?.reference || "",
            ref4: penthouseFeaturedResponse.data[3]?.reference || "",
          }));
        }

        const collectiblesResponse = await api.get(
          `${BASE_URL}/api/collectibles`
        );
        if (collectiblesResponse.data) {
          setCollectiblesData((prev) => ({
            ...prev,
            _id: collectiblesResponse.data._id,
            description: collectiblesResponse.data.description || "",
            btntext: collectiblesResponse.data.btntext || "",
          }));
        }
        const collectiblesFeaturedResponse = await api.get(
          `${BASE_URL}/api/collectibles/featured`
        );
        setCollectiblesFeaturedProperties(
          collectiblesFeaturedResponse.data || null
        );
        if (
          collectiblesFeaturedResponse.data &&
          Array.isArray(collectiblesFeaturedResponse.data)
        ) {
          setCollectiblesData((prev) => ({
            ...prev,
            ref1: collectiblesFeaturedResponse.data[0]?.reference || "",
            ref2: collectiblesFeaturedResponse.data[1]?.reference || "",
            ref3: collectiblesFeaturedResponse.data[2]?.reference || "",
            ref4: collectiblesFeaturedResponse.data[3]?.reference || "",
          }));
        }

        const magazineResponse = await api.get(`${BASE_URL}/api/magazine`);
        if (magazineResponse.data) {
          setMagazineData({
            _id: magazineResponse.data._id,
            heading: magazineResponse.data.heading || "",
            subheading: magazineResponse.data.subheading || "",
            link: magazineResponse.data.link || "", // Added link field
            image: null,
          });
          setMagazineExistingImage(magazineResponse.data.image || null);
        }

        const linksResponse = await api.get(`${BASE_URL}/api/links`);
        if (
          linksResponse.data &&
          Array.isArray(linksResponse.data) &&
          linksResponse.data.length > 0
        ) {
          const mostRecentLinks = linksResponse.data.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          )[0];
          setLinksData({
            _id: mostRecentLinks._id || null,
            mansionText1: mostRecentLinks.mansionText1 || "",
            mansionLink1: mostRecentLinks.mansionLink1 || "",
            mansionText2: mostRecentLinks.mansionText2 || "",
            mansionLink2: mostRecentLinks.mansionLink2 || "",
            mansionText3: mostRecentLinks.mansionText3 || "",
            mansionLink3: mostRecentLinks.mansionLink3 || "",
            mansionText4: mostRecentLinks.mansionText4 || "",
            mansionLink4: mostRecentLinks.mansionLink4 || "",
            penthouseText1: mostRecentLinks.penthouseText1 || "",
            penthouseLink1: mostRecentLinks.penthouseLink1 || "",
            penthouseText2: mostRecentLinks.penthouseText2 || "",
            penthouseLink2: mostRecentLinks.penthouseLink2 || "",
            penthouseText3: mostRecentLinks.penthouseText3 || "",
            penthouseLink3: mostRecentLinks.penthouseLink3 || "",
            penthouseText4: mostRecentLinks.penthouseText4 || "",
            penthouseLink4: mostRecentLinks.penthouseLink4 || "",
          });
        } else {
          setLinksData({
            _id: null,
            mansionText1: "",
            mansionLink1: "",
            mansionText2: "",
            mansionLink2: "",
            mansionText3: "",
            mansionLink3: "",
            mansionText4: "",
            mansionLink4: "",
            penthouseText1: "",
            penthouseLink1: "",
            penthouseText2: "",
            penthouseLink2: "",
            penthouseText3: "",
            penthouseLink3: "",
            penthouseText4: "",
            penthouseLink4: "",
          });
        }

        // In the useEffect function, replace the iconic section code with this version that handles an array response
        const iconicResponse = await api.get(`${BASE_URL}/api/iconic`);
        if (iconicResponse.data) {
          console.log(
            "Iconic API Response:",
            JSON.stringify(iconicResponse.data)
          );

          // Check if the response is an array and get the most recent item (first in the array)
          const iconicResponseData = Array.isArray(iconicResponse.data)
            ? iconicResponse.data[0]
            : iconicResponse.data;

          console.log("Using iconic data:", iconicResponseData);

          // Set state with the correct data
          setIconicData({
            _id: iconicResponseData._id || null,
            title: iconicResponseData.title || "",
            subtitle: iconicResponseData.subtitle || "",
            year: iconicResponseData.year || "",
            btnText: iconicResponseData.btnText || "",
            description: iconicResponseData.description || "",
            photoHome: null,
            photoSignup: null,
          });

          // Set image URLs
          setIconicExistingHomeImage(iconicResponseData.photoHome || null);
          setIconicExistingSignupImage(iconicResponseData.photoSignup || null);
        }

        const reviewsResponse = await api.get(
          `${BASE_URL}/api/reviews/admin`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessages((prev) => ({
          ...prev,
          hero: "Failed to load existing hero data.",
          featured: "Failed to load existing featured data.",
          mansionContent: "Failed to load existing mansion content.",
          mansionReferences: "Failed to load existing mansion references.",
          penthouseContent: "Failed to load existing penthouse content.",
          penthouseReferences: "Failed to load existing penthouse content.",
          collectiblesContent: "Failed to load existing collectibles content.",
          collectiblesReferences:
            "Failed to load existing collectibles references.",
          magazine: "Failed to load existing magazine data.",
          links: "Failed to load existing links data.",
          iconic: "Failed to load existing iconic data.",
          review: "Failed to load existing reviews.",
        }));
      }
    };

    fetchData();
  }, [BASE_URL]);

  // Replace the handleIconicSubmit function with this version
  const handleIconicSubmit = async (e) => {
    e.preventDefault();
    setIsLoading((prev) => ({ ...prev, iconic: true }));
    setMessages((prev) => ({ ...prev, iconic: "" }));

    console.log("Submitting iconic data:", iconicData);
    console.log("Existing images:", {
      home: iconicExistingHomeImage,
      signup: iconicExistingSignupImage,
    });

    const formData = new FormData();

    // Add all fields to FormData with logging
    if (iconicData.title) {
      console.log("Adding title to form:", iconicData.title);
      formData.append("title", iconicData.title);
    }
    if (iconicData.subtitle) {
      console.log("Adding subtitle to form:", iconicData.subtitle);
      formData.append("subtitle", iconicData.subtitle);
    }
    if (iconicData.year) {
      console.log("Adding year to form:", iconicData.year);
      formData.append("year", iconicData.year);
    }
    if (iconicData.btnText) {
      console.log("Adding btnText to form:", iconicData.btnText);
      formData.append("btnText", iconicData.btnText);
    }
    if (iconicData.description) {
      console.log("Adding description to form:", iconicData.description);
      formData.append("description", iconicData.description);
    }
    if (iconicData.photoHome) {
      console.log("Adding photoHome to form");
      formData.append("photoHome", iconicData.photoHome);
    }
    if (iconicData.photoSignup) {
      console.log("Adding photoSignup to form");
      formData.append("photoSignup", iconicData.photoSignup);
    }

    try {
      let response;
      if (iconicData._id) {
        console.log(
          "Updating existing iconic section with ID:",
          iconicData._id
        );
        response = await api.put(
          `${BASE_URL}/api/iconic/${iconicData._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Update response:", response.data);
        setMessages((prev) => ({
          ...prev,
          iconic: "Iconic section updated successfully!",
        }));
      } else {
        console.log("Creating new iconic section");
        response = await api.post(`${BASE_URL}/api/iconic`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Create response:", response.data);
        setMessages((prev) => ({
          ...prev,
          iconic: "Iconic section saved successfully!",
        }));
      }

      // Also update the refresh code in handleIconicSubmit function
      // Replace the refresh section with this:
      const refreshResponse = await api.get(`${BASE_URL}/api/iconic`);
      console.log("Refreshed data:", refreshResponse.data);

      if (refreshResponse.data) {
        // Handle array response
        const refreshedData = Array.isArray(refreshResponse.data)
          ? refreshResponse.data[0]
          : refreshResponse.data;

        setIconicData({
          _id: refreshedData._id || null,
          title: refreshedData.title || "",
          subtitle: refreshedData.subtitle || "",
          year: refreshedData.year || "",
          btnText: refreshedData.btnText || "",
          description: refreshedData.description || "",
          photoHome: null,
          photoSignup: null,
        });

        setIconicExistingHomeImage(refreshedData.photoHome || null);
        setIconicExistingSignupImage(refreshedData.photoSignup || null);
      }

      document
        .querySelectorAll('input[type="file"]')
        .forEach((input) => (input.value = ""));
    } catch (error) {
      console.error("Error saving/updating iconic section:", error);
      console.error("Error details:", error.response?.data);
      setMessages((prev) => ({
        ...prev,
        iconic:
          error.response?.data?.error || "Failed to save/update iconic section",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, iconic: false }));
    }
  };

  const handleIconicChange = (e) => {
    const { name, value, files } = e.target;
    setIconicData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleRemoveIconicHomeImage = async () => {
    if (!iconicData._id) return;

    setIsLoading((prev) => ({ ...prev, iconic: true }));
    setMessages((prev) => ({ ...prev, iconic: "" }));

    try {
      const response = await api.put(
        `${BASE_URL}/api/iconic/${iconicData._id}`,
        { removePhotoHome: true },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setIconicExistingHomeImage(null);
      setIconicData((prev) => ({
        ...prev,
        photoHome: null,
      }));
      setMessages((prev) => ({
        ...prev,
        iconic: "Home image removed successfully!",
      }));
    } catch (error) {
      console.error("Error removing iconic home image:", error);
      setMessages((prev) => ({
        ...prev,
        iconic: error.response?.data?.error || "Failed to remove home image",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, iconic: false }));
    }
  };

  const handleRemoveIconicSignupImage = async () => {
    if (!iconicData._id) return;

    setIsLoading((prev) => ({ ...prev, iconic: true }));
    setMessages((prev) => ({ ...prev, iconic: "" }));

    try {
      const response = await api.put(
        `${BASE_URL}/api/iconic/${iconicData._id}`,
        { removePhotoSignup: true },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setIconicExistingSignupImage(null);
      setIconicData((prev) => ({
        ...prev,
        photoSignup: null,
      }));
      setMessages((prev) => ({
        ...prev,
        iconic: "Signup image removed successfully!",
      }));
    } catch (error) {
      console.error("Error removing iconic signup image:", error);
      setMessages((prev) => ({
        ...prev,
        iconic: error.response?.data?.error || "Failed to remove signup image",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, iconic: false }));
    }
  };

  const handleHeroSubmit = async (e) => {
    e.preventDefault();
    setIsLoading((prev) => ({ ...prev, hero: true }));
    setMessages((prev) => ({ ...prev, hero: "" }));

    if (
      !heroData.heading &&
      !heroData.subheading &&
      !heroData.image &&
      heroExistingImage
    ) {
      setMessages((prev) => ({
        ...prev,
        hero: "At least one field must be updated when an image exists!",
      }));
      setIsLoading((prev) => ({ ...prev, hero: false }));
      return;
    }

    if (!heroData.heading && !heroData.subheading && !heroData.image) {
      setMessages((prev) => ({
        ...prev,
        hero: "At least one field is required!",
      }));
      setIsLoading((prev) => ({ ...prev, hero: false }));
      return;
    }

    const formData = new FormData();
    if (heroData.heading) formData.append("heading", heroData.heading);
    if (heroData.subheading) formData.append("subheading", heroData.subheading);
    if (heroData.image) formData.append("image", heroData.image);

    try {
      let response;
      if (heroData._id) {
        response = await api.put(
          `${BASE_URL}/api/hero/${heroData._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setMessages((prev) => ({
          ...prev,
          hero: "Hero section updated successfully!",
        }));
      } else {
        response = await api.post(`${BASE_URL}/api/hero`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setMessages((prev) => ({
          ...prev,
          hero: "Hero section saved successfully!",
        }));
      }

      setHeroData({
        _id: response.data._id,
        heading: response.data.heading || "",
        subheading: response.data.subheading || "",
        image: null,
      });
      setHeroExistingImage(response.data.image || null);
    } catch (error) {
      console.error("Error saving/updating hero section:", error);
      setMessages((prev) => ({
        ...prev,
        hero:
          error.response?.data?.error || "Failed to save/update hero section",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, hero: false }));
    }
  };

  const handleRemoveHeroImage = async () => {
    if (!heroData._id) return;

    setIsLoading((prev) => ({ ...prev, hero: true }));
    setMessages((prev) => ({ ...prev, hero: "" }));

    try {
      const response = await api.put(
        `${BASE_URL}/api/hero/${heroData._id}`,
        { removeImage: true },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setHeroExistingImage(null);
      setHeroData((prev) => ({
        ...prev,
        image: null,
      }));
      setMessages((prev) => ({
        ...prev,
        hero: "Hero image removed successfully!",
      }));
    } catch (error) {
      console.error("Error removing hero image:", error);
      setMessages((prev) => ({
        ...prev,
        hero: error.response?.data?.error || "Failed to remove hero image",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, hero: false }));
    }
  };

  const handleFeaturedSubmit = async (e) => {
    e.preventDefault();
    setIsLoading((prev) => ({ ...prev, featured: true }));
    setMessages((prev) => ({ ...prev, featured: "" }));

    const references = [
      featuredData.ref1,
      featuredData.ref2,
      featuredData.ref3,
      featuredData.ref4,
    ].filter((ref) => ref);

    if (references.length === 0) {
      setMessages((prev) => ({
        ...prev,
        featured: "At least one reference number is required!",
      }));
      setIsLoading((prev) => ({ ...prev, featured: false }));
      return;
    }

    for (const ref of references) {
      if (!validReferences.includes(ref)) {
        setMessages((prev) => ({
          ...prev,
          featured: `Invalid reference number: ${ref}`,
        }));
        setIsLoading((prev) => ({ ...prev, featured: false }));
        return;
      }
    }

    try {
      let response;
      if (featuredData._id) {
        response = await api.put(
          `${BASE_URL}/api/featured/${featuredData._id}`,
          { references },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessages((prev) => ({
          ...prev,
          featured: "Featured properties updated successfully!",
        }));
      } else {
        response = await api.post(`${BASE_URL}/api/featured`, { references });
        setMessages((prev) => ({
          ...prev,
          featured: "Featured properties saved successfully!",
        }));
      }

      setFeaturedData({
        _id: response.data._id || response.data.data?._id,
        ref1:
          response.data.references?.[0] ||
          response.data.data?.references?.[0] ||
          "",
        ref2:
          response.data.references?.[1] ||
          response.data.data?.references?.[1] ||
          "",
        ref3:
          response.data.references?.[2] ||
          response.data.data?.references?.[2] ||
          "",
        ref4:
          response.data.references?.[3] ||
          response.data.data?.references?.[3] ||
          "",
      });

      const updatedFeaturedPropertiesResponse = await api.get(
        `${BASE_URL}/api/featured`
      );
      setFeaturedProperties(updatedFeaturedPropertiesResponse.data || null);
    } catch (error) {
      console.error("Error saving/updating featured properties:", error);
      setMessages((prev) => ({
        ...prev,
        featured:
          error.response?.data?.error ||
          "Failed to save/update featured properties",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, featured: false }));
    }
  };

  const handleMansionContentSubmit = async (e) => {
    e.preventDefault();
    setIsLoading((prev) => ({ ...prev, mansionContent: true }));
    setMessages((prev) => ({ ...prev, mansionContent: "" }));

    if (!mansionData.description && !mansionData.btntext) {
      setMessages((prev) => ({
        ...prev,
        mansionContent: "At least one content field is required!",
      }));
      setIsLoading((prev) => ({ ...prev, mansionContent: false }));
      return;
    }

    try {
      let response;
      if (mansionData._id) {
        response = await api.put(
          `${BASE_URL}/api/mansion/${mansionData._id}`,
          {
            description: mansionData.description,
            btntext: mansionData.btntext,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessages((prev) => ({
          ...prev,
          mansionContent: "Mansion content updated successfully!",
        }));
      } else {
        response = await api.post(`${BASE_URL}/api/mansion`, {
          description: mansionData.description,
          btntext: mansionData.btntext,
        });
        setMessages((prev) => ({
          ...prev,
          mansionContent: "Mansion content saved successfully!",
        }));
      }

      setMansionData((prev) => ({
        ...prev,
        _id: response.data._id || prev._id,
        description: response.data.description || "",
        btntext: response.data.btntext || "",
      }));
    } catch (error) {
      console.error("Error saving/updating mansion content:", error);
      setMessages((prev) => ({
        ...prev,
        mansionContent:
          error.response?.data?.error ||
          "Failed to save/update mansion content",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, mansionContent: false }));
    }
  };

  const handleMansionReferencesSubmit = async (e) => {
    e.preventDefault();
    setIsLoading((prev) => ({ ...prev, mansionReferences: true }));
    setMessages((prev) => ({ ...prev, mansionReferences: "" }));

    const references = [
      mansionData.ref1,
      mansionData.ref2,
      mansionData.ref3,
      mansionData.ref4,
    ].filter((ref) => ref);

    if (references.length === 0) {
      setMessages((prev) => ({
        ...prev,
        mansionReferences: "At least one reference number is required!",
      }));
      setIsLoading((prev) => ({ ...prev, mansionReferences: false }));
      return;
    }

    for (const ref of references) {
      if (!validReferences.includes(ref)) {
        setMessages((prev) => ({
          ...prev,
          mansionReferences: `Invalid reference number: ${ref}`,
        }));
        setIsLoading((prev) => ({ ...prev, mansionReferences: false }));
        return;
      }
    }

    try {
      let response;
      const mansionFeatured = mansionFeaturedProperties;
      if (mansionFeatured && mansionFeatured._id) {
        response = await api.put(
          `${BASE_URL}/api/mansion/featured/${mansionFeatured._id}`,
          { references },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessages((prev) => ({
          ...prev,
          mansionReferences: "Mansion references updated successfully!",
        }));
      } else {
        response = await api.post(`${BASE_URL}/api/mansion/featured`, {
          references,
        });
        setMessages((prev) => ({
          ...prev,
          mansionReferences: "Mansion references saved successfully!",
        }));
      }

      setMansionData((prev) => ({
        ...prev,
        ref1:
          response.data.references?.[0] ||
          response.data.data?.references?.[0] ||
          "",
        ref2:
          response.data.references?.[1] ||
          response.data.data?.references?.[1] ||
          "",
        ref3:
          response.data.references?.[2] ||
          response.data.data?.references?.[2] ||
          "",
        ref4:
          response.data.references?.[3] ||
          response.data.data?.references?.[3] ||
          "",
      }));

      const updatedMansionFeaturedResponse = await api.get(
        `${BASE_URL}/api/mansion/featured`
      );
      setMansionFeaturedProperties(updatedMansionFeaturedResponse.data || null);
    } catch (error) {
      console.error("Error saving/updating mansion references:", error);
      setMessages((prev) => ({
        ...prev,
        mansionReferences:
          error.response?.data?.error ||
          "Failed to save/update mansion references",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, mansionReferences: false }));
    }
  };

  const handlePenthouseContentSubmit = async (e) => {
    e.preventDefault();
    setIsLoading((prev) => ({ ...prev, penthouseContent: true }));
    setMessages((prev) => ({ ...prev, penthouseContent: "" }));

    if (!penthouseData.description && !penthouseData.btntext) {
      setMessages((prev) => ({
        ...prev,
        penthouseContent: "At least one content field is required!",
      }));
      setIsLoading((prev) => ({ ...prev, penthouseContent: false }));
      return;
    }

    try {
      let response;
      if (penthouseData._id) {
        response = await api.put(
          `${BASE_URL}/api/penthouse/${penthouseData._id}`,
          {
            description: penthouseData.description,
            btntext: penthouseData.btntext,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessages((prev) => ({
          ...prev,
          penthouseContent: "Penthouse content updated successfully!",
        }));
      } else {
        response = await api.post(`${BASE_URL}/api/penthouse`, {
          description: penthouseData.description,
          btntext: penthouseData.btntext,
        });
        setMessages((prev) => ({
          ...prev,
          penthouseContent: "Penthouse content saved successfully!",
        }));
      }

      setPenthouseData((prev) => ({
        ...prev,
        _id: response.data._id || prev._id,
        description: response.data.description || "",
        btntext: response.data.btntext || "",
      }));
    } catch (error) {
      console.error("Error saving/updating penthouse content:", error);
      setMessages((prev) => ({
        ...prev,
        penthouseContent:
          error.response?.data?.error ||
          "Failed to save/update penthouse content",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, penthouseContent: false }));
    }
  };

  const handlePenthouseReferencesSubmit = async (e) => {
    e.preventDefault();
    setIsLoading((prev) => ({ ...prev, penthouseReferences: true }));
    setMessages((prev) => ({ ...prev, penthouseReferences: "" }));

    const references = [
      penthouseData.ref1,
      penthouseData.ref2,
      penthouseData.ref3,
      penthouseData.ref4,
    ].filter((ref) => ref);

    if (references.length === 0) {
      setMessages((prev) => ({
        ...prev,
        penthouseReferences: "At least one reference number is required!",
      }));
      setIsLoading((prev) => ({ ...prev, penthouseReferences: false }));
      return;
    }

    for (const ref of references) {
      if (!validReferences.includes(ref)) {
        setMessages((prev) => ({
          ...prev,
          penthouseReferences: `Invalid reference number: ${ref}`,
        }));
        setIsLoading((prev) => ({ ...prev, penthouseReferences: false }));
        return;
      }
    }

    try {
      let response;
      const penthouseFeatured = penthouseFeaturedProperties;
      if (penthouseFeatured && penthouseFeatured._id) {
        response = await api.put(
          `${BASE_URL}/api/penthouse/featured/${penthouseFeatured._id}`,
          { references },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessages((prev) => ({
          ...prev,
          penthouseReferences: "Penthouse references updated successfully!",
        }));
      } else {
        response = await api.post(`${BASE_URL}/api/penthouse/featured`, {
          references,
        });
        setMessages((prev) => ({
          ...prev,
          penthouseReferences: "Penthouse references saved successfully!",
        }));
      }

      setPenthouseData((prev) => ({
        ...prev,
        ref1:
          response.data.references?.[0] ||
          response.data.data?.references?.[0] ||
          "",
        ref2:
          response.data.references?.[1] ||
          response.data.data?.references?.[1] ||
          "",
        ref3:
          response.data.references?.[2] ||
          response.data.data?.references?.[2] ||
          "",
        ref4:
          response.data.references?.[3] ||
          response.data.data?.references?.[3] ||
          "",
      }));

      const updatedPenthouseFeaturedResponse = await api.get(
        `${BASE_URL}/api/penthouse/featured`
      );
      setPenthouseFeaturedProperties(
        updatedPenthouseFeaturedResponse.data || null
      );
    } catch (error) {
      console.error("Error saving/updating penthouse references:", error);
      setMessages((prev) => ({
        ...prev,
        penthouseReferences:
          error.response?.data?.error ||
          "Failed to save/update penthouse references",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, penthouseReferences: false }));
    }
  };

  const handleCollectiblesContentSubmit = async (e) => {
    e.preventDefault();
    setIsLoading((prev) => ({ ...prev, collectiblesContent: true }));
    setMessages((prev) => ({ ...prev, collectiblesContent: "" }));

    if (!collectiblesData.description && !collectiblesData.btntext) {
      setMessages((prev) => ({
        ...prev,
        collectiblesContent: "At least one content field is required!",
      }));
      setIsLoading((prev) => ({ ...prev, collectiblesContent: false }));
      return;
    }

    try {
      let response;
      if (collectiblesData._id) {
        response = await api.put(
          `${BASE_URL}/api/collectibles/${collectiblesData._id}`,
          {
            description: collectiblesData.description,
            btntext: collectiblesData.btntext,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessages((prev) => ({
          ...prev,
          collectiblesContent: "Collectibles content updated successfully!",
        }));
      } else {
        response = await api.post(`${BASE_URL}/api/collectibles`, {
          description: collectiblesData.description,
          btntext: collectiblesData.btntext,
        });
        setMessages((prev) => ({
          ...prev,
          collectiblesContent: "Collectibles content saved successfully!",
        }));
      }

      setCollectiblesData((prev) => ({
        ...prev,
        _id: response.data._id || prev._id,
        description: response.data.description || "",
        btntext: response.data.btntext || "",
      }));
    } catch (error) {
      console.error("Error saving/updating collectibles content:", error);
      setMessages((prev) => ({
        ...prev,
        collectiblesContent:
          error.response?.data?.error ||
          "Failed to save/update collectibles content",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, collectiblesContent: false }));
    }
  };

  const handleCollectiblesReferencesSubmit = async (e) => {
    e.preventDefault();
    setIsLoading((prev) => ({ ...prev, collectiblesReferences: true }));
    setMessages((prev) => ({ ...prev, collectiblesReferences: "" }));

    const references = [
      collectiblesData.ref1,
      collectiblesData.ref2,
      collectiblesData.ref3,
      collectiblesData.ref4,
    ].filter((ref) => ref);

    if (references.length === 0) {
      setMessages((prev) => ({
        ...prev,
        collectiblesReferences: "At least one reference number is required!",
      }));
      setIsLoading((prev) => ({ ...prev, collectiblesReferences: false }));
      return;
    }

    for (const ref of references) {
      if (!validReferences.includes(ref)) {
        setMessages((prev) => ({
          ...prev,
          collectiblesReferences: `Invalid reference number: ${ref}`,
        }));
        setIsLoading((prev) => ({ ...prev, collectiblesReferences: false }));
        return;
      }
    }

    try {
      let response;
      const collectiblesFeatured = collectiblesFeaturedProperties;
      if (collectiblesFeatured && collectiblesFeatured._id) {
        response = await api.put(
          `${BASE_URL}/api/collectibles/featured/${collectiblesFeatured._id}`,
          { references },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessages((prev) => ({
          ...prev,
          collectiblesReferences:
            "Collectibles references updated successfully!",
        }));
      } else {
        response = await api.post(`${BASE_URL}/api/collectibles/featured`, {
          references,
        });
        setMessages((prev) => ({
          ...prev,
          collectiblesReferences: "Collectibles references saved successfully!",
        }));
      }

      setCollectiblesData((prev) => ({
        ...prev,
        ref1:
          response.data.references?.[0] ||
          response.data.data?.references?.[0] ||
          "",
        ref2:
          response.data.references?.[1] ||
          response.data.data?.references?.[1] ||
          "",
        ref3:
          response.data.references?.[2] ||
          response.data.data?.references?.[2] ||
          "",
        ref4:
          response.data.references?.[3] ||
          response.data.data?.references?.[3] ||
          "",
      }));

      const updatedCollectiblesFeaturedResponse = await api.get(
        `${BASE_URL}/api/collectibles/featured`
      );
      setCollectiblesFeaturedProperties(
        updatedCollectiblesFeaturedResponse.data || null
      );
    } catch (error) {
      console.error("Error saving/updating collectibles references:", error);
      setMessages((prev) => ({
        ...prev,
        collectiblesReferences:
          error.response?.data?.error ||
          "Failed to save/update collectibles references",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, collectiblesReferences: false }));
    }
  };

  const handleMagazineSubmit = async (e) => {
    e.preventDefault();
    setIsLoading((prev) => ({ ...prev, magazine: true }));
    setMessages((prev) => ({ ...prev, magazine: "" }));

    if (!magazineData.link) {
      setMessages((prev) => ({
        ...prev,
        magazine: "Link is required!",
      }));
      setIsLoading((prev) => ({ ...prev, magazine: false }));
      return;
    }

    if (!magazineData.heading && !magazineData.subheading && !magazineData.image && magazineExistingImage) {
      setMessages((prev) => ({
        ...prev,
        magazine: "At least one field (heading, subheading, or image) must be updated when an image exists!",
      }));
      setIsLoading((prev) => ({ ...prev, magazine: false }));
      return;
    }

    if (!magazineData.heading && !magazineData.subheading && !magazineData.image) {
      setMessages((prev) => ({
        ...prev,
        magazine: "At least one field (heading, subheading, or image) is required!",
      }));
      setIsLoading((prev) => ({ ...prev, magazine: false }));
      return;
    }

    const formData = new FormData();
    if (magazineData.heading) formData.append("heading", magazineData.heading);
    if (magazineData.subheading) formData.append("subheading", magazineData.subheading);
    if (magazineData.link) formData.append("link", magazineData.link);
    if (magazineData.image) formData.append("image", magazineData.image);

    try {
      let response;
      if (magazineData._id) {
        response = await api.put(`${BASE_URL}/api/magazine/${magazineData._id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setMessages((prev) => ({
          ...prev,
          magazine: "Magazine section updated successfully!",
        }));
      } else {
        response = await api.post(`${BASE_URL}/api/magazine`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setMessages((prev) => ({
          ...prev,
          magazine: "Magazine section saved successfully!",
        }));
      }

      setMagazineData({
        _id: response.data._id,
        heading: response.data.heading || "",
        subheading: response.data.subheading || "",
        link: response.data.link || "", // Added link field
        image: null,
      });
      setMagazineExistingImage(response.data.image || null);
    } catch (error) {
      console.error("Error saving/updating magazine section:", error);
      setMessages((prev) => ({
        ...prev,
        magazine: error.response?.data?.error || "Failed to save/update magazine section",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, magazine: false }));
    }
  };


  const handleRemoveMagazineImage = async () => {
    if (!magazineData._id) return;

    setIsLoading((prev) => ({ ...prev, magazine: true }));
    setMessages((prev) => ({ ...prev, magazine: "" }));

    try {
      const response = await api.put(
        `${BASE_URL}/api/magazine/${magazineData._id}`,
        { removeImage: true },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMagazineExistingImage(null);
      setMagazineData((prev) => ({
        ...prev,
        image: null,
      }));
      setMessages((prev) => ({
        ...prev,
        magazine: "Magazine image removed successfully!",
      }));
    } catch (error) {
      console.error("Error removing magazine image:", error);
      setMessages((prev) => ({
        ...prev,
        magazine:
          error.response?.data?.error || "Failed to remove magazine image",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, magazine: false }));
    }
  };

 const handleLinksSubmit = async (e) => {
  e.preventDefault();
  setIsLoading((prev) => ({ ...prev, links: true }));
  setMessages((prev) => ({ ...prev, links: "" }));

  const linksPayload = {
    mansionText1: linksData.mansionText1,
    mansionLink1: linksData.mansionLink1,
    mansionText2: linksData.mansionText2,
    mansionLink2: linksData.mansionLink2,
    mansionText3: linksData.mansionText3,
    mansionLink3: linksData.mansionLink3,
    mansionText4: linksData.mansionText4,
    mansionLink4: linksData.mansionLink4,
    penthouseText1: linksData.penthouseText1,
    penthouseLink1: linksData.penthouseLink1,
    penthouseText2: linksData.penthouseText2,
    penthouseLink2: linksData.penthouseLink2,
    penthouseText3: linksData.penthouseText3,
    penthouseLink3: linksData.penthouseLink3,
    penthouseText4: linksData.penthouseText4,
    penthouseLink4: linksData.penthouseLink4,
  };

  const hasAtLeastOneField = Object.values(linksPayload).some(
    (value) => value && value.trim() !== ""
  );

  if (!hasAtLeastOneField) {
    setMessages((prev) => ({
      ...prev,
      links: "At least one field is required!",
    }));
    setIsLoading((prev) => ({ ...prev, links: false }));
    return;
  }

  try {
    let response;
    if (linksData._id) {
      response = await api.put(
        `${BASE_URL}/api/links/${linksData._id}`,
        linksPayload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessages((prev) => ({
        ...prev,
        links: "Links updated successfully!",
      }));
    } else {
      response = await api.post(`${BASE_URL}/api/links`, linksPayload);
      setMessages((prev) => ({
        ...prev,
        links: "Links saved successfully!",
      }));
    }

    const updatedLinksResponse = await api.get(`${BASE_URL}/api/links`);
    if (
      updatedLinksResponse.data &&
      Array.isArray(updatedLinksResponse.data) &&
      updatedLinksResponse.data.length > 0
    ) {
      const mostRecentLinks = updatedLinksResponse.data.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      )[0];
      setLinksData({
        _id: mostRecentLinks._id || null,
        mansionText1: mostRecentLinks.mansionText1 || "",
        mansionLink1: mostRecentLinks.mansionLink1 || "",
        mansionText2: mostRecentLinks.mansionText2 || "",
        mansionLink2: mostRecentLinks.mansionLink2 || "",
        mansionText3: mostRecentLinks.mansionText3 || "",
        mansionLink3: mostRecentLinks.mansionLink3 || "",
        mansionText4: mostRecentLinks.mansionText4 || "",
        mansionLink4: mostRecentLinks.mansionLink4 || "",
        penthouseText1: mostRecentLinks.penthouseText1 || "",
        penthouseLink1: mostRecentLinks.penthouseLink1 || "",
        penthouseText2: mostRecentLinks.penthouseText2 || "",
        penthouseLink2: mostRecentLinks.penthouseLink2 || "",
        penthouseText3: mostRecentLinks.penthouseText3 || "",
        penthouseLink3: mostRecentLinks.penthouseLink3 || "",
        penthouseText4: mostRecentLinks.penthouseText4 || "",
        penthouseLink4: mostRecentLinks.penthouseLink4 || "",
      });
    }
  } catch (error) {
    console.error("Error saving/updating links:", error);
    setMessages((prev) => ({
      ...prev,
      links: error.response?.data?.error || "Failed to save/update links",
    }));
  } finally {
    setIsLoading((prev) => ({ ...prev, links: false }));
  }
};

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsLoading((prev) => ({ ...prev, review: true }));
    setMessages((prev) => ({ ...prev, review: "" }));

    if (
      !reviewData.reviewerName ||
      !reviewData.company ||
      !reviewData.content
    ) {
      setMessages((prev) => ({
        ...prev,
        review: "All fields are required!",
      }));
      setIsLoading((prev) => ({ ...prev, review: false }));
      return;
    }

    const reviewPayload = {
      reviewerName: reviewData.reviewerName,
      company: reviewData.company,
      content: reviewData.content,
      isApproved: reviewData.isApproved,
    };

    try {
      let response;
      if (reviewData._id) {
        response = await api.put(
          `${BASE_URL}/api/reviews/${reviewData._id}`,
          reviewPayload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessages((prev) => ({
          ...prev,
          review: "Review updated successfully!",
        }));
      } else {
        response = await api.post(`${BASE_URL}/api/reviews`, reviewPayload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMessages((prev) => ({
          ...prev,
          review: "Review saved successfully!",
        }));
      }

      const updatedReviews = await api.get(`${BASE_URL}/api/reviews/admin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setReviews(updatedReviews.data);

      setReviewData({
        _id: null,
        reviewerName: "",
        company: "",
        content: "",
        isApproved: false,
      });
    } catch (error) {
      console.error("Error saving/updating review:", error);
      setMessages((prev) => ({
        ...prev,
        review: error.response?.data?.error || "Failed to save/update review",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, review: false }));
    }
  };

  const handleEditReview = (review) => {
    setReviewData({
      _id: review._id,
      reviewerName: review.reviewerName,
      company: review.company,
      content: review.content,
      isApproved: review.isApproved,
    });
  };

  const handleDeleteReview = async (reviewId) => {
    setIsLoading((prev) => ({ ...prev, review: true }));
    setMessages((prev) => ({ ...prev, review: "" }));

    try {
      await api.delete(`${BASE_URL}/api/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const updatedReviews = await api.get(`${BASE_URL}/api/reviews/admin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setReviews(updatedReviews.data);

      setMessages((prev) => ({
        ...prev,
        review: "Review deleted successfully!",
      }));
    } catch (error) {
      console.error("Error deleting review:", error);
      setMessages((prev) => ({
        ...prev,
        review: error.response?.data?.error || "Failed to delete review",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, review: false }));
    }
  };

  const handleCancelEdit = () => {
    setReviewData({
      _id: null,
      reviewerName: "",
      company: "",
      content: "",
      isApproved: false,
    });
    setMessages((prev) => ({ ...prev, review: "" }));
  };

  return (
    <div className="w-full mx-auto p-4 md:p-20 mb-8">
      {/* Hero Section */}
      <div className="bg-white shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Hero Section</h2>
        <form onSubmit={handleHeroSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hero Image
            </label>
            {heroExistingImage && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">Existing Image:</p>
                <div className="relative inline-block">
                  <img
                    src={heroExistingImage || "/placeholder.svg"}
                    alt="Hero"
                    className="w-32 h-32 object-cover rounded"
                    onError={(e) => {
                      console.error(
                        "Failed to load hero image:",
                        heroExistingImage
                      );
                      e.target.src =
                        "https://via.placeholder.com/128?text=Image+Not+Found";
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveHeroImage}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            <input
              type="file"
              name="heroImage"
              accept="image/*"
              onChange={(e) =>
                setHeroData({ ...heroData, image: e.target.files[0] })
              }
              className="w-full p-2 border outline-none mb-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heading
            </label>
            <input
              type="text"
              value={heroData.heading}
              onChange={(e) =>
                setHeroData({ ...heroData, heading: e.target.value })
              }
              className="w-full p-2 border outline-none mb-2"
              placeholder="Enter hero heading"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subheading
            </label>
            <input
              type="text"
              value={heroData.subheading}
              onChange={(e) =>
                setHeroData({ ...heroData, subheading: e.target.value })
              }
              className="w-full p-2 border outline-none mb-2"
              placeholder="Enter hero subheading"
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
              disabled={isLoading.hero}
            >
              {isLoading.hero
                ? "Saving..."
                : heroData._id
                ? "Update"
                : "Submit"}
            </button>
          </div>
        </form>
        {messages.hero && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              messages.hero.includes("success")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {messages.hero}
          </div>
        )}
      </div>

      {/* Featured Listings Section */}
      <div className="bg-white shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Featured Listings Section
        </h2>
        <form onSubmit={handleFeaturedSubmit} className="space-y-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={`featured-ref${index}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference No {index}
              </label>
              <input
                type="text"
                value={featuredData[`ref${index}`]}
                onChange={(e) =>
                  setFeaturedData({
                    ...featuredData,
                    [`ref${index}`]: e.target.value,
                  })
                }
                className="w-full p-2 border outline-none mb-2"
                placeholder={`Enter reference ${index}`}
              />
            </div>
          ))}
          <div className="text-right">
            <button
              type="submit"
              className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
              disabled={isLoading.featured}
            >
              {isLoading.featured
                ? "Saving..."
                : featuredData._id
                ? "Update"
                : "Submit"}
            </button>
          </div>
        </form>
        {messages.featured && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              messages.featured.includes("success")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {messages.featured}
          </div>
        )}
      </div>

      {/* Mansion Section */}
      <div className="bg-white shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Mansion Section
        </h2>
        <form onSubmit={handleMansionContentSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={mansionData.description}
              onChange={(e) =>
                setMansionData({ ...mansionData, description: e.target.value })
              }
              className="w-full p-2 border outline-none mb-2"
              placeholder="Enter mansion description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Text
            </label>
            <input
              type="text"
              value={mansionData.btntext}
              onChange={(e) =>
                setMansionData({ ...mansionData, btntext: e.target.value })
              }
              className="w-full p-2 border outline-none mb-2"
              placeholder="Enter mansion button text"
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
              disabled={isLoading.mansionContent}
            >
              {isLoading.mansionContent
                ? "Saving..."
                : mansionData._id
                ? "Update"
                : "Submit"}
            </button>
          </div>
        </form>
        {messages.mansionContent && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              messages.mansionContent.includes("success")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {messages.mansionContent}
          </div>
        )}
        <form
          onSubmit={handleMansionReferencesSubmit}
          className="space-y-4 mt-6"
        >
          {[1, 2, 3, 4].map((index) => (
            <div key={`mansion-ref${index}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference No {index}
              </label>
              <input
                type="text"
                value={mansionData[`ref${index}`]}
                onChange={(e) =>
                  setMansionData({
                    ...mansionData,
                    [`ref${index}`]: e.target.value,
                  })
                }
                className="w-full p-2 border outline-none mb-2"
                placeholder={`Enter reference ${index}`}
              />
            </div>
          ))}
          <div className="text-right">
            <button
              type="submit"
              className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
              disabled={isLoading.mansionReferences}
            >
              {isLoading.mansionReferences
                ? "Saving..."
                : mansionFeaturedProperties?._id
                ? "Update"
                : "Submit"}
            </button>
          </div>
        </form>
        {messages.mansionReferences && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              messages.mansionReferences.includes("success")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {messages.mansionReferences}
          </div>
        )}
      </div>

      {/* Penthouse Section */}
      <div className="bg-white shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Penthouse Section
        </h2>
        <form onSubmit={handlePenthouseContentSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={penthouseData.description}
              onChange={(e) =>
                setPenthouseData({
                  ...penthouseData,
                  description: e.target.value,
                })
              }
              className="w-full p-2 border outline-none mb-2"
              placeholder="Enter penthouse description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Text
            </label>
            <input
              type="text"
              value={penthouseData.btntext}
              onChange={(e) =>
                setPenthouseData({ ...penthouseData, btntext: e.target.value })
              }
              className="w-full p-2 border outline-none mb-2"
              placeholder="Enter penthouse button text"
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
              disabled={isLoading.penthouseContent}
            >
              {isLoading.penthouseContent
                ? "Saving..."
                : penthouseData._id
                ? "Update"
                : "Submit"}
            </button>
          </div>
        </form>
        {messages.penthouseContent && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              messages.penthouseContent.includes("success")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {messages.penthouseContent}
          </div>
        )}
        <form
          onSubmit={handlePenthouseReferencesSubmit}
          className="space-y-4 mt-6"
        >
          {[1, 2, 3, 4].map((index) => (
            <div key={`penthouse-ref${index}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference No {index}
              </label>
              <input
                type="text"
                value={penthouseData[`ref${index}`]}
                onChange={(e) =>
                  setPenthouseData({
                    ...penthouseData,
                    [`ref${index}`]: e.target.value,
                  })
                }
                className="w-full p-2 border outline-none mb-2"
                placeholder={`Enter reference ${index}`}
              />
            </div>
          ))}
          <div className="text-right">
            <button
              type="submit"
              className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
              disabled={isLoading.penthouseReferences}
            >
              {isLoading.penthouseReferences
                ? "Saving..."
                : penthouseFeaturedProperties?._id
                ? "Update"
                : "Submit"}
            </button>
          </div>
        </form>
        {messages.penthouseReferences && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              messages.penthouseReferences.includes("success")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {messages.penthouseReferences}
          </div>
        )}
      </div>

      {/* Collectibles Section */}
      <div className="bg-white shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Collectibles Section
        </h2>
        <form onSubmit={handleCollectiblesContentSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={collectiblesData.description}
              onChange={(e) =>
                setCollectiblesData({
                  ...collectiblesData,
                  description: e.target.value,
                })
              }
              className="w-full p-2 border outline-none mb-2"
              placeholder="Enter collectibles description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Text
            </label>
            <input
              type="text"
              value={collectiblesData.btntext}
              onChange={(e) =>
                setCollectiblesData({
                  ...collectiblesData,
                  btntext: e.target.value,
                })
              }
              className="w-full p-2 border outline-none mb-2"
              placeholder="Enter collectibles button text"
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
              disabled={isLoading.collectiblesContent}
            >
              {isLoading.collectiblesContent
                ? "Saving..."
                : collectiblesData._id
                ? "Update"
                : "Submit"}
            </button>
          </div>
        </form>
        {messages.collectiblesContent && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              messages.collectiblesContent.includes("success")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {messages.collectiblesContent}
          </div>
        )}
        <form
          onSubmit={handleCollectiblesReferencesSubmit}
          className="space-y-4 mt-6"
        >
          {[1, 2, 3, 4].map((index) => (
            <div key={`collectibles-ref${index}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference No {index}
              </label>
              <input
                type="text"
                value={collectiblesData[`ref${index}`]}
                onChange={(e) =>
                  setCollectiblesData({
                    ...collectiblesData,
                    [`ref${index}`]: e.target.value,
                  })
                }
                className="w-full p-2 border outline-none mb-2"
                placeholder={`Enter reference ${index}`}
              />
            </div>
          ))}
          <div className="text-right">
            <button
              type="submit"
              className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
              disabled={isLoading.collectiblesReferences}
            >
              {isLoading.collectiblesReferences
                ? "Saving..."
                : collectiblesFeaturedProperties?._id
                ? "Update"
                : "Submit"}
            </button>
          </div>
        </form>
        {messages.collectiblesReferences && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              messages.collectiblesReferences.includes("success")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {messages.collectiblesReferences}
          </div>
        )}
      </div>

      {/* Property Links Section */}
      <div className="bg-white shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Property Links Section
        </h2>
        <form onSubmit={handleLinksSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Mansion Links
              </h3>
              {[1, 2, 3, 4].map((index) => (
                <div key={`mansion-${index}`} className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mansion Text {index}
                    </label>
                    <input
                      type="text"
                      value={linksData[`mansionText${index}`]}
                      onChange={(e) =>
                        setLinksData({
                          ...linksData,
                          [`mansionText${index}`]: e.target.value,
                        })
                      }
                      className="w-full p-2 border outline-none mb-2"
                      placeholder={`Enter mansion text ${index}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mansion Link {index}
                    </label>
                    <input
                      type="url"
                      value={linksData[`mansionLink${index}`]}
                      onChange={(e) =>
                        setLinksData({
                          ...linksData,
                          [`mansionLink${index}`]: e.target.value,
                        })
                      }
                      className="w-full p-2 border outline-none mb-2"
                      placeholder={`Enter mansion link ${index}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div>
  <h3 className="text-lg font-semibold mb-4 text-gray-800">
    Penthouse Links
  </h3>
  {[1, 2, 3, 4].map((index) => (
    <div key={`penthouse-${index}`} className="space-y-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Penthouse Text {index}
        </label>
        <input
          type="text"
          value={linksData[`penthouseText${index}`]}
          onChange={(e) =>
            setLinksData({
              ...linksData,
              [`penthouseText${index}`]: e.target.value,
            })
          }
          className="w-full p-2 border outline-none mb-2"
          placeholder={`Enter penthouse text ${index}`}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Penthouse Link {index}
        </label>
        <input
          type="url"
          value={linksData[`penthouseLink${index}`]}
          onChange={(e) =>
            setLinksData({
              ...linksData,
              [`penthouseLink${index}`]: e.target.value,
            })
          }
          className="w-full p-2 border outline-none mb-2"
          placeholder={`Enter penthouse link ${index}`}
        />
      </div>
    </div>
  ))}
</div>
</div>
          <div className="text-right">
            <button
              type="submit"
              className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
              disabled={isLoading.links}
            >
              {isLoading.links
                ? "Saving..."
                : linksData._id
                ? "Update"
                : "Submit"}
            </button>
          </div>
        </form>
        {messages.links && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              messages.links.includes("success")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {messages.links}
          </div>
        )}
      </div>

      {/* Magazine Section */}
      <div className="bg-white shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Magazine Section
        </h2>
        <form onSubmit={handleMagazineSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Magazine Image
            </label>
            {magazineExistingImage && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">Existing Image:</p>
                <div className="relative inline-block">
                  <img
                    src={magazineExistingImage || "/placeholder.svg"}
                    alt="Magazine"
                    className="w-32 h-32 object-cover rounded"
                    onError={(e) => {
                      console.error(
                        "Failed to load magazine image:",
                        magazineExistingImage
                      );
                      e.target.src =
                        "https://via.placeholder.com/128?text=Image+Not+Found";
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveMagazineImage}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            <input
              type="file"
              name="magazineImage"
              accept="image/*"
              onChange={(e) =>
                setMagazineData({ ...magazineData, image: e.target.files[0] })
              }
              className="w-full p-2 border outline-none mb-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Magazine Heading
            </label>
            <input
              type="text"
              value={magazineData.heading}
              onChange={(e) =>
                setMagazineData({ ...magazineData, heading: e.target.value })
              }
              className="w-full p-2 border outline-none mb-2"
              placeholder="Enter magazine heading"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Magazine Subheading
            </label>
            <input
              type="text"
              value={magazineData.subheading}
              onChange={(e) =>
                setMagazineData({ ...magazineData, subheading: e.target.value })
              }
              className="w-full p-2 border outline-none mb-2"
              placeholder="Enter magazine subheading"
            />
          </div>
          <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Magazine Link
      </label>
      <input
        type="url"
        value={magazineData.link}
        onChange={(e) => setMagazineData({ ...magazineData, link: e.target.value })}
        className="w-full p-2 border outline-none mb-2"
        placeholder="Enter magazine link"
        required
      />
    </div>
          <div className="text-right">
            <button
              type="submit"
              className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
              disabled={isLoading.magazine}
            >
              {isLoading.magazine
                ? "Saving..."
                : magazineData._id
                ? "Update"
                : "Submit"}
            </button>
          </div>
        </form>
        {messages.magazine && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              messages.magazine.includes("success")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {messages.magazine}
          </div>
        )}
      </div>

      {/* Iconic Section */}
      <div className="bg-white shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Iconic Section
        </h2>
        <form onSubmit={handleIconicSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={iconicData.title}
                onChange={handleIconicChange}
                className="w-full p-2 border outline-none mb-2"
                placeholder="Enter title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                value={iconicData.subtitle}
                onChange={handleIconicChange}
                className="w-full p-2 border outline-none mb-2"
                placeholder="Enter subtitle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                type="text"
                name="year"
                value={iconicData.year}
                onChange={handleIconicChange}
                className="w-full p-2 border outline-none mb-2"
                placeholder="Enter year"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Text
              </label>
              <input
                type="text"
                name="btnText"
                value={iconicData.btnText}
                onChange={handleIconicChange}
                className="w-full p-2 border outline-none mb-2"
                placeholder="Enter button text"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={iconicData.description}
                onChange={handleIconicChange}
                className="w-full p-2 border outline-none mb-2"
                placeholder="Enter description"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Home Page Photo
              </label>
              {iconicExistingHomeImage && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Existing Image:</p>
                  <div className="relative inline-block">
                    <img
                      src={iconicExistingHomeImage || "/placeholder.svg"}
                      alt="Iconic Home"
                      className="w-32 h-32 object-cover rounded"
                      onError={(e) => {
                        console.error(
                          "Failed to load iconic home image:",
                          iconicExistingHomeImage
                        );
                        e.target.src =
                          "https://via.placeholder.com/128?text=Image+Not+Found";
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveIconicHomeImage}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
              <input
                type="file"
                name="photoHome"
                accept="image/*"
                onChange={handleIconicChange}
                className="w-full p-2 border outline-none mb-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sign Up Page Photo
              </label>
              {iconicExistingSignupImage && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Existing Image:</p>
                  <div className="relative inline-block">
                    <img
                      src={iconicExistingSignupImage || "/placeholder.svg"}
                      alt="Iconic Signup"
                      className="w-32 h-32 object-cover rounded"
                      onError={(e) => {
                        console.error(
                          "Failed to load iconic signup image:",
                          iconicExistingSignupImage
                        );
                        e.target.src =
                          "https://via.placeholder.com/128?text=Image+Not+Found";
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveIconicSignupImage}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
              <input
                type="file"
                name="photoSignup"
                accept="image/*"
                onChange={handleIconicChange}
                className="w-full p-2 border outline-none mb-2"
              />
            </div>
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
              disabled={isLoading.iconic}
            >
              {isLoading.iconic
                ? "Saving..."
                : iconicData._id
                ? "Update"
                : "Submit"}
            </button>
          </div>
        </form>
        {messages.iconic && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              messages.iconic.includes("success")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {messages.iconic}
          </div>
        )}
      </div>

      <div className="bg-white shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Client Reviews Section
        </h2>
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reviewer Name
            </label>
            <input
              type="text"
              value={reviewData.reviewerName}
              onChange={(e) =>
                setReviewData({ ...reviewData, reviewerName: e.target.value })
              }
              className="w-full p-2 border outline-none mb-2"
              placeholder="Enter reviewer name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              value={reviewData.company}
              onChange={(e) =>
                setReviewData({ ...reviewData, company: e.target.value })
              }
              className="w-full p-2 border outline-none mb-2"
              placeholder="Enter company name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Review Content
            </label>
            <textarea
              value={reviewData.content}
              onChange={(e) =>
                setReviewData({ ...reviewData, content: e.target.value })
              }
              className="w-full p-2 border outline-none mb-2"
              placeholder="Enter review content"
              rows="4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Approve Review
            </label>
            <input
              type="checkbox"
              checked={reviewData.isApproved}
              onChange={(e) =>
                setReviewData({ ...reviewData, isApproved: e.target.checked })
              }
              className="h-5 w-5 text-gray-900 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-600">
              Check to approve review for public display
            </span>
          </div>
          <div className="flex space-x-4">
            <div className="flex-1 text-right">
              <button
                type="submit"
                className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
                disabled={isLoading.review}
              >
                {isLoading.review
                  ? "Saving..."
                  : reviewData._id
                  ? "Update"
                  : "Submit"}
              </button>
            </div>
            {reviewData._id && (
              <div className="flex-1 text-right">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
                >
                  Cancel Edit
                </button>
              </div>
            )}
          </div>
        </form>
        {messages.review && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              messages.review.includes("success")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {messages.review}
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Existing Reviews
          </h3>
          {reviews.length === 0 ? (
            <p className="text-gray-600">No reviews available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border text-left text-sm font-medium text-gray-700">
                      Reviewer Name
                    </th>
                    <th className="px-4 py-2 border text-left text-sm font-medium text-gray-700">
                      Company
                    </th>
                    <th className="px-4 py-2 border text-left text-sm font-medium text-gray-700">
                      Content
                    </th>
                    <th className="px-4 py-2 border text-left text-sm font-medium text-gray-700">
                      Approved
                    </th>
                    <th className="px-4 py-2 border text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review._id}>
                      <td className="px-4 py-2 border text-sm text-gray-600">
                        {review.reviewerName}
                      </td>
                      <td className="px-4 py-2 border text-sm text-gray-600">
                        {review.company}
                      </td>
                      <td className="px-4 py-2 border text-sm text-gray-600">
                        {review.content.substring(0, 50)}...
                      </td>
                      <td className="px-4 py-2 border text-sm text-gray-600">
                        {review.isApproved ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-2 border text-sm">
                        <button
                          onClick={() => handleEditReview(review)}
                          className="font-inter px-4 py-1 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="font-inter px-4 py-1 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePageForm;
