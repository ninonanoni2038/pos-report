import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Surface, Text, Object as ObjectColor } from '../../styles/semanticColors';
import { ProductSalesData } from '../../types/sales';
import { formatCurrency } from '../../utils/formatters';

interface TopProductsChartProps {
  data: ProductSalesData[];
}

/**
 * 売れ筋商品ランキングコンポーネント
 * 売上金額順に上位5商品を横棒グラフで表示する
 */
const TopProductsChart: React.FC<TopProductsChartProps> = ({ data }) => {
  return (
    <div style={{ 
      background: Surface.Primary, 
      padding: 16, 
      borderRadius: 8,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      marginBottom: 24
    }}>
      <h3 style={{ margin: '0 0 16px 0', color: Text.Primary }}>売れ筋商品ランキングTop5</h3>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" />
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
            <Legend />
            <Bar dataKey="amount" name="売上金額" fill={ObjectColor.AccentPrimary} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopProductsChart;