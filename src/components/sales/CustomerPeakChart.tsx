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
import { HourlyCustomerData, DailyCustomerData } from '../../types/sales';
import { DisplayMode as ReportDisplayMode } from '../../types/displayMode';

// 刻み幅の型定義
type TimeScale = '30min' | '1hour' | '2hour';

interface CustomerPeakChartProps {
  // 表示モード（日報/月報）
  displayMode?: ReportDisplayMode;
  
  // 日報モード用データ
  hourlyData?: HourlyCustomerData[];
  halfHourlyData?: HourlyCustomerData[];
  twoHourlyData?: HourlyCustomerData[];
  
  // 日報モード用比較データ
  previousDayHourlyData?: HourlyCustomerData[];
  previousDayHalfHourlyData?: HourlyCustomerData[];
  previousDayTwoHourlyData?: HourlyCustomerData[];
  
  previousWeekHourlyData?: HourlyCustomerData[];
  previousWeekHalfHourlyData?: HourlyCustomerData[];
  previousWeekTwoHourlyData?: HourlyCustomerData[];
  
  previousYearHourlyData?: HourlyCustomerData[];
  previousYearHalfHourlyData?: HourlyCustomerData[];
  previousYearTwoHourlyData?: HourlyCustomerData[];
  
  // 月報モード用データ
  dailyData?: DailyCustomerData[];
  previousMonthDailyData?: DailyCustomerData[];
  previousYearDailyData?: DailyCustomerData[];
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


// 共通のタブボタンコンポーネント
interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, label }) => (
  <button
    onClick={onClick}
    style={{
      background: isActive ? ObjectColor.AccentPrimary : Surface.Primary,
      color: isActive ? Surface.Primary : Text.Primary,
      border: 'none',
      padding: '8px 16px',
      fontSize: '14px',
      cursor: 'pointer',
      fontWeight: isActive ? 'bold' : 'normal',
      transition: 'background-color 0.2s'
    }}
  >
    {label}
  </button>
);

// 共通のタブグループコンポーネント
interface TabGroupProps {
  children: React.ReactNode;
}

const TabGroup: React.FC<TabGroupProps> = ({ children }) => (
  <div style={{
    display: 'flex',
    borderRadius: '8px',
    overflow: 'hidden',
    border: `1px solid ${Border.LowEmphasis}`,
    width: 'fit-content'
  }}>
    {children}
  </div>
);

// 比較モードの表示名を取得するヘルパー関数
const getComparisonModeLabel = (mode: ComparisonMode): string => {
  switch (mode) {
    case 'previousDay': return '前日';
    case 'previousWeek': return '前週同曜日';
    case 'previousYear': return '前年同日';
    default: return '';
  }
};

const CustomerPeakChart: React.FC<CustomerPeakChartProps> = (props) => {
  // 表示モードの状態（デフォルトは客数）
  const [displayMode, setDisplayMode] = useState<DisplayMode>('partySize');
  // 比較モードの状態（デフォルトは比較なし）
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('none');
  // 刻み幅の状態（デフォルトは1時間）
  const [timeScale, setTimeScale] = useState<TimeScale>('1hour');
  
  // 日報/月報モード
  const isMonthlyMode = props.displayMode === ReportDisplayMode.MONTHLY;
  
  // 現在のデータを取得（日報/月報モードに応じて）
  const getCurrentData = () => {
    if (isMonthlyMode) {
      // 月報モードの場合は日別データを返す
      return props.dailyData || [];
    } else {
      // 日報モードの場合は時間帯別データを返す
      switch (timeScale) {
        case '30min': return props.halfHourlyData || [];
        case '1hour': return props.hourlyData || [];
        case '2hour': return props.twoHourlyData || [];
        default: return props.hourlyData || [];
      }
    }
  };
  
  // 比較データを取得（日報/月報モードに応じて）
  const getComparisonData = () => {
    if (comparisonMode === 'none') return null;
    
    if (isMonthlyMode) {
      // 月報モードの場合
      switch (comparisonMode) {
        case 'previousDay':
        case 'previousWeek':
          // 月報モードでは前日/前週は前月として扱う
          return props.previousMonthDailyData;
        case 'previousYear':
          return props.previousYearDailyData;
        default:
          return null;
      }
    } else {
      // 日報モードの場合
      switch (comparisonMode) {
        case 'previousDay':
          return timeScale === '30min' ? props.previousDayHalfHourlyData :
                 timeScale === '1hour' ? props.previousDayHourlyData :
                 props.previousDayTwoHourlyData;
        case 'previousWeek':
          return timeScale === '30min' ? props.previousWeekHalfHourlyData :
                 timeScale === '1hour' ? props.previousWeekHourlyData :
                 props.previousWeekTwoHourlyData;
        case 'previousYear':
          return timeScale === '30min' ? props.previousYearHourlyData :
                 timeScale === '1hour' ? props.previousYearHourlyData :
                 props.previousYearTwoHourlyData;
        default:
          return null;
      }
    }
  };
  
  // 現在のデータと比較データ
  const currentData: (HourlyCustomerData | DailyCustomerData)[] = getCurrentData();
  const comparisonData: (HourlyCustomerData | DailyCustomerData)[] | null | undefined = getComparisonData();
  
  // 合計客組数と合計人数を計算
  const totalGroups = currentData.reduce<number>((sum, item) => sum + item.count, 0);
  const totalPeople = currentData.reduce<number>((sum, item) => sum + item.partySize, 0);
  
  // 比較データの合計客組数と合計人数を計算（比較データがある場合）
  const comparisonTotalGroups = comparisonData
    ? comparisonData.reduce<number>((sum, item) => sum + item.count, 0)
    : 0;
  const comparisonTotalPeople = comparisonData
    ? comparisonData.reduce<number>((sum, item) => sum + item.partySize, 0)
    : 0;
  
  // X軸の目盛りとデータを生成（日報/月報モードに応じて）
  let xAxisTicks: string[] = [];
  let completeData: any[] = [];
  
  if (isMonthlyMode) {
    // 月報モード: 1日から31日までの日付を生成
    xAxisTicks = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
    
    // データがない日も含めた完全なデータセットを作成
    completeData = xAxisTicks.map(day => {
      // 現在のデータから該当する日のデータを検索
      const dailyData = currentData as DailyCustomerData[];
      const existingData = dailyData.find(item => item.day === day);
      const currentCount = existingData ? existingData.count : 0;
      const currentPartySize = existingData ? existingData.partySize : 0;
      
      // 比較データから該当する日のデータを検索
      const comparisonDailyData = comparisonData as DailyCustomerData[] | null;
      const comparisonDayData = comparisonDailyData?.find(item => item.day === day);
      const comparisonCount = comparisonDayData ? comparisonDayData.count : 0;
      const comparisonPartySize = comparisonDayData ? comparisonDayData.partySize : 0;
      
      return {
        day,
        count: currentCount,
        partySize: currentPartySize,
        comparisonCount: comparisonCount,
        comparisonPartySize: comparisonPartySize
      };
    });
  } else {
    // 日報モード: 刻み幅に応じた時間帯の目盛りを生成
    const getHourTicks = () => {
      switch (timeScale) {
        case '30min':
          // 10:00から24:00までの30分区切りの時間帯を生成
          return Array.from({ length: 29 }, (_, i) => {
            const hour = Math.floor(i / 2) + 10;
            const minute = i % 2 === 0 ? '00' : '30';
            return `${hour.toString().padStart(2, '0')}:${minute}`;
          });
        case '1hour':
          // 10:00から24:00までの1時間区切りの時間帯を生成
          return Array.from({ length: 15 }, (_, i) => `${(i + 10).toString().padStart(2, '0')}:00`);
        case '2hour':
          // 10:00から24:00までの2時間区切りの時間帯を生成
          return Array.from({ length: 8 }, (_, i) => {
            const startHour = i * 2 + 10;
            const endHour = startHour + 2;
            return `${startHour.toString().padStart(2, '0')}:00-${endHour.toString().padStart(2, '0')}:00`;
          });
        default:
          return Array.from({ length: 15 }, (_, i) => `${(i + 10).toString().padStart(2, '0')}:00`);
      }
    };
    
    xAxisTicks = getHourTicks();
    
    // データがない時間帯も含めた完全なデータセットを作成
    completeData = xAxisTicks.map(hour => {
      // 現在のデータから該当する時間帯のデータを検索
      const hourlyData = currentData as HourlyCustomerData[];
      const existingData = hourlyData.find(item => item.hour === hour);
      const currentCount = existingData ? existingData.count : 0;
      const currentPartySize = existingData ? existingData.partySize : 0;
      
      // 比較データから該当する時間帯のデータを検索
      const comparisonHourlyData = comparisonData as HourlyCustomerData[] | null;
      const comparisonHourData = comparisonHourlyData?.find(item => item.hour === hour);
      const comparisonCount = comparisonHourData ? comparisonHourData.count : 0;
      const comparisonPartySize = comparisonHourData ? comparisonHourData.partySize : 0;
      
      return {
        hour,
        count: currentCount,
        partySize: currentPartySize,
        comparisonCount: comparisonCount,
        comparisonPartySize: comparisonPartySize
      };
    });
  }
  
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
        
        {/* 2. 操作系UIを横並びに */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px'
        }}>
          {/* 表示モード切替タブUI */}
          <TabGroup>
            <TabButton
              isActive={displayMode === 'partySize'}
              onClick={() => setDisplayMode('partySize')}
              label="客数"
            />
            <TabButton
              isActive={displayMode === 'count'}
              onClick={() => setDisplayMode('count')}
              label="客組数"
            />
          </TabGroup>
          
          {/* 刻み幅切替タブUI - 日報モードの場合のみ表示 */}
          {!isMonthlyMode && (
            <TabGroup>
              <TabButton
                isActive={timeScale === '30min'}
                onClick={() => setTimeScale('30min')}
                label="30分"
              />
              <TabButton
                isActive={timeScale === '1hour'}
                onClick={() => setTimeScale('1hour')}
                label="1時間"
              />
              <TabButton
                isActive={timeScale === '2hour'}
                onClick={() => setTimeScale('2hour')}
                label="2時間"
              />
            </TabGroup>
          )}
          
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
            {comparisonMode !== 'none' && comparisonData && (
              <span style={{ fontSize: '12px', marginLeft: '8px', color: Text.Secondary }}>
                ({getComparisonModeLabel(comparisonMode)}: {comparisonTotalPeople}人)
              </span>
            )}
          </h4>
          <h4 style={{
            margin: 0,
            color: displayMode === 'count' ? Text.Primary : Text.Secondary,
            fontWeight: displayMode === 'count' ? 'bold' : 'normal'
          }}>
            合計客組数: {totalGroups}組
            {comparisonMode !== 'none' && comparisonData && (
              <span style={{ fontSize: '12px', marginLeft: '8px', color: Text.Secondary }}>
                ({getComparisonModeLabel(comparisonMode)}: {comparisonTotalGroups}組)
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
              dataKey={isMonthlyMode ? "day" : "hour"}
              ticks={xAxisTicks}
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
            {comparisonMode !== 'none' && comparisonData && (
              <Bar
                dataKey={displayMode === 'count' ? 'comparisonCount' : 'comparisonPartySize'}
                name={`${getComparisonModeLabel(comparisonMode)}${displayMode === 'count' ? '客組数' : '客数'}`}
                fill={ObjectColor.AccentSecondary}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomerPeakChart;