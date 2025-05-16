/**
 * 日付フォーマット用ユーティリティ
 * @param date フォーマットする日付
 * @returns 日本語形式でフォーマットされた日付文字列（例: 2024年03月01日）
 */
export const formatDate = (date: Date): string => {
  // toLocaleDateStringの代わりに独自のフォーマットを作成
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 月は0から始まるため+1
  const day = date.getDate();
  
  // 曜日の配列（日本語）
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const weekday = weekdays[date.getDay()];
  
  // 「2024年5月16日（木）」の形式で返す
  return `${year}年${month}月${day}日(${weekday})`;
};

/**
 * 曜日に応じた色情報を含む日付情報を返すユーティリティ
 * @param date フォーマットする日付
 * @returns 日付情報と曜日の色情報を含むオブジェクト
 */
export const getDateWithWeekdayColor = (date: Date): {
  dateText: string;
  weekdayText: string;
  weekdayColor: string;
} => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // 曜日の配列（日本語）
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const weekday = weekdays[date.getDay()];
  
  // 曜日に応じて色を設定
  let weekdayColor = 'inherit'; // デフォルト
  if (date.getDay() === 0) { // 日曜日
    weekdayColor = '#D21028'; // 赤色
  } else if (date.getDay() === 6) { // 土曜日
    weekdayColor = '#4A90E2'; // 青色
  }
  
  return {
    dateText: `${year}年${month}月${day}日`,
    weekdayText: `(${weekday})`,
    weekdayColor
  };
};

/**
 * 金額フォーマット用ユーティリティ
 * @param amount フォーマットする金額
 * @returns 日本円形式でフォーマットされた金額文字列（例: ¥1,234）
 */
export const formatCurrency = (amount: number): string => {
  // 小数点以下を丸める
  const roundedAmount = Math.round(amount);
  
  // 「¥123,456」ではなく「123,456円」の形式で表示
  return roundedAmount.toLocaleString('ja-JP');
};

/**
 * 年月フォーマット用ユーティリティ
 * @param date フォーマットする日付
 * @returns 日本語形式でフォーマットされた年月文字列（例: 2024年5月）
 */
export const formatYearMonth = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}年${month}月`;
};