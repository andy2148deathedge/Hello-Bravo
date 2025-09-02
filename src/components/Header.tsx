import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import "./Header.css";

const Header: React.FC = () => {
  const { isAuthenticated, user, logout, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // 組件掛載時檢查認證狀態
    checkAuth();
  }, [checkAuth]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="logo">Bravo</h1>
        <nav className="nav">
          <Link to="/" className="nav-link">
            首頁
          </Link>
          {/* <Link to="/user" className="nav-link">
            用戶
          </Link> */}
          <Link to="/state" className="nav-link">
            狀態
          </Link>
          <Link to="/revenue" className="nav-link">
            收益查詢
          </Link>
        </nav>
        <div className="auth-section">
          {isAuthenticated ? (
            <div className="user-info">
              <span className="username">歡迎, {user}!</span>
              <button onClick={handleLogout} className="logout-btn">
                登出
              </button>
            </div>
          ) : (
            <span className="login-status">未登入</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
