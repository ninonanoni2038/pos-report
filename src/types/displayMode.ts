/**
 * 表示モード定義
 * 日報/月報の切り替えや将来的な拡張（週報/年報）に対応
 */
export enum DisplayMode {
  DAILY = 'daily',
  WEEKLY = 'weekly', // 将来的な拡張用
  MONTHLY = 'monthly',
  YEARLY = 'yearly'  // 将来的な拡張用
}

/**
 * 表示モードのラベル定義
 */
export const DisplayModeLabel: Record<DisplayMode, string> = {
  [DisplayMode.DAILY]: '日報',
  [DisplayMode.WEEKLY]: '週報',
  [DisplayMode.MONTHLY]: '月報',
  [DisplayMode.YEARLY]: '年報'
};