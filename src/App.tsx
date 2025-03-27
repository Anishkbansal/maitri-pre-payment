import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import Home from './pages/Home';
import TherapyPage from './pages/TherapyPage';
import ClinicPage from './pages/ClinicPage';
import AcugraphPage from './pages/AcugraphPage';
import ShopPage from './pages/ShopPage';
import GiftCardPage from './pages/GiftCardPage';
import GiftCardAdminPage from './pages/GiftCardAdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProductsAdminPage from './pages/ProductsAdminPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import CookiePolicyPage from './pages/CookiePolicyPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/therapy/:therapy" element={<Layout><TherapyPage /></Layout>} />
      <Route path="/clinic" element={<Layout><ClinicPage /></Layout>} />
      <Route path="/acugraph" element={<Layout><AcugraphPage /></Layout>} />
      <Route path="/shop" element={<Layout><ShopPage /></Layout>} />
      <Route path="/gift-cards" element={<Layout><GiftCardPage /></Layout>} />
      
      {/* Admin routes */}
      <Route path="/admin/login" element={<Layout><AdminLoginPage /></Layout>} />
      
      {/* Admin Dashboard Route */}
      <Route path="/admin/dashboard" element={
        <Layout>
          <ProtectedRoute>
            <AdminDashboard>
              <AdminDashboardPage />
            </AdminDashboard>
          </ProtectedRoute>
        </Layout>
      } />
      
      {/* Gift Cards Admin Route */}
      <Route path="/admin/gift-cards" element={
        <Layout>
          <ProtectedRoute>
            <AdminDashboard>
              <GiftCardAdminPage />
            </AdminDashboard>
          </ProtectedRoute>
        </Layout>
      } />
      
      {/* Products Admin Route */}
      <Route path="/admin/products" element={
        <Layout>
          <ProtectedRoute>
            <AdminDashboard>
              <ProductsAdminPage />
            </AdminDashboard>
          </ProtectedRoute>
        </Layout>
      } />
      
      <Route path="/about" element={<Layout><AboutPage /></Layout>} />
      <Route path="/privacy" element={<Layout><PrivacyPage /></Layout>} />
      <Route path="/terms" element={<Layout><TermsPage /></Layout>} />
      <Route path="/cookies" element={<Layout><CookiePolicyPage /></Layout>} />
    </Routes>
  );
}

export default App;