import React from 'react';
import { Surface, Text, Object } from '../../styles/semanticColors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowUp,
  faArrowDown,
  faMoneyBillWave,  // 売上金額用
  faUsers,          // 総客数用
  faReceipt         // 客単価用
} from '@fortawesome/pro-solid-svg-icons';

interface KpiCardProps {
  title: string;                      // カードのタイトル
  value: string;                      // 表示する値
  subValue?: string;                  // サブ値（オプション）
  onClick?: () => void;               // クリックハンドラ（オプション）
  icon?: IconDefinition;              // FontAwesomeアイコン（オプション）
  
  // 実データ比較用（すべてオプション）
  currentValue?: number;              // 現在の値
  previousValue?: number;             // 比較対象の値
  comparisonType?: 'day' | 'week' | 'month' | 'year'; // 比較タイプ
  valueUnit?: string;                 // 値の単位（例：'円'、'組'）
}

/**
 * サブ値から増減を判断する関数
 */
const determineTrend = (subValue: string): 'up' | 'down' | 'neutral' => {
  if (!subValue) return 'neutral';
  
  if (subValue.includes('+')) return 'up';
  if (subValue.includes('-')) return 'down';
  
  return 'neutral';
};

/**
 * 増減に応じた色を返す関数
 */
const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
  switch (trend) {
    case 'up': return Object.Success;
    case 'down': return Object.Danger;
    default: return Text.LowEmphasis;
  }
};

/**
 * 増減に応じたアイコンを返す関数
 */
const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
  switch (trend) {
    case 'up': return faArrowUp;
    case 'down': return faArrowDown;
    default: return null;
  }
};

/**
 * 実データから比較値を算出する関数
 */
const calculateComparison = (
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

/**
 * KPIカードコンポーネント
 * タイトル、値、サブ値（オプション）を表示するカード
 * クリック可能なオプションあり
 */
const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subValue,
  onClick,
  icon,
  currentValue,
  previousValue,
  comparisonType = 'day',
  valueUnit = ''
}) => {
  // サブ値の処理
  let displaySubValue = subValue;
  
  // 実データから比較値を算出（提供されている場合）
  if (currentValue !== undefined && previousValue !== undefined) {
    displaySubValue = calculateComparison(currentValue, previousValue, comparisonType, valueUnit);
  }
  
  // 増減傾向の判断
  const trend = determineTrend(displaySubValue || '');
  const trendColor = getTrendColor(trend);
  const trendIcon = getTrendIcon(trend);
  
  return (
    <div
      style={{
        background: Surface.Primary,
        padding: 20,
        borderRadius: 12,
        boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        flex: 1,
        margin: '0 8px',
        minWidth: 180,
        display: 'flex',
        flexDirection: 'column'
      }}
      onClick={onClick}
      onMouseOver={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.12)';
        }
      }}
      onMouseOut={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.08)';
        }
      }}
    >
      {/* タイトルとアイコン */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        {icon && (
          <div style={{ marginRight: 8 }}>
            <FontAwesomeIcon icon={icon} size="lg" color={Text.MediumEmphasis} />
          </div>
        )}
        <div style={{ color: Text.MediumEmphasis, fontSize: 16, fontWeight: 'bold' }}>{title}</div>
      </div>
      
      {/* 値 */}
      <div style={{
        color: Text.HighEmphasis,
        fontWeight: 800,
        fontSize: 32,
        lineHeight: 1.2,
        marginBottom: 16,
        display: 'flex',
        alignItems: 'baseline'
      }}>
        {(() => {
          // 値を数字と単位に分ける
          if (typeof value === 'string') {
            // 円表記の場合（例：¥123,456）
            if (value.startsWith('¥')) {
              const numericPart = value.substring(1); // ¥を除去
              return (
                <>
                  <span>{numericPart}</span>
                  <span style={{ fontSize: 18, marginLeft: 2 }}>円</span>
                </>
              );
            }
            // 組表記の場合（例：123組）
            else if (value.endsWith('組')) {
              const numericPart = value.substring(0, value.length - 1); // '組'を除去
              return (
                <>
                  <span>{numericPart}</span>
                  <span style={{ fontSize: 18, marginLeft: 2 }}>人</span>
                </>
              );
            }
            // 数値のみの場合
            else {
              return (
                <>
                  <span>{value}</span>
                  <span style={{ fontSize: 18, marginLeft: 2 }}>{valueUnit}</span>
                </>
              );
            }
          }
          // その他の場合はそのまま表示
          return value;
        })()}
      </div>
      
      {/* サブ値（増減表示） */}
      {displaySubValue && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: trend !== 'neutral' ? `${trendColor}20` : 'transparent', // 20は透明度
          color: trendColor,
          padding: '4px 10px',
          borderRadius: 16,
          fontSize: 14,
          fontWeight: 500,
          marginTop: 'auto',
          alignSelf: 'flex-start'
        }}>
          {trendIcon && (
            <FontAwesomeIcon icon={trendIcon} size="sm" style={{ marginRight: 4 }} />
          )}
          {displaySubValue}
        </div>
      )}
    </div>
  );
};

export default KpiCard;