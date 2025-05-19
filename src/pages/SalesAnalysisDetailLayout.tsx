import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import PeriodSelector from '../components/sales/PeriodSelector';
import { TabButton } from '../components/common/tabs';
import { Border } from '../styles/semanticColors';
import { useSalesAnalysis } from '../contexts/SalesAnalysisContext';

/**
 * 売上分析詳細画面のレイアウトコンポーネント
 * 期間選択、タブナビゲーション、子ルートのレンダリング領域を提供する
 */
const SalesAnalysisDetailLayout: React.FC = () => {
  const { 
    displayMode, 
    currentDate, 
    handlePrevDay, 
    handleNextDay, 
    handleToday, 
    handlePrevMonth, 
    handleNextMonth, 
    handleModeChange 
  } = useSalesAnalysis();
  
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop() || 'period';
  
  // 現在のクエリパラメータを取得
  const queryParams = location.search;

  return (
    <div style={{ padding: 24 }}>
      {/* 期間選択 */}
      <PeriodSelector
        displayMode={displayMode}
        currentDate={currentDate}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        onToday={handleToday}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onModeChange={handleModeChange}
      />

      {/* タブUI */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ 
          display: 'flex', 
          borderBottom: `1px solid ${Border.LowEmphasis}`,
          marginBottom: 16
        }}>
          <NavLink
            to={`period${queryParams}`}
            style={({ isActive }) => ({
              textDecoration: 'none'
            })}
          >
            {({ isActive }) => (
              <TabButton
                isActive={isActive}
                onClick={() => {}}
                label="期間別売上"
              />
            )}
          </NavLink>
          <NavLink
            to={`product${queryParams}`}
            style={({ isActive }) => ({
              textDecoration: 'none'
            })}
          >
            {({ isActive }) => (
              <TabButton
                isActive={isActive}
                onClick={() => {}}
                label="商品別売上"
              />
            )}
          </NavLink>
          <NavLink
            to={`payment${queryParams}`}
            style={({ isActive }) => ({
              textDecoration: 'none'
            })}
          >
            {({ isActive }) => (
              <TabButton
                isActive={isActive}
                onClick={() => {}}
                label="支払い方法別売上"
              />
            )}
          </NavLink>
        </div>
      </div>

      {/* タブコンテンツ（子ルート） */}
      <Outlet />
    </div>
  );
};

export default SalesAnalysisDetailLayout;