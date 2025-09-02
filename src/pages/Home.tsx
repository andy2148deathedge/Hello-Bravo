import React, { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import "./Home.css";

const Home: React.FC = () => {
  const [username, setUsername] = useState("");
  const { isAuthenticated, user, login } = useAuthStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim());
      setUsername("");
    }
  };

  return (
    <div className="home">
      <div className="home-container">
        <h1>歡迎來到首頁</h1>
        <p>demo 網站首頁。</p>

        {!isAuthenticated ? (
          <div className="login-section">
            <h2>Demo 登入</h2>
            <p>請輸入用戶名來體驗受保護的路由功能</p>
            <form onSubmit={handleLogin} className="login-form">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="輸入用戶名"
                className="username-input"
                required
              />
              <button type="submit" className="login-btn">
                登入
              </button>
            </form>
          </div>
        ) : (
          <div className="welcome-section">
            <h2>歡迎回來, {user}!</h2>
            <p>您現在可以訪問受保護的頁面了</p>
            {/* <div className="protected-links">
              <a href="/user" className="protected-link">
                前往用戶頁面
              </a>
              <a href="/state" className="protected-link">
                前往狀態頁面
              </a>
              <a href="/revenue" className="protected-link">
                前往收益查詢頁面
              </a>
            </div> */}
          </div>
        )}

        {/* <div className="feature-cards">
          <div className="feature-card">
            <h3>功能一</h3>
            <p>這是第一個功能的描述</p>
          </div>
          <div className="feature-card">
            <h3>功能二</h3>
            <p>這是第二個功能的描述</p>
          </div>
          <div className="feature-card">
            <h3>功能三</h3>
            <p>這是第三個功能的描述</p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Home;
