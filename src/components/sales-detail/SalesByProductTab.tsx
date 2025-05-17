import React, { useMemo } from 'react';
import { DisplayMode } from '../../types/displayMode';
import { Order, Payment, OrderItem, Product, ProductSalesData } from '../../types/sales';
import TopProductsChart from '../sales/TopProductsChart';
import {
  filterDailyOrders,
  filterMonthlyOrders,
  filterDailyOrderItems,
  filterMonthlyOrderItems,
  generateTopProductsData
} from '../../utils/salesDataProcessor';

interface SalesByProductTabProps {
  displayMode: DisplayMode;
  currentDate: Date;
  orders: readonly Order[];
  payments: readonly Payment[];
  orderItems: readonly OrderItem[];
  products: readonly Product[];
}

const SalesByProductTab: React.FC<SalesByProductTabProps> = ({
  displayMode,
  currentDate,
  orders,
  payments,
  orderItems,
  products
}) => {
  // データ取得・加工ロジック
  const { filteredOrderItems, topProducts, totalAmount, totalCount, totalProfit } = useMemo(() => {
    let filteredOrders;
    let orderIds;
    let filteredItems;
    
    if (displayMode === DisplayMode.DAILY) {
      // 日報モードの場合
      filteredOrders = filterDailyOrders(orders, currentDate);
      orderIds = filteredOrders.map(order => order.orderId);
      filteredItems = filterDailyOrderItems(orderItems, orderIds);
    } else {
      // 月報モードの場合
      filteredOrders = filterMonthlyOrders(orders, currentDate);
      orderIds = filteredOrders.map(order => order.orderId);
      filteredItems = filterMonthlyOrderItems(orderItems, orderIds);
    }
    
    const productData = generateTopProductsData(filteredItems, products);
    const amount = productData.reduce((sum: number, item: ProductSalesData) => sum + item.amount, 0);
    const count = filteredItems.reduce((sum: number, item: OrderItem) => sum + item.quantity, 0);
    const profit = productData.reduce((sum: number, item: ProductSalesData) => sum + item.profit, 0);
    
    return {
      filteredOrderItems: filteredItems,
      topProducts: productData,
      totalAmount: amount,
      totalCount: count,
      totalProfit: profit
    };
  }, [displayMode, currentDate, orders, orderItems, products]);

  return (
    <div style={{ height: 'calc(100vh - 200px)' }}>
      <TopProductsChart
        data={topProducts}
        totalAmount={totalAmount}
        totalCount={totalCount}
        totalProfit={totalProfit}
      />
    </div>
  );
};

export default SalesByProductTab;