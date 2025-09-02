import { create } from 'zustand';

interface AuthStore {
  isAuthenticated: boolean;
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  user: null,
  
  login: (username: string) => {
    // 在 sessionStorage 中儲存 demo 認證資料
    sessionStorage.setItem('demo-auth', JSON.stringify({
      user: username,
      timestamp: Date.now()
    }));
    set({ isAuthenticated: true, user: username });
  },
  
  logout: () => {
    // 清除 sessionStorage 中的認證資料
    sessionStorage.removeItem('demo-auth');
    set({ isAuthenticated: false, user: null });
  },
  
  checkAuth: () => {
    // 檢查 sessionStorage 中是否有認證資料
    const authData = sessionStorage.getItem('demo-auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        // 檢查是否在 24 小時內（可選的過期機制）
        const isExpired = Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000;
        if (!isExpired) {
          set({ isAuthenticated: true, user: parsed.user });
          return;
        }
      } catch (error) {
        console.error('解析認證資料失敗:', error);
      }
    }
    // 如果沒有認證資料或已過期，清除狀態
    sessionStorage.removeItem('demo-auth');
    set({ isAuthenticated: false, user: null });
  },
}));
