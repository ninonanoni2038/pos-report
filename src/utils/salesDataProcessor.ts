import { 
  Order, 
  OrderItem, 
  Product, 
  Payment, 
  SalesKPI, 
  HourlyCustomerData,
  PaymentMethodData,
  ProductSalesData
} from '../types/sales';
import { PaymentMethod } from '../sample_data/payments/payments';

/**
 * 指定された日付の注文データをフィルタリングする
 * @param orders 全注文データ
 * @param date フィルタリングする日付
 * @returns 指定日付の注文データ
 */
export const filterDailyOrders = (orders: readonly Order[], date: Date): Order[] => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return orders.filter((order: Order) => {
    const orderDate = new Date(order.completedAt);
    return orderDate >= startOfDay && orderDate <= endOfDay;
  });
};

/**
 * 指定された日付の決済データをフィルタリングする
 * @param payments 全決済データ
 * @param date フィルタリングする日付
 * @returns 指定日付の決済データ
 */
export const filterDailyPayments = (payments: readonly Payment[], date: Date): Payment[] => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return payments.filter((payment: Payment) => {
    const paymentDate = new Date(payment.paymentTime);
    return paymentDate >= startOfDay && paymentDate <= endOfDay;
  });
};

/**
 * 売上関連のKPIを計算する
 * @param dailyOrders 日別注文データ
 * @param dailyPayments 日別決済データ
 * @returns 計算されたKPI
 */
export const calculateKPIs = (dailyOrders: readonly Order[], dailyPayments: readonly Payment[]): SalesKPI => {
  // 現地決済とオンライン決済の分類
  const onsitePaymentMethods = [PaymentMethod.CASH, PaymentMethod.CREDIT_CARD_ONSITE, PaymentMethod.QR_CODE_ONSITE];
  const onlinePaymentMethods = [PaymentMethod.CREDIT_CARD_ONLINE, PaymentMethod.PAYPAY, PaymentMethod.LINE_PAY, PaymentMethod.RAKUTEN_PAY];
  
  const totalSales = dailyPayments.reduce((sum: number, payment: Payment) => sum + payment.amount, 0);
  const totalCustomers = dailyOrders.length;
  const averagePerCustomer = totalCustomers > 0 ? totalSales / totalCustomers : 0;
  const totalFees = dailyPayments.reduce((sum: number, payment: Payment) => sum + payment.fee, 0);
  const netSales = totalSales - totalFees;
  
  const onsitePayments = dailyPayments
    .filter((payment: Payment) => onsitePaymentMethods.includes(payment.paymentMethod))
    .reduce((sum: number, payment: Payment) => sum + payment.amount, 0);
    
  const onlinePayments = dailyPayments
    .filter((payment: Payment) => onlinePaymentMethods.includes(payment.paymentMethod))
    .reduce((sum: number, payment: Payment) => sum + payment.amount, 0);
  
  return {
    totalSales,
    totalCustomers,
    averagePerCustomer,
    totalFees,
    netSales,
    onsitePayments,
    onlinePayments
  };
};

/**
 * 時間帯別の客数データを生成する
 * @param dailyOrders 日別注文データ
 * @returns 時間帯別客数データ
 */
export const generateHourlyCustomersData = (dailyOrders: readonly Order[]): HourlyCustomerData[] => {
  const hourlyCustomers: { [hour: string]: number } = {};
  
  dailyOrders.forEach((order: Order) => {
    const orderDate = new Date(order.completedAt);
    const hour = orderDate.getHours();
    const hourKey = `${hour}:00`;
    
    if (hourlyCustomers[hourKey]) {
      hourlyCustomers[hourKey]++;
    } else {
      hourlyCustomers[hourKey] = 1;
    }
  });
  
  return Object.entries(hourlyCustomers)
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => {
      const hourA = parseInt(a.hour.split(':')[0]);
      const hourB = parseInt(b.hour.split(':')[0]);
      return hourA - hourB;
    });
};

/**
 * 決済方法別のデータを生成する
 * @param dailyPayments 日別決済データ
 * @returns 決済方法別データ
 */
export const generatePaymentMethodData = (dailyPayments: readonly Payment[]): PaymentMethodData[] => {
  const paymentMethodAmounts: { [method in PaymentMethod]?: number } = {};
  
  dailyPayments.forEach((payment: Payment) => {
    const method = payment.paymentMethod;
    
    if (paymentMethodAmounts[method]) {
      paymentMethodAmounts[method]! += payment.amount;
    } else {
      paymentMethodAmounts[method] = payment.amount;
    }
  });
  
  return Object.entries(paymentMethodAmounts)
    .map(([method, amount]) => ({
      name: method.replace(/_/g, ' ').toLowerCase(),
      value: amount
    }));
};

/**
 * 売れ筋商品ランキングデータを生成する
 * @param dailyOrderItems 日別注文アイテムデータ
 * @param products 商品データ
 * @returns 売れ筋商品ランキングデータ
 */
export const generateTopProductsData = (
  dailyOrderItems: readonly OrderItem[],
  products: readonly Product[]
): ProductSalesData[] => {
  const productSales: { [productId: number]: { count: number; amount: number } } = {};
  
  // 商品ごとの売上を集計
  dailyOrderItems.forEach((item: OrderItem) => {
    const product = products.find((p: Product) => p.productId === item.productId);
    
    if (product) {
      const amount = product.price * item.quantity;
      
      if (productSales[item.productId]) {
        productSales[item.productId].count += item.quantity;
        productSales[item.productId].amount += amount;
      } else {
        productSales[item.productId] = {
          count: item.quantity,
          amount: amount
        };
      }
    }
  });
  
  // 売上金額順にソート
  return Object.entries(productSales)
    .map(([productId, data]) => {
      const product = products.find((p: Product) => p.productId === parseInt(productId));
      return {
        name: product ? product.productName : `商品ID: ${productId}`,
        amount: data.amount,
        count: data.count
      };
    })
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
};

/**
 * 指定された日付の注文アイテムをフィルタリングする
 * @param orderItems 全注文アイテムデータ
 * @param dailyOrderIds 日別注文ID配列
 * @returns 指定日付の注文アイテム
 */
export const filterDailyOrderItems = (
  orderItems: readonly OrderItem[],
  dailyOrderIds: readonly number[]
): OrderItem[] => {
  return orderItems.filter((item: OrderItem) => dailyOrderIds.includes(item.orderId));
};