import { HourlyCustomerData, DailyCustomerData } from '../../types/sales';
import { DisplayMode as ReportDisplayMode } from '../../types/displayMode';

// 表示モードの型定義
export type ChartDisplayMode = 'count' | 'partySize';

// 比較モードの型定義
export type ComparisonMode = 'none' | 'previousDay' | 'previousWeek' | 'previousYear';

// 刻み幅の型定義
export type TimeScale = '30min' | '1hour' | '2hour';

/**
 * 比較モードの表示名を取得するヘルパー関数
 * @param mode 比較モード
 * @returns 表示名
 */
export const getComparisonModeLabel = (mode: ComparisonMode): string => {
  switch (mode) {
    case 'previousDay': return '前日';
    case 'previousWeek': return '前週同曜日';
    case 'previousYear': return '前年同日';
    default: return '';
  }
};

/**
 * 現在のデータを取得（日報/月報モードに応じて）
 * @param displayMode 表示モード（日報/月報）
 * @param timeScale 刻み幅（30分/1時間/2時間）
 * @param hourlyData 1時間区切りのデータ
 * @param halfHourlyData 30分区切りのデータ
 * @param twoHourlyData 2時間区切りのデータ
 * @param dailyData 日別データ
 * @returns 現在のデータ
 */
export const getCurrentData = (
  displayMode: ReportDisplayMode,
  timeScale: TimeScale,
  hourlyData?: HourlyCustomerData[],
  halfHourlyData?: HourlyCustomerData[],
  twoHourlyData?: HourlyCustomerData[],
  dailyData?: DailyCustomerData[]
): (HourlyCustomerData | DailyCustomerData)[] => {
  if (displayMode === ReportDisplayMode.MONTHLY) {
    // 月報モードの場合は日別データを返す
    return dailyData || [];
  } else {
    // 日報モードの場合は時間帯別データを返す
    switch (timeScale) {
      case '30min': return halfHourlyData || [];
      case '1hour': return hourlyData || [];
      case '2hour': return twoHourlyData || [];
      default: return hourlyData || [];
    }
  }
};

/**
 * 比較データを取得（日報/月報モードに応じて）
 * @param displayMode 表示モード（日報/月報）
 * @param comparisonMode 比較モード
 * @param timeScale 刻み幅（30分/1時間/2時間）
 * @param previousDayHourlyData 前日の1時間区切りデータ
 * @param previousDayHalfHourlyData 前日の30分区切りデータ
 * @param previousDayTwoHourlyData 前日の2時間区切りデータ
 * @param previousWeekHourlyData 前週の1時間区切りデータ
 * @param previousWeekHalfHourlyData 前週の30分区切りデータ
 * @param previousWeekTwoHourlyData 前週の2時間区切りデータ
 * @param previousYearHourlyData 前年の1時間区切りデータ
 * @param previousYearHalfHourlyData 前年の30分区切りデータ
 * @param previousYearTwoHourlyData 前年の2時間区切りデータ
 * @param previousMonthDailyData 前月の日別データ
 * @param previousYearDailyData 前年の日別データ
 * @returns 比較データ
 */
export const getComparisonData = (
  displayMode: ReportDisplayMode,
  comparisonMode: ComparisonMode,
  timeScale: TimeScale,
  previousDayHourlyData?: HourlyCustomerData[],
  previousDayHalfHourlyData?: HourlyCustomerData[],
  previousDayTwoHourlyData?: HourlyCustomerData[],
  previousWeekHourlyData?: HourlyCustomerData[],
  previousWeekHalfHourlyData?: HourlyCustomerData[],
  previousWeekTwoHourlyData?: HourlyCustomerData[],
  previousYearHourlyData?: HourlyCustomerData[],
  previousYearHalfHourlyData?: HourlyCustomerData[],
  previousYearTwoHourlyData?: HourlyCustomerData[],
  previousMonthDailyData?: DailyCustomerData[],
  previousYearDailyData?: DailyCustomerData[]
): (HourlyCustomerData | DailyCustomerData)[] | null => {
  if (comparisonMode === 'none') return null;
  
  if (displayMode === ReportDisplayMode.MONTHLY) {
    // 月報モードの場合
    switch (comparisonMode) {
      case 'previousDay':
      case 'previousWeek':
        // 月報モードでは前日/前週は前月として扱う
        return previousMonthDailyData || [];
      case 'previousYear':
        return previousYearDailyData || [];
      default:
        return null;
    }
  } else {
    // 日報モードの場合
    switch (comparisonMode) {
      case 'previousDay':
        return timeScale === '30min' ? previousDayHalfHourlyData || [] :
               timeScale === '1hour' ? previousDayHourlyData || [] :
               previousDayTwoHourlyData || [];
      case 'previousWeek':
        return timeScale === '30min' ? previousWeekHalfHourlyData || [] :
               timeScale === '1hour' ? previousWeekHourlyData || [] :
               previousWeekTwoHourlyData || [];
      case 'previousYear':
        return timeScale === '30min' ? previousYearHalfHourlyData || [] :
               timeScale === '1hour' ? previousYearHourlyData || [] :
               previousYearTwoHourlyData || [];
      default:
        return null;
    }
  }
};

/**
 * 時間帯の目盛りを生成する関数
 * @param timeScale 刻み幅（30分/1時間/2時間）
 * @returns 時間帯の目盛り
 */
export const getHourTicks = (timeScale: TimeScale): string[] => {
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

/**
 * 月の日数の目盛りを生成する関数
 * @returns 日数の目盛り
 */
export const getDayTicks = (): string[] => {
  // 1日から31日までの日付を生成
  return Array.from({ length: 31 }, (_, i) => (i + 1).toString());
};