import React from 'react';
import { DetailedSalesData } from '../../types/sales';
import { DisplayMode } from '../../types/displayMode';
import { formatCurrency } from '../../utils/formatters';
import { Surface, Border, Text } from '../../styles/semanticColors';

interface SalesDetailTableProps {
  data: DetailedSalesData;
  displayMode: DisplayMode;
}

const SalesDetailTable: React.FC<SalesDetailTableProps> = ({ data, displayMode }) => {
  return (
    <div>
      <h3 style={{ margin: '0 0 16px 0' }}>詳細データ</h3>
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
                {displayMode === DisplayMode.DAILY ? '時間' : '日付'}
              </th>
              <th style={{ 
                textAlign: 'right', 
                padding: '8px 16px', 
                borderBottom: `1px solid ${Border.LowEmphasis}`,
                color: Text.HighEmphasis
              }}>
                総売上
              </th>
              <th style={{ 
                textAlign: 'right', 
                padding: '8px 16px', 
                borderBottom: `1px solid ${Border.LowEmphasis}`,
                color: Text.HighEmphasis
              }}>
                純売上
              </th>
              <th style={{ 
                textAlign: 'right', 
                padding: '8px 16px', 
                borderBottom: `1px solid ${Border.LowEmphasis}`,
                color: Text.HighEmphasis
              }}>
                手数料
              </th>
              <th style={{ 
                textAlign: 'right', 
                padding: '8px 16px', 
                borderBottom: `1px solid ${Border.LowEmphasis}`,
                color: Text.HighEmphasis
              }}>
                粗利益
              </th>
              <th style={{ 
                textAlign: 'right', 
                padding: '8px 16px', 
                borderBottom: `1px solid ${Border.LowEmphasis}`,
                color: Text.HighEmphasis
              }}>
                客単価
              </th>
            </tr>
          </thead>
          <tbody>
            {data.periods.map((period, index) => (
              <tr key={period}>
                <td style={{ 
                  padding: '8px 16px', 
                  borderBottom: `1px solid ${Border.LowEmphasis}`,
                  color: Text.HighEmphasis
                }}>
                  {period}
                </td>
                <td style={{ 
                  textAlign: 'right', 
                  padding: '8px 16px', 
                  borderBottom: `1px solid ${Border.LowEmphasis}`,
                  color: Text.HighEmphasis
                }}>
                  {formatCurrency(data.totalSales[index])}
                </td>
                <td style={{ 
                  textAlign: 'right', 
                  padding: '8px 16px', 
                  borderBottom: `1px solid ${Border.LowEmphasis}`,
                  color: Text.HighEmphasis
                }}>
                  {formatCurrency(data.netSales[index])}
                </td>
                <td style={{ 
                  textAlign: 'right', 
                  padding: '8px 16px', 
                  borderBottom: `1px solid ${Border.LowEmphasis}`,
                  color: Text.HighEmphasis
                }}>
                  {formatCurrency(data.fees[index])}
                </td>
                <td style={{ 
                  textAlign: 'right', 
                  padding: '8px 16px', 
                  borderBottom: `1px solid ${Border.LowEmphasis}`,
                  color: Text.HighEmphasis
                }}>
                  {formatCurrency(data.profit[index])}
                </td>
                <td style={{ 
                  textAlign: 'right', 
                  padding: '8px 16px', 
                  borderBottom: `1px solid ${Border.LowEmphasis}`,
                  color: Text.HighEmphasis
                }}>
                  {formatCurrency(data.averagePerCustomer[index])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesDetailTable;