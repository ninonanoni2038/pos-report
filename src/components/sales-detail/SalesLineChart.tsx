import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HourlySalesData, DailySalesData } from '../../types/sales';
import { formatCurrency } from '../../utils/formatters';
import { Object as ObjectColor } from '../../styles/semanticColors';

interface SalesLineChartProps {
  data: HourlySalesData[] | DailySalesData[];
  valueType: 'amount' | 'rate';
}

const SalesLineChart: React.FC<SalesLineChartProps> = ({ data, valueType }) => {
  // データキーを決定
  const dataKey = valueType === 'amount' ? 'totalSales' : 'rate';
  
  // データが空の場合は「データがありません」と表示
  if (!data || data.length === 0) {
    return (
      <div style={{
        height: 300,
        marginTop: 16,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px dashed #ccc',
        borderRadius: 8,
        color: '#999',
        fontSize: '16px',
        fontWeight: 'bold'
      }}>
        この期間のデータはありません
      </div>
    );
  }
  
  // X軸のデータキーを決定
  const xAxisDataKey = 'hour' in data[0] ? 'hour' : 'day';
  
  // ツールチップのフォーマッター
  const tooltipFormatter = (value: number) => {
    return formatCurrency(value);
  };

  return (
    <div style={{ height: 300, marginTop: 16 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisDataKey} />
          <YAxis />
          <Tooltip formatter={tooltipFormatter} />
          <Line
            type="monotone"
            dataKey="totalSales"
            stroke={ObjectColor.AccentPrimary}
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesLineChart;