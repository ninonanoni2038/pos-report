/**
 * 日付フォーマット用ユーティリティ
 * @param date フォーマットする日付
 * @returns 日本語形式でフォーマットされた日付文字列（例: 2024年03月01日）
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ja-JP', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });
};

/**
 * 金額フォーマット用ユーティリティ
 * @param amount フォーマットする金額
 * @returns 日本円形式でフォーマットされた金額文字列（例: ¥1,234）
 */
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' });
};