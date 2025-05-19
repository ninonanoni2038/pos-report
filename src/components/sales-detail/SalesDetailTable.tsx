import React from 'react';
import { DetailedSalesData } from '../../types/sales';
import { DisplayMode } from '../../types/displayMode';
import { formatCurrency, getDateWithWeekdayColor } from '../../utils/formatters';
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
            {data.periods.map((period, index) => {
              // 月報表示の場合、日付と曜日を表示
              let periodDisplay = period;
              let weekdayColor = Text.HighEmphasis;
              
              if (displayMode === DisplayMode.MONTHLY) {
                try {
                  // 日付文字列を解析（例: "1" -> "2024-05-01"）
                  const day = parseInt(period);
                  if (!isNaN(day)) {
                    // 現在の日付から年と月を取得
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = now.getMonth();
                    
                    // 日付オブジェクトを作成
                    const date = new Date(year, month, day);
                    
                    // 日付と曜日の情報を取得
                    const dateInfo = getDateWithWeekdayColor(date);
                    
                    // MM/DD(曜)の形式で表示
                    periodDisplay = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}${dateInfo.weekdayText}`;
                    weekdayColor = dateInfo.weekdayColor;
                  }
                } catch (e) {
                  // エラーが発生した場合は元の表示を使用
                  console.error("日付の解析に失敗しました", e);
                }
              }
              
              return (
                <tr key={period}>
                  <td style={{
                    padding: '8px 16px',
                    borderBottom: `1px solid ${Border.LowEmphasis}`,
                    color: weekdayColor
                  }}>
                    {periodDisplay}
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 明示的に既定のエクスポートを設定
const ExportedSalesDetailTable = SalesDetailTable;
export default ExportedSalesDetailTable;