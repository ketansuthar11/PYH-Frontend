import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TiShoppingCart } from "react-icons/ti";
import logo from '../assets/PYH-logo.png';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login', { replace: true });
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="nav-bar">

        {/* LOGO */}
        <div
          className="logo"
          onClick={() =>
            handleNavigation(role === 'user' ? '/main/plants' : '/dashboard')
          }
        >
          <img src={logo} alt="PYH Logo" />
        </div>

        {/* NAV LINKS */}
        <div className="actions">
          {role !== "admin" ? (
            <>
              <div
                className={isActive('/main/plants') ? 'nav-active' : ''}
                onClick={() => handleNavigation('/main/plants')}
              >
                Home
              </div>

              <div
                className={isActive('/main/orders') ? 'nav-active' : ''}
                onClick={() => handleNavigation('/main/orders')}
              >
                Orders
              </div>

              <div
                className={isActive('/main/aboutus') ? 'nav-active' : ''}
                onClick={() => handleNavigation('/main/aboutus')}
              >
                About
              </div>
            </>
          ) : (
            <>
              <div
                className={isActive('/dashboard') ? 'nav-active' : ''}
                onClick={() => handleNavigation('/dashboard')}
              >
                Dashboard
              </div>

              <div
                className={isActive('/main/aboutus') ? 'nav-active' : ''}
                onClick={() => handleNavigation('/main/aboutus')}
              >
                About
              </div>
            </>
          )}
        </div>

        {/* CART + PROFILE */}
        <div className="cart-profile">

          {role === "user" && (
            <div
              className={`cart-icon ${
                isActive('/main/cart') ? 'nav-active' : ''
              }`}
              onClick={() => handleNavigation('/main/cart')}
            >
              <TiShoppingCart size={25} />
            </div>
          )}

          <div className="logout" onClick={logout}>
            Logout
          </div>

          <div className="user-name">
            {username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="dnav-bar"></div>
    </>
  );
}

export default Navbar;
