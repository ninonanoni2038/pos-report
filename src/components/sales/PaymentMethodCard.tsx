import React, { useMemo, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { Surface, Text, Border, Object } from '../../styles/semanticColors';
import { PaymentMethodData } from '../../types/sales';
import { formatCurrency, formatPaymentMethodName } from '../../utils/formatters';

interface PaymentMethodCardProps {
  data: PaymentMethodData[];
  totalAmount: number;
}

/**
 * 決済手段カードコンポーネント
 * 決済方法別の売上金額を円グラフとリスト形式で表示する
 */
const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ data, totalAmount }) => {
  // ホバー状態を管理するstate
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

  // 円グラフの要素にマウスオーバーした時のハンドラ
  const handlePieEnter = (_: any, index: number) => {
    setHoveredIndex(index);
  };

  // 円グラフの要素からマウスが離れた時のハンドラ
  const handlePieLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div style={{
      background: Surface.Primary,
      padding: 16,
      borderRadius: 8,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    //   height: 400 // カードの高さを固定
    }}>
      <h3 style={{ margin: '0 0 16px 0', color: Text.HighEmphasis }}>決済手段構成</h3>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 24,
        height: 'calc(100% - 40px)', // ヘッダー分を引いた高さ
        alignItems: 'center' // 縦方向に中央揃え
      }}>
        {/* リスト表示（左側） */}
        <div style={{ flex: '1 1 250px', minWidth: 0, maxHeight: '100%', overflowY: 'auto' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {sortedData.map((item, index) => (
              <li key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: index < sortedData.length - 1 ? `1px solid ${Border.LowEmphasis}` : 'none',
                backgroundColor: hoveredIndex === index ? Surface.AccentPrimaryTint01 : 'transparent',
                borderRadius: 4
              }}>
                {/* 左側：決済手段名と決済額 */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{
                    color: Text.HighEmphasis,
                    fontWeight: 'bold',
                    fontSize: '18px'
                  }}>
                    {formatPaymentMethodName(item.name)}
                  </span>
                  <span style={{
                    color: Text.LowEmphasis,
                    fontWeight: 'normal',
                    fontSize: '14px'
                  }}>
                    {formatCurrency(item.value)}円
                  </span>
                </div>
                
                {/* 右側：割合と色の丸 */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    color: Text.HighEmphasis,
                    fontWeight: 'bold',
                    fontSize: '18px',
                    marginRight: '8px'
                  }}>
                    {((item.value / totalAmount) * 100).toFixed(1)}%
                  </span>
                  <div style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: getColor(index)
                  }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        {/* 円グラフ（右側） */}
        <div style={{ flex: '1 1 300px', minWidth: 0, height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sortedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius="80%"
                fill="#8884d8"
                dataKey="value"
                startAngle={90} // 0時の位置から開始
                endAngle={-270} // 時計回りに一周
                label={false} // ラベルを非表示に設定
                onMouseEnter={handlePieEnter}
                onMouseLeave={handlePieLeave}
              >
                {sortedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(index)} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodCard;