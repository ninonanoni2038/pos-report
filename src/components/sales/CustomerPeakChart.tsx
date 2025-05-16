import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Surface, Text, Border, Object as ObjectColor } from '../../styles/semanticColors';
import { HourlyCustomerData } from '../../types/sales';

interface CustomerPeakChartProps {
  data: HourlyCustomerData[];
  // 比較用データはすべてオプショナルにしておく
  previousDayData?: HourlyCustomerData[];
  previousWeekData?: HourlyCustomerData[];
  previousYearData?: HourlyCustomerData[];
}

/**
 * 客ピークグラフコンポーネント
 * 時間帯別の客数を縦棒グラフで表示する
 */
// 表示モードの型定義
type DisplayMode = 'count' | 'partySize';

// 比較モードの型定義
type ComparisonMode = 'none' | 'previousDay' | 'previousWeek' | 'previousYear';

// 比較モードの選択肢
const COMPARISON_OPTIONS = [
  { value: 'none', label: '比較なし' },
  { value: 'previousDay', label: '前日の比較' },
  { value: 'previousWeek', label: '前週同曜日との比較' },
  { value: 'previousYear', label: '前年同日との比較' }
];


const CustomerPeakChart: React.FC<CustomerPeakChartProps> = ({
  data,
  previousDayData,
  previousWeekData,
  previousYearData
}) => {
  // 表示モードの状態（デフォルトは客数）
  const [displayMode, setDisplayMode] = useState<DisplayMode>('partySize');
  // 比較モードの状態（デフォルトは比較なし）
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('none');
  
  // 合計客組数と合計人数を計算
  const totalGroups = data.reduce((sum, item) => sum + item.count, 0);
  const totalPeople = data.reduce((sum, item) => sum + item.partySize, 0);
  
  // 前日の合計客組数と合計人数を計算（前日データがある場合）
  const previousTotalGroups = previousDayData
    ? previousDayData.reduce((sum, item) => sum + item.count, 0)
    : 0;
  const previousTotalPeople = previousDayData
    ? previousDayData.reduce((sum, item) => sum + item.partySize, 0)
    : 0;
  
  // 10:00から24:00までの時間帯を生成
  const hourTicks = Array.from({ length: 15 }, (_, i) => `${(i + 10).toString().padStart(2, '0')}:00`);
  
  // データがない時間帯も含めた完全なデータセットを作成
  const completeData = hourTicks.map(hour => {
    const existingData = data.find(item => item.hour === hour);
    const currentCount = existingData ? existingData.count : 0;
    const currentPartySize = existingData ? existingData.partySize : 0;
    
    // 比較データを取得（データがある場合）
    const previousDayHourData = previousDayData?.find(item => item.hour === hour);
    const previousWeekHourData = previousWeekData?.find(item => item.hour === hour);
    const previousYearHourData = previousYearData?.find(item => item.hour === hour);
    
    return {
      hour,
      count: currentCount,
      partySize: currentPartySize,
      previousDayCount: previousDayHourData ? previousDayHourData.count : 0,
      previousDayPartySize: previousDayHourData ? previousDayHourData.partySize : 0,
      previousWeekCount: previousWeekHourData ? previousWeekHourData.count : 0,
      previousWeekPartySize: previousWeekHourData ? previousWeekHourData.partySize : 0,
      previousYearCount: previousYearHourData ? previousYearHourData.count : 0,
      previousYearPartySize: previousYearHourData ? previousYearHourData.partySize : 0
    };
  });
  
  // 表示モードを切り替える関数
  const toggleDisplayMode = () => {
    setDisplayMode(prevMode => prevMode === 'count' ? 'partySize' : 'count');
  };
  
  
  return (
    <div style={{
      flex: 1,
      background: Surface.Primary,
      padding: 16,
      borderRadius: 8,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      {/* ヘッダー部分 - 縦に積み重ねるレイアウト */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '16px'
      }}>
        {/* 1. 見出し */}
        <h3 style={{ margin: 0, color: Text.Primary }}>客ピーク</h3>
        
        {/* 2. タブUIと比較モードドロップダウンを横並びに */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* タブUI */}
          <div style={{
            display: 'flex',
            borderRadius: '8px',
            overflow: 'hidden',
            border: `1px solid ${Border.LowEmphasis}`,
            width: 'fit-content'
          }}>
            <button
              onClick={() => setDisplayMode('partySize')}
              style={{
                background: displayMode === 'partySize' ? ObjectColor.AccentPrimary : Surface.Primary,
                color: displayMode === 'partySize' ? Surface.Primary : Text.Primary,
                border: 'none',
                padding: '8px 16px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: displayMode === 'partySize' ? 'bold' : 'normal',
                transition: 'background-color 0.2s'
              }}
            >
              客数
            </button>
            <button
              onClick={() => setDisplayMode('count')}
              style={{
                background: displayMode === 'count' ? ObjectColor.AccentPrimary : Surface.Primary,
                color: displayMode === 'count' ? Surface.Primary : Text.Primary,
                border: 'none',
                padding: '8px 16px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: displayMode === 'count' ? 'bold' : 'normal',
                transition: 'background-color 0.2s'
              }}
            >
              客組数
            </button>
          </div>
          
          {/* 比較モードドロップダウン */}
          <div style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <select
              value={comparisonMode}
              onChange={(e) => setComparisonMode(e.target.value as ComparisonMode)}
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                border: `1px solid ${Border.LowEmphasis}`,
                backgroundColor: Surface.Primary,
                color: Text.Primary,
                fontSize: '14px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {COMPARISON_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* 3. 合計値 */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <h4 style={{
            margin: 0,
            color: displayMode === 'partySize' ? Text.Primary : Text.Secondary,
            fontWeight: displayMode === 'partySize' ? 'bold' : 'normal'
          }}>
            合計客数: {totalPeople}人
            {comparisonMode === 'previousDay' && previousDayData && (
              <span style={{ fontSize: '12px', marginLeft: '8px', color: Text.Secondary }}>
                (前日: {previousTotalPeople}人)
              </span>
            )}
            {comparisonMode === 'previousWeek' && previousWeekData && (
              <span style={{ fontSize: '12px', marginLeft: '8px', color: Text.Secondary }}>
                (前週同曜日: {previousWeekData.reduce((sum, item) => sum + item.partySize, 0)}人)
              </span>
            )}
            {comparisonMode === 'previousYear' && previousYearData && (
              <span style={{ fontSize: '12px', marginLeft: '8px', color: Text.Secondary }}>
                (前年同日: {previousYearData.reduce((sum, item) => sum + item.partySize, 0)}人)
              </span>
            )}
          </h4>
          <h4 style={{
            margin: 0,
            color: displayMode === 'count' ? Text.Primary : Text.Secondary,
            fontWeight: displayMode === 'count' ? 'bold' : 'normal'
          }}>
            合計客組数: {totalGroups}組
            {comparisonMode === 'previousDay' && previousDayData && (
              <span style={{ fontSize: '12px', marginLeft: '8px', color: Text.Secondary }}>
                (前日: {previousTotalGroups}組)
              </span>
            )}
            {comparisonMode === 'previousWeek' && previousWeekData && (
              <span style={{ fontSize: '12px', marginLeft: '8px', color: Text.Secondary }}>
                (前週同曜日: {previousWeekData.reduce((sum, item) => sum + item.count, 0)}組)
              </span>
            )}
            {comparisonMode === 'previousYear' && previousYearData && (
              <span style={{ fontSize: '12px', marginLeft: '8px', color: Text.Secondary }}>
                (前年同日: {previousYearData.reduce((sum, item) => sum + item.count, 0)}組)
              </span>
            )}
          </h4>
        </div>
      </div>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={completeData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            barGap={2} // バー間の間隔を2pxに設定
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="hour"
              ticks={hourTicks}
              tickFormatter={(value) => value}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey={displayMode}
              name={displayMode === 'count' ? '客組数' : '客数'}
              fill={ObjectColor.AccentPrimary}
            />
            {/* 比較データのバー */}
            {comparisonMode === 'previousDay' && previousDayData && (
              <Bar
                dataKey={displayMode === 'count' ? 'previousDayCount' : 'previousDayPartySize'}
                name={`前日${displayMode === 'count' ? '客組数' : '客数'}`}
                fill={ObjectColor.AcceentSecondary}
              />
            )}
            {comparisonMode === 'previousWeek' && previousWeekData && (
              <Bar
                dataKey={displayMode === 'count' ? 'previousWeekCount' : 'previousWeekPartySize'}
                name={`前週同曜日${displayMode === 'count' ? '客組数' : '客数'}`}
                fill={ObjectColor.AcceentSecondary}
              />
            )}
            {comparisonMode === 'previousYear' && previousYearData && (
              <Bar
                dataKey={displayMode === 'count' ? 'previousYearCount' : 'previousYearPartySize'}
                name={`前年同日${displayMode === 'count' ? '客組数' : '客数'}`}
                fill={ObjectColor.AcceentSecondary}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomerPeakChart;