import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirnameの代替（ESM対応）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 期間設定
const startDate = new Date('2024-03-01');
const endDate = new Date('2024-05-31');
const customerMax = 100;
const minOrdersPerDay = 10;
const maxOrdersPerDay = 30;

// ランチ・ディナータイムの時間帯
const lunchStart = 11;
const lunchEnd = 14;
const dinnerStart = 17;
const dinnerEnd = 24;

// 出力先
const outputPath = path.join(__dirname, 'orders', 'orders.csv');

// ユーティリティ：ランダム整数
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// customerIdを均等に分布させるための配列
function createCustomerIdPool(total: number, maxId: number): number[] {
  // 1からmaxIdまでの全ての数値を含む配列を生成
  const allIds: number[] = [];
  for (let id = 1; id <= maxId; id++) {
    allIds.push(id);
  }
  
  // 配列をシャッフル
  for (let i = allIds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allIds[i], allIds[j]] = [allIds[j], allIds[i]];
  }
  
  // シャッフルした配列から必要な数だけ取得
  return allIds.slice(0, total);
}

// メイン処理
const lines: string[] = ['orderId:int,completedAt:date,customerId:int,partySize:int'];
let customerIdPool: number[] = [];
// orderIdを一旦外し、completedAt, customerId, partySizeのみで生成
const allOrders: { completedAt: string, customerId: number, partySize: number }[] = [];

for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
  const ordersToday = randInt(minOrdersPerDay, maxOrdersPerDay);
  customerIdPool = createCustomerIdPool(ordersToday, customerMax);

  for (let i = 0; i < ordersToday; i++) {
    // ランチかディナーをランダム選択
    const isLunch = Math.random() < 0.5;
    let hour: number;
    if (isLunch) {
      hour = randInt(lunchStart, lunchEnd - 1);
    } else {
      hour = randInt(dinnerStart, dinnerEnd - 1);
    }
    const minute = randInt(0, 59);
    const second = randInt(0, 59);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
    const completedAt = `${dateStr}T${timeStr}`;
    const customerId = customerIdPool[i];
    
    // 人数を生成（1〜6人）
    const partySize = randInt(1, 6);
    
    allOrders.push({ completedAt, customerId, partySize });
  }
}

// completedAtで時系列ソート
allOrders.sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime());

// ソート後にorderIdを1から順に付与してCSV出力
allOrders.forEach((o, idx) => {
  lines.push(`${idx + 1},${o.completedAt},${o.customerId},${o.partySize}`);
});

fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');
console.log(`orders.csvを生成しました: ${outputPath}`); 