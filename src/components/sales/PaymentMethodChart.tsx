import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Surface, Text, Object } from '../../styles/semanticColors';
import { PaymentMethodData } from '../../types/sales';
import { formatCurrency, formatPaymentMethodName } from '../../utils/formatters';

interface PaymentMethodChartProps {
  data: PaymentMethodData[];
}

/**
 * 決済手段構成グラフコンポーネント
 * 決済方法別の売上金額を円グラフで表示する
 */
const PaymentMethodChart: React.FC<PaymentMethodChartProps> = ({ data }) => {
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
      <h3 style={{ margin: '0 0 16px 0', color: Text.HighEmphasis }}>決済手段構成</h3>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sortedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${formatPaymentMethodName(name)} ${(percent * 100).toFixed(0)}%`}
            >
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(index)} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${formatCurrency(value as number)}円`}
              labelFormatter={(name) => formatPaymentMethodName(name as string)}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PaymentMethodChart;