import { ProductSalesData } from '../../types/sales';
import { Surface } from '../../styles/semanticColors';

/**
 * ABC分析のためのデータ型
 */
export interface ABCAnalysisItem extends ProductSalesData {
  amountRank: 'A' | 'B' | 'C';
  countRank: 'A' | 'B' | 'C';
  profitRank: 'A' | 'B' | 'C';
}

/**
 * デフォルトのABC分析閾値
 */
export const DEFAULT_ABC_THRESHOLDS = {
  a: 70,
  b: 90
};

/**
 * ABC分析を行う関数
 * @param data 商品売上データ
 * @param totalAmount 合計売上金額
 * @param totalCount 合計売上個数
 * @param totalProfit 合計粗利
 * @param thresholds ABC分析の閾値（デフォルト: A=70%, B=90%）
 * @returns ABC分析結果
 */
export const performABCAnalysis = (
  data: ProductSalesData[],
  totalAmount: number,
  totalCount: number,
  totalProfit: number,
  thresholds: { a: number; b: number } = DEFAULT_ABC_THRESHOLDS
): ABCAnalysisItem[] => {
  // 各指標でソートしたデータを準備
  const amountSorted = [...data].sort((a, b) => b.amount - a.amount);
  const countSorted = [...data].sort((a, b) => b.count - a.count);
  const profitSorted = [...data].sort((a, b) => b.profit - a.profit);
  
  // 各商品のIDをキーにしたランクのマップを作成
  const amountMap = new Map<number, 'A' | 'B' | 'C'>();
  const countMap = new Map<number, 'A' | 'B' | 'C'>();
  const profitMap = new Map<number, 'A' | 'B' | 'C'>();
  
  // 売上金額の累積割合とランクを計算
  let cumulativeAmount = 0;
  amountSorted.forEach(item => {
    const percentage = totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0;
    cumulativeAmount += percentage;
    const rank = cumulativeAmount <= thresholds.a ? 'A' : cumulativeAmount <= thresholds.b ? 'B' : 'C';
    amountMap.set(item.productId, rank);
  });
  
  // 売上個数の累積割合とランクを計算
  let cumulativeCount = 0;
  countSorted.forEach(item => {
    const percentage = totalCount > 0 ? (item.count / totalCount) * 100 : 0;
    cumulativeCount += percentage;
    const rank = cumulativeCount <= thresholds.a ? 'A' : cumulativeCount <= thresholds.b ? 'B' : 'C';
    countMap.set(item.productId, rank);
  });
  
  // 粗利の累積割合とランクを計算
  let cumulativeProfit = 0;
  profitSorted.forEach(item => {
    const percentage = totalProfit > 0 ? (item.profit / totalProfit) * 100 : 0;
    cumulativeProfit += percentage;
    const rank = cumulativeProfit <= thresholds.a ? 'A' : cumulativeProfit <= thresholds.b ? 'B' : 'C';
    profitMap.set(item.productId, rank);
  });
  
  // 元のデータにランクを追加
  return data.map(item => {
    return {
      ...item,
      amountRank: amountMap.get(item.productId) || 'C',
      countRank: countMap.get(item.productId) || 'C',
      profitRank: profitMap.get(item.productId) || 'C'
    };
  });
};

/**
 * ランクに応じた背景色を取得する関数
 * @param rank ABC分析のランク
 * @returns 背景色
 */
export const getRankBackgroundColor = (rank: 'A' | 'B' | 'C'): string => {
  switch (rank) {
    case 'A':
      return Surface.AccentPrimaryTint01;
    case 'B':
      return Surface.AccentPrimaryTint02;
    case 'C':
      return Surface.AccentPrimaryTint03;
    default:
      return Surface.AccentPrimaryTint03;
  }
};