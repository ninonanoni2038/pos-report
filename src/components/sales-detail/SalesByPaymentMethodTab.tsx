import React, { useMemo } from 'react';
import { DisplayMode } from '../../types/displayMode';
import { Order, Payment, PaymentMethodData } from '../../types/sales';
import PaymentMethodCard from '../sales/PaymentMethodCard';
import PaymentMethodTable from './PaymentMethodTable';
import { Surface, Text, Border } from '../../styles/semanticColors';
import {
  filterDailyOrders,
  filterDailyPayments,
  filterMonthlyOrders,
  filterMonthlyPayments,
  generatePaymentMethodData
} from '../../utils/salesDataProcessor';

interface SalesByPaymentMethodTabProps {
  displayMode: DisplayMode;
  currentDate: Date;
  orders: readonly Order[];
  payments: readonly Payment[];
}

/**
 * 支払い方法別売上タブコンポーネント
 * 支払い方法別の売上データを表示する
 */
const SalesByPaymentMethodTab: React.FC<SalesByPaymentMethodTabProps> = ({
  displayMode,
  currentDate,
  orders,
  payments
}) => {
  // データ取得・加工ロジック
  const { paymentMethodData, totalAmount } = useMemo(() => {
    let filteredPayments;
    
    if (displayMode === DisplayMode.DAILY) {
      // 日報モードの場合
      filteredPayments = filterDailyPayments(payments, currentDate);
    } else {
      // 月報モードの場合
      filteredPayments = filterMonthlyPayments(payments, currentDate);
    }
    
    const data = generatePaymentMethodData(filteredPayments);
    const total = filteredPayments.reduce((sum: number, payment) => sum + payment.amount, 0);
    
    return {
      paymentMethodData: data,
      totalAmount: total
    };
  }, [displayMode, currentDate, payments]);

  return (
    <div>
      {/* 円グラフとリスト表示を同一カード内に */}
      <div style={{ marginBottom: 24 }}>
        <PaymentMethodCard
          data={paymentMethodData}
          totalAmount={totalAmount}
        />
      </div>
      
      {/* データテーブル */}
      {/* <div style={{
        background: Surface.Primary,
        padding: 16,
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}>
        <PaymentMethodTable
          data={paymentMethodData}
          totalAmount={totalAmount}
        />
      </div> */}
    </div>
  );
};

export default SalesByPaymentMethodTab;