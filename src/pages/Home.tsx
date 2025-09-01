import React from "react";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <div className="home">
      <div className="home-container">
        <h1>歡迎來到首頁</h1>
        <p>這是一個簡單的 demo 網站首頁。</p>
        <div className="feature-cards">
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
        </div>
      </div>
    </div>
  );
};

export default Home;
