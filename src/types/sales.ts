import { PaymentMethod } from '../sample_data/payments/payments';

// 注文データの型定義
export interface Order {
  orderId: number;
  completedAt: Date;
  customerId: number;
}

// 注文アイテムの型定義
export interface OrderItem {
  orderItemId: number;
  orderId: number;
  productId: number;
  quantity: number;
}

// 商品データの型定義
export interface Product {
  productId: number;
  menu: string;
  category: string;
  subCategory: string;
  productName: string;
  price: number;
  cost: number;
  profit: number;
}

// 決済データの型定義
export interface Payment {
  paymentId: number;
  orderId: number;
  paymentMethod: PaymentMethod;
  amount: number;
  fee: number;
  paymentTime: Date;
}

// KPI計算結果の型定義
export interface SalesKPI {
  totalSales: number;
  totalCustomers: number;
  averagePerCustomer: number;
  totalFees: number;
  netSales: number;
  onsitePayments: number;
  onlinePayments: number;
}

// 時間帯別客数データの型定義
export interface HourlyCustomerData {
  hour: string;
  count: number;
}

// 決済方法別データの型定義
export interface PaymentMethodData {
  name: string;
  value: number;
}

// 商品売上データの型定義
export interface ProductSalesData {
  name: string;
  amount: number;
  count: number;
}