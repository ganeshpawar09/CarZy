import React, { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setPhoneNumber("");
    navigate("/");
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50  bg-white font-monda text-xl border-b border-gray-300 px-6 py-2">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex justify-center">
            <Link to="/">
              <img
                src="src/assets/carzy.png"
                alt="CarZy Logo"
                className="h-11"
              />
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
