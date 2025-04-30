import React, { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUserName(user.full_name || "");
      setPhoneNumber(user.mobile_number || "");
      setIsVerified(user.verification_status === 'approved');
    }
  }, []);
  

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const handleLoginSuccess = (name, phone) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setIsLoggedIn(true);
    setUserName(name);
    setPhoneNumber(phone);
    setIsVerified(storedUser.verification_status === 'approved'); 
    setShowLoginModal(false);
  };

 

  const handleClick = () => {
    if (isVerified) {
      navigate("/listyourcar");
    } else {
      alert("Please verify your profile before listing a car. Go to your profile to complete verification.");
      navigate("/profile");
    }
  };


  const navigateToProfile = () => {
    navigate("/profile");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white font-monda text-xl border-b border-gray-300 px-6 py-2">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex justify-center">
            <Link to="/">
              <img src="src/assets/carzy1.png" alt="CarZy Logo" className="h-11" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#hero" className="hover:text-gray-600">Home</a>
            <a href="#why-choose-us" className="hover:text-gray-600">Why Choose Us</a>
            <a href="#how-it-works" className="hover:text-gray-600">How It Works</a>
            <a href="#testimonials" className="hover:text-gray-600">Testimonials</a>
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleClick}
                  className="hover:text-gray-600 transition-colors duration-200"
                >
                  List Your Car
                </button>
                <button
                  onClick={navigateToProfile}
                  className="border border-black px-4 py-2 rounded-full hover:bg-black hover:text-white transition-colors flex items-center space-x-2"
                >
                  <User size={16} />
                  <span>{userName}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="border border-black px-4 py-2 rounded hover:bg-black hover:text-white transition-colors"
              >
                Login/Sign Up
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col space-y-4">
            <Link to="/" className="hover:text-gray-600">Home</Link>
            <a href="#why-choose-us" className="hover:text-gray-600">Why Choose Us</a>
            <a href="#how-it-works" className="hover:text-gray-600">How It Works</a>
            <a href="#faq" className="hover:text-gray-600">FAQ</a>
            {isLoggedIn ? (
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleClick}
                  className="hover:text-gray-600 transition-colors duration-200"
                >
                  List Your Car
                </button>
                <button
                  onClick={navigateToProfile}
                  className="border border-black px-4 py-2 rounded-full hover:bg-black hover:text-white transition-colors flex items-center space-x-2"
                >
                  <User size={16} />
                  <span>{userName}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="border border-black px-4 py-2 rounded text-center hover:bg-black hover:text-white transition-colors"
              >
                Login/Sign Up
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          closeModal={closeLoginModal}
          onLoginSuccess={handleLoginSuccess}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
        />
      )}
    </>
  );
}
