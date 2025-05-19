import React from 'react';
import { useSalesAnalysis } from '../contexts/SalesAnalysisContext';
import SalesByPaymentMethodTab from '../components/sales-detail/SalesByPaymentMethodTab';

// サンプルデータのインポート
import { payments } from '../sample_data/payments/payments';
import { orders } from '../sample_data/orders/orders';

/**
 * 支払い方法別売上ページコンポーネント
 * 支払い方法別の売上データを表示する
 */
const SalesByPaymentMethodPage: React.FC = () => {
  const { displayMode, currentDate } = useSalesAnalysis();

  return (
    <SalesByPaymentMethodTab
      displayMode={displayMode}
      currentDate={currentDate}
      orders={orders}
      payments={payments}
    />
  );
};

export default SalesByPaymentMethodPage;