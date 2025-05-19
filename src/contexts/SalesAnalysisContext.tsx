import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DisplayMode } from '../types/displayMode';

interface SalesAnalysisContextType {
  displayMode: DisplayMode;
  currentDate: Date;
  lastDailyDate: Date;
  setDisplayMode: (mode: DisplayMode) => void;
  setCurrentDate: (date: Date) => void;
  handlePrevDay: () => void;
  handleNextDay: () => void;
  handleToday: () => void;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handleModeChange: (mode: DisplayMode) => void;
}

const SalesAnalysisContext = createContext<SalesAnalysisContextType | undefined>(undefined);

export const SalesAnalysisProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // URLからクエリパラメータを解析
  const queryParams = new URLSearchParams(location.search);
  const modeParam = queryParams.get('mode');
  const dateParam = queryParams.get('date');
  
  // 初期状態の設定（URLパラメータがあればそれを使用）
  const initialMode = modeParam === 'monthly' ? DisplayMode.MONTHLY : DisplayMode.DAILY;
  const initialDate = dateParam ? new Date(dateParam) : new Date('2024-05-16');
  
  // 状態管理
  const [displayMode, setDisplayModeState] = useState<DisplayMode>(initialMode);
  const [currentDate, setCurrentDateState] = useState<Date>(initialDate);
  const [lastDailyDate, setLastDailyDate] = useState<Date>(initialDate);
  
  // URLクエリパラメータを更新する関数
  const updateQueryParams = (mode: DisplayMode, date: Date) => {
    const currentPath = location.pathname;
    const params = new URLSearchParams(location.search);
    
    params.set('mode', mode === DisplayMode.DAILY ? 'daily' : 'monthly');
    params.set('date', date.toISOString().split('T')[0]); // YYYY-MM-DD形式
    
    navigate(`${currentPath}?${params.toString()}`, { replace: true });
  };
  
  // 状態を設定し、URLも更新するラッパー関数
  const setDisplayMode = (mode: DisplayMode) => {
    setDisplayModeState(mode);
    updateQueryParams(mode, currentDate);
  };
  
  const setCurrentDate = (date: Date) => {
    setCurrentDateState(date);
    updateQueryParams(displayMode, date);
  };
  
  // 日付が変更されたときに最後の日報日付を更新
  useEffect(() => {
    if (displayMode === DisplayMode.DAILY) {
      setLastDailyDate(currentDate);
    }
  }, [currentDate, displayMode]);

  // 日付操作ハンドラ - 日報モード
  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };
  
  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };
  
  const handleToday = () => {
    setCurrentDate(new Date('2024-05-16')); // サンプルデータの日付に合わせる
  };

  // 日付操作ハンドラ - 月報モード
  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };
  
  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // 表示モード切替ハンドラ
  const handleModeChange = (mode: DisplayMode) => {
    if (mode === displayMode) return;

    if (mode === DisplayMode.DAILY) {
      // 月報から日報に切り替える場合
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      // 最後に表示した日報の日付が現在の月と同じ場合はその日付を表示
      if (lastDailyDate.getMonth() === currentMonth && lastDailyDate.getFullYear() === currentYear) {
        setCurrentDate(new Date(lastDailyDate));
      } else {
        // そうでない場合は月の1日を表示
        const newDate = new Date(currentDate);
        newDate.setDate(1);
        setCurrentDate(newDate);
      }
    }
    
    // 表示モードを更新
    setDisplayMode(mode);
  };

  return (
    <SalesAnalysisContext.Provider value={{
      displayMode,
      currentDate,
      lastDailyDate,
      setDisplayMode,
      setCurrentDate,
      handlePrevDay,
      handleNextDay,
      handleToday,
      handlePrevMonth,
      handleNextMonth,
      handleModeChange
    }}>
      {children}
    </SalesAnalysisContext.Provider>
  );
};

export const useSalesAnalysis = () => {
  const context = useContext(SalesAnalysisContext);
  if (context === undefined) {
    throw new Error('useSalesAnalysis must be used within a SalesAnalysisProvider');
  }
  return context;
};