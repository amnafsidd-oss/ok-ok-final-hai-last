import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, PlusCircle, LayoutDashboard, User, MapPin, Phone, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';

const Footer = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <footer className="bg-card border-t border-border mt-20 pb-20 md:pb-0 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">Z</span>
                </div>
                <span className="text-xl font-bold text-foreground">ZayToo</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your trusted marketplace for buying and selling products across Pakistan. Discover the best deals near you.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-5 uppercase tracking-wide text-sm">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/track-order" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block">
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link to="/return-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block">
                    Return & Refund Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Seller Tools */}
            <div>
              <h3 className="font-semibold text-foreground mb-5 uppercase tracking-wide text-sm">Seller Tools</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/feature-ad-selection" className="text-sm text-primary font-medium hover:text-primary/80 transition-colors inline-block">
                    Feature Your Ad
                  </Link>
                </li>
                <li>
                  <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block">
                    Admin Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="font-semibold text-foreground mb-5 uppercase tracking-wide text-sm">Contact Info</h3>
              <ul className="space-y-4">
                <li className="flex items-start text-sm text-muted-foreground">
                  <Phone className="w-5 h-5 text-primary mr-3 shrink-0" />
                  <span className="leading-tight">+92 329 2257988</span>
                </li>
                <li className="flex items-start text-sm text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary mr-3 shrink-0" />
                  <span className="leading-tight">Okara, Pakistan</span>
                </li>
                <li className="flex items-start text-sm text-muted-foreground">
                  <Clock className="w-5 h-5 text-primary mr-3 shrink-0" />
                  <span className="leading-tight">Working Hours:<br/>9:00 AM to 6:00 PM</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ZayToo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation - overlay */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-t border-border z-40 pb-safe">
        <div className="flex items-center justify-around h-16">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              isActive('/') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Home</span>
          </Link>

          <Link
            to="/listings"
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              isActive('/listings') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Browse</span>
          </Link>

          <Link
            to="/sell"
            className="flex flex-col items-center justify-center flex-1 h-full relative"
          >
            <div className="w-14 h-14 -mt-8 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 text-primary-foreground border-4 border-background transition-transform active:scale-95">
              <PlusCircle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-medium mt-1 text-primary">Sell</span>
          </Link>

          <Link
            to="/dashboard"
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">My Ads</span>
          </Link>

          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              isActive('/login') || isActive('/signup') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Account</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Footer;