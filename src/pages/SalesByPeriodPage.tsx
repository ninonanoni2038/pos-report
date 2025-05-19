import React from 'react';
import { useSalesAnalysis } from '../contexts/SalesAnalysisContext';
import SalesByPeriodTab from '../components/sales-detail/SalesByPeriodTab';

// サンプルデータのインポート
import { payments } from '../sample_data/payments/payments';
import { orders } from '../sample_data/orders/orders';
import { order_items } from '../sample_data/order_items/order_items';
import { products } from '../sample_data/products/products';

/**
 * 期間別売上ページコンポーネント
 * 期間別の売上データを表示する
 */
const SalesByPeriodPage: React.FC = () => {
  const { displayMode, currentDate } = useSalesAnalysis();

  return (
    <SalesByPeriodTab
      displayMode={displayMode}
      currentDate={currentDate}
      orders={orders}
      payments={payments}
      orderItems={order_items}
      products={products}
    />
  );
};

export default SalesByPeriodPage;