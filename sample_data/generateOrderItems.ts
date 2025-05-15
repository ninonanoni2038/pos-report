import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirnameの代替（ESM対応）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ファイルパス
const ordersPath = path.join(__dirname, 'orders', 'orders.csv');
const productsPath = path.join(__dirname, 'products', 'products.ts');
const outputPath = path.join(__dirname, 'order_items', 'order_items.csv');

async function main() {
  // products.tsの読み込み（ESM対応: 動的import）
  const productsModule = await import(productsPath + '?ts');
  const products = productsModule.products;

  // orders.csvの読み込み
  const ordersCsv = fs.readFileSync(ordersPath, 'utf-8');
  const orderLines = ordersCsv.split(/\r?\n/).filter((line: string) => line && !line.startsWith('orderId'));
  const orders = orderLines.map((line: string) => {
    const [orderId, completedAt, customerId] = line.split(',');
    return { orderId: Number(orderId), completedAt };
  });

  // メニューごとにproductsを分類
  const lunchProducts = products.filter((p: any) => p.menu.includes('ランチ'));
  const dinnerProducts = products.filter((p: any) => p.menu.includes('ディナー'));

  // カテゴリごとに分類
  function classifyProducts(pool: any[]) {
    return {
      main: pool.filter((p: any) => p.category.includes('メイン料理')),
      side: pool.filter((p: any) => ['サラダ', 'デザート'].includes(p.category)),
      drink: pool.filter((p: any) => p.category.includes('ドリンク')),
      other: pool.filter((p: any) => !['メイン料理', 'サラダ', 'デザート', 'ドリンク'].includes(p.category)),
    };
  }

  // ランチ/ディナー判定関数
  function isLunch(completedAt: string): boolean {
    const hour = Number(completedAt.split('T')[1].split(':')[0]);
    return hour >= 11 && hour < 14;
  }

  // ユーティリティ：ランダム整数
  function randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // メイン処理
  const lines: string[] = ['orderItemId:int,orderId:int,productId:int,quantity:int'];
  let orderItemId = 1;

  for (const order of orders) {
    const isLunchOrder = isLunch(order.completedAt);
    const productPool = isLunchOrder ? lunchProducts : dinnerProducts;
    const classified = classifyProducts(productPool);

    // 各カテゴリから1品ずつ（なければスキップ）
    const selected: any[] = [];
    if (classified.main.length) selected.push(classified.main[randInt(0, classified.main.length - 1)]);
    if (classified.side.length) selected.push(classified.side[randInt(0, classified.side.length - 1)]);
    if (classified.drink.length) selected.push(classified.drink[randInt(0, classified.drink.length - 1)]);

    // 追加で2～5品になるまで重複しないように追加
    const already = new Set(selected.map((p: any) => p.productId));
    const remain = productPool.filter((p: any) => !already.has(p.productId));
    const numItems = randInt(Math.max(2, selected.length), 5);
    while (selected.length < numItems && remain.length > 0) {
      const idx = randInt(0, remain.length - 1);
      selected.push(remain[idx]);
      remain.splice(idx, 1);
    }

    for (const p of selected) {
      const quantity = randInt(1, 3);
      lines.push(`${orderItemId},${order.orderId},${p.productId},${quantity}`);
      orderItemId++;
    }
  }

  fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');
  console.log(`order_items.csvを生成しました: ${outputPath}`);
}

main(); 