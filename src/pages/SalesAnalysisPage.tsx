import React, { useState, useEffect } from 'react';
import { Surface, Text, Border, Object as ObjectColor } from '../styles/semanticColors';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// サンプルデータのインポート
import { payments, PaymentMethod } from '../sample_data/payments/payments';
import { orders } from '../sample_data/orders/orders';
import { order_items } from '../sample_data/order_items/order_items';
import { products } from '../sample_data/products/products';

// 型定義
interface Order {
  orderId: number;
  completedAt: Date;
  customerId: number;
}

interface OrderItem {
  orderItemId: number;
  orderId: number;
  productId: number;
  quantity: number;
}

interface Product {
  productId: number;
  menu: string;
  category: string;
  subCategory: string;
  productName: string;
  price: number;
  cost: number;
  profit: number;
}

interface Payment {
  paymentId: number;
  orderId: number;
  paymentMethod: PaymentMethod;
  amount: number;
  fee: number;
  paymentTime: Date;
}

// 日付フォーマット用ユーティリティ
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ja-JP', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });
};

// 金額フォーマット用ユーティリティ
const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' });
};

// 期間選択コンポーネント
const PeriodSelector: React.FC<{
  currentDate: Date;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
}> = ({ currentDate, onPrevDay, onNextDay, onToday }) => {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      marginBottom: 24,
      background: Surface.Primary,
      padding: '12px 16px',
      borderRadius: 8,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <div style={{ marginRight: 'auto', display: 'flex', alignItems: 'center' }}>
        <span style={{ color: Text.Secondary, marginRight: 8 }}>日報</span>
        <button 
          onClick={onPrevDay}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: ObjectColor.AccentPrimary,
            fontSize: 18,
            padding: '0 8px'
          }}
        >
          &lt;
        </button>
        <div style={{ 
          padding: '6px 16px', 
          border: `1px solid ${Border.LowEmphasis}`,
          borderRadius: 4,
          margin: '0 8px',
          fontWeight: 'bold'
        }}>
          {formatDate(currentDate)}
        </div>
        <button 
          onClick={onNextDay}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: ObjectColor.AccentPrimary,
            fontSize: 18,
            padding: '0 8px'
          }}
        >
          &gt;
        </button>
      </div>
      <button 
        onClick={onToday}
        style={{
          border: `1px solid ${Border.LowEmphasis}`,
          background: Surface.Primary,
          padding: '6px 12px',
          borderRadius: 4,
          cursor: 'pointer',
          color: Text.Secondary
        }}
      >
        今日
      </button>
    </div>
  );
};

// KPIカードコンポーネント
const KpiCard: React.FC<{
  title: string;
  value: string;
  subValue?: string;
  onClick?: () => void;
}> = ({ title, value, subValue, onClick }) => {
  return (
    <div 
      style={{ 
        background: Surface.Primary, 
        padding: 16, 
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        flex: 1,
        margin: '0 8px',
        minWidth: 200
      }}
      onClick={onClick}
      onMouseOver={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        }
      }}
      onMouseOut={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        }
      }}
    >
      <div style={{ color: Text.Secondary, marginBottom: 8, fontSize: 14 }}>{title}</div>
      <div style={{ color: Text.Primary, fontWeight: 'bold', fontSize: 24 }}>{value}</div>
      {subValue && (
        <div style={{ color: Text.Tertiary, fontSize: 12, marginTop: 4 }}>{subValue}</div>
      )}
    </div>
  );
};

// 売上分析ページコンポーネント
const SalesAnalysisPage: React.FC = () => {
  // 状態管理
  const [currentDate, setCurrentDate] = useState<Date>(new Date('2024-03-01'));
  
  // 日付操作ハンドラ
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
    setCurrentDate(new Date('2024-03-01')); // サンプルデータの日付に合わせる
  };

  // 選択された日付のデータを計算
  const startOfDay = new Date(currentDate);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(currentDate);
  endOfDay.setHours(23, 59, 59, 999);
  
  // 当日の注文データをフィルタリング
  const dailyOrders = orders.filter((order: Order) => {
    const orderDate = new Date(order.completedAt);
    return orderDate >= startOfDay && orderDate <= endOfDay;
  });
  
  // 当日の決済データをフィルタリング
  const dailyPayments = payments.filter((payment: Payment) => {
    const paymentDate = new Date(payment.paymentTime);
    return paymentDate >= startOfDay && paymentDate <= endOfDay;
  });
  
  // KPI計算
  const totalSales = dailyPayments.reduce((sum: number, payment: Payment) => sum + payment.amount, 0);
  const totalCustomers = dailyOrders.length;
  const averagePerCustomer = totalCustomers > 0 ? totalSales / totalCustomers : 0;
  
  // 時間帯別の客数データ作成（客ピークグラフ用）
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
  
  const hourlyCustomersData = Object.entries(hourlyCustomers)
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => {
      const hourA = parseInt(a.hour.split(':')[0]);
      const hourB = parseInt(b.hour.split(':')[0]);
      return hourA - hourB;
    });
  
  // 決済方法別データ作成（円グラフ用）
  const paymentMethodCounts: { [method in PaymentMethod]?: number } = {};
  const paymentMethodAmounts: { [method in PaymentMethod]?: number } = {};
  
  dailyPayments.forEach((payment: Payment) => {
    const method = payment.paymentMethod;
    
    if (paymentMethodCounts[method]) {
      paymentMethodCounts[method]!++;
      paymentMethodAmounts[method]! += payment.amount;
    } else {
      paymentMethodCounts[method] = 1;
      paymentMethodAmounts[method] = payment.amount;
    }
  });
  
  const paymentMethodData = Object.entries(paymentMethodAmounts)
    .map(([method, amount]) => ({
      name: method.replace(/_/g, ' ').toLowerCase(),
      value: amount
    }));
  
  // 売れ筋商品ランキングデータ作成
  const productSales: { [productId: number]: { count: number; amount: number } } = {};
  
  // 当日の注文IDを取得
  const dailyOrderIds = dailyOrders.map((order: Order) => order.orderId);
  
  // 当日の注文アイテムをフィルタリング
  const dailyOrderItems = order_items.filter((item: OrderItem) => dailyOrderIds.includes(item.orderId));
  
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
  const topProducts = Object.entries(productSales)
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
  
  // 円グラフの色
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C'];

  // 詳細情報の計算
  const totalFees = dailyPayments.reduce((sum: number, payment: Payment) => sum + payment.fee, 0);
  const netSales = totalSales - totalFees;
  
  // 現地決済とオンライン決済の分類
  const onsitePaymentMethods = [PaymentMethod.CASH, PaymentMethod.CREDIT_CARD_ONSITE, PaymentMethod.QR_CODE_ONSITE];
  const onlinePaymentMethods = [PaymentMethod.CREDIT_CARD_ONLINE, PaymentMethod.PAYPAY, PaymentMethod.LINE_PAY, PaymentMethod.RAKUTEN_PAY];
  
  const onsitePayments = dailyPayments
    .filter((payment: Payment) => onsitePaymentMethods.includes(payment.paymentMethod))
    .reduce((sum: number, payment: Payment) => sum + payment.amount, 0);
    
  const onlinePayments = dailyPayments
    .filter((payment: Payment) => onlinePaymentMethods.includes(payment.paymentMethod))
    .reduce((sum: number, payment: Payment) => sum + payment.amount, 0);

  return (
    <div style={{ padding: 24 }}>
      {/* 期間選択 */}
      <PeriodSelector 
        currentDate={currentDate}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        onToday={handleToday}
      />
      
      {/* KPIカード */}
      <div style={{ display: 'flex', marginBottom: 24 }}>
        <KpiCard 
          title="売上金額" 
          value={formatCurrency(totalSales)}
          subValue="前日比: +5.2%"
          onClick={() => console.log('売上詳細へ')}
        />
        <KpiCard 
          title="総客数" 
          value={`${totalCustomers}組`}
          subValue="前日比: +3組"
        />
        <KpiCard 
          title="客単価" 
          value={formatCurrency(averagePerCustomer)}
          subValue="前日比: +2.1%"
        />
      </div>
      
      {/* グラフセクション */}
      <div style={{ display: 'flex', marginBottom: 24, gap: 16 }}>
        {/* 客ピークグラフ */}
        <div style={{ 
          flex: 1, 
          background: Surface.Primary, 
          padding: 16, 
          borderRadius: 8,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: Text.Primary }}>客ピーク</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={hourlyCustomersData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="客数" fill={ObjectColor.AccentPrimary} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* 決済手段構成 */}
        <div style={{ 
          flex: 1, 
          background: Surface.Primary, 
          padding: 16, 
          borderRadius: 8,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: Text.Primary }}>決済手段構成</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* 売れ筋商品ランキング */}
      <div style={{ 
        background: Surface.Primary, 
        padding: 16, 
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        marginBottom: 24
      }}>
        <h3 style={{ margin: '0 0 16px 0', color: Text.Primary }}>売れ筋商品ランキングTop5</h3>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={topProducts}
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Bar dataKey="amount" name="売上金額" fill={ObjectColor.AccentPrimary} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* 詳細情報 */}
      <div style={{ 
        background: Surface.Primary, 
        padding: 16, 
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', color: Text.Primary }}>詳細情報</h3>
        
        {/* 売上セクション */}
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ margin: '0 0 8px 0', color: Text.Primary }}>売上</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}` }}>売上合計</td>
                <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}`, textAlign: 'right' }}>{formatCurrency(totalSales)}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}` }}>現地決済</td>
                <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}`, textAlign: 'right' }}>{formatCurrency(onsitePayments)}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}` }}>オンライン決済</td>
                <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}`, textAlign: 'right' }}>{formatCurrency(onlinePayments)}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}` }}>手数料</td>
                <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}`, textAlign: 'right' }}>{formatCurrency(totalFees)}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', fontWeight: 'bold' }}>純売上</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold', color: ObjectColor.AccentPrimary }}>{formatCurrency(netSales)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* 詳細情報 */}
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ margin: '0 0 8px 0', color: Text.Primary }}>詳細情報</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}` }}>組数</td>
                <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}`, textAlign: 'right' }}>{totalCustomers}組</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}` }}>客数</td>
                <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}`, textAlign: 'right' }}>{totalCustomers}人</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}` }}>客単価</td>
                <td style={{ padding: '8px 0', borderBottom: `1px solid ${Border.LowEmphasis}`, textAlign: 'right' }}>{formatCurrency(averagePerCustomer)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalysisPage;