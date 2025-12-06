import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Vehicles from './pages/Vehicles';
import HireaDriver from './pages/HireaDriver';
import FAQs from './pages/FAQs';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/' element={<Home />} />
          <Route path='/vehicles' element={<Vehicles />} />
          <Route path='/hire-a-driver' element={<HireaDriver />} />
          <Route path='/faqs' element={<FAQs />} />
          <Route path='/contact' element={<Contact />} />
          
          {/* Protected Routes - require authentication */}
          <Route path='/x' element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path='/wishlist' element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;