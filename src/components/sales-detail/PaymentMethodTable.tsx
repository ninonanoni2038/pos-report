import React, { useMemo } from 'react';
import { PaymentMethodData } from '../../types/sales';
import { formatCurrency, formatPaymentMethodName } from '../../utils/formatters';
import { Surface, Border, Text, Object } from '../../styles/semanticColors';

interface PaymentMethodTableProps {
  data: PaymentMethodData[];
  totalAmount: number;
}

/**
 * 支払い方法別データテーブルコンポーネント
 * 支払い方法別の売上データをテーブル形式で表示する
 */
const PaymentMethodTable: React.FC<PaymentMethodTableProps> = ({ data, totalAmount }) => {
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
    <div>
      <h3 style={{ margin: '0 0 16px 0', color: Text.HighEmphasis }}>支払い方法別データ</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{
                textAlign: 'left',
                padding: '8px 16px',
                borderBottom: `1px solid ${Border.LowEmphasis}`,
                color: Text.HighEmphasis
              }}>
                支払い方法
              </th>
              <th style={{
                textAlign: 'right',
                padding: '8px 16px',
                borderBottom: `1px solid ${Border.LowEmphasis}`,
                color: Text.HighEmphasis
              }}>
                総売上
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <tr key={index}>
                <td style={{
                  padding: '8px 16px',
                  borderBottom: `1px solid ${Border.LowEmphasis}`,
                  color: Text.HighEmphasis
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: getColor(index),
                      marginRight: 8
                    }} />
                    {formatPaymentMethodName(item.name)}
                  </div>
                </td>
                <td style={{
                  textAlign: 'right',
                  padding: '8px 16px',
                  borderBottom: `1px solid ${Border.LowEmphasis}`
                }}>
                  <div style={{ fontWeight: 'bold', color: Text.HighEmphasis }}>
                    {formatCurrency(item.value)}円
                  </div>
                  <div style={{ fontSize: '0.8em', color: Text.MediumEmphasis }}>
                    ({((item.value / totalAmount) * 100).toFixed(1)}%)
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentMethodTable;