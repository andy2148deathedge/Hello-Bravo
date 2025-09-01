# Zustand 狀態管理示範

## 概述

這個專案已經成功整合了 Zustand 作為狀態管理工具，並新增了一個「狀態」分頁來展示如何使用 Zustand 從 API 獲取資料。

## 新增的功能

### 1. Zustand Store (`src/stores/apiStore.ts`)

創建了一個 Zustand store 來管理 API 資料：

- **狀態**：

  - `posts`: 存儲從 API 獲取的文章資料
  - `loading`: 載入狀態指示器
  - `error`: 錯誤訊息

- **動作**：
  - `fetchPosts()`: 從 JSONPlaceholder API 獲取文章資料
  - `clearPosts()`: 清除所有文章資料

### 2. 新的「狀態」分頁 (`src/pages/State.tsx`)

這個分頁展示了：

- 使用 Zustand hook (`useApiStore`) 來存取狀態
- 自動載入資料（組件掛載時）
- 手動重新獲取資料
- 清除資料功能
- 載入狀態和錯誤處理
- 響應式設計的文章卡片展示

### 3. 導航更新

在 Header 組件中新增了「狀態」導航連結，並在 App.tsx 中添加了對應的路由。

## 使用方法

1. **訪問「狀態」分頁**：點擊導航欄中的「狀態」連結
2. **查看自動載入的資料**：頁面會自動從 API 獲取 10 篇文章
3. **重新獲取資料**：點擊「重新獲取資料」按鈕
4. **清除資料**：點擊「清除資料」按鈕

## 技術特點

- **TypeScript 支援**：完整的型別定義
- **錯誤處理**：優雅的錯誤處理和用戶提示
- **載入狀態**：清晰的載入指示器
- **響應式設計**：適配各種螢幕尺寸
- **現代 UI**：使用漸層背景和卡片設計

## API 資料來源

使用 [JSONPlaceholder](https://jsonplaceholder.typicode.com/) 作為測試 API，獲取模擬的文章資料。

## 依賴項目

- `zustand`: 輕量級狀態管理庫
- `react`: React 框架
- `react-router-dom`: 路由管理

## 下一步

您可以基於這個範例來：

1. 擴展 store 以管理更多類型的資料
2. 添加更多 API 端點
3. 實現資料持久化
4. 添加更多互動功能（如搜尋、篩選等）
