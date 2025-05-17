import { Object, Text } from '../../styles/semanticColors';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faArrowUp, faArrowDown } from '@fortawesome/pro-solid-svg-icons';

/**
 * サブ値から増減を判断する関数
 * @param subValue 比較値の文字列
 * @returns 増減傾向
 */
export const determineTrend = (subValue: string): 'up' | 'down' | 'neutral' => {
  if (!subValue) return 'neutral';
  
  if (subValue.includes('+')) return 'up';
  if (subValue.includes('-')) return 'down';
  
  return 'neutral';
};

/**
 * 増減に応じた色を返す関数
 * @param trend 増減傾向
 * @returns 色コード
 */
export const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
  switch (trend) {
    case 'up': return Object.Success;
    case 'down': return Object.Danger;
    default: return Text.LowEmphasis;
  }
};

/**
 * 増減に応じたアイコンを返す関数
 * @param trend 増減傾向
 * @returns FontAwesomeアイコン
 */
export const getTrendIcon = (trend: 'up' | 'down' | 'neutral'): IconDefinition | null => {
  switch (trend) {
    case 'up': return faArrowUp;
    case 'down': return faArrowDown;
    default: return null;
  }
};

/**
 * 実データから比較値を算出する関数
 * @param current 現在の値
 * @param previous 比較対象の値
 * @param type 比較タイプ（日/週/月/年）
 * @param valueUnit 値の単位（例：'円'、'人'）
 * @returns フォーマットされた比較値の文字列
 */
export const calculateComparison = (
  current: number,
  previous: number,
  type: 'day' | 'week' | 'month' | 'year',
  valueUnit: string = ''
): string => {
  if (previous === undefined || previous === null) return '';
  
  // 差分を計算し、小数点以下を丸める
  const diff = Math.round(current - previous);
  
  let prefix = '';
  switch (type) {
    case 'day': prefix = '前日から'; break;
    case 'week': prefix = '前週から'; break;
    case 'month': prefix = '前月から'; break;
    case 'year': prefix = '前年から'; break;
  }
  
  const sign = diff >= 0 ? '+' : '';
  return `${prefix} ${sign}${diff.toLocaleString()}${valueUnit}`;
};