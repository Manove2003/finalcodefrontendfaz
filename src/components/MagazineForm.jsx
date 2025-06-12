import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const MagazineForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    author: "",
    category: "",
    title: "",
    subtitle: "",
    mainimage: null,
    bodytext: "",
    time: "",
    page: "Magazine",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stats, setStats] = useState({ words: 0, images: 0, lines: 0 });
  const quillRef = useRef(null);

  const BASE_URL =
    process.env.NODE_ENV === "production"
     ? "https://backendfaz.onrender.com"
      : "http://localhost:5001";

  // Compress image before upload
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const maxWidth = 1024;
          const maxHeight = 1024;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            file.type,
            0.7
          );
        };
      };
    });
  };

  // Fetch existing article data
  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/magazineDetail/${id}`);
          const data = response.data;
          setFormData({
            author: data.author || "",
            category: data.category || "",
            title: data.title || "",
            subtitle: data.subtitle || "",
            mainimage: null,
            bodytext: data.content || "",
            time: data.time ? new Date(data.time).toISOString().slice(0, 16) : "",
            page: data.page || "Magazine",
          });
        } catch (error) {
          console.error("Error fetching article:", error);
          setError("Failed to load article data.");
        }
      };
      fetchArticle();
    }
  }, [id]);

  // Update stats (word count, image count, line count)
  useEffect(() => {
    if (quillRef.current && quillRef.current.getEditor) {
      const quill = quillRef.current.getEditor();
      const updateStats = () => {
        const text = quill.getText().trim();
        const words = text ? text.split(/\s+/).length : 0;
        const images = quill.root.querySelectorAll("img").length;
        const lines = text ? text.split("\n").filter((line) => line.trim()).length : 0;
        setStats({ words, images, lines });
      };

      updateStats();
      quill.on("text-change", updateStats);
      return () => quill.off("text-change", updateStats);
    }
  }, []);

  // Configure Quill image upload for multiple images
  useEffect(() => {
    if (quillRef.current && quillRef.current.getEditor) {
      const quill = quillRef.current.getEditor();
      const toolbar = quill.getModule("toolbar");

      toolbar.addHandler("image", () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.setAttribute("multiple", "true");
        input.click();

        input.onchange = async () => {
          const files = Array.from(input.files);
          if (files.length > 0) {
            try {
              const range = quill.getSelection(true);
              let currentIndex = range.index;

              for (const file of files) {
                const compressedFile = await compressImage(file);
                const uploadData = new FormData();
                uploadData.append("image", compressedFile);

                const response = await axios.post(`${BASE_URL}/api/upload`, uploadData, {
                  headers: { "Content-Type": "multipart/form-data" },
                });

                const imageUrl = response.data.url;
                quill.insertEmbed(currentIndex, "image", imageUrl);
                currentIndex += 1;
              }

              quill.setSelection(currentIndex);
            } catch (error) {
              console.error("Error uploading images:", error);
              setError("Failed to upload one or more images.");
            }
          }
        };
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressedFile = await compressImage(file);
      setFormData((prev) => ({ ...prev, mainimage: compressedFile }));
    }
  };

  const handleQuillChange = (value) => {
    setFormData((prev) => ({ ...prev, bodytext: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.author || !formData.title || !formData.time || !formData.bodytext || !formData.category || !formData.page) {
      setError("Author, Title, Time, Body Text, Category, and Page are required.");
      return;
    }

    const submitData = new FormData();
    submitData.append("author", formData.author);
    submitData.append("title", formData.title);
    submitData.append("subtitle", formData.subtitle);
    submitData.append("time", formData.time);
    submitData.append("content", formData.bodytext);
    submitData.append("category", formData.category);
    submitData.append("page", formData.page);
    if (formData.mainimage) {
      submitData.append("mainImage", formData.mainimage);
    }

    try {
      let response;
      if (id) {
        response = await axios.put(`${BASE_URL}/api/magazineDetail/${id}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Article updated successfully!");
        navigate("/dashboard");
      } else {
        response = await axios.post(`${BASE_URL}/api/magazineDetail`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Article submitted successfully!");
        setFormData({
          author: "",
          category: "",
          title: "",
          subtitle: "",
          mainimage: null,
          bodytext: "",
          time: "",
          page: "Magazine",
        });
        document.querySelector('input[type="file"]').value = "";
      }
    } catch (error) {
      console.error("Error submitting article:", error);
      setError(
        error.response?.data?.message || "Failed to submit article. Please try again."
      );
    }
  };

  return (
    <div className="w-full p-4 md:p-20 mb-8 font-inter">
      <div className="bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {id ? "Edit Article" : "Add New Article"}
        </h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        {success && <div className="mb-4 text-green-500 text-center">{success}</div>}
        <div className="mb-4 text-gray-600">
          Words: {stats.words} | Images: {stats.images} | Lines: {stats.lines}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="w-full">
            <label className="block font-semibold mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border outline-none"
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="THE MANSION GUIDE">THE MANSION GUIDE</option>
              <option value="THE PENTHOUSE GUIDE">THE PENTHOUSE GUIDE</option>
              <option value="THE LIFESTYLE GUIDE">THE LIFESTYLE GUIDE</option>
              <option value="DEVELOPMENTS">DEVELOPMENTS</option>
              <option value="NEWSROOM">NEWSROOM</option>
            </select>
          </div>
          <div className="w-full mt-4">
            <label className="block font-semibold mb-2">Page</label>
            <select
              name="page"
              value={formData.page}
              onChange={handleChange}
              className="w-full p-2 border outline-none"
              required
            >
              <option value="Magazine">Magazine</option>
              <option value="Home">Home</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-4">
            {[
              { label: "Author", name: "author", type: "text" },
              { label: "Title", name: "title", type: "text" },
              { label: "Sub-Title", name: "subtitle", type: "text" },
              { label: "Time", name: "time", type: "datetime-local" },
              { label: "Main Image", name: "mainimage", type: "file" },
            ].map((field) => (
              <div key={field.label} className="w-full">
                <label className="block font-semibold mb-2">{field.label}</label>
                {field.type === "file" ? (
                  <input
                    type="file"
                    name={field.name}
                    onChange={handleImageChange}
                    className="w-full p-2 border outline-none"
                    accept="image/*"
                    required={!id}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full p-2 border outline-none"
                    placeholder={`Enter ${field.label}`}
                    required={field.name !== "subtitle"}
                  />
                )}
              </div>
            ))}
            <div className="w-full md:col-span-2">
              <label className="block font-semibold mb-1">Body Text</label>
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={formData.bodytext}
                onChange={handleQuillChange}
                modules={{
                  toolbar: [
                    ["bold", "italic", "underline"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                  ],
                }}
                formats={["bold", "italic", "underline", "list", "bullet", "link", "image"]}
              />
            </div>
          </div>
          <div className="text-center mt-8">
            <button
              type="submit"
              className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
            >
              {id ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MagazineForm;