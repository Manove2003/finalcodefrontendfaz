import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaSearch, FaPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assests/TMM_Logo_Non-responsive.svg';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';

const AdminDashboard = ({ viewType }) => {
  const { api, user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [properties, setProperties] = useState([]);
  const [luxuryCollectibles, setLuxuryCollectibles] = useState([]);
  const [displayCount, setDisplayCount] = useState(10);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRowClick = (item) => {
    console.log('Selected item:', item);
  };

  const handleDelete = async (id, type, endpoint) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      setLoading(true);
      await api.delete(`${endpoint}/${id}`);
      toast.success(`${type} deleted successfully`);

      if (type === 'Inquiry') {
        setInquiries(inquiries.filter((item) => item._id !== id));
        setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
      } else if (['Mansion', 'Penthouse'].includes(type)) {
        setProperties(properties.filter((item) => item.id !== id));
        setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
      } else if (type === 'Luxury Collectible') {
        setLuxuryCollectibles(luxuryCollectibles.filter((item) => item.id !== id));
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
    if (['Mansion', 'Penthouse', 'Luxury Collectible'].includes(type)) {
      navigate(`/mansionform/${id}`);
    }
  };

  const handleLoadMore = () => {
    setDisplayCount((prevCount) => prevCount + 10);
  };

  const toggleSelectData = () => {
    setIsSelecting(!isSelecting);
    if (isSelecting) {
      setSelectedRows([]);
    }
  };

  const handleRowCheckboxChange = (id) => {
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
      setSelectedRows(data.map((item) => item.id || item._id));
    }
  };

  const handleExport = (data, type) => {
    let exportData = data;
    if (isSelecting && selectedRows.length > 0) {
      exportData = data.filter((item) => selectedRows.includes(item.id || item._id));
    }

    if (exportData.length === 0) {
      toast.warn('No data selected for export');
      return;
    }

    const worksheetData = exportData.map((item) => {
      if (type === 'Inquiry') {
        return {
          'Reference No': item._id?.substring(0, 8) || 'N/A',
          'Property Ref': item.propertyRef || 'N/A',
          'Property Title': item.propertyTitle || 'N/A',
          'First Name': item.firstName || 'NEW',
          'Last Name': item.lastName || 'N/A',
          Email: item.email || 'N/A',
          Phone: item.phone || 'N/A',
          'Created Time': formatDate(item.createdAt),
          Message: item.message || 'N/A',
        };
      } else {
        return {
          'Ref No': item.reference || 'N/A',
          Title: item.title || 'N/A',
          Location: item.location || 'N/A',
          Price: item.price || 'N/A',
          'Created Time': formatDate(item.createdAt),
        };
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, type);
    XLSX.writeFile(workbook, `${type}_export.xlsx`);
  };

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/api/admin/inquiries');
        setInquiries(response.data);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (viewType === 'leads') {
      fetchInquiries();
    }
  }, [viewType, api]);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/api/properties');
        const adminProps = response.data.filter(
          (prop) => prop.createdBy === user.id || prop.adminId === user.id
        );
        const transformedData = adminProps
          .filter((item) => {
            if (viewType === 'mansions') return item.propertytype === 'Mansion';
            if (viewType === 'penthouses') return item.propertytype === 'Penthouse';
            return false;
          })
          .map((item) => ({
            id: item._id,
            reference: item.reference || 'N/A',
            title: item.title || 'N/A',
            email: item.email || 'N/A',
            category: item.propertytype || 'Unknown',
            location: item.propertyaddress || item.community || 'N/A',
            price: item.price || 'N/A',
            createdAt: item.createdAt || new Date().toISOString(),
          }));
        setProperties(transformedData);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (['mansions', 'penthouses'].includes(viewType)) {
      fetchProperties();
    }
  }, [viewType, api, user]);

  useEffect(() => {
    const fetchLuxuryCollectibles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/api/properties');
        const adminProps = response.data.filter(
          (prop) => prop.createdBy === user.id || prop.adminId === user.id
        );
        const transformedData = adminProps
          .filter((item) => item.propertytype === 'Luxury Collectibles')
          .map((item) => ({
            id: item._id,
            reference: item.reference || 'N/A',
            title: item.title || 'N/A',
            location: item.propertyaddress || 'N/A',
            price: item.price || 'N/A',
            createdAt: item.createdAt || new Date().toISOString(),
          }));
        setLuxuryCollectibles(transformedData);
      } catch (error) {
        console.error('Error fetching luxury collectibles:', error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (viewType === 'luxurycollectibles') {
      fetchLuxuryCollectibles();
    }
  }, [viewType, api, user]);

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.propertyRef?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.propertyTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate =
      !selectedDate ||
      new Date(inquiry.createdAt).toDateString() === selectedDate.toDateString();
    return matchesSearch && matchesDate;
  });

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate =
      !selectedDate ||
      new Date(property.createdAt).toDateString() === selectedDate.toDateString();
    return matchesSearch && matchesDate;
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

  const renderHeader = (title, breadcrumb) => (
    <div className="mb-4 sm:mb-6">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold">{title}</h1>
      <div className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
        Dashboard <span className="text-blue-600">/ {breadcrumb}</span>
      </div>
    </div>
  );

  const renderSearchBar = (placeholder, showAddButton = false, addType = '') => {
    const formRoutes = {
      mansion: '/mansionform',
      penthouse: '/mansionform',
      'luxury collectible': '/mansionform',
    };
    const formRoute = formRoutes[addType.toLowerCase()] || '/';

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

  return (
    <div className="flex-1 bg-[#F9F9F8] p-4 sm:p-6 md:p-8 lg:p-10 w-full min-h-screen">
      <ToastContainer />
      <div className="flex justify-center sm:justify-end mb-4 sm:mb-6">
        <img
          src={logo}
          className="w-[150px] sm:w-[200px] md:w-[300px] lg:w-[400px]"
          alt="logo"
        />
      </div>
      {viewType === 'leads' ? (
        <div className="font-inter w-full">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {renderHeader('All Leads', 'Leads')}
            {renderSearchBar('Search by Email, Name, Property Ref, or Title')}
          </div>
          <div className="bg-[#00603A] text-white py-2 px-4 flex justify-between items-center">
            <h2 className="text-sm sm:text-base md:text-lg font-inter">Leads</h2>
            <div className="flex gap-2">
              <button
                onClick={toggleSelectData}
                className="bg-white text-[#00603A] px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm hover:bg-gray-200"
              >
                {isSelecting ? 'Cancel Selection' : 'Select Data'}
              </button>
              <button
                onClick={() => handleExport(filteredInquiries, 'Inquiry')}
                className="bg-white text-[#00603A] px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm hover:bg-gray-200"
              >
                Export
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-xs sm:text-sm font-inter">
              <thead>
                <tr className="bg-[#BAD4CA]">
                  {isSelecting && (
                    <th className="py-2 px-2 sm:px-4 border">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === filteredInquiries.length && filteredInquiries.length > 0}
                        onChange={() => handleSelectAll(filteredInquiries)}
                      />
                    </th>
                  )}
                  <th className="py-2 px-2 sm:px-4 border">Reference no</th>
                  <th className="py-2 px-2 sm:px-4 border">Property Ref</th>
                  <th className="py-2 px-2 sm:px-4 border">Property Title</th>
                  <th className="py-2 px-2 sm:px-4 border">First Name</th>
                  <th className="py-2 px-2 sm:px-4 border">Last Name</th>
                  <th className="py-2 px-2 sm:px-4 border">Email</th>
                  <th className="py-2 px-2 sm:px-4 border">Phone</th>
                  <th className="py-2 px-2 sm:px-4 border">
                    Created Time
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      showTimeSelect
                      dateFormat="Pp"
                      customInput={
                        <button className="px-2 py-1 text-xs sm:text-sm cursor-pointer">
                          {selectedDate ? formatDate(selectedDate) : ''} 🔽
                        </button>
                      }
                    />
                  </th>
                  <th className="py-2 px-2 sm:px-4 border">Message</th>
                  <th className="py-2 px-2 sm:px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={isSelecting ? 11 : 10} className="py-2 px-2 sm:px-4 border text-center">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={isSelecting ? 11 : 10}
                      className="py-2 px-2 sm:px-4 border text-center text-red-600"
                    >
                      Error: {error}
                    </td>
                  </tr>
                ) : filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan={isSelecting ? 11 : 10} className="py-2 px-2 sm:px-4 border text-center">
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
                      {isSelecting && (
                        <td className="py-2 px-2 sm:px-4 border">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(inquiry._id)}
                            onChange={() => handleRowCheckboxChange(inquiry._id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                      )}
                      <td className="py-2 px-2 sm:px-4 border text-center">
                        {inquiry._id.substring(0, 8) || 'N/A'}
                      </td>
                      <td className="py-2 px-2 sm:px-4 border">
                        {inquiry.propertyRef || 'N/A'}
                      </td>
                      <td className="py-2 px-2 sm:px-4 border">
                        {inquiry.propertyTitle || 'N/A'}
                      </td>
                      <td className="py-2 px-2 sm:px-4 border">
                        {inquiry.firstName || 'NEW'}
                      </td>
                      <td className="py-2 px-2 sm:px-4 border">
                        {inquiry.lastName || 'N/A'}
                      </td>
                      <td className="py-2 px-2 sm:px-4 border text-center">
                        {inquiry.email || 'N/A'}
                      </td>
                      <td className="py-2 px-2 sm:px-4 border">
                        {inquiry.phone || 'N/A'}
                      </td>
                      <td className="py-2 px-2 sm:px-4 border">
                        {formatDate(inquiry.createdAt)}
                      </td>
                      <td className="py-2 px-2 sm:px-4 border">
                        <div
                          className="max-w-[150px] sm:max-w-[200px] truncate"
                          title={inquiry.message}
                        >
                          {inquiry.message || 'N/A'}
                        </div>
                      </td>
                      <td className="py-2 px-2 sm:px-4 border">
                        <div className="flex gap-2 justify-center">
                          <FaTrash
                            className="text-red-600 cursor-pointer"
                            onClick={() =>
                              handleDelete(inquiry._id, 'Inquiry', '/api/inquiries')
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
      ) : viewType === 'mansions' ? (
        <div className="font-inter w-full">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {renderHeader('Mansion Listings', 'Mansions')}
            {renderSearchBar('Search by Title or Reference', true, 'mansion')}
          </div>
          <div className="bg-[#00603A] text-white py-2 px-4 flex justify-between items-center">
            <h2 className="text-sm sm:text-base md:text-lg font-inter">Mansion Listings</h2>
            <div className="flex gap-2">
              <button
                onClick={toggleSelectData}
                className="bg-white text-[#00603A] px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm hover:bg-gray-200"
              >
                {isSelecting ? 'Cancel Selection' : 'Select Data'}
              </button>
              <button
                onClick={() => handleExport(filteredProperties, 'Mansion')}
                className="bg-white text-[#00603A] px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm hover:bg-gray-200"
              >
                Export
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border font-inter text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#BAD4CA]">
                  {isSelecting && (
                    <th className="py-2 px-2 sm:px-4 border">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === filteredProperties.length && filteredProperties.length > 0}
                        onChange={() => handleSelectAll(filteredProperties)}
                      />
                    </th>
                  )}
                  <th className="py-2 px-2 sm:px-4 border">Ref no.</th>
                  <th className="py-2 px-2 sm:px-4 border">Title</th>
                  <th className="py-2 px-2 sm:px-4 border">Location</th>
                  <th className="py-2 px-2 sm:px-4 border">Price</th>
                  <th className="py-2 px-2 sm:px-4 border">Created Time</th>
                  <th className="py-2 px-2 sm:px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={isSelecting ? 7 : 6} className="py-2 px-2 sm:px-4 border text-center">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={isSelecting ? 7 : 6}
                      className="py-2 px-2 sm:px-4 border text-center text-red-600"
                    >
                      Error: {error}
                    </td>
                  </tr>
                ) : filteredProperties.length === 0 ? (
                  <tr>
                    <td colSpan={isSelecting ? 7 : 6} className="py-2 px-2 sm:px-4 border text-center">
                      No mansion listings available
                    </td>
                  </tr>
                ) : (
                  filteredProperties.slice(0, displayCount).map((property, index) => (
                    <tr
                      key={property.id}
                      className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                      onClick={() => handleRowClick(property)}
                    >
                      {isSelecting && (
                        <td className="py-2 px-2 sm:px-4 border">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(property.id)}
                            onChange={() => handleRowCheckboxChange(property.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                      )}
                      <td className="py-2 px-2 sm:px-4 border">{property.reference}</td>
                      <td className="py-2 px-2 sm:px-4 border">{property.title}</td>
                      <td className="py-2 px-2 sm:px-4 border">{property.location}</td>
                      <td className="py-2 px-2 sm:px-4 border">{property.price}</td>
                      <td className="py-2 px-2 sm:px-4 border">
                        {formatDate(property.createdAt)}
                      </td>
                      <td className="py-2 px-2 sm:px-4 border">
                        <div className="flex gap-2 justify-center">
                          <FaEdit
                            className="text-green-600 cursor-pointer"
                            onClick={(e) => handleEditClick(e, property.id, 'Mansion')}
                          />
                          <FaTrash
                            className="text-red-600 cursor-pointer"
                            onClick={() =>
                              handleDelete(property.id, 'Mansion', '/api/properties')
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
      ) : viewType === 'penthouses' ? (
        <div className="font-inter w-full">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {renderHeader('Penthouse Listings', 'Penthouses')}
            {renderSearchBar('Search by Title or Reference', true, 'penthouse')}
          </div>
          <div className="bg-[#00603A] text-white py-2 px-4 flex justify-between items-center">
            <h2 className="text-sm sm:text-base md:text-lg font-inter">Penthouse Listings</h2>
            <div className="flex gap-2">
              <button
                onClick={toggleSelectData}
                className="bg-white text-[#00603A] px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm hover:bg-gray-200"
              >
                {isSelecting ? 'Cancel Selection' : 'Select Data'}
              </button>
              <button
                onClick={() => handleExport(filteredProperties, 'Penthouse')}
                className="bg-white text-[#00603A] px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm hover:bg-gray-200"
              >
                Export
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border font-inter text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#BAD4CA]">
                  {isSelecting && (
                    <th className="py-2 px-2 sm:px-4 border">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === filteredProperties.length && filteredProperties.length > 0}
                        onChange={() => handleSelectAll(filteredProperties)}
                      />
                    </th>
                  )}
                  <th className="py-2 px-2 sm:px-4 border">Ref no.</th>
                  <th className="py-2 px-2 sm:px-4 border">Title</th>
                  <th className="py-2 px-2 sm:px-4 border">Location</th>
                  <th className="py-2 px-2 sm:px-4 border">Price</th>
                  <th className="py-2 px-2 sm:px-4 border">Created Time</th>
                  <th className="py-2 px-2 sm:px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={isSelecting ? 7 : 6} className="py-2 px-2 sm:px-4 border text-center">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={isSelecting ? 7 : 6}
                      className="py-2 px-2 sm:px-4 border text-center text-red-600"
                    >
                      Error: {error}
                    </td>
                  </tr>
                ) : filteredProperties.length === 0 ? (
                  <tr>
                    <td colSpan={isSelecting ? 7 : 6} className="py-2 px-2 sm:px-4 border text-center">
                      No penthouse listings available
                    </td>
                  </tr>
                ) : (
                  filteredProperties.slice(0, displayCount).map((property, index) => (
                    <tr
                      key={property.id}
                      className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                      onClick={() => handleRowClick(property)}
                    >
                      {isSelecting && (
                        <td className="py-2 px-2 sm:px-4 border">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(property.id)}
                            onChange={() => handleRowCheckboxChange(property.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                      )}
                      <td className="py-2 px-2 sm:px-4 border">{property.reference}</td>
                      <td className="py-2 px-2 sm:px-4 border">{property.title}</td>
                      <td className="py-2 px-2 sm:px-4 border">{property.location}</td>
                      <td className="py-2 px-2 sm:px-4 border">{property.price}</td>
                      <td className="py-2 px-2 sm:px-4 border">
                        {formatDate(property.createdAt)}
                      </td>
                      <td className="py-2 px-2 sm:px-4 border">
                        <div className="flex gap-2 justify-center">
                          <FaEdit
                            className="text-green-600 cursor-pointer"
                            onClick={(e) => handleEditClick(e, property.id, 'Penthouse')}
                          />
                          <FaTrash
                            className="text-red-600 cursor-pointer"
                            onClick={() =>
                              handleDelete(property.id, 'Penthouse', '/api/properties')
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
      ) : viewType === 'luxurycollectibles' ? (
        <div className="font-inter w-full">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {renderHeader('Luxury Collectibles Listings', 'Luxury Collectibles')}
            {renderSearchBar('Search by Title or Reference', true, 'luxury collectible')}
          </div>
          <div className="bg-[#00603A] text-white py-2 px-4 flex justify-between items-center">
            <h2 className="text-sm sm:text-base md:text-lg font-inter">Luxury Collectibles Listings</h2>
            <div className="flex gap-2">
              <button
                onClick={toggleSelectData}
                className="bg-white text-[#00603A] px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm hover:bg-gray-200"
              >
                {isSelecting ? 'Cancel Selection' : 'Select Data'}
              </button>
              <button
                onClick={() => handleExport(filteredLuxuryCollectibles, 'Luxury Collectible')}
                className="bg-white text-[#00603A] px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm hover:bg-gray-200"
              >
                Export
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border font-inter text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#BAD4CA]">
                  {isSelecting && (
                    <th className="py-2 px-2 sm:px-4 border">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === filteredLuxuryCollectibles.length && filteredLuxuryCollectibles.length > 0}
                        onChange={() => handleSelectAll(filteredLuxuryCollectibles)}
                      />
                    </th>
                  )}
                  <th className="py-2 px-2 sm:px-4 border">Ref no.</th>
                  <th className="py-2 px-2 sm:px-4 border">Title</th>
                  <th className="py-2 px-2 sm:px-4 border">Location</th>
                  <th className="py-2 px-2 sm:px-4 border">Price</th>
                  <th className="py-2 px-2 sm:px-4 border">
                    <label className="px-2">Created Time</label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      showTimeSelect
                      dateFormat="Pp"
                      customInput={
                        <button className="border px-2 py-1 bg-white shadow-sm cursor-pointer text-xs sm:text-sm">
                          {selectedDate ? formatDate(selectedDate) : 'Select Time'} 🔽
                        </button>
                      }
                    />
                  </th>
                  <th className="py-2 px-2 sm:px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={isSelecting ? 7 : 6} className="py-2 px-2 sm:px-4 border text-center">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={isSelecting ? 7 : 6}
                      className="py-2 px-2 sm:px-4 border text-center text-red-600"
                    >
                      Error: {error}
                    </td>
                  </tr>
                ) : filteredLuxuryCollectibles.length === 0 ? (
                  <tr>
                    <td colSpan={isSelecting ? 7 : 6} className="py-2 px-2 sm:px-4 border text-center">
                      No luxury collectibles available
                    </td>
                  </tr>
                ) : (
                  filteredLuxuryCollectibles.slice(0, displayCount).map((collectible, index) => (
                    <tr
                      key={collectible.id}
                      className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                      onClick={() => handleRowClick(collectible)}
                    >
                      {isSelecting && (
                        <td className="py-2 px-2 sm:px-4 border">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(collectible.id)}
                            onChange={() => handleRowCheckboxChange(collectible.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                      )}
                      <td className="py-2 px-2 sm:px-4 border">{collectible.reference}</td>
                      <td className="py-2 px-2 sm:px-4 border">{collectible.title}</td>
                      <td className="py-2 px-2 sm:px-4 border">{collectible.location}</td>
                      <td className="py-2 px-2 sm:px-4 border">{collectible.price}</td>
                      <td className="py-2 px-2 sm:px-4 border">
                        {formatDate(collectible.createdAt)}
                      </td>
                      <td className="py-2 px-2 sm:px-4 border">
                        <div className="flex gap-2 justify-center">
                          <FaEdit
                            className="text-green-600 cursor-pointer"
                            onClick={(e) =>
                              handleEditClick(e, collectible.id, 'Luxury Collectible')
                            }
                          />
                          <FaTrash
                            className="text-red-600 cursor-pointer"
                            onClick={() =>
                              handleDelete(collectible.id, 'Luxury Collectible', '/api/properties')
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
      ) : (
        <div className="text-center">
          <h2 className="text-base sm:text-lg md:text-xl font-bold">Select a view from the sidebar</h2>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;