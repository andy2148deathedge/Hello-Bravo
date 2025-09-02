import React, { useEffect, useRef, useCallback } from "react";
import { useRevenueStore } from "../stores/revenueStore";
import "./Revenue.css";

const Revenue: React.FC = () => {
  const { dataset, musicianRevenue, loading, error, loadDataset, clearError } =
    useRevenueStore();

  // 使用 useRef 保存最後點擊時間，實現節流功能
  const lastClickTime = useRef(0);
  const THROTTLE_DELAY = 1000; // 1秒內只能點擊一次

  // 節流功能實作(throttle)：使用 useCallback 記憶化節流函數，避免每次渲染都重新創建
  const throttledLoadDataset = useCallback(() => {
    const now = Date.now();
    if (now - lastClickTime.current >= THROTTLE_DELAY) {
      loadDataset();
      lastClickTime.current = now;
    }
  }, [loadDataset]);

  // 組件掛載時自動載入資料集
  useEffect(() => {
    loadDataset();
  }, [loadDataset]);

  if (loading) {
    return (
      <div className="revenue">
        <div className="revenue-container">
          <h1>收益查詢</h1>
          <div className="revenue-content">
            <p>載入中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="revenue">
        <div className="revenue-container">
          <h1>收益查詢</h1>
          <div className="revenue-content">
            <div className="error-message">
              <p>錯誤：{error}</p>
              <button onClick={clearError}>清除錯誤</button>
              <button onClick={throttledLoadDataset}>重新查詢</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="revenue">
      <div className="revenue-container">
        <div className="revenue-header">
          <h1>收益查詢</h1>
          <button
            className="reload-button"
            onClick={throttledLoadDataset}
            disabled={loading}
          >
            {loading ? "載入中..." : "重新查詢"}
          </button>
        </div>
        <div className="revenue-content">
          {musicianRevenue && (
            <div className="revenue-summary">
              <h3>{musicianRevenue.musicianName} 的收益摘要</h3>
              <div className="total-revenue">
                <strong>
                  總收益：${musicianRevenue.totalRevenue.toFixed(2)}
                </strong>
              </div>

              <div className="works-list">
                <h4>著作列表：</h4>
                <div className="works-grid">
                  {musicianRevenue.works.map((work) => (
                    <div key={work.workId} className="work-item">
                      <div className="work-header">
                        <h3 className="work-title">{work.workTitle}</h3>
                        <span className="percentage">
                          權利比例：{(work.percentage * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="work-revenue">
                        <strong>
                          著作收益：${work.totalRevenue.toFixed(2)}
                        </strong>
                      </div>
                      <div className="royalty-details">
                        <h6>版稅紀錄：</h6>
                        <ul>
                          {work.royaltyRecords.map((royalty) => (
                            <li key={royalty.Id}>
                              {royalty.Date} - {royalty.Source}: $
                              {royalty.Amount.toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!musicianRevenue && dataset && <p>載入收益資訊中...</p>}
        </div>
      </div>
    </div>
  );
};

export default Revenue;
