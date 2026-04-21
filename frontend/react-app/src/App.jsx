import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import CartPage from './components/CartPage';
import ProfilePage from './pages/ProfilePage'; 
import AdminDashboard from './pages/AdminDashboard'; 

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              {/* 1. Login is now the very first page the user sees */}
              <Route path="/" element={<Login />} />

              {/* 2. The Bakery Store is moved to /store */}
              <Route path="/store" element={
                  <ProtectedRoute>
                      <Home />
                  </ProtectedRoute>
              } />

              {/* Protected Customer Routes */}
              <Route path="/cart" element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;