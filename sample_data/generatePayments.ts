import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirnameの代替（ESM対応）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ファイルパス
const ordersPath = path.join(__dirname, 'orders', 'orders.ts');
const orderItemsPath = path.join(__dirname, 'order_items', 'order_items.ts');
const productsPath = path.join(__dirname, 'products', 'products.ts');
const outputPath = path.join(__dirname, 'payments', 'payments.csv');

// 決済方法の定義（英語）
const PAYMENT_METHODS = {
  ONLINE: {
    CREDIT_CARD: 'CREDIT_CARD_ONLINE',
    PAYPAY: 'PAYPAY',
    LINE_PAY: 'LINE_PAY',
    RAKUTEN_PAY: 'RAKUTEN_PAY'
  },
  ONSITE: {
    CASH: 'CASH',
    CREDIT_CARD: 'CREDIT_CARD_ONSITE',
    QR_CODE: 'QR_CODE_ONSITE'
  }
};

// 手数料率の定義（%）
const FEE_RATES = {
  [PAYMENT_METHODS.ONLINE.CREDIT_CARD]: { min: 3.0, max: 3.8 },
  [PAYMENT_METHODS.ONLINE.PAYPAY]: { min: 2.5, max: 2.5 },
  [PAYMENT_METHODS.ONLINE.LINE_PAY]: { min: 2.8, max: 3.0 },
  [PAYMENT_METHODS.ONLINE.RAKUTEN_PAY]: { min: 2.7, max: 3.0 },
  [PAYMENT_METHODS.ONSITE.CASH]: { min: 0, max: 0 },
  [PAYMENT_METHODS.ONSITE.CREDIT_CARD]: { min: 3.0, max: 3.5 },
  [PAYMENT_METHODS.ONSITE.QR_CODE]: { min: 2.0, max: 2.5 }
};

// ユーティリティ：ランダム整数
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ユーティリティ：ランダム小数
function randFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// ユーティリティ：ランダム決済方法選択
function selectPaymentMethod(completedAt: Date): string {
  const hour = completedAt.getHours();
  
  // 時間帯による決済方法の偏り
  // ランチタイム（11-14時）: オンライン30%、現地70%
  // ディナータイム（17-24時）: オンライン45%、現地55%
  // その他の時間: オンライン40%、現地60%
  let onlineRatio;
  if (hour >= 11 && hour < 14) {
    onlineRatio = 0.3; // ランチタイム
  } else if (hour >= 17 && hour < 24) {
    onlineRatio = 0.45; // ディナータイム
  } else {
    onlineRatio = 0.4; // その他の時間
  }
  
  // オンラインか現地かを決定
  const isOnline = Math.random() < onlineRatio;
  
  if (isOnline) {
    // オンライン決済の場合
    const methods = Object.values(PAYMENT_METHODS.ONLINE);
    const weights = [0.6, 0.25, 0.1, 0.05]; // クレカ60%、PayPay25%、LINE Pay10%、楽天ペイ5%
    
    const rand = Math.random();
    let cumulativeWeight = 0;
    
    for (let i = 0; i < methods.length; i++) {
      cumulativeWeight += weights[i];
      if (rand < cumulativeWeight) {
        return methods[i];
      }
    }
    
    return methods[0]; // デフォルト
  } else {
    // 現地決済の場合
    const methods = Object.values(PAYMENT_METHODS.ONSITE);
    const weights = [0.4, 0.4, 0.2]; // 現金40%、クレカ40%、QR20%
    
    const rand = Math.random();
    let cumulativeWeight = 0;
    
    for (let i = 0; i < methods.length; i++) {
      cumulativeWeight += weights[i];
      if (rand < cumulativeWeight) {
        return methods[i];
      }
    }
    
    return methods[0]; // デフォルト
  }
}

// ユーティリティ：手数料計算
function calculateFee(amount: number, paymentMethod: string): number {
  const feeRate = FEE_RATES[paymentMethod];
  if (!feeRate) return 0;
  
  const rate = randFloat(feeRate.min, feeRate.max) / 100;
  return Math.round(amount * rate);
}


// ユーティリティ：決済日時生成（注文完了から0〜5分後）
function generatePaymentTime(orderCompletedAt: Date): Date {
  const paymentTime = new Date(orderCompletedAt);
  const minutesLater = randInt(0, 5);
  paymentTime.setMinutes(paymentTime.getMinutes() + minutesLater);
  return paymentTime;
}

async function main() {
  try {
    // orders.tsの読み込み
    const ordersModule = await import(ordersPath + '?ts');
    const orders = ordersModule.orders;
    
    // order_items.tsの読み込み
    const orderItemsModule = await import(orderItemsPath + '?ts');
    const orderItems = orderItemsModule.order_items;
    
    // products.tsの読み込み
    const productsModule = await import(productsPath + '?ts');
    const products = productsModule.products;
    
    // 注文ごとの合計金額を計算
    const orderTotals: Record<number, number> = {};
    
    for (const item of orderItems) {
      const orderId = item.orderId;
      const productId = item.productId;
      const quantity = item.quantity;
      
      // 該当する商品を検索
      const product = products.find((p: any) => p.productId === productId);
      if (!product) continue;
      
      const price = product.price;
      const itemTotal = price * quantity;
      
      if (!orderTotals[orderId]) {
        orderTotals[orderId] = 0;
      }
      
      orderTotals[orderId] += itemTotal;
    }
    
    // 決済データ生成
    const payments: {
      paymentId: number;
      orderId: number;
      paymentMethod: string;
      amount: number;
      fee: number;
      paymentTime: Date;
    }[] = [];
    
    let paymentId = 1;
    
    for (const order of orders) {
      const orderId = order.orderId;
      const orderCompletedAt = order.completedAt;
      const amount = orderTotals[orderId] || 0;
      
      if (amount === 0) continue; // 金額が0の注文はスキップ
      
      const paymentMethod = selectPaymentMethod(orderCompletedAt);
      const fee = calculateFee(amount, paymentMethod);
      const paymentTime = generatePaymentTime(orderCompletedAt);
      
      payments.push({
        paymentId,
        orderId,
        paymentMethod,
        amount,
        fee,
        paymentTime
      });
      
      paymentId++;
    }
    
    // CSVに変換して出力
    const lines = ['paymentId:int,orderId:int,paymentMethod:enum,amount:int,fee:int,paymentTime:date'];
    
    payments.forEach(payment => {
      const paymentTimeStr = payment.paymentTime.toISOString();
      lines.push(
        `${payment.paymentId},${payment.orderId},${payment.paymentMethod},${payment.amount},${payment.fee},${paymentTimeStr}`
      );
    });
    
    // 出力ディレクトリが存在しない場合は作成
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');
    console.log(`payments.csvを生成しました: ${outputPath}`);
    
    // 統計情報の出力
    const totalPayments = payments.length;
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalFee = payments.reduce((sum, p) => sum + p.fee, 0);
    
    const paymentMethodCounts: Record<string, number> = {};
    for (const payment of payments) {
      const method = payment.paymentMethod;
      paymentMethodCounts[method] = (paymentMethodCounts[method] || 0) + 1;
    }
    
    console.log(`\n===== 決済データ統計 =====`);
    console.log(`総決済件数: ${totalPayments}件`);
    console.log(`総決済金額: ${totalAmount.toLocaleString()}円`);
    console.log(`総手数料: ${totalFee.toLocaleString()}円`);
    console.log(`\n決済方法別件数:`);
    
    for (const [method, count] of Object.entries(paymentMethodCounts)) {
      const percentage = (count / totalPayments * 100).toFixed(1);
      console.log(`- ${method}: ${count}件 (${percentage}%)`);
    }
    
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

main();