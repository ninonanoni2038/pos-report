import React from 'react';
import { Border, Text, Object as ObjectColor } from '../../styles/semanticColors';
import { formatCurrency } from '../../utils/formatters';

interface SalesDetailTableProps {
  data: {
    totalSales: number;
    onsitePayments: number;
    onlinePayments: number;
    totalFees: number;
    netSales: number;
  };
}

/**
 * 売上詳細テーブルコンポーネント
 * 売上合計、現地決済、オンライン決済、手数料、純売上を表示する
 */
const SalesDetailTable: React.FC<SalesDetailTableProps> = ({ data }) => {
  const { totalSales, onsitePayments, onlinePayments, totalFees, netSales } = data;

  return (
    <div style={{ marginBottom: 24 }}>
      <h4 style={{ margin: '0 0 8px 0', color: Text.Primary }}>売上</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}` }}>売上合計</td>
            <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}`, textAlign: 'right' }}>
              {formatCurrency(totalSales)}
            </td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}` }}>現地決済</td>
            <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}`, textAlign: 'right' }}>
              {formatCurrency(onsitePayments)}
            </td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}` }}>オンライン決済</td>
            <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}`, textAlign: 'right' }}>
              {formatCurrency(onlinePayments)}
            </td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}` }}>手数料</td>
            <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}`, textAlign: 'right' }}>
              {formatCurrency(totalFees)}
            </td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', fontWeight: 'bold' }}>純売上</td>
            <td style={{ 
              padding: '8px 0', 
              textAlign: 'right', 
              fontWeight: 'bold', 
              color: ObjectColor.AccentPrimary 
            }}>
              {formatCurrency(netSales)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SalesDetailTable;