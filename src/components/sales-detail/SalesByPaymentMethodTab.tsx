import React, { useMemo } from 'react';
import { DisplayMode } from '../../types/displayMode';
import { Order, Payment, PaymentMethodData } from '../../types/sales';
import PaymentMethodChart from '../sales/PaymentMethodChart';
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
      {/* 円グラフ */}
      <div style={{
        background: Surface.Primary,
        padding: 16,
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        marginBottom: 24
      }}>
        <h3 style={{ margin: '0 0 16px 0' }}>全ての支払い方法</h3>
        <div style={{ height: 300 }}>
          <PaymentMethodChart
            data={paymentMethodData}
          />
        </div>
      </div>
      
      {/* データテーブル */}
      <div style={{
        background: Surface.Primary,
        padding: 16,
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <PaymentMethodTable
          data={paymentMethodData}
          totalAmount={totalAmount}
        />
      </div>
    </div>
  );
};

export default SalesByPaymentMethodTab;