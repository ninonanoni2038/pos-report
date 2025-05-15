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
import { HourlyCustomerData } from '../../types/sales';

interface CustomerPeakChartProps {
  data: HourlyCustomerData[];
}

/**
 * 客ピークグラフコンポーネント
 * 時間帯別の客数を縦棒グラフで表示する
 */
const CustomerPeakChart: React.FC<CustomerPeakChartProps> = ({ data }) => {
  return (
    <div style={{ 
      flex: 1, 
      background: Surface.Primary, 
      padding: 16, 
      borderRadius: 8,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <h3 style={{ margin: '0 0 16px 0', color: Text.Primary }}>客ピーク</h3>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="客数" fill={ObjectColor.AccentPrimary} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomerPeakChart;