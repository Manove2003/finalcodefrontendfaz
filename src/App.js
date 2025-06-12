import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async"; // Add Helmet imports
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Mansions from "./pages/Mansions";
import Penthouses from "./pages/Penthouses";
import About from "./pages/About";
import Register from "./pages/Register";
import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Magazine from "./pages/Magazine";
import BlogPage from "./pages/BlogPage";
import ListingPage from "./pages/ListingPage";
import DashboardAdmin from "./pages/DashboardAdmin";
import CreatePost from "./components/CreatePost";
import SignupSection from "./pages/SignupSection";
import NewDevelopment from "./pages/NewDevelopment";
import NewDevelopmentForm from "./components/NewDevelopmentform";
import CollectiveListing from "./pages/CollectiveListing";
import LuxeCollectibles from "./pages/LuxeCollectibles";
import ListedCollectibles from "./pages/ListedCollectibles";
import MagazineForm from "./components/MagazineForm";
import MansionForm from "./components/MansionForm";
import PenthouseForm from "./components/PenthouseForm";
import CollectibleForm from "./components/Collectibles";
import HomePageForm from "./components/HomePageForm";
import MansionList from "./components/MansionList";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import { MansionProvider, useMansions } from "./context/MansionContext";
import Admin from "./pages/Admin";
import { CollectiblesProvider } from "./context/CollectibleContext";
import IconicForm from "./pages/IconicForm";
import UserForm from "./components/Auth/UserForm";
import ScrollToTop from "./ScrollToTop";
import { CurrencyProvider } from "./context/CurrencyContext";
import axios from "axios";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  console.log(
    "ProtectedRoute: Checking auth state - Loading:",
    loading,
    "User:",
    user
  );
  // if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppContent() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { mansions } = useMansions();

  const [magazine, setMagazine] = React.useState(null);

  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://api.themansionmarket.com"
      : "http://localhost:5001";

  // Fetch magazine data for /blogpage/:id route
  useEffect(() => {
    const pathParts = location.pathname.split("/");
    if (pathParts[1] === "blogpage" && pathParts[2]) {
      const fetchMagazineById = async (id) => {
        try {
          const response = await axios.get(`${BASE_URL}/api/magazineDetail/${id}`);
          setMagazine(response.data);
        } catch (err) {
          console.error("Error fetching magazine:", err);
        }
      };
      fetchMagazineById(pathParts[2]);
    }
  }, [location.pathname]);

  // Define route-to-title mapping
  const getPageTitle = (pathname) => {
    const routeTitles = {
"/": "Global Luxury Real Estate Marketplace: Mansions, Penthouses & Luxury Collectibles | The Mansion Market",
      "/mansions": "Explore Luxurious Mansions For Sale Globally | The Mansion Market",
      "/penthouses": "Explore Luxurious Penthouses For Sale Globally | The Mansion Market",
      "/about": "About Us | The Mansion Market",
      "/contactus": "Contact Us | The Mansion Market",
      "/register": " Register With Us | The Mansion Market",
      "/privacypolicy": "Privacy Policy | The Mansion Market",
      "/magazine": "Magazine | The Mansion Market",
      "/signupsection": " Newsletter Sign Up | The Mansion Market",
      "/newdevelopment": "Explore The Finest New Luxury Developments Globally | The Mansion Market",
      "/collectivelisting": "Explore Luxurious Collectibles For Sale Globally | The Mansion Market",
      "/listedcollectibles": "Listed Collectibles | The Mansion Market",
      "/luxecollectibles": "Luxe Collectibles | The Mansion Market",
      "/login": "Login | The Mansion Market",
      // "/signup": "Sign Up | The Mansion Market",
      "/dashboard": "Dashboard | The Mansion Market",
      "/admin": "Admin | The Mansion Market",
      "/userform": "User Form | The Mansion Market",
      "/create-post": "Create Post | The Mansion Market",
      "/magazineform": "Magazine Form | The Mansion Market",
      "/mansionform": "Mansion Form | The Mansion Market",
      "/penthouseform": "Penthouse Form | The Mansion Market",
      "/collectiblesform": "Collectibles Form | The Mansion Market",
      "/homeform": "Home Form | The Mansion Market",
      "/newdevelopmentform": "New Development Form | The Mansion Market",
      "/mansionlist": "Mansion List | The Mansion Market",
      "/iconicform": "Iconic Form | The Mansion Market",
    };

    if (pathname.startsWith("/blogpage/")) {
      return magazine ? `${magazine.title} | The Mansion Market` : `Article | The Mansion Market`;
    }
    if (pathname.startsWith("/mansion/")) {
      const reference = pathname.split("/")[2];
      const mansion = mansions.find((m) => m.reference === reference);
      return mansion
        ? `${mansion.title} | The Mansion Market`
        : `Mansion ${reference} | The Mansion Market`;
    }
    if (pathname.startsWith("/userform/")) {
      return `Edit User | The Mansion Market`;
    }
    if (pathname.startsWith("/magazineform/")) {
      return `Edit Magazine | The Mansion Market`;
    }
    if (pathname.startsWith("/mansionform/")) {
      return `Edit Mansion | The Mansion Market`;
    }
    if (pathname.startsWith("/collectiblesform/")) {
      return `Edit Collectible | The Mansion Market`;
    }
    if (pathname.startsWith("/newdevelopmentform/")) {
      return `Edit New Development | The Mansion Market`;
    }

    return routeTitles[pathname] || "The Mansion Market";
  };

  // Update document title on route change
  useEffect(() => {
    document.title = getPageTitle(location.pathname);
  }, [location.pathname, mansions]);

  // if (loading) return <div>Loading...</div>;

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mansions" element={<Mansions />} />
        <Route path="/penthouses" element={<Penthouses />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/magazine" element={<Magazine />} />
        <Route path="/blogpage/:id" element={<BlogPage />} />
        <Route path="/mansion/:reference" element={<ListingPage />} />
        <Route path="/signupsection" element={<SignupSection />} />
        <Route path="/newdevelopment" element={<NewDevelopment />} />
        <Route path="/collectivelisting" element={<CollectiveListing />} />
        <Route path="/listedcollectibles" element={<ListedCollectibles />} />
        <Route path="/luxecollectibles" element={<LuxeCollectibles />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/signup" element={<Signup />} /> */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              {user && user.role === "admin" ? (
                <Admin />
              ) : (
                <Navigate to="/" replace />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/userform"
          element={
            <ProtectedRoute>
              <UserForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userform/:id"
          element={
            <ProtectedRoute>
              <UserForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/magazineform"
          element={
            <ProtectedRoute>
              <MagazineForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/magazineform/:id"
          element={
            <ProtectedRoute>
              <MagazineForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mansionform"
          element={
            <ProtectedRoute>
              <MansionForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mansionform/:id"
          element={
            <ProtectedRoute>
              <MansionForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/penthouseform"
          element={
            <ProtectedRoute>
              <PenthouseForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collectiblesform"
          element={
            <ProtectedRoute>
              <CollectibleForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collectiblesform/:id"
          element={
            <ProtectedRoute>
              <CollectibleForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/homeform"
          element={
            <ProtectedRoute>
              <HomePageForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/newdevelopmentform"
          element={
            <ProtectedRoute>
              <NewDevelopmentForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/newdevelopmentform/:id"
          element={
            <ProtectedRoute>
              <NewDevelopmentForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mansionlist"
          element={
            <ProtectedRoute>
              <MansionList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/iconicform"
          element={
            <ProtectedRoute>
              <IconicForm />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <MansionProvider>
            <CurrencyProvider>
              <CollectiblesProvider>
                <ScrollToTop />
                <AppContent />
              </CollectiblesProvider>
            </CurrencyProvider>
          </MansionProvider>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
