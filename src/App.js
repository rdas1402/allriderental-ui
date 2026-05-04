// App.js
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.js';
import HomePage from './components/HomePage.js';
import RentPage from './components/RentPage.js';
import AboutPage from './components/AboutPage.js';
import ContactPage from './components/ContactPage.js';
import BlogsPage from './components/BlogsPage.js';
import CareerPage from './components/CareerPage.js';
import BuyPage from './components/BuyPage.js';
import PartnerPage from './components/PartnerPage.js';
import VehicleList from './components/VehicleList.js';
import PrivacyPolicy from './components/PrivacyPolicy.js';
import TermsOfService from './components/TermsOfService.js';
import CancellationPolicy from './components/CancellationPolicy.js';
import LoginPage from './components/LoginPage';
import BookingConfirmationPage from './components/BookingConfirmationPage';
import ProfilePage from './components/ProfilePage';
import BookingPage from './components/BookingPage';
import AdminDashboard from './components/AdminDashboard';
import PaymentGatewayPage from './components/PaymentGatewayPage';
import MonthlySubscriptionPage from './components/MonthlySubscriptionPage';
import SubscriptionVehiclesPage from './components/SubscriptionVehiclesPage';
import SubscriptionBookingPage from './components/SubscriptionBookingPage';
import { CityProvider } from './context/CityContext';
import BlogDetailPage from "./components/BlogDetailPage";

function App() {
  const basename = process.env.REACT_APP_BASENAME || '';
  
  return (
    <CityProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/rent" element={<RentPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/career" element={<CareerPage />} />
            <Route path="/buy" element={<BuyPage />} />
            <Route path="/partner" element={<PartnerPage />} />
            <Route path="/vehicles" element={<VehicleList />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cancellation" element={<CancellationPolicy />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/payment" element={<PaymentGatewayPage />} />
            <Route path="/subscription" element={<MonthlySubscriptionPage />} />
            <Route path="/subscription/vehicles" element={<SubscriptionVehiclesPage />} />
            <Route path="/subscription/booking" element={<SubscriptionBookingPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
          </Routes>
        </Layout>
      </Router>
    </CityProvider>
  );
}

export default App;