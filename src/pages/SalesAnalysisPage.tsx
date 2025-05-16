import React, { useState } from 'react';
import { Surface } from '../styles/semanticColors';

// コンポーネントのインポート
import PeriodSelector from '../components/sales/PeriodSelector';
import KpiCard from '../components/sales/KpiCard';
import CustomerPeakChart from '../components/sales/CustomerPeakChart';
import PaymentMethodChart from '../components/sales/PaymentMethodChart';
import TopProductsChart from '../components/sales/TopProductsChart';
import SalesDetailTable from '../components/sales/SalesDetailTable';
import CustomerDetailTable from '../components/sales/CustomerDetailTable';

// ユーティリティのインポート
import { formatCurrency } from '../utils/formatters';
import {
  filterDailyOrders,
  filterDailyPayments,
  calculateKPIs,
  generateHourlyCustomersData,
  generateHalfHourlyCustomersData,
  generateTwoHourlyCustomersData,
  generatePaymentMethodData,
  generateTopProductsData,
  filterDailyOrderItems
} from '../utils/salesDataProcessor';

// サンプルデータのインポート
import { payments } from '../sample_data/payments/payments';
import { orders } from '../sample_data/orders/orders';
import { order_items } from '../sample_data/order_items/order_items';
import { products } from '../sample_data/products/products';

/**
 * 売上分析ページコンポーネント
 * 売上データの分析と表示を行う
 */
const SalesAnalysisPage: React.FC = () => {
  // 状態管理
  const [currentDate, setCurrentDate] = useState<Date>(new Date('2024-03-01'));
  
  // 日付操作ハンドラ
  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };
  
  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };
  
  const handleToday = () => {
    setCurrentDate(new Date('2024-03-01')); // サンプルデータの日付に合わせる
  };

  // データ処理
  const dailyOrders = filterDailyOrders(orders, currentDate);
  const dailyPayments = filterDailyPayments(payments, currentDate);
  
  // 比較用データを取得
  // 前日のデータ
  const previousDayDate = new Date(currentDate);
  previousDayDate.setDate(previousDayDate.getDate() - 1);
  const previousDayOrders = filterDailyOrders(orders, previousDayDate);
  
  // 前週同曜日のデータ
  const previousWeekDate = new Date(currentDate);
  previousWeekDate.setDate(previousWeekDate.getDate() - 7);
  const previousWeekOrders = filterDailyOrders(orders, previousWeekDate);
  
  // 前年同日のデータ
  const previousYearDate = new Date(currentDate);
  previousYearDate.setFullYear(previousYearDate.getFullYear() - 1);
  const previousYearOrders = filterDailyOrders(orders, previousYearDate);
  
  // KPI計算
  const kpis = calculateKPIs(dailyOrders, dailyPayments);
  const { totalSales, totalCustomers, averagePerCustomer } = kpis;
  
  // グラフデータ生成 - 1時間区切り
  const hourlyCustomersData = generateHourlyCustomersData(dailyOrders);
  const previousDayHourlyCustomersData = generateHourlyCustomersData(previousDayOrders);
  const previousWeekHourlyCustomersData = generateHourlyCustomersData(previousWeekOrders);
  const previousYearHourlyCustomersData = generateHourlyCustomersData(previousYearOrders);
  
  // グラフデータ生成 - 30分区切り
  const halfHourlyCustomersData = generateHalfHourlyCustomersData(dailyOrders);
  const previousDayHalfHourlyCustomersData = generateHalfHourlyCustomersData(previousDayOrders);
  const previousWeekHalfHourlyCustomersData = generateHalfHourlyCustomersData(previousWeekOrders);
  const previousYearHalfHourlyCustomersData = generateHalfHourlyCustomersData(previousYearOrders);
  
  // グラフデータ生成 - 2時間区切り
  const twoHourlyCustomersData = generateTwoHourlyCustomersData(dailyOrders);
  const previousDayTwoHourlyCustomersData = generateTwoHourlyCustomersData(previousDayOrders);
  const previousWeekTwoHourlyCustomersData = generateTwoHourlyCustomersData(previousWeekOrders);
  const previousYearTwoHourlyCustomersData = generateTwoHourlyCustomersData(previousYearOrders);
  
  const paymentMethodData = generatePaymentMethodData(dailyPayments);
  
  // 売れ筋商品データ生成
  const dailyOrderIds = dailyOrders.map(order => order.orderId);
  const dailyOrderItems = filterDailyOrderItems(order_items, dailyOrderIds);
  const topProducts = generateTopProductsData(dailyOrderItems, products);

  return (
    <div style={{ padding: 24 }}>
      {/* 期間選択 */}
      <PeriodSelector 
        currentDate={currentDate}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        onToday={handleToday}
      />
      
      {/* KPIカード */}
      <div style={{ display: 'flex', marginBottom: 24 }}>
        <KpiCard 
          title="売上金額" 
          value={formatCurrency(totalSales)}
          subValue="前日比: +5.2%"
          onClick={() => console.log('売上詳細へ')}
        />
        <KpiCard 
          title="総客数" 
          value={`${totalCustomers}組`}
          subValue="前日比: +3組"
        />
        <KpiCard 
          title="客単価" 
          value={formatCurrency(averagePerCustomer)}
          subValue="前日比: +2.1%"
        />
      </div>
      
      {/* グラフセクション */}
      <div style={{ display: 'flex', marginBottom: 24, gap: 16 }}>
        <CustomerPeakChart
          hourlyData={hourlyCustomersData}
          halfHourlyData={halfHourlyCustomersData}
          twoHourlyData={twoHourlyCustomersData}
          previousDayHourlyData={previousDayHourlyCustomersData}
          previousDayHalfHourlyData={previousDayHalfHourlyCustomersData}
          previousDayTwoHourlyData={previousDayTwoHourlyCustomersData}
          previousWeekHourlyData={previousWeekHourlyCustomersData}
          previousWeekHalfHourlyData={previousWeekHalfHourlyCustomersData}
          previousWeekTwoHourlyData={previousWeekTwoHourlyCustomersData}
          previousYearHourlyData={previousYearHourlyCustomersData}
          previousYearHalfHourlyData={previousYearHalfHourlyCustomersData}
          previousYearTwoHourlyData={previousYearTwoHourlyCustomersData}
        />
        <PaymentMethodChart data={paymentMethodData} />
      </div>
      
      {/* 売れ筋商品ランキング */}
      <TopProductsChart data={topProducts} />
      
      {/* 詳細情報 */}
      <div style={{ 
        background: Surface.Primary, 
        padding: 16, 
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ margin: '0 0 16px 0' }}>詳細情報</h3>
        
        {/* 売上セクション */}
        <SalesDetailTable data={kpis} />
        
        {/* 詳細情報 */}
        <CustomerDetailTable data={{ totalCustomers, averagePerCustomer }} />
      </div>
    </div>
  );
};

export default SalesAnalysisPage;