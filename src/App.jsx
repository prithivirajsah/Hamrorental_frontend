import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/car-rental/Home';
import CarDetails from './pages/car-rental/CarDetails';
import Vehicles from './pages/Vehicles/Vehicles';
import HireaDriver from './pages/hire/HireaDriver';
import FAQs from './pages/FAQs';
import Contact from './pages/Contact';

// User Protected Pages
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Layout from './Layout';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AdminVehicles from './pages/dashboard/AdminVehicles';
import AdminBookings from './pages/dashboard/AdminBookings';
import AdminUsers from './pages/dashboard/AdminUsers';
import AdminDocuments from './pages/dashboard/AdminDocuments';
import AddPost from './pages/dashboard/AddPost';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* --- PUBLIC ROUTES --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/vehicles/:id" element={<CarDetails />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/hire-a-driver" element={<HireaDriver />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/contact" element={<Contact />} />


          {/* --- USER PROTECTED ROUTES --- */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<Layout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="vehicles" element={<AdminVehicles />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="documents" element={<AdminDocuments />} />
            <Route path="add-post" element={<AddPost />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
