import { create } from 'zustand';

/**
 * 收益相關的 interface 定義，供 mock JSON 載入使用
 *
 * 說明
 * - 金額與權利比例使用 `number` 表示
 * - 日期為 ISO 字串（例如："2024-07-15"）
 */

/**
 * 音樂人（創作者）
 *
 * JSON 來源：public/mock/musicians.json
 */
export interface Musician {
  Id: number; // 主鍵 → 音樂人ID
  Name: string; // 音樂人顯示名稱
}

/**
 * 音樂著作（作品 / 歌曲）
 *
 * JSON 來源：public/mock/musicalWorks.json
 */
export interface MusicalWork {
  Id: number; // 主鍵 → 作品ID
  Title: string; // 作品標題
}

/**
 * 著作權分配紀錄：連結音樂人與作品，並記錄其權利比例
 * 同一首作品可有多筆分權設定
 *
 * JSON 來源：public/mock/musicalWorkCopyrights.json
 */
export interface MusicalWorkCopyright {
  Id: number; // 主鍵 → 著作權分配ID 
  MusicianId: number; // 外鍵 → Musician.Id
  MusicalWorkId: number; // 外鍵 → MusicalWork.Id
  Percentage: number; // 權利比例（小數 0.0 ~ 1.0）
}

/**
 * 版稅（收益）紀錄：連結到特定的著作權分配（即某音樂人在某作品的份額）
 *
 * JSON 來源：public/mock/royaltyRecords.json
 */
export interface RoyaltyRecord {
  Id: number; // 主鍵 → 版稅紀錄ID
  MusicalWorkCopyrightId: number; // 外鍵 → MusicalWorkCopyright.Id
  Amount: number; // 此筆紀錄的金額（幣別由業務情境決定）
  Date: string; // ISO 日期字串（YYYY-MM-DD），表示紀錄/入帳日期
  Source: string; // 來源平台或通路（如：Spotify、YouTube、Live）
}

/**
 * 一次載入四個 mock JSON 後的完整資料集
 */
export interface RevenueDataset {
  musicians: Musician[];
  musicalWorks: MusicalWork[];
  musicalWorkCopyrights: MusicalWorkCopyright[];
  royaltyRecords: RoyaltyRecord[];
}

/**
 * 音樂人著作收益摘要
 */
export interface MusicianWorkRevenue {
  workId: number; // 著作 ID
  workTitle: string; // 著作標題
  percentage: number; // 權利比例
  totalRevenue: number; // 該著作總收益
  royaltyRecords: RoyaltyRecord[]; //該著作的版稅紀錄
}

/**
 * 音樂人收益摘要
 */
export interface MusicianRevenue {
  musicianId: number; // 音樂人 ID
  musicianName: string; // 音樂人姓名
  works: MusicianWorkRevenue[]; // 著作列表
  totalRevenue: number; // 總收益
}

interface RevenueStore {
  dataset: RevenueDataset | null; // 資料集
  loading: boolean; // 載入狀態
  error: string | null; // 錯誤訊息
  musicianRevenue: MusicianRevenue | null; // 音樂人收益摘要
  isStale: boolean; // 快取狀態

  loadDataset: () => Promise<void>; // 載入資料集
  loadDatasetWithCache: () => Promise<void>; // 載入資料集（使用快取）
  calculateRevenue: (musicianId: number) => void; // 計算音樂人收益
  clearError: () => void; // 清除錯誤 
}

export const useRevenueStore = create<RevenueStore>((set, get) => ({
  dataset: null,
  loading: false,
  error: null,
  musicianRevenue: null,
  isStale: false,
  
  loadDataset: async () => {
    set({ loading: true, error: null });
    try {
      // 載入四個 mock JSON 檔案
      const [musiciansRes, musicalWorksRes, copyrightsRes, royaltiesRes] = await Promise.all([
        fetch('/mock/musicians.json'),
        fetch('/mock/musicalWorks.json'),
        fetch('/mock/musicalWorkCopyrights.json'),
        fetch('/mock/royaltyRecords.json')
      ]);
      
      if (!musiciansRes.ok || !musicalWorksRes.ok || !copyrightsRes.ok || !royaltiesRes.ok) {
        throw new Error('無法載入資料檔案');
      }
      
      const [musicians, musicalWorks, copyrights, royalties] = await Promise.all([
        musiciansRes.json(),
        musicalWorksRes.json(),
        copyrightsRes.json(),
        royaltiesRes.json()
      ]);
      
      const dataset: RevenueDataset = {
        musicians,
        musicalWorks,
        musicalWorkCopyrights: copyrights,
        royaltyRecords: royalties
      };
      
      set({ dataset, loading: false, isStale: false }); // 設定資料集和 fetch, 快取狀態
      
      // 自動計算第一個音樂人的收益
      if (musicians.length > 0) {
        get().calculateRevenue(musicians[0].Id);
      }
      
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '載入資料時發生錯誤', 
        loading: false 
      });
    }
  },

  /**
   * 載入資料集（使用快取）
   */
  loadDatasetWithCache: async () => {
    const CACHE_KEY = 'revenue-dataset-cache'; // 快取 key
    const CACHE_TTL = 5 * 60 * 1000; // 5分鐘過期
    
    console.log('SWR 快取策略開始執行...');
    
    // 1. 檢查快取
    const cached = localStorage.getItem(CACHE_KEY); // 取得快取資料
    if (cached) {
      try {
        // 解析快取資料
        const { data, timestamp } = JSON.parse(cached);
        // 檢查快取是否過期
        const isExpired = Date.now() - timestamp > CACHE_TTL;
        const cacheAge = Math.floor((Date.now() - timestamp) / 1000);
        
        console.log(`快取年齡: ${cacheAge}秒, 過期時間: ${CACHE_TTL / 1000}秒`);
        
        if (!isExpired) {
          console.log('快取有效，立即顯示快取資料');
          // 顯示快取資料
          set({ dataset: data, loading: false, isStale: true });
          if (data.musicians.length > 0) {
            get().calculateRevenue(data.musicians[0].Id);
          }
          
          console.log('開始背景更新最新資料...');
          // 在背景更新最新資料
          get().loadDataset().then(() => {
            console.log('背景更新完成，替換快取資料');
            set({ isStale: false });
          });
          return;
        } else {
          console.log('快取已過期，需要重新載入');
        }
      } catch (e) {
        // 快取解析失敗，清除快取
        localStorage.removeItem(CACHE_KEY);
      }
    } else {
      console.log('沒有找到快取資料');
    }
    
    // 2. 沒有快取或已過期，正常載入
    console.log('開始載入最新資料...');
    set({ isStale: false });
    await get().loadDataset();
    
    // 3. 儲存到快取
    const { dataset } = get();
    if (dataset) {
      console.log('將最新資料儲存到快取');
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: dataset,
        timestamp: Date.now()
      }));
    }
  },
  
  /**
   * 計算音樂人收益
   * @param musicianId 音樂人 ID
   * @returns 
   */
  calculateRevenue: (musicianId: number) => {
    const { dataset } = get();
    if (!dataset) {
      set({ musicianRevenue: null });
      return;
    }
    
    try {
      const musician = dataset.musicians.find(m => m.Id === musicianId);
      if (!musician) {
        set({ musicianRevenue: null });
        return;
      }
      
      // 找出該音樂人的所有著作權分配
      const musicianCopyrights = dataset.musicalWorkCopyrights.filter(
        c => c.MusicianId === musicianId
      );
      
      // 計算每個著作的收益
      const works: MusicianWorkRevenue[] = musicianCopyrights.map(copyright => {
        const work = dataset.musicalWorks.find(w => w.Id === copyright.MusicalWorkId);
        if (!work) return null;
        
        // 找出該著作權分配的所有版稅紀錄
        const royalties = dataset.royaltyRecords.filter(
          r => r.MusicalWorkCopyrightId === copyright.Id
        );
        
        // 計算總收益（考慮權利比例）
        const totalRevenue = royalties.reduce((sum, royalty) => {
          return sum + (royalty.Amount * copyright.Percentage);
        }, 0);
        
        return {
          workId: work.Id,
          workTitle: work.Title,
          percentage: copyright.Percentage,
          totalRevenue: Math.round(totalRevenue * 100) / 100, // 四捨五入到小數點後兩位
          royaltyRecords: royalties
        };
      }).filter(Boolean) as MusicianWorkRevenue[];
      
      // 計算總收益
      const totalRevenue = works.reduce((sum, work) => sum + work.totalRevenue, 0);
      
      const musicianRevenue: MusicianRevenue = {
        musicianId: musician.Id,
        musicianName: musician.Name,
        works,
        totalRevenue: Math.round(totalRevenue * 100) / 100
      };
      
      set({ musicianRevenue });
      
    } catch (error) {
      set({ 
        error: '計算收益時發生錯誤', 
        musicianRevenue: null 
      });
    }
  },
  
  clearError: () => {
    set({ error: null });
  }
}));
