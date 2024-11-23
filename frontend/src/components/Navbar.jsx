import { FiMenu, FiX } from "react-icons/fi";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ isLoggedIn, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Make the logo clickable and navigate to home page */}
        <Link
          to="/"
          className="text-white text-xl font-bold hover:text-gray-300 transition-colors"
        >
          My Website
        </Link>

        {/* Hamburger menu button (visible on small screens) */}
        <button className="text-white lg:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Desktop menu (hidden on small screens) */}
        <div className="hidden lg:flex space-x-4">
          <NavLinks
            isLoggedIn={isLoggedIn}
            onLogout={onLogout}
            closeMenu={closeMenu}
          />
        </div>
      </div>

      {/* Mobile menu (visible when isMenuOpen is true) */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4">
          <NavLinks
            isLoggedIn={isLoggedIn}
            onLogout={onLogout}
            mobile
            closeMenu={closeMenu}
          />
        </div>
      )}
    </nav>
  );
};

const NavLinks = ({ isLoggedIn, onLogout, mobile, closeMenu }) => {
  const linkClass = mobile
    ? "block py-2 text-white hover:text-gray-300"
    : "text-white hover:text-gray-300";

  const handleClick = () => {
    if (mobile) {
      closeMenu();
    }
  };

  return (
    <>
      <Link to="/" className={linkClass} onClick={handleClick}>
        Home
      </Link>
      <Link to="/blogs" className={linkClass} onClick={handleClick}>
        Blogs
      </Link>
      <Link to="/about" className={linkClass} onClick={handleClick}>
        About Us
      </Link>
      {isLoggedIn ? (
        <>
          <Link to="/dashboard" className={linkClass} onClick={handleClick}>
            Dashboard
          </Link>
          <button
            onClick={() => {
              onLogout();
              handleClick();
            }}
            className={linkClass}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className={linkClass} onClick={handleClick}>
            Login
          </Link>
          <Link to="/register" className={linkClass} onClick={handleClick}>
            Register
          </Link>
        </>
      )}
    </>
  );
};

export default Navbar;
