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
  /** 主鍵 */
  Id: number;
  /** 音樂人顯示名稱 */
  Name: string;
}

/**
 * 音樂著作（作品 / 歌曲）
 *
 * JSON 來源：public/mock/musicalWorks.json
 */
export interface MusicalWork {
  /** 主鍵 */
  Id: number;
  /** 作品標題 */
  Title: string;
}

/**
 * 著作權分配紀錄：連結音樂人與作品，並記錄其權利比例
 * 同一首作品可有多筆分權設定
 *
 * JSON 來源：public/mock/musicalWorkCopyrights.json
 */
export interface MusicalWorkCopyright {
  /** 主鍵 */
  Id: number;
  /** 外鍵 → Musician.Id */
  MusicianId: number;
  /** 外鍵 → MusicalWork.Id */
  MusicalWorkId: number;
  /** 權利比例（小數 0.0 ~ 1.0） */
  Percentage: number;
}

/**
 * 版稅（收益）紀錄：連結到特定的著作權分配（即某音樂人在某作品的份額）
 *
 * JSON 來源：public/mock/royaltyRecords.json
 */
export interface RoyaltyRecord {
  /** 主鍵 */
  Id: number;
  /** 外鍵 → MusicalWorkCopyright.Id */
  MusicalWorkCopyrightId: number;
  /** 此筆紀錄的金額（幣別由業務情境決定） */
  Amount: number;
  /** ISO 日期字串（YYYY-MM-DD），表示紀錄/入帳日期 */
  Date: string;
  /** 來源平台或通路（如：Spotify、YouTube、Live） */
  Source: string;
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
  /** 著作 ID */
  workId: number;
  /** 著作標題 */
  workTitle: string;
  /** 權利比例 */
  percentage: number;
  /** 該著作總收益 */
  totalRevenue: number;
  /** 該著作的版稅紀錄 */
  royaltyRecords: RoyaltyRecord[];
}

/**
 * 音樂人收益摘要
 */
export interface MusicianRevenue {
  /** 音樂人 ID */
  musicianId: number;
  /** 音樂人姓名 */
  musicianName: string;
  /** 著作列表 */
  works: MusicianWorkRevenue[];
  /** 總收益 */
  totalRevenue: number;
}

interface RevenueStore {
  // 資料狀態
  dataset: RevenueDataset | null;
  
  // UI 狀態
  loading: boolean;
  error: string | null;
  
  // 計算結果
  musicianRevenue: MusicianRevenue | null;
  
  // Actions
  loadDataset: () => Promise<void>;
  calculateRevenue: (musicianId: number) => void;
  clearError: () => void;
}

export const useRevenueStore = create<RevenueStore>((set, get) => ({
  dataset: null,
  loading: false,
  error: null,
  musicianRevenue: null,
  
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
      
      set({ dataset, loading: false });
      
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
