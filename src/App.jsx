import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Vehicles from './pages/Vehicles';
import HireaDriver from './pages/HireaDriver';
import FAQs from './pages/FAQs';
import Contact from './pages/Contact';

// User Protected Pages
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Admin from './pages/Admindashboard';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* --- PUBLIC ROUTES --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
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

          <Route path="/admin" element={<Admin/>} />



        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
