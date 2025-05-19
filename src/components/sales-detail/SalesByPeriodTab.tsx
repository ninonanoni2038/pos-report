import React, { useState, useMemo } from 'react';
import { DisplayMode } from '../../types/displayMode';
import { Order, Payment, OrderItem, Product, HourlySalesData, DailySalesData } from '../../types/sales';
import SalesLineChart from './SalesLineChart';
import SalesDetailTable from './SalesDetailTable';
import { TabGroup, TabButton } from '../common/tabs';
import { Surface, Text, Border, Object as ObjectColor } from '../../styles/semanticColors';
import { formatCurrency, formatDate, formatYearMonth } from '../../utils/formatters';
import {
  filterDailyOrders,
  filterDailyPayments,
  filterDailyOrderItems,
  filterMonthlyOrders,
  filterMonthlyPayments,
  filterMonthlyOrderItems,
  generateHourlySalesData,
  generateDailySalesData,
  calculateDetailedSalesData
} from '../../utils/salesDataProcessor';

interface SalesByPeriodTabProps {
  displayMode: DisplayMode;
  currentDate: Date;
  orders: readonly Order[];
  payments: readonly Payment[];
  orderItems: readonly OrderItem[];
  products: readonly Product[];
}

const SalesByPeriodTab: React.FC<SalesByPeriodTabProps> = ({
  displayMode,
  currentDate,
  orders,
  payments,
  orderItems,
  products
}) => {
  const [valueType, setValueType] = useState<'amount' | 'rate'>('amount');

  // データ取得・加工ロジック
  const salesData = useMemo(() => {
    if (displayMode === DisplayMode.DAILY) {
      // 日報モードの場合
      const filteredOrders = filterDailyOrders(orders, currentDate);
      const filteredPayments = filterDailyPayments(payments, currentDate);
      const orderIds = filteredOrders.map(order => order.orderId);
      const filteredOrderItems = filterDailyOrderItems(orderItems, orderIds);
      
      return generateHourlySalesData(filteredOrders, filteredPayments, filteredOrderItems, products);
    } else {
      // 月報モードの場合
      const filteredOrders = filterMonthlyOrders(orders, currentDate);
      const filteredPayments = filterMonthlyPayments(payments, currentDate);
      const orderIds = filteredOrders.map(order => order.orderId);
      const filteredOrderItems = filterMonthlyOrderItems(orderItems, orderIds);
      
      return generateDailySalesData(filteredOrders, filteredPayments, filteredOrderItems, products);
    }
  }, [displayMode, currentDate, orders, payments, orderItems, products]);

  // 詳細データテーブル用のデータを計算
  const detailedData = useMemo(() => {
    return calculateDetailedSalesData(salesData);
  }, [salesData]);

  // 総売上金額を計算
  const totalSales = useMemo(() => {
    if (!salesData || salesData.length === 0) return 0;
    return (salesData as Array<{ totalSales: number }>).reduce((sum: number, data) => sum + data.totalSales, 0);
  }, [salesData]);

  return (
    <div>
      {/* グラフ表示セクション */}
      <div style={{
        background: Surface.Primary,
        padding: 16,
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        marginBottom: 24
      }}>
        {/* グラフヘッダー */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          {/* 総売上金額 */}
          <div>
            <h2 style={{ margin: 0, fontSize: 24 }}>{formatCurrency(totalSales)}</h2>
            <p style={{ margin: '4px 0 0 0', color: Text.MediumEmphasis }}>
              {displayMode === DisplayMode.DAILY
                ? formatDate(currentDate)
                : formatYearMonth(currentDate)}
            </p>
          </div>
          
          {/* 金額/率切り替えタブ */}
          <div style={{ display: 'flex' }}>
            <TabGroup>
              <TabButton
                isActive={valueType === 'amount'}
                onClick={() => setValueType('amount')}
                label="金額"
              />
              <TabButton
                isActive={valueType === 'rate'}
                onClick={() => setValueType('rate')}
                label="率"
              />
            </TabGroup>
          </div>
        </div>
        
        {/* 折れ線グラフ */}
        <SalesLineChart
          data={salesData}
          valueType={valueType}
        />
      </div>
      
      {/* 詳細データテーブル */}
      <div style={{
        background: Surface.Primary,
        padding: 16,
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <SalesDetailTable
          data={detailedData}
          displayMode={displayMode}
        />
      </div>
    </div>
  );
};

export default SalesByPeriodTab;