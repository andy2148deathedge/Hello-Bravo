import React from "react";
import "./User.css";

const User: React.FC = () => {
  return (
    <div className="user">
      <div className="user-container">
        <h1>用戶頁面</h1>
        <p>這是用戶相關的頁面內容。</p>

        <div className="user-profile">
          <div className="profile-card">
            <div className="avatar">
              <span>👤</span>
            </div>
            <h3>用戶名稱</h3>
            <p>用戶描述：這是一個示例用戶</p>
            <div className="user-stats">
              <div className="stat">
                <span className="stat-number">25</span>
                <span className="stat-label">文章</span>
              </div>
              <div className="stat">
                <span className="stat-number">150</span>
                <span className="stat-label">追蹤者</span>
              </div>
              <div className="stat">
                <span className="stat-number">89</span>
                <span className="stat-label">追蹤中</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
