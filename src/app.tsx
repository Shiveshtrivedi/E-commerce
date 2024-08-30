import React from 'react';
import './styles/global.css';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/privateRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import ProductList from './components/productList';
import ProductPage from './pages/ProductPage';
import Header from './components/header';
import Footer from './components/footer';
import Cart from './components/cart';
import WishlistPage from './pages/WishlistPage';
import AddProductPage from './pages/AddProductPage';
import AdminRoute from './components/adminRoute';
import AdminHistoryPage from './pages/AdminHistoryPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicy from './components/privacyPolicy';
import TermsOfService from './components/termsOfService';
import Help from './components/helpPage';
import SuccessTickAnimation from './components/successTickAnimation';

function App() {
  return (
    <div id="root">
      <Header />
      <main style={{ overflowY: 'auto' }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/"
            element={<PrivateRoute element={<ProductList />} />}
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute
                element={<PrivateRoute element={<ProfilePage />} />}
              />
            }
          />
          <Route
            path="/products"
            element={<PrivateRoute element={<ProductList />} />}
          />
          <Route
            path="/products/:id"
            element={<PrivateRoute element={<ProductPage />} />}
          />
          <Route path="/cart" element={<PrivateRoute element={<Cart />} />} />
          <Route
            path="/wishList"
            element={<PrivateRoute element={<WishlistPage />} />}
          />
          <Route
            path="/addProduct"
            element={<AdminRoute element={<AddProductPage />} />}
          />
          <Route
            path="/adminHistory"
            element={<AdminRoute element={<AdminHistoryPage />} />}
          />
          <Route
            path="/checkout"
            element={<PrivateRoute element={<CheckoutPage />} />}
          />
          <Route
            path="/orderHistory"
            element={<PrivateRoute element={<OrderHistoryPage />} />}
          />
          <Route
            path="/about"
            element={<PrivateRoute element={<AboutPage />} />}
          />
          <Route
            path="/contact"
            element={<PrivateRoute element={<ContactPage />} />}
          />
          <Route
            path="/checkout/success"
            element={<PrivateRoute element={<SuccessTickAnimation />} />}
          />
          <Route path="/checkout/success" element="order success" />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/help" element={<Help />} />
          <Route path="/products/:category" element={<ProductList />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
