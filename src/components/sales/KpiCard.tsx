import React from 'react';
import { Surface, Text } from '../../styles/semanticColors';

interface KpiCardProps {
  title: string;
  value: string;
  subValue?: string;
  onClick?: () => void;
}

/**
 * KPIカードコンポーネント
 * タイトル、値、サブ値（オプション）を表示するカード
 * クリック可能なオプションあり
 */
const KpiCard: React.FC<KpiCardProps> = ({ 
  title, 
  value, 
  subValue, 
  onClick 
}) => {
  return (
    <div 
      style={{ 
        background: Surface.Primary, 
        padding: 16, 
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        flex: 1,
        margin: '0 8px',
        minWidth: 200
      }}
      onClick={onClick}
      onMouseOver={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        }
      }}
      onMouseOut={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        }
      }}
    >
      <div style={{ color: Text.Secondary, marginBottom: 8, fontSize: 14 }}>{title}</div>
      <div style={{ color: Text.Primary, fontWeight: 'bold', fontSize: 24 }}>{value}</div>
      {subValue && (
        <div style={{ color: Text.Tertiary, fontSize: 12, marginTop: 4 }}>{subValue}</div>
      )}
    </div>
  );
};

export default KpiCard;