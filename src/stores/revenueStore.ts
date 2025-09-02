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
