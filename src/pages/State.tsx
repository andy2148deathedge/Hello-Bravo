import React, { useEffect } from "react";
import { useApiStore } from "../stores/apiStore";
import "./State.css";

const State: React.FC = () => {
  const { posts, loading, error, fetchPosts, clearPosts } = useApiStore();

  useEffect(() => {
    // 組件掛載時自動獲取資料
    fetchPosts();
  }, [fetchPosts]);

  const handleRefresh = () => {
    fetchPosts();
  };

  const handleClear = () => {
    clearPosts();
  };

  return (
    <div className="state-page">
      <div className="state-container">
        <h1 className="state-title">狀態管理示範</h1>
        <p className="state-description">
          這個頁面展示了如何使用 Zustand 來管理狀態和從 API 獲取資料
        </p>

        <div className="state-controls">
          <button
            className="state-btn state-btn-primary"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? "載入中..." : "重新獲取資料"}
          </button>
          <button
            className="state-btn state-btn-secondary"
            onClick={handleClear}
            disabled={loading}
          >
            清除資料
          </button>
        </div>

        {error && (
          <div className="state-error">
            <p>錯誤: {error}</p>
          </div>
        )}

        {loading && (
          <div className="state-loading">
            <p>正在載入資料...</p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="state-content">
            <h2 className="state-subtitle">
              獲取到的文章資料 ({posts.length} 篇)
            </h2>
            <div className="posts-grid">
              {posts.map((post) => (
                <div key={post.id} className="post-card">
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-body">{post.body}</p>
                  <div className="post-meta">
                    <span className="post-id">ID: {post.id}</span>
                    <span className="post-user">用戶: {post.userId}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="state-empty">
            <p>目前沒有資料，請點擊「重新獲取資料」按鈕來載入資料</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default State;
