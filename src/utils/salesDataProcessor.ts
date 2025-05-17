import {
  Order,
  OrderItem,
  Product,
  Payment,
  SalesKPI,
  HourlyCustomerData,
  PaymentMethodData,
  ProductSalesData,
  DailyCustomerData,
  HourlySalesData,
  DailySalesData,
  DetailedSalesData
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
  
  // 総人数を計算
  const totalPartySize = dailyOrders.reduce((sum, order) => sum + order.partySize, 0);
  
  // 客単価を人数で計算
  const averagePerCustomer = totalPartySize > 0 ? totalSales / totalPartySize : 0;
  
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
/**
 * 時間帯のフォーマット関数の型定義
 */
type TimeFormatter = (date: Date) => string;

/**
 * 時間帯データを生成する汎用関数
 * @param dailyOrders 日別注文データ
 * @param formatTime 時間帯フォーマット関数
 * @param sortFn ソート関数（オプション）
 * @returns 時間帯別客数データ
 */
const generateTimeBasedCustomersData = (
  dailyOrders: readonly Order[],
  formatTime: TimeFormatter,
  sortFn?: (a: HourlyCustomerData, b: HourlyCustomerData) => number
): HourlyCustomerData[] => {
  const timeData: { [timeKey: string]: { count: number, partySize: number } } = {};
  
  dailyOrders.forEach((order: Order) => {
    const orderDate = new Date(order.completedAt);
    const timeKey = formatTime(orderDate);
    
    if (timeData[timeKey]) {
      timeData[timeKey].count++;
      timeData[timeKey].partySize += order.partySize;
    } else {
      timeData[timeKey] = {
        count: 1,
        partySize: order.partySize
      };
    }
  });
  
  const result = Object.entries(timeData)
    .map(([hour, data]) => ({
      hour,
      count: data.count,
      partySize: data.partySize
    }));
  
  return sortFn ? result.sort(sortFn) : result;
};

/**
 * 時間のソート関数
 */
const sortByHour = (a: HourlyCustomerData, b: HourlyCustomerData): number => {
  const hourA = parseInt(a.hour.split(':')[0]);
  const hourB = parseInt(b.hour.split(':')[0]);
  return hourA - hourB;
};

/**
 * 時間と分のソート関数
 */
const sortByHourAndMinute = (a: HourlyCustomerData, b: HourlyCustomerData): number => {
  const [hourA, minuteA] = a.hour.split(':').map(Number);
  const [hourB, minuteB] = b.hour.split(':').map(Number);
  if (hourA !== hourB) return hourA - hourB;
  return minuteA - minuteB;
};

// 1時間区切りの時間帯別客数データを生成
export const generateHourlyCustomersData = (dailyOrders: readonly Order[]): HourlyCustomerData[] => {
  const formatHourly = (date: Date): string => `${date.getHours()}:00`;
  return generateTimeBasedCustomersData(dailyOrders, formatHourly, sortByHour);
};

// 30分区切りの時間帯別客数データを生成
export const generateHalfHourlyCustomersData = (dailyOrders: readonly Order[]): HourlyCustomerData[] => {
  const formatHalfHourly = (date: Date): string => {
    const hour = date.getHours();
    const minute = date.getMinutes();
    // 0-29分は「XX:00」、30-59分は「XX:30」に集計
    return minute < 30
      ? `${hour.toString().padStart(2, '0')}:00`
      : `${hour.toString().padStart(2, '0')}:30`;
  };
  return generateTimeBasedCustomersData(dailyOrders, formatHalfHourly, sortByHourAndMinute);
};

// 2時間区切りの時間帯別客数データを生成
export const generateTwoHourlyCustomersData = (dailyOrders: readonly Order[]): HourlyCustomerData[] => {
  const formatTwoHourly = (date: Date): string => {
    const hour = date.getHours();
    // 2時間単位でグループ化（0-1時は「00:00-02:00」など）
    const twoHourBlock = Math.floor(hour / 2) * 2;
    return `${twoHourBlock.toString().padStart(2, '0')}:00-${(twoHourBlock + 2).toString().padStart(2, '0')}:00`;
  };
  return generateTimeBasedCustomersData(dailyOrders, formatTwoHourly, sortByHour);
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
  // すべての商品に対して初期値を設定
  const productSales: { [productId: number]: { count: number; amount: number } } = {};
  
  // すべての商品を初期化（売上0として）
  products.forEach((product) => {
    productSales[product.productId] = {
      count: 0,
      amount: 0
    };
  });
  
  // 商品ごとの売上を集計
  dailyOrderItems.forEach((item: OrderItem) => {
    const product = products.find((p: Product) => p.productId === item.productId);
    
    if (product) {
      const amount = product.price * item.quantity;
      productSales[item.productId].count += item.quantity;
      productSales[item.productId].amount += amount;
    }
  });
  
  // すべての商品データを返す（売れていない商品も含む）
  return Object.entries(productSales)
    .map(([productId, data]) => {
      const product = products.find((p: Product) => p.productId === parseInt(productId));
      if (!product) return null; // 商品が見つからない場合はスキップ
      
      return {
        name: product.productName,
        amount: data.amount,
        count: data.count,
        profit: product.profit * data.count,
        productId: parseInt(productId),
        menu: product.menu,
        category: product.category,
        subCategory: product.subCategory
      };
    })
    .filter((item) => item !== null) as ProductSalesData[]; // nullをフィルタリング
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

/**
 * 指定された年月の注文データをフィルタリングする
 * @param orders 全注文データ
 * @param date フィルタリングする年月の日付
 * @returns 指定年月の注文データ
 */
export const filterMonthlyOrders = (orders: readonly Order[], date: Date): Order[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  return orders.filter((order: Order) => {
    const orderDate = new Date(order.completedAt);
    return orderDate.getFullYear() === year && orderDate.getMonth() === month;
  });
};

/**
 * 指定された年月の決済データをフィルタリングする
 * @param payments 全決済データ
 * @param date フィルタリングする年月の日付
 * @returns 指定年月の決済データ
 */
export const filterMonthlyPayments = (payments: readonly Payment[], date: Date): Payment[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  return payments.filter((payment: Payment) => {
    const paymentDate = new Date(payment.paymentTime);
    return paymentDate.getFullYear() === year && paymentDate.getMonth() === month;
  });
};

/**
 * 月内の日別客数データを生成する
 * @param monthlyOrders 月別注文データ
 * @returns 日別客数データ
 */
export const generateDailyCustomersData = (monthlyOrders: readonly Order[]): DailyCustomerData[] => {
  const dailyData: { [dateKey: string]: { count: number, partySize: number } } = {};
  
  monthlyOrders.forEach((order: Order) => {
    const orderDate = new Date(order.completedAt);
    const day = orderDate.getDate();
    const dateKey = day.toString();
    
    if (dailyData[dateKey]) {
      dailyData[dateKey].count++;
      dailyData[dateKey].partySize += order.partySize;
    } else {
      dailyData[dateKey] = {
        count: 1,
        partySize: order.partySize
      };
    }
  });
  
  // 日付順にソート
  return Object.entries(dailyData)
    .map(([day, data]) => ({
      day,
      count: data.count,
      partySize: data.partySize
    }))
    .sort((a, b) => parseInt(a.day) - parseInt(b.day));
};

/**
 * 月次データに基づいてKPIを計算する
 * @param monthlyOrders 月別注文データ
 * @param monthlyPayments 月別決済データ
 * @returns 計算されたKPI
 */
export const calculateMonthlyKPIs = (monthlyOrders: readonly Order[], monthlyPayments: readonly Payment[]): SalesKPI => {
  // 現地決済とオンライン決済の分類
  const onsitePaymentMethods = [PaymentMethod.CASH, PaymentMethod.CREDIT_CARD_ONSITE, PaymentMethod.QR_CODE_ONSITE];
  const onlinePaymentMethods = [PaymentMethod.CREDIT_CARD_ONLINE, PaymentMethod.PAYPAY, PaymentMethod.LINE_PAY, PaymentMethod.RAKUTEN_PAY];
  
  const totalSales = monthlyPayments.reduce((sum: number, payment: Payment) => sum + payment.amount, 0);
  const totalCustomers = monthlyOrders.length;
  
  // 総人数を計算
  const totalPartySize = monthlyOrders.reduce((sum, order) => sum + order.partySize, 0);
  
  // 客単価を人数で計算
  const averagePerCustomer = totalPartySize > 0 ? totalSales / totalPartySize : 0;
  
  const totalFees = monthlyPayments.reduce((sum: number, payment: Payment) => sum + payment.fee, 0);
  const netSales = totalSales - totalFees;
  
  const onsitePayments = monthlyPayments
    .filter((payment: Payment) => onsitePaymentMethods.includes(payment.paymentMethod))
    .reduce((sum: number, payment: Payment) => sum + payment.amount, 0);
    
  const onlinePayments = monthlyPayments
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
 * 指定された月の注文アイテムをフィルタリングする
 * @param orderItems 全注文アイテムデータ
 * @param monthlyOrderIds 月別注文ID配列
 * @returns 指定月の注文アイテム
 */
export const filterMonthlyOrderItems = (
  orderItems: readonly OrderItem[],
  monthlyOrderIds: readonly number[]
): OrderItem[] => {
  return orderItems.filter((item: OrderItem) => monthlyOrderIds.includes(item.orderId));
};

/**
 * 時間帯別売上データを生成する
 * @param dailyOrders 日別注文データ
 * @param dailyPayments 日別決済データ
 * @param dailyOrderItems 日別注文アイテムデータ
 * @param products 商品データ
 * @returns 時間帯別売上データ
 */
export const generateHourlySalesData = (
  dailyOrders: readonly Order[],
  dailyPayments: readonly Payment[],
  dailyOrderItems: readonly OrderItem[],
  products: readonly Product[]
): HourlySalesData[] => {
  // 時間帯ごとのデータを格納するオブジェクト
  const hourlyData: { [hour: string]: {
    totalSales: number;
    fees: number;
    count: number;
    partySize: number;
    profit: number;
  }} = {};

  // 時間帯ごとの注文を集計
  dailyOrders.forEach(order => {
    const orderDate = new Date(order.completedAt);
    const hour = `${orderDate.getHours()}:00`;

    if (!hourlyData[hour]) {
      hourlyData[hour] = {
        totalSales: 0,
        fees: 0,
        count: 0,
        partySize: 0,
        profit: 0
      };
    }

    hourlyData[hour].count++;
    hourlyData[hour].partySize += order.partySize;

    // この注文に関連する決済を検索
    const orderPayments = dailyPayments.filter(payment => payment.orderId === order.orderId);
    orderPayments.forEach(payment => {
      hourlyData[hour].totalSales += payment.amount;
      hourlyData[hour].fees += payment.fee;
    });

    // この注文に関連する注文アイテムを検索して粗利を計算
    const orderItems = dailyOrderItems.filter(item => item.orderId === order.orderId);
    orderItems.forEach(item => {
      const product = products.find(p => p.productId === item.productId);
      if (product) {
        hourlyData[hour].profit += product.profit * item.quantity;
      }
    });
  });

  // 結果を配列に変換
  return Object.entries(hourlyData)
    .map(([hour, data]) => ({
      hour,
      totalSales: data.totalSales,
      netSales: data.totalSales - data.fees,
      fees: data.fees,
      profit: data.profit,
      averagePerCustomer: data.partySize > 0 ? data.totalSales / data.partySize : 0
    }))
    .sort((a, b) => {
      const hourA = parseInt(a.hour.split(':')[0]);
      const hourB = parseInt(b.hour.split(':')[0]);
      return hourA - hourB;
    });
};

/**
 * 日別売上データを生成する
 * @param monthlyOrders 月別注文データ
 * @param monthlyPayments 月別決済データ
 * @param monthlyOrderItems 月別注文アイテムデータ
 * @param products 商品データ
 * @returns 日別売上データ
 */
export const generateDailySalesData = (
  monthlyOrders: readonly Order[],
  monthlyPayments: readonly Payment[],
  monthlyOrderItems: readonly OrderItem[],
  products: readonly Product[]
): DailySalesData[] => {
  // 日付ごとのデータを格納するオブジェクト
  const dailyData: { [day: string]: {
    totalSales: number;
    fees: number;
    count: number;
    partySize: number;
    profit: number;
  }} = {};

  // 日付ごとの注文を集計
  monthlyOrders.forEach(order => {
    const orderDate = new Date(order.completedAt);
    const day = orderDate.getDate().toString();

    if (!dailyData[day]) {
      dailyData[day] = {
        totalSales: 0,
        fees: 0,
        count: 0,
        partySize: 0,
        profit: 0
      };
    }

    dailyData[day].count++;
    dailyData[day].partySize += order.partySize;

    // この注文に関連する決済を検索
    const orderPayments = monthlyPayments.filter(payment => payment.orderId === order.orderId);
    orderPayments.forEach(payment => {
      dailyData[day].totalSales += payment.amount;
      dailyData[day].fees += payment.fee;
    });

    // この注文に関連する注文アイテムを検索して粗利を計算
    const orderItems = monthlyOrderItems.filter(item => item.orderId === order.orderId);
    orderItems.forEach(item => {
      const product = products.find(p => p.productId === item.productId);
      if (product) {
        dailyData[day].profit += product.profit * item.quantity;
      }
    });
  });

  // 結果を配列に変換
  return Object.entries(dailyData)
    .map(([day, data]) => ({
      day,
      totalSales: data.totalSales,
      netSales: data.totalSales - data.fees,
      fees: data.fees,
      profit: data.profit,
      averagePerCustomer: data.partySize > 0 ? data.totalSales / data.partySize : 0
    }))
    .sort((a, b) => parseInt(a.day) - parseInt(b.day));
};

/**
 * 詳細データテーブル用のデータを計算する
 * @param salesData 時間帯別/日別売上データ
 * @returns 詳細データテーブル用のデータ
 */
export const calculateDetailedSalesData = (
  salesData: HourlySalesData[] | DailySalesData[]
): DetailedSalesData => {
  const periods = salesData.map(data => 'hour' in data ? data.hour : data.day);
  const totalSales = salesData.map(data => data.totalSales);
  const netSales = salesData.map(data => data.netSales);
  const fees = salesData.map(data => data.fees);
  const profit = salesData.map(data => data.profit);
  const averagePerCustomer = salesData.map(data => data.averagePerCustomer);

  return {
    periods,
    totalSales,
    netSales,
    fees,
    profit,
    averagePerCustomer
  };
};