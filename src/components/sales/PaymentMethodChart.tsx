import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Surface, Text } from '../../styles/semanticColors';
import { PaymentMethodData } from '../../types/sales';
import { formatCurrency } from '../../utils/formatters';

interface PaymentMethodChartProps {
  data: PaymentMethodData[];
}

/**
 * 決済手段構成グラフコンポーネント
 * 決済方法別の売上金額を円グラフで表示する
 */
const PaymentMethodChart: React.FC<PaymentMethodChartProps> = ({ data }) => {
  // 円グラフの色
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C'];

  return (
    <div style={{ 
      flex: 1, 
      background: Surface.Primary, 
      padding: 16, 
      borderRadius: 8,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <h3 style={{ margin: '0 0 16px 0', color: Text.Primary }}>決済手段構成</h3>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PaymentMethodChart;