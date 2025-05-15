import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirnameの代替（ESM対応）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ファイルパス
const ordersPath = path.join(__dirname, 'orders', 'orders.ts');
const productsPath = path.join(__dirname, 'products', 'products.ts');
const outputPath = path.join(__dirname, 'order_items', 'order_items.csv');

async function main() {
  // products.tsの読み込み（ESM対応: 動的import）
  const productsModule = await import(productsPath + '?ts');
  const products = productsModule.products;

  // orders.tsの読み込み
  const ordersModule = await import(ordersPath + '?ts');
  const orders = ordersModule.orders;

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
  const orderItems: { orderItemId: number, orderId: number, productId: number, quantity: number }[] = [];
  let orderItemId = 1;

  for (const order of orders) {
    // completedAtがDateオブジェクトなので、ISOString形式に変換してから判定
    const completedAtStr = order.completedAt.toISOString();
    const isLunchOrder = isLunch(completedAtStr);
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
      orderItems.push({
        orderItemId: orderItemId++,
        orderId: order.orderId,
        productId: p.productId,
        quantity
      });
    }
  }

  // CSVに変換して出力
  const lines = ['orderItemId:int,orderId:int,productId:int,quantity:int'];
  orderItems.forEach(item => {
    lines.push(`${item.orderItemId},${item.orderId},${item.productId},${item.quantity}`);
  });

  fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');
  console.log(`order_items.csvを生成しました: ${outputPath}`);
}

main(); 