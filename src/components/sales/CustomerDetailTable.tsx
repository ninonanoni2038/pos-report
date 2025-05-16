import React from 'react';
import { Border, Text } from '../../styles/semanticColors';
import { formatCurrency } from '../../utils/formatters';

interface CustomerDetailTableProps {
  data: {
    totalCustomers: number;
    averagePerCustomer: number;
  };
}

/**
 * 顧客詳細テーブルコンポーネント
 * 組数、客数、客単価を表示する
 */
const CustomerDetailTable: React.FC<CustomerDetailTableProps> = ({ data }) => {
  const { totalCustomers, averagePerCustomer } = data;

  return (
    <div style={{ marginBottom: 24 }}>
      <h4 style={{ margin: '0 0 8px 0', color: Text.HighEmphasis }}>詳細情報</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}` }}>組数</td>
            <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}`, textAlign: 'right' }}>
              {totalCustomers}組
            </td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}` }}>客数</td>
            <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}`, textAlign: 'right' }}>
              {totalCustomers}人
            </td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}` }}>客単価</td>
            <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}`, textAlign: 'right' }}>
              {formatCurrency(averagePerCustomer)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CustomerDetailTable;