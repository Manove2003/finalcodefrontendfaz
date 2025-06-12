import React from "react";
import homelogo from "../assests/Mansions.svg";
import penthouselogo from "../assests/Penthouse.svg";
import magazinelogo from "../assests/Magazine.svg";
import newletterlogo from "../assests/Newsletters.svg";
import collectible from "../assests/Collectible.svg";
import logoutIcon from "../assests/Log Out.svg";
import leadslogo from "../assests/Leads White.svg";
import userlogo from '../assests/User.svg'
import newdevelopment from '../assests/New Developments.svg'
import featuredlogo from '../assests/Featured.svg'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const Sidebar = ({ setViewType }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const firstName = localStorage.getItem("firstName")?.trim() || "";
  const lastName = localStorage.getItem("lastName")?.trim() || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Admin";

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    navigate("/login");
  };

  const menuItems = [
    { view: "userdata", label: "All Users Detail", icon: userlogo},
    { view: "leads", label: "Leads", icon: leadslogo },
    { view: "", label: "Featured", icon: featuredlogo, path: "/homeform" },
    { view: "mansions", label: "Mansion Listings", icon: homelogo },
    { view: "penthouses", label: "Penthouse Listings", icon: penthouselogo },
    { view: "luxurycollectibles", label: "Luxury Collectibles", icon: collectible },
    { view: "newDevelopments", label: "New Developments", icon: newdevelopment },
    { view: "property", label: "Newsletter Signup", icon: newletterlogo },
    { view: "magazine", label: "Magazine Post", icon: magazinelogo },
  ];

  return (
    <div className="w-full h-full bg-green-800 text-gray-100 flex flex-col p-4 pt-20 sm:p-6 overflow-y-auto">
      <h2 className="text-lg sm:text-xl mb-8 sm:mb-16 font-semibold mt-20">
        Welcome, {fullName}
      </h2>
      <ul className="space-y-4 sm:space-y-8 font-inter flex-1">
        {menuItems.map((item) => (
          <li
            key={item.label}
            onClick={() => {
              setViewType(item.view);
              if (item.path) navigate(item.path);
            }}
            className="hover:bg-green-600 p-2 sm:p-3 border cursor-pointer flex items-center gap-3 sm:gap-4 text-sm sm:text-base transition-colors duration-200"
          >
            <img src={item.icon} alt={item.label} className="w-4 sm:w-6 h-4 sm:h-6" />
            {item.label}
          </li>
        ))}
      </ul>
      <button
        onClick={handleLogout}
        className="mt-10 p-2 sm:p-3 bg-red-700 hover:bg-red-600 flex items-center gap-3 sm:gap-4 text-sm sm:text-base transition-colors duration-200"
      >
        <img src={logoutIcon} alt="Logout" className="w-4 sm:w-5 h-4 sm:h-5" />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;