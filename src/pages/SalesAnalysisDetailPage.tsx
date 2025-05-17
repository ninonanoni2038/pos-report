import React, { useState, useEffect } from 'react';
import PeriodSelector from '../components/sales/PeriodSelector';
import { DisplayMode } from '../types/displayMode';
import { Order, Payment, OrderItem, Product } from '../types/sales';
import SalesByPeriodTab from '../components/sales-detail/SalesByPeriodTab';
import SalesByProductTab from '../components/sales-detail/SalesByProductTab';
import SalesByPaymentMethodTab from '../components/sales-detail/SalesByPaymentMethodTab';
import { TabGroup, TabButton } from '../components/common/tabs';
import { Surface, Text, Border } from '../styles/semanticColors';

// サンプルデータのインポート
import { payments } from '../sample_data/payments/payments';
import { orders } from '../sample_data/orders/orders';
import { order_items } from '../sample_data/order_items/order_items';
import { products } from '../sample_data/products/products';

const SalesAnalysisDetailPage: React.FC = () => {
  // 状態管理
  const [activeTab, setActiveTab] = useState<'period' | 'product' | 'payment'>('period');
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.DAILY);
  const [currentDate, setCurrentDate] = useState<Date>(new Date('2024-05-16'));
  const [lastDailyDate, setLastDailyDate] = useState<Date>(new Date('2024-05-16'));
  
  // 日付が変更されたときに最後の日報日付を更新
  useEffect(() => {
    if (displayMode === DisplayMode.DAILY) {
      setLastDailyDate(currentDate);
    }
  }, [currentDate, displayMode]);

  // タブ切り替え処理
  const handleTabChange = (tab: 'period' | 'product' | 'payment') => {
    setActiveTab(tab);
  };

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

      {/* タブUI */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ 
          display: 'flex', 
          borderBottom: `1px solid ${Border.LowEmphasis}`,
          marginBottom: 16
        }}>
          <TabButton
            isActive={activeTab === 'period'}
            onClick={() => handleTabChange('period')}
            label="期間別売上"
          />
          <TabButton
            isActive={activeTab === 'product'}
            onClick={() => handleTabChange('product')}
            label="商品別売上"
          />
          <TabButton
            isActive={activeTab === 'payment'}
            onClick={() => handleTabChange('payment')}
            label="支払い方法別売上"
          />
        </div>
      </div>

      {/* タブコンテンツ */}
      {activeTab === 'period' && (
        <SalesByPeriodTab
          displayMode={displayMode}
          currentDate={currentDate}
          orders={orders}
          payments={payments}
          orderItems={order_items}
          products={products}
        />
      )}
      {activeTab === 'product' && (
        <SalesByProductTab
          displayMode={displayMode}
          currentDate={currentDate}
          orders={orders}
          payments={payments}
          orderItems={order_items}
          products={products}
        />
      )}
      {activeTab === 'payment' && (
        <SalesByPaymentMethodTab
          displayMode={displayMode}
          currentDate={currentDate}
          orders={orders}
          payments={payments}
        />
      )}
    </div>
  );
};

export default SalesAnalysisDetailPage;