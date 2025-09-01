import { create } from 'zustand';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface ApiStore {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  clearPosts: () => void;
}

export const useApiStore = create<ApiStore>((set) => ({
  posts: [],
  loading: false,
  error: null,
  
  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
      if (!response.ok) {
        throw new Error('無法獲取資料');
      }
      const data = await response.json();
      set({ posts: data, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '發生未知錯誤', 
        loading: false 
      });
    }
  },
  
  clearPosts: () => {
    set({ posts: [], error: null });
  },
}));
