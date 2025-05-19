import React, { useMemo } from 'react';
import { PaymentMethodData } from '../../types/sales';
import { formatCurrency, formatPaymentMethodName } from '../../utils/formatters';
import { Surface, Text, Border, Object } from '../../styles/semanticColors';

interface PaymentMethodListProps {
  data: PaymentMethodData[];
  totalAmount: number;
}

/**
 * 決済手段リスト表示コンポーネント
 * 決済方法別の売上金額をリスト形式で表示する
 */
const PaymentMethodList: React.FC<PaymentMethodListProps> = ({ data, totalAmount }) => {
  // データを金額順にソート
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.value - a.value);
  }, [data]);

  // 順位に応じた色を設定
  const getColor = (index: number) => {
    switch (index) {
      case 0: return Object.AccentPrimary;
      case 1: return Object.AccentSecondary;
      case 2: return Object.AccentTertiary;
      default: return Object.LowEmphasis;
    }
  };

  return (
    <div style={{ 
      background: Surface.Primary, 
      padding: 16, 
      borderRadius: 8,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      height: '100%'
    }}>
      <h3 style={{ margin: '0 0 16px 0', color: Text.HighEmphasis }}>決済手段一覧</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {sortedData.map((item, index) => (
          <li key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '8px 0',
            borderBottom: index < sortedData.length - 1 ? `1px solid ${Border.LowEmphasis}` : 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                backgroundColor: getColor(index),
                marginRight: 8
              }} />
              <span style={{ color: Text.HighEmphasis }}>
                {formatPaymentMethodName(item.name)}
              </span>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', color: Text.HighEmphasis, textAlign: 'right' }}>
                {formatCurrency(item.value)}円
              </div>
              <div style={{ fontSize: '0.8em', color: Text.MediumEmphasis, textAlign: 'right' }}>
                {((item.value / totalAmount) * 100).toFixed(1)}%
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentMethodList;