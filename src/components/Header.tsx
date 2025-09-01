import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="logo">Hello Bravo</h1>
        <nav className="nav">
          <Link to="/" className="nav-link">
            首頁
          </Link>
          <Link to="/user" className="nav-link">
            用戶
          </Link>
          <Link to="/state" className="nav-link">
            狀態
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
