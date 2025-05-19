import React from 'react';
import { useSalesAnalysis } from '../contexts/SalesAnalysisContext';
import SalesByProductTab from '../components/sales-detail/SalesByProductTab';

// サンプルデータのインポート
import { payments } from '../sample_data/payments/payments';
import { orders } from '../sample_data/orders/orders';
import { order_items } from '../sample_data/order_items/order_items';
import { products } from '../sample_data/products/products';

/**
 * 商品別売上ページコンポーネント
 * 商品別の売上データを表示する
 */
const SalesByProductPage: React.FC = () => {
  const { displayMode, currentDate } = useSalesAnalysis();

  return (
    <SalesByProductTab
      displayMode={displayMode}
      currentDate={currentDate}
      orders={orders}
      payments={payments}
      orderItems={order_items}
      products={products}
    />
  );
};

export default SalesByProductPage;