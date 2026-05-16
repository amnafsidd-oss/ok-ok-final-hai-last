import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ProductListingPage from './pages/ProductListingPage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import SellPage from './pages/SellPage.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AdminPortal from './pages/AdminPortal.jsx';
import FeatureAdSelectionPage from './pages/FeatureAdSelectionPage.jsx';
import FeatureSuccessPage from './pages/FeatureSuccessPage.jsx';
import FeatureCancelPage from './pages/FeatureCancelPage.jsx';
import FAQ from './pages/FAQ.jsx';
import TrackOrder from './pages/TrackOrder.jsx';
import ReturnPolicy from './pages/ReturnPolicy.jsx';
import TermsConditions from './pages/TermsConditions.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/listings" element={<ProductListingPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/product/:adId" element={<ProductDetailPage />} />
          <Route
            path="/sell"
            element={
              <ProtectedRoute>
                <SellPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPortal />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/feature-ad-selection"
            element={
              <ProtectedRoute>
                <FeatureAdSelectionPage />
              </ProtectedRoute>
            }
          />
          <Route path="/feature-success" element={<FeatureSuccessPage />} />
          <Route path="/feature-cancel" element={<FeatureCancelPage />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          {/* Catch-all 404 Route */}
          <Route path="*" element={
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
              <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
              <h2 className="text-2xl font-semibold text-foreground mb-6">Page Not Found</h2>
              <a href="/" className="text-primary hover:underline underline-offset-4">
                Return to Home
              </a>
            </div>
          } />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;