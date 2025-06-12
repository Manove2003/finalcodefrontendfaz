import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye, FaSearch, FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assests/TMM_Logo_Non-responsive.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Dashboard = ({ viewType }) => {
  const { api, user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [properties, setProperties] = useState([]);
  const [luxuryCollectibles, setLuxuryCollectibles] = useState([]);
  const [magazineDetails, setMagazineDetails] = useState([]);
  const [developments, setDevelopments] = useState([]);
  const [displayCount, setDisplayCount] = useState(10);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();

  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://backendfaz.onrender.com"
      : "http://localhost:5001";


  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRowClick = (item) => {
    console.log("Selected item:", item);
  };

   const handleDelete = async (id, type, endpoint) => {
  if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

  try {
    setLoading(true);
    
    // Determine the correct endpoint based on type
    let apiEndpoint = endpoint;
    if (["Mansion", "Penthouse", "Luxury Collectible"].includes(type)) {
      apiEndpoint = `/api/propertyDetail`; // Use propertyDetail endpoint for these types
    }

    await api.delete(`${apiEndpoint}/${id}`);
    toast.success(`${type} deleted successfully`);

    if (type === "Inquiry") {
      setInquiries(inquiries.filter((item) => item._id !== id));
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else if (type === "Newsletter") {
      setProperties(properties.filter((item) => item.id !== id));
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else if (type === "Magazine Article") {
      setMagazineDetails(magazineDetails.filter((item) => item.id !== id));
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else if (type === "Luxury Collectible") {
      setLuxuryCollectibles(luxuryCollectibles.filter((item) => item.id !== id));
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else if (["Mansion", "Penthouse"].includes(type)) {
      setProperties(properties.filter((item) => item.id !== id));
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else if (type === "Development") {
      setDevelopments(developments.filter((item) => item._id !== id));
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else if (type === "User") {
      setUsers(users.filter((item) => item._id !== id));
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  } catch (error) {
    console.error(`Error deleting ${type}:`, error);
    toast.error(
      `Failed to delete ${type}: ${error.response?.data?.message || error.message}`
    );
  } finally {
    setLoading(false);
  }
};

  const handleEditClick = (e, id, type) => {
    e.stopPropagation();
    if (type === "Magazine Article") {
      navigate(`/magazineform/${id}`);
    } else if (["Mansion", "Penthouse", "Luxury Collectible"].includes(type)) {
      navigate(`/mansionform/${id}`);
    } else if (type === "Development") {
      navigate(`/newdevelopmentform/${id}`);
    } else if (type === "User") {
      navigate(`/userform/${id}`);
    }
  };

  const handleAddClick = (type) => {
    console.log(`Add new ${type}`);
    if (type === "development") {
      navigate("/newdevelopmentform");
    } else if (type === "user") {
      navigate("/userform");
    }
  };

  const toggleCheckboxes = () => {
    setShowCheckboxes(!showCheckboxes);
    setSelectedRows([]);
  };

  const handleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (data) => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((item) => item._id || item.id));
    }
  };

  const exportToExcel = (data, filename, headers) => {
    const dataToExport = showCheckboxes
      ? data.filter((item) => selectedRows.includes(item._id || item.id))
      : data;

    if (dataToExport.length === 0) {
      toast.error("No rows selected for export");
      return;
    }

    const formattedData = dataToExport.map((item) =>
      headers.reduce(
        (obj, header) => ({
          ...obj,
          [header.label]:
            header.formatter && item[header.key]
              ? header.formatter(item[header.key])
              : item[header.key] || "N/A",
        }),
        {}
      )
    );

    const worksheet = XLSX.utils.json_to_sheet(formattedData, {
      header: headers.map((h) => h.label),
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, `${filename}.xlsx`);
  };

  const handleLoadMore = () => {
    setDisplayCount((prevCount) => prevCount + 10);
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate =
      !selectedDate ||
      new Date(inquiry.createdAt).toDateString() === selectedDate.toDateString();
    return matchesSearch && matchesDate;
  });

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      viewType === "property"
        ? property.email?.toLowerCase().includes(searchTerm.toLowerCase())
        : property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || property.category === filterCategory;
    const matchesDate =
      !selectedDate ||
      new Date(property.createdAt || property.createdTime).toDateString() ===
        selectedDate.toDateString();
    return matchesSearch && (viewType === "property" ? matchesCategory && matchesDate : matchesDate);
  });

  const filteredLuxuryCollectibles = luxuryCollectibles.filter((collectible) => {
    const matchesSearch =
      collectible.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collectible.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate =
      !selectedDate ||
      new Date(collectible.createdAt).toDateString() === selectedDate.toDateString();
    return matchesSearch && matchesDate;
  });

  const filteredMagazineDetails = magazineDetails.filter((magazine) => {
    const matchesSearch =
      magazine.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      magazine.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate =
      !selectedDate ||
      new Date(magazine.time).toDateString() === selectedDate.toDateString();
    return matchesSearch && matchesDate;
  });

  const filteredDevelopments = developments.filter((development) => {
    const matchesSearch =
      development.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      development.link?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate =
      !selectedDate ||
      new Date(development.createdAt).toDateString() === selectedDate.toDateString();
    return matchesSearch && matchesDate;
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        setError(null);
        const endpoint = user?.role === "admin" ? "/api/admin/inquiries" : "/api/inquiries";
        const response = await api.get(endpoint);
        setInquiries(response.data);
      } catch (error) {
        console.error("Error fetching inquiries:", error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (viewType === "leads") {
      fetchInquiries();
    }
  }, [viewType, api, user?.role]);

  useEffect(() => {
    const fetchNewsletter = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/api/newsletter");
        const transformedData = response.data.map((item) => ({
          id: item._id,
          email: item.email || "N/A",
          category: item.category || "Unknown",
          createdTime: item.createdAt || new Date().toISOString(),
        }));
        setProperties(transformedData);
      } catch (error) {
        console.error("Error fetching newsletter:", error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (viewType === "property") {
      fetchNewsletter();
    }
  }, [viewType, api]);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/api/properties");
        const data = response.data;

        const transformedData = data
          .filter((item) => {
            if (viewType === "mansions") return item.propertytype === "Mansion";
            if (viewType === "penthouses") return item.propertytype === "Penthouse";
            return false;
          })
          .map((item) => ({
            id: item._id,
            reference: item.reference || "N/A",
            title: item.title || "N/A",
            email: item.email || "N/A",
            category: item.propertytype || "Unknown",
            location: item.propertyaddress || item.community || "N/A",
            price: item.price || "N/A",
            createdAt: item.createdAt || new Date().toISOString(),
          }));

        setProperties(transformedData);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (["mansions", "penthouses"].includes(viewType)) {
      fetchProperties();
    }
  }, [viewType, api]);

  useEffect(() => {
    const fetchLuxuryCollectibles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/api/properties");
        const data = response.data;

        const transformedData = data
          .filter((item) => item.propertytype === "Luxury Collectibles")
          .map((item) => ({
            id: item._id,
            reference: item.reference || "N/A",
            title: item.title || "N/A",
            location: item.propertyaddress || "N/A",
            price: item.price || "N/A",
            createdAt: item.createdAt || new Date().toISOString(),
          }));
        setLuxuryCollectibles(transformedData);
      } catch (error) {
        console.error("Error fetching luxury collectibles:", error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (viewType === "luxurycollectibles") {
      fetchLuxuryCollectibles();
    }
  }, [viewType, api]);

  useEffect(() => {
    const fetchMagazineDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/api/magazineDetails");
        const transformedData = response.data.map((item) => ({
          id: item._id,
          author: item.author || "N/A",
          title: item.title || "N/A",
          subtitle: item.subtitle || "N/A",
          time: item.time || item.createdAt || new Date().toISOString(),
          mainImage: item.mainImage || null,
          content: item.content || "N/A",
        }));
        setMagazineDetails(transformedData);
      } catch (error) {
        console.error("Error fetching magazine details:", error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (viewType === "magazine") {
      fetchMagazineDetails();
    }
  }, [viewType, api]);

  useEffect(() => {
    const fetchDevelopments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/api/developments");
        setDevelopments(response.data);
      } catch (error) {
        console.error("Error fetching developments:", error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (viewType === "newDevelopments") {
      fetchDevelopments();
    }
  }, [viewType, api]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/api/dashboard/superadmin");
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (viewType === "userdata") {
      fetchUsers();
    }
  }, [viewType, api]);

  const renderHeader = (title, breadcrumb) => (
    <div className="mb-4 sm:mb-6">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold">{title}</h1>
      <div className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
        Dashboard <span className="text-blue-600">/ {breadcrumb}</span>
      </div>
    </div>
  );

  const renderSearchBar = (placeholder, showAddButton = false, addType = "") => {
    const formRoutes = {
      user: "/userform",
      mansion: "/mansionform",
      penthouse: "/mansionform",
      "luxury collectible": "/mansionform",
      "magazine article": "/magazineform",
      development: "/newdevelopmentform",
    };
    const formRoute = formRoutes[addType.toLowerCase()] || "/";

    return (
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center mb-4 sm:mb-6 w-full md:w-96">
        <div className="flex items-center gap-2 w-full">
          {showAddButton && (
            <Link to={formRoute}>
              <button
                className="bg-white text-[#00603A] p-2 sm:p-3 hover:bg-gray-200"
                title={`Add New ${addType.charAt(0).toUpperCase() + addType.slice(1)}`}
              >
                <FaPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </Link>
          )}
          <input
            type="text"
            placeholder={placeholder}
            className="flex-1 px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-700 focus:outline-none border border-gray-300 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-[#00603A] p-2 sm:p-3 text-white hover:text-[#00603A] border border-[#00603A] hover:bg-transparent transition">
            <FaSearch className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    );
  };

  const renderTableHeader = (headers, data) => (
    <thead>
      <tr className="bg-[#BAD4CA]">
        {showCheckboxes && (
          <th className="py-2 px-2 sm:px-4 border">
            <input
              type="checkbox"
              checked={selectedRows.length === data.length && data.length > 0}
              onChange={() => handleSelectAll(data)}
            />
          </th>
        )}
        {headers.map((header, index) => (
          <th key={index} className="py-2 px-2 sm:px-4 border">
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );

  return (
    <div className="flex-1 bg-[#F9F9F8] p-4 sm:p-6 md:p-8 lg:p-10 w-full min-h-screen">
      <ToastContainer />
      <div className="flex justify-center sm:justify-end mb-4 sm:mb-6">
        <img
          src={logo}
          className="w-[300px] sm:w-[200px] md:w-[300px] lg:w-[400px] mb-10"
          alt="logo"
        />
      </div>
      {viewType === "userdata" ? (
        <div className="font-inter w-full">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {renderHeader("All User Detail", "Users")}
            {renderSearchBar("Search by Email, First Name, or Last Name", true, "user")}
          </div>
          <div className="bg-[#00603A] text-white py-2 px-4 flex justify-between items-center">
            <h2 className="text-sm sm:text-base md:text-lg font-inter">Users</h2>
            <div className="flex gap-2">
              <button
                className="bg-white text-[#00603A] px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm hover:bg-gray-200"
                onClick={toggleCheckboxes}
              >
                {showCheckboxes ? "Hide Selection" : "Select Data"}
              </button>
              <button
                className="bg-white text-[#00603A] px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm hover:bg-gray-200"
                onClick={() =>
                  exportToExcel(filteredUsers, "users", [
                    { label: "Sno", key: "_id" },
                    { label: "First Name", key: "firstName" },
                    { label: "Last Name", key: "lastName" },
                    { label: "Email", key: "email" },
                    { label: "Role", key: "role" },
                  ])
                }
              >
                Export
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-xs sm:text-sm font-inter">
              {renderTableHeader(
                ["Sno", "First Name", "Last Name", "Email", "Password", "Role", "Actions"],
                filteredUsers
              )}
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={showCheckboxes ? 8 : 7} className="py-2 px-2 sm:px-4 border text-center">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={showCheckboxes ? 8 : 7}
                      className="py-2 px-2 sm:px-4 border text-center text-red-600"
                    >
                      Error: {error}
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={showCheckboxes ? 8 : 7} className="py-2 px-2 sm:px-4 border text-center">
                      No users match your search
                    </td>
                  </tr>
                ) : (
                  filteredUsers.slice(0, displayCount).map((user, index) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-100"
                      onClick={() => handleRowClick(user)}
                    >
                      {showCheckboxes && (
                        <td className="py-2 px-2 sm:px-4 border">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(user._id)}
                            onChange={() => handleRowSelection(user._id)}
                          />
                        </td>
                      )}
                      <td className="py-2 px-2 sm:px-4 border text-center">{index + 1}</td>
                      <td className="py-2 px-2 sm:px-4 border">{user.firstName}</td>
                      <td className="py-2 px-2 sm:px-4 border">{user.lastName}</td>
                      <td className="py-2 px-2 sm:px-4 border text-center">{user.email}</td>
                      <td className="py-2 px-2 sm:px-4 border">********</td>
                      <td className="py-2 px-2 sm:px-4 border">{user.role}</td>
                      <td className="py-2 px-2 sm:px-4 border">
                        <div className="flex gap-2 justify-center">
                          <FaEdit
                            className="text-green-600 cursor-pointer"
                            onClick={(e) => handleEditClick(e, user._id, "User")}
                          />
                          <FaTrash
                            className="text-red-600 cursor-pointer"
                            onClick={() =>
                              handleDelete(user._id, "User", "/api/users")
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredUsers.length > displayCount && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleLoadMore}
                className="bg-[#00603A] text-white px-4 py-2 text-sm sm:text-base hover:bg-[#004d2e] transition"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      ) : viewType === "leads" ? (
        <div className="font-inter w-full">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {renderHeader("All Leads", "Leads")}
            {renderSearchBar("Search by Email, Name, or Reference")}
          </div>
          <div className="bg-[#00603A] text-white py-2 px-4 flex justify-between items-center">
            <h2 className="text-sm sm:text-base md:text-lg font-inter">Leads</h2>
            <div className="flex gap-2">
              <button
                className="bg-white text-[#00603A] px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm hover:bg-gray-200"
                onClick={toggleCheckboxes}
              >
                {showCheckboxes ? "Hide Selection" : "Select Data"}
              </button>
              <button
                className="bg-white text-[#00603A] px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm hover:bg-gray-200"
                onClick={() =>
                  exportToExcel(filteredInquiries, "leads", [
                    { label: "Reference no", key: "reference" },
                    { label: "First Name", key: "firstName" },
                    { label: "Last Name", key: "lastName" },
                    { label: "Email", key: "email" },
                    { label: "Phone", key: "phone" },
                    { label: "Created Time", key: "createdAt", formatter: formatDate },
                    { label: "Message", key: "message" },
                  ])
                }
              >
                Export
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-xs sm:text-sm font-inter">
              {renderTableHeader(
                [
                  "Reference no",
                  "First Name",
                  "Last Name",
                  "Email",
                  "Phone",
                  "Created Time",
                  "Message",
                  "Actions",
                ],
                filteredInquiries
              )}
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={showCheckboxes ? 9 : 8} className="py-2 px-2 sm:px-4 border text-center">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={showCheckboxes ? 9 : 8}
                      className="py-2 px-2 sm:px-4 border text-center text-red-600"
                    >
                      Error: {error}
                    </td>
                  </tr>
                ) : filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan={showCheckboxes ? 9 : 8} className="py-2 px-2 sm:px-4 border text-center">
                      No leads match your search
                    </td>
                  </tr>
                ) : (
                  filteredInquiries.slice(0, displayCount).map((inquiry) => (
                    <tr
                      key={inquiry._id}
                      className="hover:bg-gray-100"
                      onClick={() => handleRowClick(inquiry)}
                    >
                      {showCheckboxes && (
                        <td className="py-2 px-2 sm:px-4 border">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(inquiry._id)}
                            onChange={() => handleRowSelection(inquiry._id)}
                          />
                        </td>
                      )}
                      <td className="py-2 px-2 sm:px-4 border text-center">
                        {inquiry.propertyRef || "N/A"}
                      </td>
                      <td className="py-2 px-2 sm:px-4 border">{inquiry.firstName || "NEW"}</td>
                      <td className="py-2 px-2 sm:px-4 border">{inquiry.lastName || "N/A"}</td>
                      <td className="py-2 px-2 sm:px-4 border text-center">{inquiry.email || "N/A"}</td>
                      <td className="py-2 px-2 sm:px-4 border">{inquiry.phone || "N/A"}</td>
                      <td className="py-2 px-2 sm:px-4 border">{formatDate(inquiry.createdAt)}</td>
                      <td className="py-2 px-2 sm:px-4 border">
                        <div className="max-w-[150px] sm:max-w-[200px] truncate" title={inquiry.message}>
                          {inquiry.message || "N/A"}
                        </div>
                      </td>
                      <td className="py-2 px-2 sm:px-4 border">
                        <div className="flex gap-2 justify-center">
                          <FaTrash
                            className="text-red-600 cursor-pointer"
                            onClick={() =>
                              handleDelete(inquiry._id, "Inquiry", "/api/inquiries")
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredInquiries.length > displayCount && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleLoadMore}
                className="bg-[#00603A] text-white px-4 py-2 text-sm sm:text-base hover:bg-[#004d2e] transition"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      ) : viewType === "property" ? (
        <div className="font-inter w-full">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {renderHeader("Newsletter", "Newsletter")}
            {renderSearchBar("Search By Email")}
          </div>
          <div className="bg-[#00603A] text-white py-2 px-4 flex justify-between items-center">
            <h2 className="text-sm sm:text-base md:text-lg font-inter">Newsletter List</h2>
            <div className="flex gap-2">
              <button
                className="bg-white text-[#00603A] px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm hover:bg-gray-200"
                onClick={toggleCheckboxes}
              >
                {showCheckboxes ? "Hide Selection" : "Select Data"}
              </button>
              <button
                className="bg-white text-[#00603A] px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm hover:bg-gray-200"
                onClick={() =>
                  exportToExcel(filteredProperties, "newsletter", [
                    { label: "S.No", key: "id" },
                    { label: "Email", key: "email" },
                    { label: "Category", key: "category" },
                    { label: "Created Time", key: "createdTime", formatter: formatDate },
                  ])
                }
              >
                Export
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border font-inter text-xs sm:text-sm">
              {renderTableHeader(
                ["S.NO", "Email", "Category", "Created Time", "Actions"],
                filteredProperties
              )}
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={showCheckboxes ? 6 : 5} className="py-2 px-2 sm:px-4 border text-center">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={showCheckboxes ? 6 : 5}
                      className="py-2 px-2 sm:px-4 border text-center text-red-600"
                    >
                      Error: {error}
                    </td>
                  </tr>
                ) : filteredProperties.length === 0 ? (
                  <tr>
                    <td colSpan={showCheckboxes ? 6 : 5} className="py-2 px-2 sm:px-4 border text-center">
                      No data available
                    </td>
                  </tr>
                ) : (
                  filteredProperties.slice(0, displayCount).map((property, index) => (
                    <tr
                      key={property.id}
                      className={`hover:bg-gray-100 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                      onClick={() => handleRowClick(property)}
                    >
                      {showCheckboxes && (
                        <td className="py-2 px-2 sm:px-4 border">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(property.id)}
                            onChange={() => handleRowSelection(property.id)}
                          />
                        </td>
                      )}
                      <td className="py-2 px-2 sm:px-4 border">{index + 1}</td>
                      <td className="py-2 px-2 sm:px-4 border">{property.email}</td>
                      <td className="py-2 px-2 sm:px-4 border">{property.category}</td>
                      <td className="py-2 px-2 sm:px-4 border">{formatDate(property.createdTime)}</td>
                      <td className="py-2 px-2 sm:px-4 border">
                        <div className="flex gap-2 justify-center">
                          <FaTrash
                            className="text-red-600 cursor-pointer"
                            onClick={() =>
                              handleDelete(property.id, "Newsletter", "/api/newsletter")
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredProperties.length > displayCount && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleLoadMore}
                className="bg-[#00603A] text-white px-4 py-2 text-sm sm:text-base hover:bg-[#004d2e] transition"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      ) : viewType === "mansions" ? (
        <div className="font-inter w-full">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {renderHeader("Mansion Listings", "Mansions")}
            {renderSearchBar("Search by Title or Reference", true, "mansion")}
          </div>
          <div className="bg-[#00603A] text-white py-2 px-4 flex justify-between items-center">
            <h2 className="text-sm sm:text-base md:text-lg font-inter">Mansion Listings</h2>
            <div className="flex gap-2">
              <button
                className="bg-white text-[#00603A] px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm hover:bg-gray-200"
                onClick={toggleCheckboxes}
              >
                {showCheckboxes ? "Hide Selection" : "Select Data"}
              </button>
              <button
                className="bg-white text-[#00603A] px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm hover:bg-gray-200"
                onClick={() =>
                  exportToExcel(filteredProperties, "mansions", [
                    { label: "Ref no.", key: "reference" },
                    { label: "Title", key: "title" },
                    { label: "Location", key: "location" },
                    { label: "Price", key: "price" },
                    { label: "Created Time", key: "createdAt", formatter: formatDate },
                  ])
                }
              >
                Export
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border font-inter text-xs sm:text-sm">
              {renderTableHeader(
                ["Ref no.", "Title", "Location", "Price", "Created Time", "Actions"],
                filteredProperties
              )}
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={showCheckboxes ? 7 : 6} className="py-2 px-2 sm:px-4 border text-center">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={showCheckboxes ? 7 : 6}
                      className="py-2 px-2 sm:px-4 border text-center text-red-600"
                    >
                      Error: {error}
                    </td>
                  </tr>
                ) : filteredProperties.length === 0 ? (
                  <tr>
                    <td colSpan={showCheckboxes ? 7 : 6} className="py-2 px-2 sm:px-4 border text-center">
                      No mansion listings available
                    </td>
                  </tr>
                ) : (
                  filteredProperties.slice(0, displayCount).map((property, index) => (
                    <tr
                      key={property.id}
                      className={`hover:bg-gray-100 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                      onClick={() => handleRowClick(property)}
                    >
                      {showCheckboxes && (
                        <td className="py-2 px-2 sm:px-4 border">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(property.id)}
                            onChange={() => handleRowSelection(property.id)}
                          />
                        </td>
                      )}
                      <td className="py-2 px-2 sm:px-4 border">{property.reference}</td>
                      <td className="py-2 px-2 sm:px-4 border">{property.title}</td>
                      <td className="py-2 px-2 sm:px-4 border">{property.location}</td>
                      <td className="py-2 px-2 sm:px-4 border">{property.price}</td>
                      <td className="py-2 px-2 sm:px-4 border">{formatDate(property.createdAt)}</td>
                      <td className="py-2 px-2 sm:px-4 border">
                        <div className="flex gap-2 justify-center">
                          <FaEdit
                            className="text-green-600 cursor-pointer"
                            onClick={(e) => handleEditClick(e, property.id, "Mansion")}
                          />
                          <FaTrash
                            className="text-red-600 cursor-pointer"
                            onClick={() =>
                              handleDelete(property.id, "Mansion", "/api/properties")
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredProperties.length > displayCount && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleLoadMore}
                className="bg-[#00603A] text-white px-4 py-2 text-sm sm:text-base hover:bg-[#004d2e] transition"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      ) : viewType === "penthouses" ? (
        <div className="font-inter w-full">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {renderHeader("Penthouse Listings", "Penthouses")}
            {renderSearchBar("Search by Title or Reference", true, "penthouse")}
          </div>
          <div className="bg-[#00603A] text-white py-2 px-4 flex justify-between items-center">
            <h2 className="text-sm sm:text-base md:text-lg font-inter">Penthouse Listings</h2>
            <div className="flex gap-2">
              <button
                className="bg-white text-[#00603A] px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm hover:bg-gray-200"
                onClick={toggleCheckboxes}
              >
                {showCheckboxes ? "Hide Selection" : "Select Data"}
              </button>
              <button
                className="bg-white text-[#00603A] px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm hover:bg-gray-200"
                onClick={() =>
                  exportToExcel(filteredProperties, "penthouses", [
                    { label: "Ref no.", key: "reference" },
                    { label: "Title", key: "title" },
                    { label: "Location", key: "location" },
                    { label: "Price", key: "price" },
                    { label: "Created Time", key: "createdAt", formatter: formatDate },
                  ])
                }
              >
                Export
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border font-inter text-xs sm:text-sm">
              {renderTableHeader(
                ["Ref no.", "Title", "Location", "Price", "Created Time", "Actions"],
                filteredProperties
              )}
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={showCheckboxes ? 7 : 6} className="py-2 px-2 sm:px-4 border text-center">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={showCheckboxes ? 7 : 6}
                      className="py-2 px-2 sm:px-4 border text-center text-red-600"
                    >
                      Error: {error}
                    </td>
                  </tr>
                ) : filteredProperties.length === 0 ? (
                  <tr>
                    <td colSpan={showCheckboxes ? 7 : 6} className="py-2 px-2 sm:px-4 border text-center">
                      No penthouse listings available
                    </td>
                  </tr>
                ) : (
                  filteredProperties.slice(0, displayCount).map((property, index) => (
                    <tr
                      key={property.id}
                      className={`hover:bg-gray-100 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                      onClick={() => handleRowClick(property)}
                    >
                      {showCheckboxes && (
                        <td className="py-2 px-2 sm:px-4 border">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(property.id)}
                            onChange={() => handleRowSelection(property.id)}
                          />
                        </td>
                      )}
                      <td className="py-2 px-2 sm:px-4 border">{property.reference}</td>
                      <td className="py-2 px-2 sm:px-4 border">{property.title}</td>
                      <td className="py-2 px-2 sm:px-4 border">{property.location}</td>
                      <td className="py-2 px-2 sm:px-4 border">{property.price}</td>
                      <td className="py-2 px-2 sm:px-4 border">{formatDate(property.createdAt)}</td>
                      <td className="py-2 px-2 sm:px-4 border">
                        <div className="flex gap-2 justify-center">
                          <FaEdit
                            className="text-green-600 cursor-pointer"
                            onClick={(e) => handleEditClick(e, property.id, "Penthouse")}
                          />
                          <FaTrash
                            className="text-red-600 cursor-pointer"
                            onClick={() =>
                              handleDelete(property.id, "Penthouse", "/api/properties")
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredProperties.length > displayCount && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleLoadMore}
                className="bg-[#00603A] text-white px-4 py-2 text-sm sm:text-base hover:bg-[#004d2e] transition"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      ) : viewType === "luxurycollectibles" ? (
        <div className="font-inter w-full">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {renderHeader("Luxury Collectibles Listings", "Luxury Collectibles")}
            {renderSearchBar("Search by Title or Reference", true, "luxury collectible")}
          </div>
          <div className="bg-[#00603A] text-white py-2 px-4 flex justify-between items-center">
            <h2 className="text-sm sm:text-base md:text-lg font-inter">Luxury Collectibles Listings</h2>
            <div className="flex gap-2">
              <button
                className="bg-white text-[#00603A] px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm hover:bg-gray-200"
                onClick={toggleCheckboxes}
              >
                {showCheckboxes ? "Hide Selection" : "Select Data"}
              </button>
              <button
                className="bg-white text-[#00603A] px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm hover:bg-gray-200"
                onClick={() =>
                  exportToExcel(filteredLuxuryCollectibles, "luxury_collectibles", [
                    { label: "Ref no.", key: "reference" },
                    { label: "Title", key: "title" },
                    { label: "Location", key: "location" },
                    { label: "Price", key: "price" },
                    { label: "Created Time", key: "createdAt", formatter: formatDate },
                  ])
                }
              >
                Export
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border font-inter text-xs sm:text-sm">
              {renderTableHeader(
                ["Ref no.", "Title", "Location", "Price", "Created Time", "Actions"],
                filteredLuxuryCollectibles
              )}
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={showCheckboxes ? 7 : 6} className="py-2 px-2 sm:px-4 border text-center">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={showCheckboxes ? 7 : 6}
                      className="py-2 px-2 sm:px-4 border text-center text-red-600"
                    >
                      Error: {error}
                    </td>
                  </tr>
                ) : filteredLuxuryCollectibles.length === 0 ? (
                  <tr>
                    <td colSpan={showCheckboxes ? 7 : 6} className="py-2 px-2 sm:px-4 border text-center">
                      No luxury collectibles available
                    </td>
                  </tr>
                ) : (
                  filteredLuxuryCollectibles.slice(0, displayCount).map((collectible, index) => (
                    <tr
                      key={collectible.id}
                      className={`hover:bg-gray-100 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                      onClick={() => handleRowClick(collectible)}
                    >
                      {showCheckboxes && (
                        <td className="py-2 px-2 sm:px-4 border">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(collectible.id)}
                            onChange={() => handleRowSelection(collectible.id)}
                          />
                        </td>
                      )}
                      <td className="py-2 px-2 sm:px-4 border">{collectible.reference}</td>
                      <td className="py-2 px-2 sm:px-4 border">{collectible.title}</td>
                      <td className="py-2 px-2 sm:px-4 border">{collectible.location}</td>
                      <td className="py-2 px-2 sm:px-4 border">{collectible.price}</td>
                      <td className="py-2 px-2 sm:px-4 border">{formatDate(collectible.createdAt)}</td>
                      <td className="py-2 px-2 sm:px-4 border">
                        <div className="flex gap-2 justify-center">
                          <FaEdit
                            className="text-green-600 cursor-pointer"
                            onClick={(e) =>
                              handleEditClick(e, collectible.id, "Luxury Collectible")
                            }
                          />
                          <FaTrash
                            className="text-red-600 cursor-pointer"
                            onClick={() =>
                              handleDelete(collectible.id, "Luxury Collectible", "/api/properties")
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredLuxuryCollectibles.length > displayCount && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleLoadMore}
                className="bg-[#00603A] text-white px-4 py-2 text-sm sm:text-base hover:bg-[#004d2e] transition"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      ) : viewType === "magazine" ? (
        <div className="font-inter w-full">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {renderHeader("Magazine Articles", "Magazine")}
            {renderSearchBar("Search by Title or Author", true, "magazine article")}
          </div>
          <div className="bg-[#00603A] text-white py-2 px-4 flex justify-between items-center">
            <h2 className="text-sm sm:text-base md:text-lg font-inter">Magazine Articles</h2>
            <div className="flex gap-2">
              <button
                className="bg-white text-[#00603A] px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm hover:bg-gray-200"
                onClick={toggleCheckboxes}
              >
                {showCheckboxes ? "Hide Selection" : "Select Data"}
              </button>
              <button
                className="bg-white text-[#00603A] px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm hover:bg-gray-200"
                onClick={() =>
                  exportToExcel(filteredMagazineDetails, "magazine_articles", [
                    { label: "S.No", key: "id" },
                    { label: "Title", key: "title" },
                    { label: "Author", key: "author" },
                    { label: "Subtitle", key: "subtitle" },
                    { label: "Published Time", key: "time", formatter: formatDate },
                  ])
                }
              >
                Export
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border font-inter text-xs sm:text-sm">
              {renderTableHeader(
                ["S.NO", "Title", "Author", "Subtitle", "Published Time", "Actions"],
                filteredMagazineDetails
              )}
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={showCheckboxes ? 7 : 6} className="py-2 px-2 sm:px-4 border text-center">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={showCheckboxes ? 7 : 6}
                      className="py-2 px-2 sm:px-4 border text-center text-red-600"
                    >
                      Error: {error}
                    </td>
                  </tr>
                ) : filteredMagazineDetails.length === 0 ? (
                  <tr>
                    <td colSpan={showCheckboxes ? 7 : 6} className="py-2 px-2 sm:px-4 border text-center">
                      No magazine articles available
                    </td>
                  </tr>
                ) : (
                  filteredMagazineDetails.slice(0, displayCount).map((magazine, index) => (
                    <tr
                      key={magazine.id}
                      className={`hover:bg-gray-100 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                      onClick={() => handleRowClick(magazine)}
                    >
                      {showCheckboxes && (
                        <td className="py-2 px-2 sm:px-4 border">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(magazine.id)}
                            onChange={() => handleRowSelection(magazine.id)}
                          />
                        </td>
                      )}
                      <td className="py-2 px-2 sm:px-4 border">{index + 1}</td>
                      <td className="py-2 px-2 sm:px-4 border">{magazine.title}</td>
                      <td className="py-2 px-2 sm:px-4 border">{magazine.author}</td>
                      <td className="py-2 px-2 sm:px-4 border">
                        <div className="max-w-[150px] sm:max-w-[200px] truncate" title={magazine.subtitle}>
                          {magazine.subtitle || "N/A"}
                        </div>
                      </td>
                      <td className="py-2 px-2 sm:px-4 border">{formatDate(magazine.time)}</td>
                      <td className="py-2 px-2 sm:px-4 border">
                        <div className="flex gap-2 justify-center">
                          <Link to={`/magazine/${magazine.id}`}>
                            <FaEye className="text-blue-600 cursor-pointer" />
                          </Link>
                          <FaEdit
                            className="text-green-600 cursor-pointer"
                            onClick={(e) => handleEditClick(e, magazine.id, "Magazine Article")}
                          />
                          <FaTrash
                            className="text-red-600 cursor-pointer"
                            onClick={() =>
                              handleDelete(magazine.id, "Magazine Article", "/api/magazineDetail")
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredMagazineDetails.length > displayCount && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleLoadMore}
                className="bg-[#00603A] text-white px-4 py-2 text-sm sm:text-base hover:bg-[#004d2e] transition"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      ) : viewType === "newDevelopments" ? (
        <div className="font-inter w-full">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {renderHeader("New Developments", "New Developments")}
            {renderSearchBar("Search by Title or Link", true, "development")}
          </div>
          <div className="bg-[#00603A] text-white py-2 px-4 flex justify-between items-center">
            <h2 className="text-sm sm:text-base md:text-lg font-inter">New Developments</h2>
            <div className="flex gap-2">
              <button
                className="bg-white text-[#00603A] px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm hover:bg-gray-200"
                onClick={toggleCheckboxes}
              >
                {showCheckboxes ? "Hide Selection" : "Select Data"}
              </button>
              <button
                className="bg-white text-[#00603A] px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm hover:bg-gray-200"
                onClick={() =>
                  exportToExcel(filteredDevelopments, "new_developments", [
                    { label: "S.No", key: "_id" },
                    { label: "Title", key: "title" },
                    { label: "Link", key: "link" },
                    { label: "Created Time", key: "createdAt", formatter: formatDate },
                  ])
                }
              >
                Export
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border font-inter text-xs sm:text-sm">
              {renderTableHeader(
                ["S.NO", "Title", "Image", "Link", "Created Time", "Actions"],
                filteredDevelopments
              )}
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={showCheckboxes ? 7 : 6} className="py-2 px-2 sm:px-4 border text-center">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={showCheckboxes ? 7 : 6}
                      className="py-2 px-2 sm:px-4 border text-center text-red-600"
                    >
                      Error: {error}
                    </td>
                  </tr>
                ) : filteredDevelopments.length === 0 ? (
                  <tr>
                    <td colSpan={showCheckboxes ? 7 : 6} className="py-2 px-2 sm:px-4 border text-center">
                      No developments available
                    </td>
                  </tr>
                ) : (
                  filteredDevelopments.slice(0, displayCount).map((development, index) => (
                    <tr
                      key={development._id}
                      className={`hover:bg-gray-100 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                      onClick={() => handleRowClick(development)}
                    >
                      {showCheckboxes && (
                        <td className="py-2 px-2 sm:px-4 border">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(development._id)}
                            onChange={() => handleRowSelection(development._id)}
                          />
                        </td>
                      )}
                      <td className="py-2 px-2 sm:px-4 border">{index + 1}</td>
                      <td className="py-2 px-2 sm:px-4 border">{development.title}</td>
                      <td className="py-2 px-2 sm:px-4 border">
                        {development.image ? (
                          <img
                            src={development.image}
                            alt={development.title}
                            className="h-12 w-12 sm:h-16 sm:w-16 object-cover"
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="py-2 px-2 sm:px-4 border">
                        <a
                          href={development.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {development.link}
                        </a>
                      </td>
                      <td className="py-2 px-2 sm:px-4 border">{formatDate(development.createdAt)}</td>
                      <td className="py-2 px-2 sm:px-4 border">
                        <div className="flex gap-2 justify-center">
                          <FaEdit
                            className="text-green-600 cursor-pointer"
                            onClick={(e) => handleEditClick(e, development._id, "Development")}
                          />
                          <FaTrash
                            className="text-red-600 cursor-pointer"
                            onClick={() =>
                              handleDelete(development._id, "Development", "/api/developments")
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredDevelopments.length > displayCount && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleLoadMore}
                className="bg-[#00603A] text-white px-4 py-2 text-sm sm:text-base hover:bg-[#004d2e] transition"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-base sm:text-lg md:text-xl font-bold">Select a view from the sidebar</h2>
        </div>
      )}
    </div>
  );
};

export default Dashboard;