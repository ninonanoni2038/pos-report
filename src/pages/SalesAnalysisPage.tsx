import React, { useState, useEffect } from 'react';
import { Surface } from '../styles/semanticColors';
import { DisplayMode } from '../types/displayMode';
import {
  Order,
  Payment,
  SalesKPI,
  ProductSalesData,
  DailyCustomerData,
  HourlyCustomerData
} from '../types/sales';

// コンポーネントのインポート
import PeriodSelector from '../components/sales/PeriodSelector';
import KpiCard from '../components/sales/KpiCard';
import CustomerPeakChart from '../components/sales/CustomerPeakChart';
import TopProductsChart from '../components/sales/TopProductsChart';
import SalesDetailTable from '../components/sales/SalesDetailTable';
import CustomerDetailTable from '../components/sales/CustomerDetailTable';

// FontAwesomeアイコンのインポート
import {
  faMoneyBillWave,
  faUsers,
  faReceipt
} from '@fortawesome/pro-solid-svg-icons';

// ユーティリティのインポート
import { formatCurrency } from '../utils/formatters';
import {
  filterDailyOrders,
  filterDailyPayments,
  calculateKPIs,
  generateHourlyCustomersData,
  generateHalfHourlyCustomersData,
  generateTwoHourlyCustomersData,
  generateTopProductsData,
  filterDailyOrderItems,
  // 月報表示用の関数
  filterMonthlyOrders,
  filterMonthlyPayments,
  calculateMonthlyKPIs,
  generateDailyCustomersData
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
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.DAILY);
  const [currentDate, setCurrentDate] = useState<Date>(new Date('2024-05-16'));
  const [lastDailyDate, setLastDailyDate] = useState<Date>(new Date('2024-05-16'));
  
  // 日付が変更されたときに最後の日報日付を更新
  useEffect(() => {
    if (displayMode === DisplayMode.DAILY) {
      setLastDailyDate(currentDate);
    }
  }, [currentDate, displayMode]);

  // 表示モード切替ハンドラ
  const handleModeChange = (mode: DisplayMode) => {
    if (mode === displayMode) return;

    if (mode === DisplayMode.DAILY) {
      // 月報から日報に切り替える場合
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      // 最後に表示した日報の日付が現在の月と同じ場合はその日付を表示
      if (lastDailyDate.getMonth() === currentMonth && lastDailyDate.getFullYear() === currentYear) {
        setCurrentDate(new Date(lastDailyDate));
      } else {
        // そうでない場合は月の1日を表示
        const newDate = new Date(currentDate);
        newDate.setDate(1);
        setCurrentDate(newDate);
      }
    } else if (mode === DisplayMode.MONTHLY) {
      // 日報から月報に切り替える場合は、現在の日付の月を表示
      // 日付は変更しない
    }

    setDisplayMode(mode);
  };

  // 日付操作ハンドラ - 日報モード
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
    setCurrentDate(new Date('2024-05-16')); // サンプルデータの日付に合わせる
  };

  // 日付操作ハンドラ - 月報モード
  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };
  
  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // データ処理 - 表示モードに応じて処理を分岐
  let filteredOrders: Order[];
  let filteredPayments: Payment[];
  let kpis: SalesKPI;
  // 日報/月報モードに応じたデータ型を定義
  type DailyCustomerDataType = {
    hourlyData: HourlyCustomerData[];
    halfHourlyData: HourlyCustomerData[];
    twoHourlyData: HourlyCustomerData[];
    previousDayHourlyData: HourlyCustomerData[];
    previousDayHalfHourlyData: HourlyCustomerData[];
    previousDayTwoHourlyData: HourlyCustomerData[];
    previousWeekHourlyData: HourlyCustomerData[];
    previousWeekHalfHourlyData: HourlyCustomerData[];
    previousWeekTwoHourlyData: HourlyCustomerData[];
    previousYearHourlyData: HourlyCustomerData[];
    previousYearHalfHourlyData: HourlyCustomerData[];
    previousYearTwoHourlyData: HourlyCustomerData[];
  };

  type MonthlyCustomerDataType = {
    dailyData: DailyCustomerData[];
    previousMonthDailyData: DailyCustomerData[];
    previousYearDailyData: DailyCustomerData[];
  };

  let customerData: DailyCustomerDataType | MonthlyCustomerDataType;
  let topProducts: ProductSalesData[];

  // 比較用のKPI値
  let previousDayKpis: SalesKPI | null = null;
  let previousWeekKpis: SalesKPI | null = null;
  let previousMonthKpis: SalesKPI | null = null;
  let previousYearKpis: SalesKPI | null = null;
  
  // 比較用の注文データ
  let previousDayOrdersData: Order[] = [];
  let previousMonthOrdersData: Order[] = [];

  if (displayMode === DisplayMode.DAILY) {
    // 日報モードのデータ処理
    filteredOrders = filterDailyOrders(orders, currentDate);
    filteredPayments = filterDailyPayments(payments, currentDate);
    
    // 比較用データを取得
    // 前日のデータ
    const previousDayDate = new Date(currentDate);
    previousDayDate.setDate(previousDayDate.getDate() - 1);
    previousDayOrdersData = filterDailyOrders(orders, previousDayDate);
    const previousDayPayments = filterDailyPayments(payments, previousDayDate);
    previousDayKpis = calculateKPIs(previousDayOrdersData, previousDayPayments);
    
    // 前週同曜日のデータ
    const previousWeekDate = new Date(currentDate);
    previousWeekDate.setDate(previousWeekDate.getDate() - 7);
    const previousWeekOrders = filterDailyOrders(orders, previousWeekDate);
    const previousWeekPayments = filterDailyPayments(payments, previousWeekDate);
    previousWeekKpis = calculateKPIs(previousWeekOrders, previousWeekPayments);
    
    // 前年同日のデータ
    const previousYearDate = new Date(currentDate);
    previousYearDate.setFullYear(previousYearDate.getFullYear() - 1);
    const previousYearOrders = filterDailyOrders(orders, previousYearDate);
    const previousYearPayments = filterDailyPayments(payments, previousYearDate);
    previousYearKpis = calculateKPIs(previousYearOrders, previousYearPayments);
    
    // KPI計算
    kpis = calculateKPIs(filteredOrders, filteredPayments);
    
    // グラフデータ生成 - 1時間区切り
    const hourlyCustomersData = generateHourlyCustomersData(filteredOrders);
    const previousDayHourlyCustomersData = generateHourlyCustomersData(previousDayOrdersData);
    const previousWeekHourlyCustomersData = generateHourlyCustomersData(previousWeekOrders);
    const previousYearHourlyCustomersData = generateHourlyCustomersData(previousYearOrders);
    
    // グラフデータ生成 - 30分区切り
    const halfHourlyCustomersData = generateHalfHourlyCustomersData(filteredOrders);
    const previousDayHalfHourlyCustomersData = generateHalfHourlyCustomersData(previousDayOrdersData);
    const previousWeekHalfHourlyCustomersData = generateHalfHourlyCustomersData(previousWeekOrders);
    const previousYearHalfHourlyCustomersData = generateHalfHourlyCustomersData(previousYearOrders);
    
    // グラフデータ生成 - 2時間区切り
    const twoHourlyCustomersData = generateTwoHourlyCustomersData(filteredOrders);
    const previousDayTwoHourlyCustomersData = generateTwoHourlyCustomersData(previousDayOrdersData);
    const previousWeekTwoHourlyCustomersData = generateTwoHourlyCustomersData(previousWeekOrders);
    const previousYearTwoHourlyCustomersData = generateTwoHourlyCustomersData(previousYearOrders);
    
    customerData = {
      hourlyData: hourlyCustomersData,
      halfHourlyData: halfHourlyCustomersData,
      twoHourlyData: twoHourlyCustomersData,
      previousDayHourlyData: previousDayHourlyCustomersData,
      previousDayHalfHourlyData: previousDayHalfHourlyCustomersData,
      previousDayTwoHourlyData: previousDayTwoHourlyCustomersData,
      previousWeekHourlyData: previousWeekHourlyCustomersData,
      previousWeekHalfHourlyData: previousWeekHalfHourlyCustomersData,
      previousWeekTwoHourlyData: previousWeekTwoHourlyCustomersData,
      previousYearHourlyData: previousYearHourlyCustomersData,
      previousYearHalfHourlyData: previousYearHalfHourlyCustomersData,
      previousYearTwoHourlyData: previousYearTwoHourlyCustomersData
    };
  } else {
    // 月報モードのデータ処理
    filteredOrders = filterMonthlyOrders(orders, currentDate);
    filteredPayments = filterMonthlyPayments(payments, currentDate);
    
    // 前月のデータ
    const previousMonthDate = new Date(currentDate);
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
    previousMonthOrdersData = filterMonthlyOrders(orders, previousMonthDate);
    const previousMonthPayments = filterMonthlyPayments(payments, previousMonthDate);
    previousMonthKpis = calculateMonthlyKPIs(previousMonthOrdersData, previousMonthPayments);
    
    // 前年同月のデータ
    const previousYearDate = new Date(currentDate);
    previousYearDate.setFullYear(previousYearDate.getFullYear() - 1);
    const previousYearOrders = filterMonthlyOrders(orders, previousYearDate);
    const previousYearPayments = filterMonthlyPayments(payments, previousYearDate);
    previousYearKpis = calculateMonthlyKPIs(previousYearOrders, previousYearPayments);
    
    // KPI計算
    kpis = calculateMonthlyKPIs(filteredOrders, filteredPayments);
    
    // 日別客数データ生成
    const dailyCustomersData = generateDailyCustomersData(filteredOrders);
    const previousMonthDailyCustomersData = generateDailyCustomersData(previousMonthOrdersData);
    const previousYearDailyCustomersData = generateDailyCustomersData(previousYearOrders);
    
    customerData = {
      dailyData: dailyCustomersData,
      previousMonthDailyData: previousMonthDailyCustomersData,
      previousYearDailyData: previousYearDailyCustomersData
    };
  }
  
  // 売れ筋商品データ生成
  const orderIds = filteredOrders.map(order => order.orderId);
  const filteredOrderItems = filterDailyOrderItems(order_items, orderIds);
  topProducts = generateTopProductsData(filteredOrderItems, products);
  
  // KPIから値を取得
  const { totalSales, totalCustomers, averagePerCustomer } = kpis;
  
  // 総人数を計算（組数ではなく実際の人数）
  // 注：calculateKPIs関数で既に人数ベースの客単価を計算しているため、
  // ここでの計算は表示用のみ
  const totalPartySize = filteredOrders.reduce((sum, order) => sum + order.partySize, 0);

  return (
    <div style={{ padding: 24 }}>
      {/* 期間選択 */}
      <PeriodSelector
        displayMode={displayMode}
        currentDate={currentDate}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        onToday={handleToday}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onModeChange={handleModeChange}
      />
      
      {/* KPIカード */}
      <div style={{ display: 'flex', marginBottom: 24 }}>
        <KpiCard
          title="売上金額"
          value={formatCurrency(totalSales)}
          icon={faMoneyBillWave}
          currentValue={totalSales}
          previousValue={displayMode === DisplayMode.DAILY
            ? previousDayKpis?.totalSales
            : previousMonthKpis?.totalSales}
          comparisonType={displayMode === DisplayMode.DAILY ? 'day' : 'month'}
          valueUnit="円"
          onClick={() => console.log('売上詳細へ')}
        />
        <KpiCard
          title="総客数"
          value={`${totalPartySize}`}
          icon={faUsers}
          currentValue={totalPartySize}
          previousValue={displayMode === DisplayMode.DAILY
            ? previousDayOrdersData.reduce((sum, order) => sum + order.partySize, 0)
            : previousMonthOrdersData.reduce((sum, order) => sum + order.partySize, 0)}
          comparisonType={displayMode === DisplayMode.DAILY ? 'day' : 'month'}
          valueUnit="人"
        />
        <KpiCard
          title="客単価"
          value={formatCurrency(averagePerCustomer)}
          icon={faReceipt}
          currentValue={averagePerCustomer}
          previousValue={displayMode === DisplayMode.DAILY
            ? previousDayKpis?.averagePerCustomer
            : previousMonthKpis?.averagePerCustomer}
          comparisonType={displayMode === DisplayMode.DAILY ? 'day' : 'month'}
          valueUnit="円"
        />
      </div>
      
      {/* グラフセクション */}
      <div style={{
        display: 'flex',
        marginBottom: 24,
        gap: 16,
        height: 500,
        boxSizing: 'border-box'
      }}>
        <div style={{
          flex: 1,
          width: '50%',
          height: '100%',
          boxSizing: 'border-box'
        }}>
          <CustomerPeakChart
            {...customerData}
            displayMode={displayMode}
          />
        </div>
        <div style={{
          flex: 1,
          width: '50%',
          height: '100%',
          boxSizing: 'border-box'
        }}>
          <TopProductsChart
            data={topProducts}
            totalAmount={kpis.totalSales}
            totalCount={filteredOrderItems.reduce((sum, item) => sum + item.quantity, 0)}
            totalProfit={kpis.netSales}
          />
        </div>
      </div>
      
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